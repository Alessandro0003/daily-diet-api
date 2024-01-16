import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users-routes'
import { mealsRoutes } from './routes/meals-routes'

export const app = fastify()

void app.register(cookie)
void app.register(usersRoutes, { prefix: 'users' })
void app.register(mealsRoutes, { prefix: 'meals' })
