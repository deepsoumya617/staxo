import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

// zod schema for env validation
const envSchema = z.object({
  PORT: z.string().default('8080'),
  DATABASE_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  APP_URL: z.string(),
  JWT_SECRET_KEY: z.string(),
})

// validate
const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', z.treeifyError(parsed.error))
  process.exit(1)
}

export const env = parsed.data
