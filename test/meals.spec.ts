import { it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('Meals Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })
  it('Should create to a meals', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'any_name',
        description: 'any_description',
        isOnDiet: 'any_IsOnDiet',
        date: 'any_date'
      })
      .expect(201)
  })
})
