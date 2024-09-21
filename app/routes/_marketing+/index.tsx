import { DiscordLink } from '#app/components/discord-link.js'
import { type MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => [{ title: 'Covenant Foundry' }]

export default function Index() {
	return (
		<main className="flex flex-col items-center">
			<p className="mx-auto my-4 max-w-3xl px-3 text-center text-2xl md:my-12">
				A community of Christians pursuing faithful stewardship of our time,
				talents, and treasures via entrepreneurship.
			</p>

			<div className="my-8 flex flex-wrap justify-center gap-4">
				<DiscordLink />
				<a
					href="/find-a-cofounder"
					className="rounded border-2 border-accent bg-transparent px-6 py-3 font-bold text-accent transition-opacity duration-300 hover:opacity-90"
				>
					Find a Co-founder
				</a>
			</div>
		</main>
	)
}
