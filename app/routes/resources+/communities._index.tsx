import { json, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Prose } from '#app/components/prose'
import { type Community } from '#app/db/schema.js'
import { db } from '#app/utils/db.server.js'
import { ResourceCard } from '../../components/resources/resource-card'
import { ResourceGrid } from '../../components/resources/resource-grid'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	const allCommunities = Object.values(data?.communitiesByCategory ?? {}).flat()

	return [
		{ title: 'Communities for Christian Entrepreneurs' },
		{ description: 'Communities for Christian Entrepreneurs.' },
		{
			property: 'og:image',
			content: 'https://covenantfoundry.com/img/logo.png',
		},
		{
			'script:ld+json': {
				'@context': 'https://schema.org',
				'@type': 'ItemList',
				name: 'Communities for Christian Entrepreneurs',
				description:
					'Curated collection of communities for Christian entrepreneurs and business leaders.',
				numberOfItems: allCommunities.length,
				itemListElement: allCommunities.map((community, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'Organization',
						name: community.title,
						description: community.description,
						image: `/images/${community.imageId}`,
						url: community.link,
					},
				})),
			},
		},
	]
}

export const loader = async () => {
	const communitiesByCategory = (await db.query.Community.findMany()).reduce(
		(acc, community) => {
			acc[community.category] = [...(acc[community.category] || []), community]
			return acc
		},
		{} as Record<string, (typeof Community.$inferSelect)[]>,
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
