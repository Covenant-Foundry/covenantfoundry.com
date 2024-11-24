import { invariant } from '@epic-web/invariant'
import { redirect } from '@remix-run/node'
import bcrypt from 'bcryptjs'
import { and, eq } from 'drizzle-orm'
import { safeRedirect } from 'remix-utils/safe-redirect'
import { Password, Role, RoleToUser, Session, User } from '#app/db/schema.js'
import { db } from './db.server'
import { combineHeaders } from './misc.tsx'
import { authSessionStorage } from './session.server.ts'

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () =>
	new Date(Date.now() + SESSION_EXPIRATION_TIME)

export const sessionKey = 'sessionId'

export async function getUserId(request: Request) {
	const authSession = await authSessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const sessionId = authSession.get(sessionKey)
	if (!sessionId) return null
	const session = await db.query.Session.findFirst({
		where: (session, { eq, gt }) =>
			eq(session.id, sessionId) && gt(session.expirationDate, new Date()),
		with: {
			user: true,
		},
	})
	if (!session?.user) {
		throw redirect('/', {
			headers: {
				'set-cookie': await authSessionStorage.destroySession(authSession),
			},
		})
	}
	return session.user.id
}

export async function requireUserId(
	request: Request,
	{ redirectTo }: { redirectTo?: string | null } = {},
) {
	const userId = await getUserId(request)
	if (!userId) {
		const requestUrl = new URL(request.url)
		redirectTo =
			redirectTo === null
				? null
				: (redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`)
		const loginParams = redirectTo ? new URLSearchParams({ redirectTo }) : null
		const loginRedirect = ['/login', loginParams?.toString()]
			.filter(Boolean)
			.join('?')
		throw redirect(loginRedirect)
	}
	return userId
}

export async function requireAnonymous(request: Request) {
	const userId = await getUserId(request)
	if (userId) {
		throw redirect('/')
	}
}

export async function login({
	username,
	password,
}: {
	username: (typeof User.$inferSelect)['username']
	password: string
}) {
	const user = await verifyUserPassword({ username }, password)
	if (!user) return null
	const session = await db
		.insert(Session)
		.values({
			expirationDate: getSessionExpirationDate(),
			userId: user.id,
		})
		.returning()
	return session
}

export async function resetUserPassword({
	username,
	password,
}: {
	username: (typeof User.$inferSelect)['username']
	password: string
}) {
	const hashedPassword = await getPasswordHash(password)
	return db
		.update(Password)
		.set({ hash: hashedPassword })
		.from(User)
		.where(and(eq(User.username, username), eq(Password.userId, User.id)))
}

export async function signup({
	email,
	username,
	password,
	name,
}: {
	email: (typeof User.$inferSelect)['email']
	username: (typeof User.$inferSelect)['username']
	name: (typeof User.$inferSelect)['name']
	password: string
}) {
	const hashedPassword = await getPasswordHash(password)

	return await db.transaction(async (tx) => {
		// create user
		const [user] = await tx
			.insert(User)
			.values({
				email: email.toLowerCase(),
				username: username.toLowerCase(),
				name,
			})
			.returning()
		invariant(user, 'User not created')

		// assign `user` role
		const userRole = await tx.query.Role.findFirst({
			where: eq(Role.name, 'user'),
		})
		invariant(userRole, 'User role not found')
		await tx.insert(RoleToUser).values({
			roleId: userRole.id,
			userId: user.id,
		})

		// create hashed password
		await tx
			.insert(Password)
			.values({
				hash: hashedPassword,
				userId: user.id,
			})
			.returning()

		// create new session
		const [session] = await tx
			.insert(Session)
			.values({
				expirationDate: getSessionExpirationDate(),
				userId: user.id,
			})
			.returning()

		return session
	})
}

export async function logout(
	{
		request,
		redirectTo = '/',
	}: {
		request: Request
		redirectTo?: string
	},
	responseInit?: ResponseInit,
) {
	const authSession = await authSessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const sessionId = authSession.get(sessionKey)
	// if this fails, we still need to delete the session from the user's browser
	// and it doesn't do any harm staying in the db anyway.
	if (sessionId) {
		// the .catch is important because that's what triggers the query.
		void db
			.delete(Session)
			.where(eq(Session.id, sessionId))
			.catch(() => {})
	}
	throw redirect(safeRedirect(redirectTo), {
		...responseInit,
		headers: combineHeaders(
			{ 'set-cookie': await authSessionStorage.destroySession(authSession) },
			responseInit?.headers,
		),
	})
}

export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10)
	return hash
}

export async function verifyUserPassword(
	where:
		| Pick<typeof User.$inferSelect, 'username'>
		| Pick<typeof User.$inferSelect, 'id'>,
	password: (typeof Password.$inferSelect)['hash'],
) {
	const userWithPassword = await db.query.User.findFirst({
		where:
			'username' in where
				? eq(User.username, where.username)
				: eq(User.id, where.id),
		with: {
			password: true,
		},
	})

	if (!userWithPassword || !userWithPassword.password) {
		return null
	}

	const isValid = await bcrypt.compare(password, userWithPassword.password.hash)

	if (!isValid) {
		return null
	}

	return { id: userWithPassword.id }
}
