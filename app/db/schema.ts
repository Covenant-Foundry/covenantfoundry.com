import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import {
	sqliteTable,
	text,
	integer,
	blob,
	uniqueIndex,
	index,
	primaryKey,
} from 'drizzle-orm/sqlite-core'

export const User = sqliteTable('User', {
	id: text('id')
		.primaryKey()
		.$default(() => createId()),
	email: text('email').unique().notNull(),
	username: text('username').unique().notNull(),
	name: text('name'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
		sql`CURRENT_TIMESTAMP`,
	),
})

export const usersRelations = relations(User, ({ one, many }) => ({
	password: one(Password, {
		fields: [User.id],
		references: [Password.userId],
	}),
	roles: many(RoleToUser),
}))

export const Book = sqliteTable(
	'Book',
	{
		id: text('id')
			.primaryKey()
			.$default(() => createId()),
		title: text('title').notNull(),
		slug: text('slug').unique().notNull(),
		description: text('description').notNull(),
		longDescription: text('longDescription'),
		category: text('category').notNull(),
		tags: text('tags').notNull(),
		link: text('link').notNull(),
		createdAt: integer('createdAt', { mode: 'timestamp' }).default(
			sql`CURRENT_TIMESTAMP`,
		),
		updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
			sql`CURRENT_TIMESTAMP`,
		),
		imageId: text('imageId')
			.notNull()
			.references(() => Image.id, { onDelete: 'set null' }),
	},
	(table) => ({
		slugIndex: index('slugIndex').on(table.slug),
	}),
)

export const booksRelations = relations(Book, ({ one }) => ({
	image: one(Image, {
		fields: [Book.imageId],
		references: [Image.id],
	}),
}))

export const Community = sqliteTable('Community', {
	id: text('id')
		.primaryKey()
		.$default(() => createId()),
	title: text('title').notNull(),
	description: text('description').notNull(),
	category: text('category').notNull(),
	tags: text('tags').notNull(),
	link: text('link').notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	imageId: text('imageId')
		.notNull()
		.references(() => Image.id, { onDelete: 'set null' }),
})

export const communitiesRelations = relations(Community, ({ one }) => ({
	image: one(Image, {
		fields: [Community.imageId],
		references: [Image.id],
	}),
}))

export const Image = sqliteTable('Image', {
	id: text('id')
		.primaryKey()
		.$default(() => createId()),
	altText: text('altText'),
	contentType: text('contentType').notNull(),
	blob: blob('blob', { mode: 'buffer' }).notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
		sql`CURRENT_TIMESTAMP`,
	),
})

export const Password = sqliteTable('Password', {
	hash: text('hash').notNull(),
	userId: text('userId')
		.unique()
		.notNull()
		.references(() => User.id, { onDelete: 'cascade' }),
})

export const passwordsRelations = relations(Password, ({ one }) => ({
	user: one(User, {
		fields: [Password.userId],
		references: [User.id],
	}),
}))

export const Session = sqliteTable(
	'Session',
	{
		id: text('id')
			.primaryKey()
			.$default(() => createId()),
		expirationDate: integer('expirationDate', { mode: 'timestamp' }).notNull(),
		createdAt: integer('createdAt', { mode: 'timestamp' }).default(
			sql`CURRENT_TIMESTAMP`,
		),
		updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
			sql`CURRENT_TIMESTAMP`,
		),
		userId: text('userId')
			.notNull()
			.references(() => User.id, { onDelete: 'cascade' }),
	},
	(table) => ({
		userIdIndex: index('userIdIndex').on(table.userId),
	}),
)

export const sessionsRelations = relations(Session, ({ one }) => ({
	user: one(User, {
		fields: [Session.userId],
		references: [User.id],
	}),
}))

export const Permission = sqliteTable(
	'Permission',
	{
		id: text('id')
			.primaryKey()
			.$default(() => createId()),
		action: text('action').notNull(),
		entity: text('entity').notNull(),
		access: text('access').notNull(),
		description: text('description').default(''),
		createdAt: integer('createdAt', { mode: 'timestamp' }).default(
			sql`CURRENT_TIMESTAMP`,
		),
		updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
			sql`CURRENT_TIMESTAMP`,
		),
	},
	(table) => ({
		uniqueIndex: uniqueIndex('permissionUniqueIndex').on(
			table.action,
			table.entity,
			table.access,
		),
	}),
)

export const permissionsRelations = relations(Permission, ({ many }) => ({
	roles: many(RoleToPermission),
}))

export const Role = sqliteTable('Role', {
	id: text('id')
		.primaryKey()
		.$default(() => createId()),
	name: text('name').unique().notNull(),
	description: text('description').default(''),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(
		sql`CURRENT_TIMESTAMP`,
	),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
		sql`CURRENT_TIMESTAMP`,
	),
})

export const rolesRelations = relations(Role, ({ many }) => ({
	permissions: many(RoleToPermission),
	users: many(RoleToUser),
}))

export const RoleToPermission = sqliteTable(
	'RoleToPermission',
	{
		roleId: text('roleId')
			.notNull()
			.references(() => Role.id, { onDelete: 'cascade' }),
		permissionId: text('permissionId')
			.notNull()
			.references(() => Permission.id, { onDelete: 'cascade' }),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
	}),
)

export const RoleToPermissionRelations = relations(
	RoleToPermission,
	({ one }) => ({
		role: one(Role, {
			fields: [RoleToPermission.roleId],
			references: [Role.id],
		}),
		permission: one(Permission, {
			fields: [RoleToPermission.permissionId],
			references: [Permission.id],
		}),
	}),
)

export const RoleToUser = sqliteTable(
	'RoleToUser',
	{
		roleId: text('roleId')
			.notNull()
			.references(() => Role.id, { onDelete: 'cascade' }),
		userId: text('userId')
			.notNull()
			.references(() => User.id, { onDelete: 'cascade' }),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.roleId, table.userId] }),
	}),
)

export const RoleToUserRelations = relations(RoleToUser, ({ one }) => ({
	role: one(Role, { fields: [RoleToUser.roleId], references: [Role.id] }),
	user: one(User, { fields: [RoleToUser.userId], references: [User.id] }),
}))

export const Verification = sqliteTable(
	'Verification',
	{
		id: text('id')
			.primaryKey()
			.$default(() => createId()),
		createdAt: integer('createdAt', { mode: 'timestamp' }).default(
			sql`CURRENT_TIMESTAMP`,
		),
		type: text('type').notNull(),
		target: text('target').notNull(),
		secret: text('secret').notNull(),
		algorithm: text('algorithm').notNull(),
		digits: integer('digits').notNull(),
		period: integer('period').notNull(),
		charSet: text('charSet').notNull(),
		expiresAt: integer('expiresAt', { mode: 'timestamp' }),
	},
	(table) => ({
		uniqueIndex: uniqueIndex('verificationUniqueIndex').on(
			table.target,
			table.type,
		),
	}),
)
