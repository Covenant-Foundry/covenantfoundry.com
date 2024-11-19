import { prisma } from '#app/utils/db.server.ts'
import { createPassword } from '#tests/db-utils.ts'

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time(`🎩 Setting password for admin user "jon"`)

	const adminUser = await prisma.user.findUniqueOrThrow({
		where: { email: 'jon.winsley@gmail.com' },
	})
	await prisma.password.update({
		where: { userId: adminUser.id },
		data: createPassword('passw0rd'),
	})
	console.timeEnd(`🎩 Setting password for admin user "jon"`)

	console.timeEnd(`🌱 Database has been seeded`)
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})

// we're ok to import from the test directory in this file
/*
eslint
	no-restricted-imports: "off",
*/
