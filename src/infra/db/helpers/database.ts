// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { knex as setupKnex, Knex } from 'knex'
import { env } from '../../../env/env'
export const config: Knex.Config = {
  client: env.DATBASE_CLIENT,

  connection: env.DATBASE_CLIENT === 'sqlite'
    ? {
        filename: env.DATABASE_URL
      }
    : env.DATABASE_URL,

  useNullAsDefault: true,

  migrations: {
    extension: 'ts',
    directory: './src/infra/db/migrations'
  }
}

export const knex = setupKnex(config)
