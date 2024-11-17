import doMoreFaster from '#app/assets/images/do-more-faster.jpg'
import entrepreneursGuideToLawAndStrategy from '#app/assets/images/entrepreneurs-guide-law-strategy.jpg'
import faithDrivenEntrepreneur from '#app/assets/images/faith-driven-entrepreneur.jpg'
import millionDollarWeekend from '#app/assets/images/million-dollar-weekend.jpg'
import neverEatAlone from '#app/assets/images/never-eat-alone.jpg'
import partnershipCharter from '#app/assets/images/partnership-charter.jpg'
import ventureDeals from '#app/assets/images/venture-deals.jpg'
import zeroToOne from '#app/assets/images/zero-to-one.jpg'

export const books = [
	{
		title: 'Zero to One',
		slug: 'zero-to-one',
		description: 'Notes on Startups, or How to Build the Future',
		longDescription: '',
		category: 'Inspiration',
		tags: ['Peter Thiel'],
		link: 'https://www.amazon.com/Zero-One-Notes-Startups-Future/dp/0804139296/',
		imageUrl: zeroToOne,
	},
	{
		title: 'Venture Deals',
		slug: 'venture-deals',
		description: 'Be Smarter than Your Lawyer and Venture Capitalist',
		longDescription: '',
		category: 'Business',
		tags: ['Brad Feld', 'Jason Mendelson'],
		link: 'https://www.amazon.com/Venture-Deals-4th-Edition-audiobook/dp/B07YL8NHLH',
		imageUrl: ventureDeals,
	},
	{
		title: 'Million Dollar Weekend',
		slug: 'million-dollar-weekend',
		description: 'A guide to making a million dollars in a weekend',
		longDescription: '',
		category: 'Inspiration',
		tags: ['Noah Kagan'],
		link: 'https://appsumo.com/products/million-dollar-weekend-ga/',
		imageUrl: millionDollarWeekend,
	},
	{
		title: 'Never Eat Alone',
		slug: 'never-eat-alone',
		description: 'And Other Secrets to Success, One Relationship at a Time',
		longDescription: '',
		category: 'Networking',
		tags: ['Keith Ferrazzi'],
		link: 'https://www.amazon.com/gp/aw/d/0385346654/',
		imageUrl: neverEatAlone,
	},
	{
		title: 'The Partnership Charter',
		slug: 'the-partnership-charter',
		description: 'How to Start Right and Thrive',
		longDescription: '',
		category: 'Business',
		tags: ['David Gage'],
		link: 'https://www.amazon.com/Partnership-Charter-Start-Right-Business/dp/0738208981/',
		imageUrl: partnershipCharter,
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
		imageUrl: faithDrivenEntrepreneur,
	},
	{
		title: "The Entrepreneur's Guide to Law and Strategy",
		slug: 'entrepreneurs-guide-to-law-and-strategy',
		description: 'A comprehensive guide to business law for entrepreneurs',
		longDescription: '',
		category: 'Law',
		tags: ['Constance Bagley', 'Craig Dauchy'],
		link: 'https://www.amazon.com/Entrepreneurs-Guide-Law-Strategy-ebook/dp/B06X9DRMB5/',
		imageUrl: entrepreneursGuideToLawAndStrategy,
	},
	{
		title: 'Do More Faster',
		slug: 'do-more-faster',
		description: 'TechStars Lessons to Accelerate Your Startup',
		longDescription: '',
		category: 'Inspiration',
		tags: ['David Cohen', 'Brad Feld'],
		link: 'https://www.amazon.com/Do-More-Faster-TechStars-Accelerate/dp/1119583284/',
		imageUrl: doMoreFaster,
	},
]

books.sort((a, b) => a.title.localeCompare(b.title))
