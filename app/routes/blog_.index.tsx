import { json, type MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { Prose } from '#app/components/prose'
import { getPosts } from './blog+/posts.server'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Blog' },
		{
			name: 'description',
			content: 'The latest articles from Covenant Foundry.',
		},
	]
}

export const loader = async () => {
	const posts = await getPosts()
	return json(posts)
}

export default function ArticlesPage() {
	const posts = useLoaderData<typeof loader>()

	return (
		<Prose className="container mx-auto max-w-4xl py-10">
			<h1>Articles</h1>
			<p>
				<ul>
					{posts.map((post) => (
						<li key={post.slug}>
							<span className="text-muted-foreground">
								{post.frontmatter.published} |{' '}
							</span>
							<Link to={post.slug}>{post.frontmatter.title}</Link>
						</li>
					))}
				</ul>
			</p>
		</Prose>
	)
}
