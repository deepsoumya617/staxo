import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { users } from '@db/schema/user'
import { folders } from '@db/schema/folder'

// enums
export const fileStatusEnums = pgEnum('file_status', [
  'PENDING',
  'COMPLETED',
  'FAILED',
])

// file table
export const files = pgTable(
  'files',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    folderId: uuid('folder_id').references(() => folders.id),
    size: integer('size').default(0).notNull(),
    mimeType: varchar('mime_type', { length: 255 }),
    storageKey: text('storage_key').notNull(),
    uploadId: varchar('upload_id', { length: 255 }),
    status: fileStatusEnums('status').default('PENDING').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => [
    index('idx_files_user_id').on(table.userId),
    index('idx_files_folder_id').on(table.folderId),
    index('idx_files_status').on(table.status),
  ]
)
