import { app } from './app'
import { env } from './env/env'

void app.listen({

  port: env.PORT

})
  .then(() => {
    console.log(`Server running in http://localhost:${env.PORT}`)
  })
