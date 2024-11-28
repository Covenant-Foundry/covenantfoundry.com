import { Link, type MetaFunction, Outlet } from '@remix-run/react'
import { Prose } from '#app/components/prose'

export const meta: MetaFunction = () => {
	return [
		{
			property: 'og:image',
			content: 'https://covenantfoundry.com/img/logo.png',
		},
	]
}

export default function ArticleLayout() {
	return (
		<>
			<Prose className="container mx-auto mb-[25vh] max-w-4xl py-10">
				<p className="text-muted-foreground">
					<Link to="/blog" className="no-underline hover:underline">
						« Back to Articles
					</Link>
				</p>
				<Outlet />
			</Prose>
		</>
	)
}
