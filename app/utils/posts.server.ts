export type Frontmatter = {
	name: string
}

export type PostMeta = {
	slug: string
	frontmatter: Frontmatter
}

export const getPosts = async (): Promise<PostMeta[]> => {
	const modules = import.meta.glob<{ frontmatter: Frontmatter }>(
		'../routes/blog.*.(mdx|md)',
		{ eager: true },
	)
	const build = await import('virtual:remix/server-build')
	const posts = Object.entries(modules).map(([file, post]) => {
		const id = file.replace('../', '').replace(/\.mdx?$/, '')

		if (build.routes[id] === undefined) throw new Error(`No route for ${id}`)

		return {
			slug: '/' + build.routes[id].path,
			frontmatter: post.frontmatter,
		}
	})
	return sortBy(posts, (post) => post.frontmatter.name, 'desc')
}

function sortBy<T>(
	arr: T[],
	key: (item: T) => unknown,
	dir: 'asc' | 'desc' = 'asc',
) {
	return arr.sort((a, b) => {
		const res = compare(key(a), key(b))
		return dir === 'asc' ? res : -res
	})
}

function compare<T>(a: T, b: T): number {
	if (a < b) return -1
	if (a > b) return 1
	return 0
}
