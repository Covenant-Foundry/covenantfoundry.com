import {
  json,
  type HeadersFunction,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { withSentry } from "@sentry/remix";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import appleTouchIconAssetUrl from "./assets/favicons/apple-touch-icon.png";
import { CTAButton } from "./components/cta-button.tsx";
import { DiscordLink } from "./components/discord-link.tsx";
import { GeneralErrorBoundary } from "./components/error-boundary.tsx";
import { Icon } from "./components/ui/icon.tsx";
import backgroundStyleSheetUrl from "./styles/background.css?url";
import tailwindStyleSheetUrl from "./styles/tailwind.css?url";
import { ClientHintCheck, getHints } from "./utils/client-hints.tsx";
import { getEnv } from "./utils/env.server.ts";
import { honeypot } from "./utils/honeypot.server.ts";
import { getDomainUrl } from "./utils/misc.tsx";
import { useNonce } from "./utils/nonce-provider.ts";

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "/favicon.ico",
      sizes: "48x48",
    },
    { rel: "apple-touch-icon", href: appleTouchIconAssetUrl },
    {
      rel: "manifest",
      href: "/site.webmanifest",
      crossOrigin: "use-credentials",
    } as const, // necessary to make typescript happy
    { rel: "stylesheet", href: tailwindStyleSheetUrl },
    { rel: "stylesheet", href: backgroundStyleSheetUrl },
  ].filter(Boolean);
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data ? "Covenant Foundry" : "Error | Covenant Foundry" },
    {
      name: "description",
      content: `A community of Christians pursuing faithful stewardship of our time, talents, and treasures via entrepreneurship.`,
    },
    {
      property: "og:image",
      content: "https://covenantfoundry.com/img/logo.png",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const honeyProps = honeypot.getInputProps();
  const ogUrl = new URL(request.url);

  return json({
    requestInfo: {
      hints: getHints(request),
      origin: getDomainUrl(request),
      path: new URL(request.url).pathname,
    },
    ogUrl,
    ENV: getEnv(),
    honeyProps,
  });
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const headers = {
    "Server-Timing": loaderHeaders.get("Server-Timing") ?? "",
    "Content-Security-Policy": [
      "img-src 'self' data: blob: https:",
    ].join("; "),
  };
  return headers;
};

function Document({
  children,
  nonce,
  env = {},
  allowIndexing = true,
  ogUrl,
}: {
  children: React.ReactNode;
  nonce: string;
  env?: Record<string, string>;
  allowIndexing?: boolean;
  ogUrl?: string;
}) {
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
  );
}

function App() {
  const data = useLoaderData<typeof loader>();
  const nonce = useNonce();
  const allowIndexing = data.ENV.ALLOW_INDEXING !== "false";

  return (
    <Document
      nonce={nonce}
      allowIndexing={allowIndexing}
      env={data.ENV}
      ogUrl={data.ogUrl}
    >
      <div className="flex flex-col h-screen">
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
    </Document>
  );
}

export function NavMenu({ children }: { children: React.ReactNode }) {
  return (
    <nav className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-between gap-4 lg:gap-8 mx-8">
      <input type="checkbox" id="nav-toggle" className="hidden peer" />
      <div className="flex peer-checked:hidden lg:flex-1 flex-shrink flex-nowrap items-center justify-between gap-4 w-full lg:w-auto">
        <Logo />
        <label
          htmlFor="nav-toggle"
          className="lg:hidden p-2 cursor-pointer text-3xl"
          aria-label="Toggle menu"
        >
          <Icon name="hamburger" />
        </label>
      </div>
      <div className="hidden peer-checked:flex lg:flex-1 flex-nowrap flex-shrink items-center justify-between gap-4 w-full lg:w-auto">
        <Logo />
        <label
          htmlFor="nav-toggle"
          className="lg:hidden p-2 cursor-pointer text-3xl"
          aria-label="Toggle menu"
        >
          <Icon name="close" />
        </label>
      </div>
      <div className="hidden peer-checked:flex lg:flex flex-col items-end gap-4 w-full lg:w-auto pb-8 mb-8 lg:mb-0 lg:pb-0 border-b-2 border-b-accent lg:border-b-0">
        <div className="flex flex-col lg:flex-row gap-4">{children}</div>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-4 my-6">
      <img
        src="/img/logo.png"
        alt="Covenant Foundry logo"
        className="h-16 md:h-24"
      />
      <div className="text-3xl md:text-5xl font-bold">Covenant Foundry</div>
    </Link>
  );
}

function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <HoneypotProvider {...data.honeyProps}>
      <App />
    </HoneypotProvider>
  );
}

export default withSentry(AppWithProviders);

export function ErrorBoundary() {
  // the nonce doesn't rely on the loader so we can access that
  const nonce = useNonce();

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
  );
}
