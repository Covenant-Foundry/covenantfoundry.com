import { invariant } from '@epic-web/invariant'
import {
	json,
	type HeadersFunction,
	type LinksFunction,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/node'
import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'
import { withSentry } from '@sentry/remix'
import { eq } from 'drizzle-orm'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import appleTouchIconAssetUrl from './assets/favicons/apple-touch-icon.png'
import { CTAButton } from './components/cta-button.tsx'
import { DiscordLink } from './components/discord-link.tsx'
import { GeneralErrorBoundary } from './components/error-boundary.tsx'
import { EpicProgress } from './components/progress-bar.tsx'
import { useToast } from './components/toaster.tsx'
import { Icon, href as iconsHref } from './components/ui/icon.tsx'
import { EpicToaster } from './components/ui/sonner.tsx'
import { User } from './db/schema.ts'
import backgroundStyleSheetUrl from './styles/background.css?url'
import tailwindStyleSheetUrl from './styles/tailwind.css?url'
import { getUserId, logout } from './utils/auth.server.ts'
import { ClientHintCheck, getHints } from './utils/client-hints.tsx'
import { db } from './utils/db.server.ts'
import { getEnv } from './utils/env.server.ts'
import { honeypot } from './utils/honeypot.server.ts'
import { combineHeaders, getDomainUrl } from './utils/misc.tsx'
import { useNonce } from './utils/nonce-provider.ts'
import { makeTimings, time } from './utils/timing.server.ts'
import { getToast } from './utils/toast.server.ts'

export const links: LinksFunction = () => {
	return [
		// Preload svg sprite as a resource to avoid render blocking
		{ rel: 'preload', href: iconsHref, as: 'image' },
		{
			rel: 'icon',
			href: '/favicon.ico',
			sizes: '48x48',
		},
		{ rel: 'apple-touch-icon', href: appleTouchIconAssetUrl },
		{
			rel: 'manifest',
			href: '/site.webmanifest',
			crossOrigin: 'use-credentials',
		} as const, // necessary to make typescript happy
		{ rel: 'stylesheet', href: tailwindStyleSheetUrl },
		{ rel: 'stylesheet', href: backgroundStyleSheetUrl },
	].filter(Boolean)
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [{ title: data ? 'Covenant Foundry' : 'Error | Covenant Foundry' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
	const timings = makeTimings('root loader')
	const userId = await time(() => getUserId(request), {
		timings,
		type: 'getUserId',
		desc: 'getUserId in root',
	})

	const user = userId
		? await time(
				async () => {
					const user = await db.query.User.findFirst({
						columns: {
							id: true,
							name: true,
							username: true,
						},
						where: eq(User.id, userId),
						with: {
							roles: {
								with: {
									role: {
										with: {
											permissions: {
												with: {
													permission: true,
												},
											},
										},
									},
								},
							},
						},
					})
					invariant(user, 'user not found')
					return user
				},
				{ timings, type: 'find user', desc: 'find user in root' },
			)
		: null
	if (userId && !user) {
		console.info('something weird happened')
		// something weird happened... The user is authenticated but we can't find
		// them in the database. Maybe they were deleted? Let's log them out.
		await logout({ request, redirectTo: '/' })
	}
	const { toast, headers: toastHeaders } = await getToast(request)
	const honeyProps = honeypot.getInputProps()
	const ogUrl = new URL(request.url)

	return json(
		{
			user,
			requestInfo: {
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
			},
			ogUrl,
			ENV: getEnv(),
			toast,
			honeyProps,
		},
		{
			headers: combineHeaders(
				{ 'Server-Timing': timings.toString() },
				toastHeaders,
			),
		},
	)
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	const headers = {
		'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
	}
	return headers
}

function Document({
	children,
	nonce,
	env = {},
	ogUrl,
}: {
	children: React.ReactNode
	nonce: string
	env?: Record<string, string>
	ogUrl?: string
}) {
	const allowIndexing = ENV.ALLOW_INDEXING !== 'false'
	return (
		<html lang="en" className={`dark h-full overflow-x-hidden`}>
			<head>
				<ClientHintCheck nonce={nonce} />
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				{allowIndexing ? null : (
					<meta name="robots" content="noindex, nofollow" />
				)}
				{ogUrl && (
					<>
						<meta property="og:url" content={ogUrl} />
						<meta name="twitter:url" content={ogUrl} />
					</>
				)}
				<Links />
			</head>
			<body className="text-foreground">
				{children}
				<script
					nonce={nonce}
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
			</body>
		</html>
	)
}

function App() {
	const data = useLoaderData<typeof loader>()
	const nonce = useNonce()
	useToast(data.toast)

	return (
		<Document nonce={nonce} env={data.ENV} ogUrl={data.ogUrl}>
			<div className="flex h-screen flex-col">
				<header>
					<NavMenu>
						<CTAButton className="text-xl" to="/find-a-cofounder">
							Find a Co-founder
						</CTAButton>
						<CTAButton className="text-xl" to="/resources">
							Resources
						</CTAButton>
						<DiscordLink />
					</NavMenu>
				</header>

				<div className="flex flex-1">
					<Outlet />
				</div>
			</div>
			<EpicToaster closeButton position="top-center" theme="dark" />
			<EpicProgress />
		</Document>
	)
}

export function NavMenu({ children }: { children: React.ReactNode }) {
	return (
		<nav className="mx-8 flex flex-wrap items-center justify-center gap-4 lg:flex-nowrap lg:justify-between lg:gap-8">
			<input type="checkbox" id="nav-toggle" className="peer hidden" />
			<div className="flex w-full flex-shrink flex-nowrap items-center justify-between gap-4 peer-checked:hidden lg:w-auto lg:flex-1">
				<Logo />
				<label
					htmlFor="nav-toggle"
					className="cursor-pointer p-2 text-3xl lg:hidden"
					aria-label="Toggle menu"
				>
					<Icon name="hamburger" />
				</label>
			</div>
			<div className="hidden w-full flex-shrink flex-nowrap items-center justify-between gap-4 peer-checked:flex lg:w-auto lg:flex-1">
				<Logo />
				<label
					htmlFor="nav-toggle"
					className="cursor-pointer p-2 text-3xl lg:hidden"
					aria-label="Toggle menu"
				>
					<Icon name="close" />
				</label>
			</div>
			<div className="mb-8 hidden w-full flex-col items-end gap-4 border-b-2 border-b-accent pb-8 peer-checked:flex lg:mb-0 lg:flex lg:w-auto lg:border-b-0 lg:pb-0">
				<div className="flex flex-col gap-4 lg:flex-row">{children}</div>
			</div>
		</nav>
	)
}

function Logo() {
	return (
		<Link to="/" className="my-6 flex items-center gap-4">
			<img
				src="/img/logo.png"
				alt="Covenant Foundry logo"
				className="h-16 md:h-24"
			/>
			<div className="text-3xl font-bold md:text-5xl">Covenant Foundry</div>
		</Link>
	)
}

function AppWithProviders() {
	const data = useLoaderData<typeof loader>()
	return (
		<HoneypotProvider {...data.honeyProps}>
			<App />
		</HoneypotProvider>
	)
}

export default withSentry(AppWithProviders)

export function ErrorBoundary() {
	// the nonce doesn't rely on the loader so we can access that
	const nonce = useNonce()

	// NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
	// likely failed to run so we have to do the best we can.
	// We could probably do better than this (it's possible the loader did run).
	// This would require a change in Remix.

	// Just make sure your root route never errors out and you'll always be able
	// to give the user a better UX.

	return (
		<Document nonce={nonce}>
			<GeneralErrorBoundary />
		</Document>
	)
}
