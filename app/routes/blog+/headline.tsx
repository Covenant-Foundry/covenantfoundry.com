import { tz } from '@date-fns/tz'
import { format, parseISO } from 'date-fns'
import { AILevel } from '#app/components/ai-level.js'
import { useHints } from '#app/utils/client-hints.js'

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
	const { timeZone } = useHints()
	const formattedDate = format(parseISO(published), 'MMMM d, yyyy', {
		in: tz(timeZone),
	})
	return (
		<div className="mb-10 flex flex-col gap-4">
			<h1 className="m-0">{title}</h1>
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col text-sm font-bold md:flex-row md:text-lg">
					<div>{formattedDate}</div>
					<div className="md:ml-2 md:border-l md:border-gray-200 md:pl-2">
						{author}
					</div>
				</div>
				<div className="flex-shrink-0">
					{aiLevel !== undefined && <AILevel level={aiLevel} />}
				</div>
			</div>
		</div>
	)
}
