import { json, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Prose } from '#app/components/prose'
import { ResourceCard } from '../../components/resources/resource-card'
import { ResourceGrid } from '../../components/resources/resource-grid'
import { books } from '../../data/books'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Books for Christian Entrepreneurs' },
		{ description: 'Books for Christian Entrepreneurs.' },
	]
}

export const loader = async () => {
	const booksByCategory = books.reduce(
		(acc, book) => {
			acc[book.category] = [...(acc[book.category] || []), book]
			return acc
		},
		{} as Record<string, typeof books>,
	)
	return json({ booksByCategory, categories: Object.keys(booksByCategory) })
}

export default function BooksIndex() {
	const { booksByCategory, categories } = useLoaderData<typeof loader>()
	return (
		<Prose className="mx-8 max-w-full pb-5">
			<h1>Books for Christian Entrepreneurs</h1>

			{categories.map((category) => (
				<section key={category}>
					<h2>{category}</h2>
					<ResourceGrid>
						{booksByCategory[category]?.map((resource) => (
							<ResourceCard
								key={resource.title}
								root="/resources/books"
								resource={resource}
							/>
						))}
					</ResourceGrid>
				</section>
			))}
		</Prose>
	)
}
