import { parseISO } from 'date-fns'
import { Feed } from 'feed'
import { type LoaderFunction } from 'react-router'
import { getPosts } from '#app/routes/blog+/posts.server'

export const loader: LoaderFunction = async () => {
	const blogUrl = `https://covenantfoundry.com/blog`
	const posts = await getPosts()

	const feed = new Feed({
		id: blogUrl,
		title: 'Covenant Foundry Blog',
		description: 'Building companies and Christian community.',
		link: blogUrl,
		language: 'en',
		updated: posts[0] ? parseISO(posts[0].frontmatter.published) : new Date(),
		generator: 'https://github.com/jpmonette/feed',
		copyright: '© Covenant Foundry',
	})

	posts.forEach((post) => {
		const postLink = `${blogUrl}/${post.slug}`
		feed.addItem({
			id: postLink,
			title: post.frontmatter.title,
			link: postLink,
			date: parseISO(post.frontmatter.published),
			description: post.frontmatter.description,
		})
	})

	return new Response(feed.rss2(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': `public, max-age=${60 * 5}`,
		},
	})
}
