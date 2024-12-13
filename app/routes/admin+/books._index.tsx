import {
	type ActionFunctionArgs,
	json,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { eq } from 'drizzle-orm'
import { Book } from '#app/db/schema.js'
import { db } from '#app/utils/db.server.ts'
import { requireUserWithRole } from '#app/utils/permissions.server.js'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await requireUserWithRole(request, 'admin')
	const books = await db.query.Book.findMany()
	return json({ books })
}

export const action = async ({ request }: ActionFunctionArgs) => {
	await requireUserWithRole(request, 'admin')
	const formData = await request.formData()
	const id = formData.get('id')
	if (typeof id !== 'string') {
		return json({ error: 'Invalid id' }, { status: 400 })
	}
	await db.delete(Book).where(eq(Book.id, id))
	return json({ success: true })
}

export default function AdminBooks() {
	const { books } = useLoaderData<typeof loader>()

	return (
		<div className="px-4">
			<div className="flex flex-row items-center justify-between">
				<h1 className="mb-4 mt-0 border-l-4 border-l-accent pl-4 text-3xl font-bold md:text-5xl">
					Manage Books
				</h1>
				<Link
					to={'/admin/books/new'}
					className="rounded-lg border-2 border-accent px-4 py-2 text-xl font-bold text-white transition-opacity duration-300 hover:bg-accent/20"
				>
					+ Add Book
				</Link>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full rounded-lg bg-white/10 shadow-sm">
					<thead className="border-b border-white/10">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
								Title
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-white/10">
						{books.map((book) => (
							<tr key={book.id} className="hover:bg-white/10">
								<td className="whitespace-nowrap px-6 py-4 text-gray-200">
									{book.title}
								</td>
								<td className="whitespace-nowrap px-6 py-4">
									<Link
										to={`/admin/books/${book.id}`}
										className="mr-2 text-blue-400 hover:text-blue-300"
									>
										Edit
									</Link>
									<Form method="post" className="inline">
										<button
											type="submit"
											name="id"
											value={book.id}
											className="text-red-400 hover:text-red-300"
										>
											Delete
										</button>
									</Form>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
