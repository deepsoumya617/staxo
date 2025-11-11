import { pgTable, index, foreignKey, check, uuid, varchar, integer, text, timestamp, unique, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const fileStatus = pgEnum("file_status", ['PENDING', 'COMPLETED', 'FAILED'])


export const files = pgTable("files", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	userId: uuid("user_id").notNull(),
	folderId: uuid("folder_id"),
	size: integer().default(0).notNull(),
	mimeType: varchar("mime_type", { length: 255 }),
	storageKey: text("storage_key").notNull(),
	checksum: varchar({ length: 128 }),
	status: fileStatus().default('PENDING').notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_files_folder_id").using("btree", table.folderId.asc().nullsLast().op("uuid_ops")),
	index("idx_files_status").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("idx_files_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "files_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.folderId],
			foreignColumns: [folders.id],
			name: "files_folder_id_folders_id_fk"
		}),
	check("files_id_not_null", sql`NOT NULL id`),
	check("files_name_not_null", sql`NOT NULL name`),
	check("files_user_id_not_null", sql`NOT NULL user_id`),
	check("files_size_not_null", sql`NOT NULL size`),
	check("files_storage_key_not_null", sql`NOT NULL storage_key`),
	check("files_status_not_null", sql`NOT NULL status`),
	check("files_created_at_not_null", sql`NOT NULL created_at`),
	check("files_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const folders = pgTable("folders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	userId: uuid("user_id").notNull(),
	parentId: uuid("parent_id"),
	path: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_folders_parent_id").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	index("idx_folders_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "folders_user_id_users_id_fk"
		}),
	check("folders_id_not_null", sql`NOT NULL id`),
	check("folders_name_not_null", sql`NOT NULL name`),
	check("folders_user_id_not_null", sql`NOT NULL user_id`),
	check("folders_created_at_not_null", sql`NOT NULL created_at`),
	check("folders_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: varchar("first_name", { length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }),
	email: varchar({ length: 255 }).notNull(),
	totalStorageUsed: integer("total_storage_used").default(0).notNull(),
	storageLimit: integer("storage_limit").default(sql`'10000000000'`).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	check("users_id_not_null", sql`NOT NULL id`),
	check("users_first_name_not_null", sql`NOT NULL first_name`),
	check("users_email_not_null", sql`NOT NULL email`),
	check("users_total_storage_used_not_null", sql`NOT NULL total_storage_used`),
	check("users_storage_limit_not_null", sql`NOT NULL storage_limit`),
	check("users_created_at_not_null", sql`NOT NULL created_at`),
]);

export const refreshTokens = pgTable("refresh_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	tokenHash: text("token_hash").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("idx_refresh_tokens_expires_at").using("btree", table.expiresAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_refresh_tokens_token_hash").using("btree", table.tokenHash.asc().nullsLast().op("text_ops")),
	index("idx_refresh_tokens_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "refresh_tokens_user_id_users_id_fk"
		}),
	check("refresh_tokens_id_not_null", sql`NOT NULL id`),
	check("refresh_tokens_user_id_not_null", sql`NOT NULL user_id`),
	check("refresh_tokens_token_hash_not_null", sql`NOT NULL token_hash`),
	check("refresh_tokens_created_at_not_null", sql`NOT NULL created_at`),
	check("refresh_tokens_expires_at_not_null", sql`NOT NULL expires_at`),
]);
