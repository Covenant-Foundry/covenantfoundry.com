import {
  json,
  type LoaderFunctionArgs,
  type HeadersFunction,
  type LinksFunction,
  type MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useSubmit,
} from "@remix-run/react";
import { withSentry } from "@sentry/remix";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import appleTouchIconAssetUrl from "./assets/favicons/apple-touch-icon.png";
import { GeneralErrorBoundary } from "./components/error-boundary.tsx";
import tailwindStyleSheetUrl from "./styles/tailwind.css?url";
import { ClientHintCheck, getHints } from "./utils/client-hints.tsx";
import { getEnv } from "./utils/env.server.ts";
import { honeypot } from "./utils/honeypot.server.ts";
import { getDomainUrl } from "./utils/misc.tsx";
import { useNonce } from "./utils/nonce-provider.ts";
import backgroundStyleSheetUrl from "./styles/background.css?url";

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
    <Document nonce={nonce} allowIndexing={allowIndexing} env={data.ENV} ogUrl={data.ogUrl}>
      <div className="flex h-screen flex-col justify-between">
        <header className="container py-6">
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:flex-nowrap md:gap-8">
            <Logo />
          </nav>
        </header>

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </Document>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-4 my-6">
      <img src="/img/logo.png" alt="Covenant Foundry logo" className="h-24" />
      <div className="text-5xl font-bold">Covenant Foundry</div>
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
