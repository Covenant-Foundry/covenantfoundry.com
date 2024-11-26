import { Link, Outlet } from '@remix-run/react'
import { Prose } from '#app/components/prose'

export default function ArticleLayout() {
	return (
		<>
			<Prose className="container mx-auto max-w-4xl py-10">
				<p className="text-muted-foreground">
					<Link to="/articles" className="no-underline hover:underline">
						« Back to Articles
					</Link>
				</p>
				<Outlet />
			</Prose>
		</>
	)
}
