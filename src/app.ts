import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users-routes'

export const app = fastify()

void app.register(cookie)
void app.register(usersRoutes, { prefix: 'users' })
