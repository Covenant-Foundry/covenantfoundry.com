import { invariant } from '@epic-web/invariant'
import { Password, Role, RoleToUser, User } from '#app/db/schema.js'
import { db } from '#app/utils/db.server'
import { createPassword } from '#tests/db-utils.js'

async function seed() {
	const [userRole] = await db
		.insert(Role)
		.values({
			name: 'user',
		})
		.returning()
	invariant(userRole, 'User role not created')

	const [adminRole] = await db
		.insert(Role)
		.values({
			name: 'admin',
		})
		.returning()
	invariant(adminRole, 'Admin role not created')

	const [user] = await db
		.insert(User)
		.values({
			email: 'jon.winsley@gmail.com',
			username: 'jon',
			name: 'Jon Winsley',
		})
		.returning({ id: User.id })
	const userId = user?.id
	invariant(userId, 'User failed to insert')
	await db.insert(Password).values({
		userId,
		...createPassword('passw0rd'),
	})

	await db.insert(RoleToUser).values({
		roleId: userRole.id,
		userId,
	})
}

seed()
	.then(() => {
		console.log('Seeding completed.')
		process.exit(0)
	})
	.catch((error) => {
		console.error('Seeding failed:', error)
		process.exit(1)
	})
