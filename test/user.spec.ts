import { it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('Users Routes', () => {
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

  it('Should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Ale',
        email: 'ale@gmail.com'
      })
      .expect(201)
  })
})
