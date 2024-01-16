import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../infra/db/helpers/database'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function usersRoutes (app: FastifyInstance) {
  app.get('/', {
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {
    const { sessionId } = request.cookies

    const users = await knex('users')
      .where('session_id', sessionId)
      .select()

    return { users }
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email()
    })

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      })
    }

    const { name, email } = createUserBodySchema.parse(request.body)

    const userByEmail = await knex('users').where({ email }).first()

    if (userByEmail) {
      return await reply.status(400).send({ message: 'User already exists' })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId
    })

    return await reply.status(201).send({
      name,
      email
    })
  })
}
