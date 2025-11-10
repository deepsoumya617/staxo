import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '@config/env'
import * as schema from '@db/index'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })

// connect and verify database connection
export async function connectDB() {
  try {
    await pool.connect()
    console.log('Database connected successfully!')
  } catch (error) {
    console.error('Failed to connect to Database: ', error)
    process.exit(1)
  }
}
