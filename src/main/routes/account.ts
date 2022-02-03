import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeAddAccountController } from '@/main/factories/application/controllers'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/account', adapt(makeAddAccountController()))
}
