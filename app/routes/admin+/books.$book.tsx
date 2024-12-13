import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import {
	type ActionFunctionArgs,
	json,
	type LoaderFunctionArgs,
	redirect,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
} from '@remix-run/node'
import { Form, useLoaderData, useActionData } from '@remix-run/react'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { Field, ImageField, TextareaField } from '#app/components/forms.js'
import { StatusButton } from '#app/components/ui/status-button.js'
import { Book, Image } from '#app/db/schema.js'
import { db } from '#app/utils/db.server.ts'
import { useIsPending } from '#app/utils/misc.js'
import { requireUserWithRole } from '#app/utils/permissions.server.js'
import { urlForImage } from '../images.$imageId'

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

const BaseSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().min(1, 'Description is required'),
	longDescription: z.string().optional(),
	category: z.string().min(1, 'Category is required'),
	tags: z.string().min(1, 'Tags are required'),
	link: z.string().url('Must be a valid URL'),
})

const UpdateBookFormSchema = z.intersection(
	BaseSchema,
	z.object({
		image: z
			.instanceof(File)
			.optional()
			.refine(
				(file) => !file || file?.size <= MAX_UPLOAD_SIZE,
				'Image size must be less than 3MB',
			),
	}),
)

const CreateBookFormSchema = z.intersection(
	BaseSchema,
	z.object({
		image: z
			.instanceof(File)
			.refine((file) => file.size > 0, 'Image is required')
			.refine(
				(file) => file?.size <= MAX_UPLOAD_SIZE,
				'Image size must be less than 3MB',
			),
	}),
)

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	await requireUserWithRole(request, 'admin')
	if (params.book === 'new') {
		return { book: null }
	}
	const book = await db.query.Book.findFirst({
		where: eq(Book.id, params.book ?? ''),
	})
	return { book }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
	await requireUserWithRole(request, 'admin')
	const formData = await unstable_parseMultipartFormData(
		request,
		unstable_createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	)
	const schema =
		params.book === 'new' ? CreateBookFormSchema : UpdateBookFormSchema
	const submission = await parseWithZod(formData, {
		schema: schema.transform(async (data) => {
			return {
				...data,
				image: data.image
					? {
							contentType: data.image.type,
							blob: Buffer.from(await data.image.arrayBuffer()),
						}
					: undefined,
			}
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return json({ result: submission.reply() }, { status: 400 })
	}

	const { image, ...book } = submission.value

	try {
		const created = await db.transaction(async (tx) => {
			const { imageId: existingImageId } =
				(await tx.query.Book.findFirst({
					columns: { imageId: true },
					where: eq(Book.id, params.book ?? ''),
				})) ?? {}

			const [newImage] = image
				? await tx
						.insert(Image)
						.values({
							contentType: image.contentType,
							blob: image.blob,
						})
						.returning({ id: Image.id })
				: []

			const bookData = {
				...(params.book && params.book !== 'new' ? { id: params.book } : {}),
				...book,
				imageId: (newImage?.id ?? existingImageId)!,
				updatedAt: new Date(),
			}
			const [newBook] = await tx
				.insert(Book)
				.values(bookData)
				.onConflictDoUpdate({
					target: [Book.id],
					set: {
						...book,
						...(newImage ? { imageId: newImage.id } : {}),
						updatedAt: new Date(),
					},
				})
				.returning()

			if (newImage && existingImageId) {
				await tx.delete(Image).where(eq(Image.id, existingImageId))
			}

			return newBook
		})
		if (params.book === 'new') {
			return redirect(`/admin/books/${created!.id}`)
		}
		return json({ result: submission.reply() })
	} catch (error) {
		if (String(error).includes('UNIQUE constraint failed: Book.slug')) {
			return json(
				{
					result: submission.reply({
						fieldErrors: { slug: ['Slug must be unique'] },
					}),
				},
				{ status: 400 },
			)
		}
		throw error
	}
}

export default function AdminBooks() {
	const { book } = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const schema = book ? UpdateBookFormSchema : CreateBookFormSchema

	const [form, fields] = useForm({
		id: 'book-edit',
		constraint: getZodConstraint(schema),
		defaultValue: {
			...book,
			image: null,
		},
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema })
		},
	})

	return (
		<div>
			<h1 className="mb-4 mt-0 border-l-4 border-l-accent pl-4 text-3xl font-bold md:text-5xl">
				Manage Book
			</h1>
			<Form
				method="post"
				encType="multipart/form-data"
				className="rounded-lg bg-white/10 p-4"
				{...getFormProps(form)}
			>
				<div className="">
					<div className="flex flex-col-reverse gap-4 md:flex-row">
						<div className="flex flex-1 flex-col">
							<Field
								labelProps={{ children: 'Title' }}
								inputProps={{
									...getInputProps(fields.title, { type: 'text' }),
									autoFocus: true,
								}}
								errors={fields.title.errors}
							/>

							<Field
								labelProps={{ children: 'Slug' }}
								inputProps={getInputProps(fields.slug, { type: 'text' })}
								errors={fields.slug.errors}
							/>

							<TextareaField
								labelProps={{ children: 'Description' }}
								textareaProps={getTextareaProps(fields.description)}
								errors={fields.description.errors}
							/>

							<Field
								labelProps={{ children: 'Category' }}
								inputProps={getInputProps(fields.category, { type: 'text' })}
								errors={fields.category.errors}
							/>

							<Field
								labelProps={{ children: 'Tags' }}
								inputProps={getInputProps(fields.tags, { type: 'text' })}
								errors={fields.tags.errors}
							/>

							<Field
								labelProps={{ children: 'Link' }}
								inputProps={getInputProps(fields.link, { type: 'url' })}
								errors={fields.link.errors}
							/>
						</div>

						<ImageField
							labelProps={{ children: 'Image' }}
							inputProps={getInputProps(fields.image, {
								type: 'file',
							})}
							imageProps={{
								src: book?.imageId ? urlForImage(book.imageId) : undefined,
								alt: book?.title ?? '',
								className: 'object-cover',
							}}
							errors={fields.image.errors}
							className="flex flex-1 flex-col justify-center"
						/>
					</div>

					<TextareaField
						labelProps={{ children: 'Long Description' }}
						textareaProps={getTextareaProps(fields.longDescription)}
						errors={fields.longDescription.errors}
					/>

					<div>
						<StatusButton
							type="submit"
							status={isPending ? 'pending' : (form.status ?? 'idle')}
						>
							Save Changes
						</StatusButton>
					</div>
				</div>
			</Form>
		</div>
	)
}
