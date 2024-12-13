import { json, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Prose } from '#app/components/prose'
import { db } from '#app/utils/db.server.js'
import { ResourceCard } from '../../components/resources/resource-card'
import { ResourceGrid } from '../../components/resources/resource-grid'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	const allBooks = Object.values(data?.booksByCategory ?? {}).flat()

	return [
		{ title: 'Books for Christian Entrepreneurs' },
		{ description: 'Books for Christian Entrepreneurs.' },
		{
			property: 'og:image',
			content: 'https://covenantfoundry.com/img/logo.png',
		},
		{
			'script:ld+json': {
				'@context': 'https://schema.org',
				'@type': 'ItemList',
				name: 'Books for Christian Entrepreneurs',
				description:
					'Curated collection of books for Christian entrepreneurs and business leaders.',
				numberOfItems: allBooks.length,
				itemListElement: allBooks.map((book, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'Book',
						name: book.title,
						description: book.description,
						image: `/images/${book.imageId}`,
						url: `/resources/books/${book.slug}`,
					},
				})),
			},
		},
	]
}

export const loader = async () => {
	const books = await db.query.Book.findMany()
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
