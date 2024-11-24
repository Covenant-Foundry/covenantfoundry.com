import { type SerializeFrom } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { type Book, type Community } from '#app/db/schema.js'
import { Tags } from '../ui/tags'

export function ResourceCard({
	resource,
	root,
	showCategory = false,
}: {
	resource: SerializeFrom<
		typeof Book.$inferSelect | typeof Community.$inferSelect
	>
	root: string
	showCategory?: boolean
}) {
	const link = 'slug' in resource ? `${root}/${resource.slug}` : resource.link
	const tags = resource.tags ? resource.tags.split(',') : []
	return (
		<div className="w-md flex flex-row gap-2 bg-white/10">
			{'imageId' in resource && (
				<Link to={link} className="flex flex-1 items-stretch justify-stretch">
					<img
						src={`/images/${resource.imageId}`}
						alt={resource.title}
						className="m-0 object-cover"
					/>
				</Link>
			)}
			<div className="flex flex-1 flex-col justify-between gap-2 p-2">
				<Link to={link} className="no-underline hover:underline">
					<div className="text-2xl font-bold">{resource.title}</div>
				</Link>
				{showCategory && <div className="text-sm">{resource.category}</div>}
				<Tags tags={tags} />
				<div className="flex-grow text-sm">{resource.description}</div>
			</div>
		</div>
	)
}
