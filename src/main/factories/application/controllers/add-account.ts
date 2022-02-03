import { AddAccountController } from '@/application/controllers'
import { AddAccount, VerifyAccountExists } from '@/domain/contracts/gateways'
import { DbAddAccount, DbVerifyAccountExists } from '@/domain/use-cases'
import { BcryptAdapter, JwtTokenHandler } from '@/infra/gateways'
import { AccountMongoRepository } from '@/infra/repos/mongodb'
import env from '@/main/config/env'

export const makeAddAccountController = (): AddAccountController => {
  const salt = 12
  const bcrypterAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcrypterAdapter, accountMongoRepository)
  const dbVerifyAccount = new DbVerifyAccountExists(accountMongoRepository)
  const account: AddAccount & VerifyAccountExists = {
    add: dbAddAccount.add.bind(dbAddAccount),
    verify: dbVerifyAccount.verify.bind(dbVerifyAccount)
  }
  const jwtTokenHandler = new JwtTokenHandler(env.jwtSecret)
  return new AddAccountController(account, jwtTokenHandler)
}
