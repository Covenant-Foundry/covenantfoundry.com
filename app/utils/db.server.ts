import { remember } from '@epic-web/remember'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '#app/db/schema.js'

export const db = remember('db', () => {
	const client = createClient({
		url: process.env.TURSO_DATABASE_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	})

	const db = drizzle({ client, schema, casing: 'snake_case' })

	return db
})
