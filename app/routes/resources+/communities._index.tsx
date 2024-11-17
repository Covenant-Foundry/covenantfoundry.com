import { json, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Prose } from '#app/components/prose'
import { ResourceCard } from '../../components/resources/resource-card'
import { ResourceGrid } from '../../components/resources/resource-grid'
import { communities } from '../../data/communities'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Communities for Christian Entrepreneurs' },
		{ description: 'Communities for Christian Entrepreneurs.' },
	]
}

export const loader = async () => {
	const communitiesByCategory = communities.reduce(
		(acc, community) => {
			acc[community.category] = [...(acc[community.category] || []), community]
			return acc
		},
		{} as Record<string, typeof communities>,
	)
	return json({
		communitiesByCategory,
		categories: Object.keys(communitiesByCategory),
	})
}

export default function CommunitiesIndex() {
	const { communitiesByCategory, categories } = useLoaderData<typeof loader>()
	return (
		<Prose className="mx-8 max-w-full pb-5">
			<h1>Communities for Christian Entrepreneurs</h1>

			{categories.map((category) => (
				<section key={category}>
					<h2>{category}</h2>
					<ResourceGrid>
						{communitiesByCategory[category]?.map((resource) => (
							<ResourceCard
								key={resource.title}
								root="/resources/communities"
								resource={resource}
							/>
						))}
					</ResourceGrid>
				</section>
			))}
		</Prose>
	)
}
