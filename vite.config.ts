import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { flatRoutes } from "remix-flat-routes";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
    remix({
      ignoredRouteFiles: ["**/*"],
      serverModuleFormat: "esm",
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes, {
          ignoredRouteFiles: [
            ".*",
            "**/*.css",
            "**/*.test.{js,jsx,ts,tsx}",
            "**/__*.*",
            // This is for server-side utilities you want to colocate
            // next to your routes without making an additional
            // directory. If you need a route that includes "server" or
            // "client" in the filename, use the escape brackets like:
            // my-route.[server].tsx
            "**/*.server.*",
            "**/*.client.*",
          ],
        });
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    headers: {
      "Content-Security-Policy": [
        "img-src 'self' data: blob: https:",
      ].join("; "),
    },
  },
});
