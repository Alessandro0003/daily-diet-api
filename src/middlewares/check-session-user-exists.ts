import { type FastifyReply, type FastifyRequest } from 'fastify'
import knex from 'knex'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function checkSessionUserExists (request: FastifyRequest, reply: FastifyReply) {
  const sessionId = request.cookies.sessionId

  const user = await knex('users').where({ session_id: sessionId }).first()

  if (!user) {
    return await reply.status(401).send({ error: 'Unauthorized' })
  }

  request.user = user
}
