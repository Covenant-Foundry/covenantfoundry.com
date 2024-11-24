import { invariant } from '@epic-web/invariant'
import { test as base } from '@playwright/test'
import { eq, sql } from 'drizzle-orm'
import * as setCookieParser from 'set-cookie-parser'
import {
	Role,
	Password,
	RoleToUser,
	User,
	type User as UserModel,
	Session,
} from '#app/db/schema'
import {
	getPasswordHash,
	getSessionExpirationDate,
	sessionKey,
} from '#app/utils/auth.server.ts'
import { db } from '#app/utils/db.server.ts'
import { authSessionStorage } from '#app/utils/session.server.ts'
import { createUser } from './db-utils.ts'

export * from './db-utils.ts'

type GetOrInsertUserOptions = {
	id?: string
	username?: (typeof UserModel.$inferSelect)['username']
	password?: string
	email?: (typeof UserModel.$inferSelect)['email']
}

type User = {
	id: string
	email: string
	username: string
	name: string | null
}

async function getOrInsertUser({
	id,
	username,
	password,
	email,
}: GetOrInsertUserOptions = {}): Promise<User> {
	if (id) {
		const user = await db.query.User.findFirst({
			columns: { id: true, email: true, username: true, name: true },
			where: eq(User.id, id),
		})
		invariant(user, 'User not found')
		return user
	} else {
		const userData = createUser()
		username ??= userData.username
		password ??= userData.username
		email ??= userData.email
		const [user] = await db
			.insert(User)
			.values({
				...userData,
				email,
				username,
			})
			.returning({
				id: User.id,
				email: User.email,
				username: User.username,
				name: User.name,
			})
		invariant(user, 'Failed to create user')
		const withUserRoleId = db
			.$with('user_role_id')
			.as(db.select({ id: Role.id }).from(Role).where(eq(Role.name, 'user')))
		await db
			.with(withUserRoleId)
			.insert(RoleToUser)
			.values({
				userId: user.id,
				roleId: sql`${withUserRoleId}`,
			})
		await db.insert(Password).values({
			userId: user.id,
			hash: await getPasswordHash(password),
		})
		return user
	}
}

export const test = base.extend<{
	insertNewUser(options?: GetOrInsertUserOptions): Promise<User>
	login(options?: GetOrInsertUserOptions): Promise<User>
}>({
	insertNewUser: async ({}, use) => {
		let userId: string | undefined = undefined
		await use(async (options) => {
			const user = await getOrInsertUser(options)
			userId = user.id
			return user
		})
		await db.delete(User).where(eq(User.id, userId ?? ''))
	},
	login: async ({ page }, use) => {
		let userId: string | undefined = undefined
		await use(async (options) => {
			const user = await getOrInsertUser(options)
			userId = user.id
			const [session] = await db
				.insert(Session)
				.values({
					expirationDate: getSessionExpirationDate(),
					userId: user.id,
				})
				.returning({ id: Session.id })
			invariant(session, 'Failed to create session')

			const authSession = await authSessionStorage.getSession()
			authSession.set(sessionKey, session.id)
			const cookieConfig = setCookieParser.parseString(
				await authSessionStorage.commitSession(authSession),
			)
			const newConfig = {
				...cookieConfig,
				domain: 'localhost',
				expires: cookieConfig.expires?.getTime(),
				sameSite: cookieConfig.sameSite as 'Strict' | 'Lax' | 'None',
			}
			await page.context().addCookies([newConfig])
			return user
		})
		await db.delete(User).where(eq(User.id, userId ?? ''))
	},
})
export const { expect } = test

/**
 * This allows you to wait for something (like an email to be available).
 *
 * It calls the callback every 50ms until it returns a value (and does not throw
 * an error). After the timeout, it will throw the last error that was thrown or
 * throw the error message provided as a fallback
 */
export async function waitFor<ReturnValue>(
	cb: () => ReturnValue | Promise<ReturnValue>,
	{
		errorMessage,
		timeout = 5000,
	}: { errorMessage?: string; timeout?: number } = {},
) {
	const endTime = Date.now() + timeout
	let lastError: unknown = new Error(errorMessage)
	while (Date.now() < endTime) {
		try {
			const response = await cb()
			if (response) return response
		} catch (e: unknown) {
			lastError = e
		}
		await new Promise((r) => setTimeout(r, 100))
	}
	throw lastError
}
