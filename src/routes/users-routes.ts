import { type FastifyInstance } from 'fastify'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function usersRoutes (app: FastifyInstance) {
  app.post('/', (request, reply) => {
    return reply.send({ name: String, email: String }).status(200)
  })
}
