import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import knex from 'knex'
import { randomUUID } from 'crypto'
import { checkSessionUserExists } from '../middlewares/check-session-user-exists'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function mealsRoutes (app: FastifyInstance) {
  app.post('/', { preHandler: [checkSessionUserExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date()
      })

      const { name, description, isOnDiet, date } = createMealBodySchema.parse(
        request.body
      )

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime()
      })

      return await reply.status(201).send({
        name,
        description
      })
    }
  )

  app.get(
    '/',
    { preHandler: [checkSessionUserExists] },
    async (request, reply) => {
      const meals = await knex('meals')
        .where({ user_id: request.user?.id })
        .orderBy('date', 'desc')

      return await reply.send({ meals })
    }
  )

  app.get(
    '/:mealId',
    { preHandler: [checkSessionUserExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      const { mealId } = paramsSchema.parse(request.params)

      const meal = await knex('meals').where({ id: mealId }).first()

      if (!meal) {
        return await reply.status(404).send({ error: 'Meal not found' })
      }

      return await reply.send({ meal })
    }
  )

  app.put(
    '/:mealId',
    { preHandler: [checkSessionUserExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      const { mealId } = paramsSchema.parse(request.params)

      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date()
      })

      const { name, description, isOnDiet, date } = updateMealBodySchema.parse(
        request.body
      )

      const meal = await knex('meals').where({ id: mealId }).first()

      if (!meal) {
        return await reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals').where({ id: mealId }).update({
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime()
      })

      return await reply.status(204).send()
    }
  )

  app.delete(
    '/:mealId',
    { preHandler: [checkSessionUserExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      const { mealId } = paramsSchema.parse(request.params)

      const meal = await knex('meals').where({ id: mealId }).first()

      if (!meal) {
        return await reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals').where({ id: mealId }).delete()

      return await reply.status(204).send()
    }
  )

  app.get(
    '/metrics',
    { preHandler: [checkSessionUserExists] },
    async (request, reply) => {
      const totalMealsOnDiet = await knex('meals')
        .where({ user_id: request.user?.id, is_on_diet: true })
        .count('id', { as: 'total' })
        .first()

      const totalMealsOffDiet = await knex('meals')
        .where({ user_id: request.user?.id, is_on_diet: false })
        .count('id', { as: 'total' })
        .first()

      const totalMeals = await knex('meals')
        .where({ user_id: request.user?.id })
        .orderBy('date', 'desc')

      const { bestOnDietSequence } = totalMeals.reduce(
        (acc, meal) => {
          if (meal.is_on_diet) {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence
          }

          return acc
        },
        { bestOnDietSequence: 0, currentSequence: 0 }
      )

      return await reply.send({
        totalMeals: totalMeals.length,
        totalMealsOnDiet: totalMealsOnDiet?.total,
        totalMealsOffDiet: totalMealsOffDiet?.total,
        bestOnDietSequence
      })
    }
  )
}
