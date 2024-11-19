import fs from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { prisma } from '#app/utils/db.server.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const books = [
	{
		title: 'Zero to One',
		slug: 'zero-to-one',
		description: 'Notes on Startups, or How to Build the Future',
		longDescription: '',
		category: 'Inspiration',
		tags: ['Peter Thiel'],
		link: 'https://www.amazon.com/Zero-One-Notes-Startups-Future/dp/0804139296/',
		imageUrl: 'zero-to-one.jpg',
	},
	{
		title: 'Venture Deals',
		slug: 'venture-deals',
		description: 'Be Smarter than Your Lawyer and Venture Capitalist',
		longDescription: '',
		category: 'Business',
		tags: ['Brad Feld', 'Jason Mendelson'],
		link: 'https://www.amazon.com/Venture-Deals-4th-Edition-audiobook/dp/B07YL8NHLH',
		imageUrl: 'venture-deals.jpg',
	},
	{
		title: 'Million Dollar Weekend',
		slug: 'million-dollar-weekend',
		description: 'A guide to making a million dollars in a weekend',
		longDescription: '',
		category: 'Inspiration',
		tags: ['Noah Kagan'],
		link: 'https://appsumo.com/products/million-dollar-weekend-ga/',
		imageUrl: 'million-dollar-weekend.jpg',
	},
	{
		title: 'Never Eat Alone',
		slug: 'never-eat-alone',
		description: 'And Other Secrets to Success, One Relationship at a Time',
		longDescription: '',
		category: 'Networking',
		tags: ['Keith Ferrazzi'],
		link: 'https://www.amazon.com/gp/aw/d/0385346654/',
		imageUrl: 'never-eat-alone.jpg',
	},
	{
		title: 'The Partnership Charter',
		slug: 'the-partnership-charter',
		description: 'How to Start Right and Thrive',
		longDescription: '',
		category: 'Business',
		tags: ['David Gage'],
		link: 'https://www.amazon.com/Partnership-Charter-Start-Right-Business/dp/0738208981/',
		imageUrl: 'partnership-charter.jpg',
	},
	{
		title: 'Faith Driven Entrepreneur',
		slug: 'faith-driven-entrepreneur',
		description:
			'What It Takes to Step Into Your Purpose and Pursue Your God-Given Call to Create',
		longDescription: '',
		category: 'Inspiration',
		tags: ['Henry Kaestner', 'J.D. Greear', 'Chip Ingram'],
		link: 'https://www.amazon.com/Faith-Driven-Entrepreneur-Purpose-God-Given/dp/1496457234/',
		imageUrl: 'faith-driven-entrepreneur.jpg',
	},
	{
		title: "The Entrepreneur's Guide to Law and Strategy",
		slug: 'entrepreneurs-guide-to-law-and-strategy',
		description: 'A comprehensive guide to business law for entrepreneurs',
		longDescription: '',
		category: 'Law',
		tags: ['Constance Bagley', 'Craig Dauchy'],
		link: 'https://www.amazon.com/Entrepreneurs-Guide-Law-Strategy-ebook/dp/B06X9DRMB5/',
		imageUrl: 'entrepreneurs-guide-law-strategy.jpg',
	},
	{
		title: 'Do More Faster',
		slug: 'do-more-faster',
		description: 'TechStars Lessons to Accelerate Your Startup',
		longDescription: '',
		category: 'Inspiration',
		tags: ['David Cohen', 'Brad Feld'],
		link: 'https://www.amazon.com/Do-More-Faster-TechStars-Accelerate/dp/1119583284/',
		imageUrl: 'do-more-faster.jpg',
	},
]

async function seed() {
	console.log('🌱 Seeding...')

	// Clear existing data
	await prisma.book.deleteMany()
	await prisma.image.deleteMany()

	// Process each book
	for (const book of books) {
		// Read the image file
		const imagePath = path.resolve(
			__dirname,
			'../../app/assets/images/',
			book.imageUrl,
		)
		const imageBuffer = await fs.readFile(imagePath)

		// Create the book entry
		await prisma.book.create({
			data: {
				title: book.title,
				slug: book.slug,
				description: book.description,
				longDescription: book.longDescription || '',
				category: book.category,
				tags: book.tags.join(','), // Convert array to comma-separated string
				link: book.link,
				image: {
					create: {
						contentType: 'image/jpeg',
						blob: imageBuffer,
						altText: `Cover of ${book.title}`,
					},
				},
			},
		})
	}

	console.log('✅ Seeding complete')
}

seed()
	.catch((e) => {
		console.error('❌ Seeding failed')
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
