import fs from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { invariant } from '@epic-web/invariant'
import { inArray } from 'drizzle-orm'
import { Community, Image } from '#app/db/schema.js'
import { db } from '#app/utils/db.server.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const communities = [
	{
		title: 'Faith Driven Entrepreneur',
		slug: 'faith-driven-entrepreneur',
		description:
			'Helping Christ-following entrepreneurs find their community and fulfill their God-given call to create.',
		category: 'Entrepreneurship',
		tags: [],
		link: 'https://www.faithdrivenentrepreneur.org/',
		imageUrl: 'faith-driven-entrepreneur.webp',
	},
	{
		title: 'FaithTech',
		slug: 'faithtech',
		description: 'Bridging the Gap Between Faith and Technology',
		category: 'Tech',
		tags: [],
		link: 'https://faithtech.com/',
		imageUrl: 'faithtech.png',
	},
	{
		title: 'Christians in Tech',
		slug: 'christians-in-tech',
		description: 'A Slack community for Christians in tech',
		category: 'Tech',
		tags: [],
		link: 'https://cit.chat/invitation',
		imageUrl: 'christians-in-tech.jpg',
	},
	{
		title: 'Reformed Devs',
		slug: 'reformed-devs',
		description: 'A Discord community for Reformed-ish developers',
		category: 'Tech',
		tags: [],
		link: 'https://discord.gg/fKcJVvjPCq',
		imageUrl: 'reformed-devs.png',
	},
]

async function seed() {
	console.log('🌱 Seeding communities...')

	// Clear existing data
	const images = await db.delete(Community).returning({ id: Image.id })
	await db.delete(Image).where(
		inArray(
			Image.id,
			images.map((image) => image.id),
		),
	)

	// Process each community
	for (const community of communities) {
		// Read the image file
		const imagePath = path.resolve(
			__dirname,
			'../../app/assets/images/',
			community.imageUrl,
		)
		const imageBuffer = await fs.readFile(imagePath)

		// Create the community entry
		const [image] = await db
			.insert(Image)
			.values({
				contentType: getContentType(community.imageUrl),
				blob: imageBuffer,
				altText: `Logo of ${community.title}`,
			})
			.returning({ id: Image.id })
		invariant(image, 'Failed to create image')
		await db.insert(Community).values({
			title: community.title,
			description: community.description,
			category: community.category,
			tags: community.tags.join(','),
			link: community.link,
			imageId: image.id,
		})
	}

	console.log('✅ Communities seeding complete')
}

function getContentType(filename: string): string {
	const ext = path.extname(filename).toLowerCase()
	switch (ext) {
		case '.jpg':
		case '.jpeg':
			return 'image/jpeg'
		case '.png':
			return 'image/png'
		case '.webp':
			return 'image/webp'
		default:
			return 'image/jpeg'
	}
}

seed()
	.catch((e) => {
		console.error('❌ Communities seeding failed')
		console.error(e)
		process.exit(1)
	})
	.finally(() => {
		db.$client.close()
	})
