import { connectDB } from '@config/db'
import { env } from '@config/env'
import app from 'app'

// start the server
;(async () => {
  // connect db -> later
  await connectDB()
  app.listen(Number(env.PORT), () => {
    console.log(`Server is running on port http://localhost:${env.PORT}/api`)
  })
})()
