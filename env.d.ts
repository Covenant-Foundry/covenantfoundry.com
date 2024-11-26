/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

declare module '*.mdx' {
	let MDXComponent: (props: any) => JSX.Element
	export const frontmatter: any
	export default MDXComponent
}

declare module 'virtual:remix/server-build' {
	import { type ServerBuild } from '@remix-run/node'
	export const routes: ServerBuild['routes']
}
