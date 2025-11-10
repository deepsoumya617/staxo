import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

// user table
export const users = pgTable('users', {
  // basic columns
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),

  // storage info
  totalStorageUsed: integer('total_storage_used').default(0).notNull(),
  storageLimit: integer('storage_limit').default(10_000_000_000).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
})
