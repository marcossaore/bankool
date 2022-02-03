import './config/module-alias'
import { MongoHelper } from '@/infra/repos/mongodb'
import env from '@/main/config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const { app } = await import('@/main/config/app')
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  })
  .catch(console.error)
