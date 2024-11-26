import { format, parseISO } from 'date-fns'
import { AILevel } from '#app/components/ai-level.js'

export function Headline({
	title,
	author,
	published,
	aiLevel,
}: {
	title: string
	author: string
	published: string
	aiLevel?: 0 | 1 | 2 | 3 | 4 | 5
}) {
	const formattedDate = format(parseISO(published), 'MMMM d, yyyy')
	return (
		<div className="mb-10 flex flex-col gap-4">
			<h1 className="m-0">{title}</h1>
			<div className="flex items-center justify-between gap-2">
				<div className="text-sm font-bold md:text-lg">
					{formattedDate} | {author}
				</div>
				{aiLevel !== undefined && <AILevel level={aiLevel} />}
			</div>
		</div>
	)
}
