import { remember } from '@epic-web/remember'
import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'
import chalk from 'chalk'

export const prisma = remember('prisma', () => {
	// NOTE: if you change anything in this function you'll need to restart
	// the dev server to see your changes.

	const libsql = createClient({
		url: 'file:./prisma/data.db',
		syncUrl: process.env.TURSO_DATABASE_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
		syncInterval: 60000,
	})

	const adapter = new PrismaLibSQL(libsql)

	// Feel free to change this log threshold to something that makes sense for you
	const logThreshold = 20

	const client = new PrismaClient({
		log: [
			{ level: 'query', emit: 'event' },
			{ level: 'error', emit: 'stdout' },
			{ level: 'warn', emit: 'stdout' },
		],
		adapter,
	})
	client.$extends({
		query: {
			$allModels: {
				async $allOperations({ operation, args, query }) {
					const result = await query(args)

					// Synchronize the embedded replica after any write operation
					if (['create', 'update', 'delete'].includes(operation)) {
						await libsql.sync()
					}

					return result
				},
			},
		},
	})
	client.$on('query', async (e) => {
		if (e.duration < logThreshold) return
		const color =
			e.duration < logThreshold * 1.1
				? 'green'
				: e.duration < logThreshold * 1.2
					? 'blue'
					: e.duration < logThreshold * 1.3
						? 'yellow'
						: e.duration < logThreshold * 1.4
							? 'redBright'
							: 'red'
		const dur = chalk[color](`${e.duration}ms`)
		console.info(`prisma:query - ${dur} - ${e.query}`)
	})
	void client.$connect()
	return client
})
