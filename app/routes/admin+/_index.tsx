import { type LoaderFunctionArgs } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { Icon } from '#app/components/ui/icon.js'
import { requireUserWithRole } from '#app/utils/permissions.server.js'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await requireUserWithRole(request, 'admin')
	return null
}

export default function AdminIndex() {
	return (
		<div>
			<h1 className="mb-4 mt-0 border-l-4 border-l-accent pl-4 text-3xl font-bold md:text-5xl">
				Admin
			</h1>
			<nav className="mt-10 flex max-w-[65ch] flex-col items-stretch justify-stretch gap-10">
				<Link
					className="mx-10 flex flex-row items-center border-0 bg-transparent pe-5 text-3xl font-bold no-underline transition-opacity duration-300 hover:bg-accent/20"
					to={'/admin/books'}
				>
					<Icon
						name={'book'}
						className="mr-3 h-[3em] w-[3em] border-r-4 border-r-accent p-5"
					>
						Books
					</Icon>
				</Link>
			</nav>
		</div>
	)
}
