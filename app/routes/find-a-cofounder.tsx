import { Link, type MetaFunction } from '@remix-run/react'
import { DiscordLink } from '#app/components/discord-link'
import { Prose } from '#app/components/prose'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Find a Co-founder',
		},
		{
			name: 'description',
			content:
				'A good co-founder, aligned with your Christian worldview, can make all the difference for a successful business.',
		},
		{
			property: 'og:image',
			content: 'https://covenantfoundry.com/img/logo.png',
		},
	]
}

export default function Index() {
	return (
		<Prose className="container mx-auto max-w-4xl py-10">
			<h1>Find a Co-founder</h1>
			<p>
				A good co-founder can make all the difference for a successful business.
				But finding someone who has the right skills <em>and</em> is aligned
				with your Christian worldview is tough.
			</p>
			<p>
				Join our Discord server and introduce yourself in our{' '}
				<Link
					to="https://discordapp.com/channels/1204923985498996746/1284558421047119952"
					className="text-accent underline-offset-4 hover:underline"
					target="_blank"
					rel="noreferrer"
				>
					#find-a-cofounder
				</Link>{' '}
				channel. Get to know other founders who share your values, and find
				opportunities to collaborate!
			</p>

			<div className="my-8 flex flex-wrap justify-center gap-4">
				<DiscordLink />
			</div>
		</Prose>
	)
}
