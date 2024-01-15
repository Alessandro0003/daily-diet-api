import { config } from 'dotenv'
import { z } from 'zod'

/* Validation that accesses the .env.test environment variables */
if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATBASE_CLIENT: z.enum(['sqlite']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3000)
})

const _env = envSchema.safeParse(process.env)

/* Validation in the Server  */
if (!_env.success) {
  console.error('⚠ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
