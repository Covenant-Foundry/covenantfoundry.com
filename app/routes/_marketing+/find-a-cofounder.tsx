import { Link } from '@remix-run/react'

export default function Index() {
	return (
		<main className="flex flex-col items-center">
			<h1 className="text-center text-3xl font-bold">Find a Co-founder</h1>
			<p className="mx-auto my-4 max-w-3xl px-3 text-center text-body-lg">
				A good co-founder can make all the difference for a successful business.
				But finding someone who has the right skills <em>and</em> is aligned
				with your Christian worldview is tough.
			</p>
			<p className="mx-auto my-4 max-w-3xl px-3 text-center text-body-lg">
				Join our Discord server and introduce yourself in our{' '}
				<Link
					to="https://discordapp.com/channels/1204923985498996746/1284558421047119952"
					className="text-accent underline-offset-4 hover:underline"
					target="_blank"
				>
					#find-a-cofounder
				</Link>{' '}
				channel. Get to know other founders who share your values, and find
				opportunities to collaborate!
			</p>

			<div className="my-8 flex flex-wrap justify-center gap-4">
				<a
					href="https://discord.gg/JcWQNBXH42"
					className="flex items-center rounded bg-[#5865f2] px-6 py-3 font-bold text-white transition-opacity duration-300 hover:opacity-90"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 640 512"
						className="mr-2 h-6 w-6"
					>
						<path
							fill="#ffffff"
							d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z"
						/>
					</svg>
					Join the Discord
				</a>
			</div>
		</main>
	)
}
