import { type FastifyReply, type FastifyRequest } from 'fastify'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function checkSessionIdExists (request: FastifyRequest, reply: FastifyReply) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return await reply.status(401).send({
      error: 'Unauthorized.'
    })
  }
}
