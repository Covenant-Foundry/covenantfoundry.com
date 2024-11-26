import { Link } from '@remix-run/react'
import { type IconName, Icon } from './ui/icon'

const resources: {
	title: string
	icon: IconName
	to: string
}[] = [
	{
		title: 'Blog',
		icon: 'pen-fancy',
		to: '/blog',
	},
	{
		title: 'Books',
		icon: 'book',
		to: '/resources/books',
	},
	{
		title: 'Communities',
		icon: 'people-group',
		to: '/resources/communities',
	},
	{
		title: 'Services',
		icon: 'handshake',
		to: '/resources/services',
	},
]

export function Resources() {
	return (
		<nav className="mx-auto mt-10 flex max-w-[65ch] flex-col items-stretch justify-stretch gap-10">
			{resources.map((resource) => (
				<Link
					key={resource.to}
					className="mx-10 flex flex-row items-center border-0 bg-transparent pe-5 text-3xl font-bold no-underline transition-opacity duration-300 hover:bg-accent/20"
					to={resource.to}
				>
					<Icon
						name={resource.icon}
						className="mr-3 h-[3em] w-[3em] border-r-4 border-r-accent p-5"
					>
						{resource.title}
					</Icon>
				</Link>
			))}
		</nav>
	)
}
