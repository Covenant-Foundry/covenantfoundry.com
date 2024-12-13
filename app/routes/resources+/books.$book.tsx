import { type SEOHandle } from '@nasa-gcn/remix-seo'
import {
	json,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { eq } from 'drizzle-orm'
import { bundleMDX } from 'mdx-bundler'
import { getMDXComponent } from 'mdx-bundler/client'
import { useMemo } from 'react'
import { serverOnly$ } from 'vite-env-only/macros'
import { Prose } from '#app/components/prose'
import { Tags } from '#app/components/ui/tags'
import { Book } from '#app/db/schema.js'
import { db } from '#app/utils/db.server.js'
import { notFound } from '#app/utils/notfound'

export const handle: SEOHandle = {
	getSitemapEntries: serverOnly$(async () => {
		return (await db.query.Book.findMany({ columns: { slug: true } })).map(
			(book) => {
				return { route: `/resources/books/${book.slug}`, priority: 0.7 }
			},
		)
	}),
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: 'Books for Christian Entrepreneurs' },
		{ description: 'Books for Christian Entrepreneurs.' },
		{
			property: 'og:image',
			content: 'https://covenantfoundry.com/img/logo.png',
		},
		{
			'script:ld+json': {
				book: {
					title: data?.book.title,
					description: data?.book.description,
					image: `/images/${data?.book.imageId}`,
					url: data?.book.link,
				},
			},
		},
	]
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const book = await db.query.Book.findFirst({
		where: eq(Book.slug, params.book ?? ''),
	})
	if (!book) {
		throw notFound()
	}
	const content = await bundleMDX({
		source: book.longDescription ?? '',
	})
	return json({ book, content })
}

export default function BookPage() {
	const { book, content } = useLoaderData<typeof loader>()
	const Content = useMemo(() => getMDXComponent(content.code), [content.code])
	const tags = book.tags ? book.tags.split(',') : []
	return (
		<Prose className="container mx-auto max-w-4xl py-10">
			<div className="flex flex-row gap-10">
				<img
					src={`/images/${book.imageId}`}
					alt={book.title}
					className="max-h-sm m-0 max-w-sm object-cover"
				/>
				<div className="flex flex-grow flex-col gap-4">
					<h1 className="m-0">
						<Link
							to={`/resources/books`}
							className="font-bold no-underline hover:underline"
						>
							Books
						</Link>{' '}
						/ {book.title}
					</h1>
					<h2 className="m-0">{book.description}</h2>
					<div className="flex flex-row justify-between gap-2">
						<Link to={book.link} className="text-body-xs">
							Buy on Amazon
						</Link>
						<Tags tags={tags} />
					</div>
					<div>
						<Content />
					</div>
				</div>
			</div>
		</Prose>
	)
}
