import fs from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { prisma } from '#app/utils/db.server.js'

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
	await prisma.community.deleteMany()
	await prisma.image.deleteMany({
		where: {
			communities: {
				some: {},
			},
		},
	})

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
		await prisma.community.create({
			data: {
				title: community.title,
				description: community.description,
				category: community.category,
				tags: community.tags.join(','),
				link: community.link,
				image: {
					create: {
						contentType: getContentType(community.imageUrl),
						blob: imageBuffer,
						altText: `Logo of ${community.title}`,
					},
				},
			},
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
	.finally(async () => {
		await prisma.$disconnect()
	})
