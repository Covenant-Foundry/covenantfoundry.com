import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { eq, type InferSelectModel } from 'drizzle-orm'
import { Image } from '#app/db/schema.js'
import { db } from '#app/utils/db.server.ts'

export async function loader({ params }: LoaderFunctionArgs) {
	invariantResponse(params.imageId, 'Image ID is required', { status: 400 })
	const image = await db.query.Image.findFirst({
		where: eq(Image.id, params.imageId),
		columns: { contentType: true, blob: true },
	})

	invariantResponse(image, 'Not found', { status: 404 })

	return new Response(image.blob, {
		headers: {
			'Content-Type': image.contentType,
			'Content-Length': Buffer.byteLength(image.blob).toString(),
			'Content-Disposition': `inline; filename="${params.imageId}"`,
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	})
}

export function urlForImage(imageId: InferSelectModel<typeof Image>['id']) {
	return `/images/${imageId}`
}
