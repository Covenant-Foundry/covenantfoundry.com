import { type MetaFunction } from '@remix-run/node'
import { DiscordLink } from '#app/components/discord-link'
import { Resources } from '#app/components/resources'

export const meta: MetaFunction = () => [
	{ title: 'Covenant Foundry' },
	{
		name: 'description',
		content: `A community of Christians pursuing faithful stewardship of our time, talents, and treasures via entrepreneurship.`,
	},
	{
		property: 'og:image',
		content: 'https://covenantfoundry.com/img/logo.png',
	},
]

export default function Index() {
	return (
		<div className="flex flex-1 flex-row flex-wrap justify-center gap-20">
			<div className="mt-20 flex flex-col items-center justify-center gap-10 lg:my-20">
				<div className="mx-10 max-w-[600px] text-center text-2xl md:mx-20 md:text-3xl">
					A community of Christians pursuing faithful stewardship of our time,
					talents, and treasures via entrepreneurship.
				</div>
				<DiscordLink className="text-2xl" />
			</div>
			<div className="mb-20 flex flex-col items-center justify-center lg:my-20">
				<h2 className="text-3xl font-bold">Resources for</h2>
				<h2 className="text-3xl font-bold">Christian Entrepreneurs</h2>
				<Resources />
			</div>
		</div>
	)
}
