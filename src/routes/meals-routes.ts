import { type FastifyInstance } from 'fastify'

export async function mealsRoutes (app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    return await reply.status(201).send('Acessou a rota post')
  })
}
