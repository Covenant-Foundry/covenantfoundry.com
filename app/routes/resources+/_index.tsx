import { type MetaFunction } from '@remix-run/node'
import { Prose } from '#app/components/prose'
import { Resources } from '../../components/resources'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Resources' },
		{ name: 'description', content: 'Resources for Christian entrepreneurs.' },
		{
			property: 'og:image',
			content: 'https://covenantfoundry.com/img/logo.png',
		},
	]
}

export default function ResourcesPage() {
	return (
		<Prose className="container mx-auto max-w-4xl py-10">
			<h1>Resources</h1>
			<Resources />
		</Prose>
	)
}
