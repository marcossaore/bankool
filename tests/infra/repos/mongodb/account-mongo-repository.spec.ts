import { SaveUserAccountRepository } from '@/domain/contracts/repos'
import { MongoHelper, AccountMongoRepository } from '@/infra/repos/mongodb'

import { Collection } from 'mongodb'

describe('', () => {
  let usersAccountCollection: Collection
  let sut: AccountMongoRepository
  let addAccountParams: SaveUserAccountRepository.Input

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    addAccountParams = {
      cpf: '12345678901',
      name: 'Mario Guerra',
      email: 'faker_email@gmail.com',
      password: '123456',
      birthDate: '1999-01-01',
      phone: '3196351441',
      rg: '453825373'
    }
  })

  beforeEach(async () => {
    usersAccountCollection = MongoHelper.getCollection('account')
    await usersAccountCollection.deleteMany({})
    sut = new AccountMongoRepository()
  })

  describe('AccountMongoRepository', () => {
    it('Should create an account on success', async () => {
      const userCreated = await sut.saveUserAccount(addAccountParams)
      const usersSavedInDb = await usersAccountCollection.find().toArray()
      expect(usersSavedInDb.length).toBe(1)
      expect(usersSavedInDb[0]._id.toString()).toBe(userCreated.id)
    })
  })
})
