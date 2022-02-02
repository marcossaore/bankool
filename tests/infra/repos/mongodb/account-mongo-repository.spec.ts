import { SaveUserAccountRepository } from '@/domain/contracts/repos'
import { MongoHelper, AccountMongoRepository } from '@/infra/repos/mongodb'

import { Collection } from 'mongodb'

describe('', () => {
  let accountCollection: Collection
  let sut: AccountMongoRepository
  let addAccountParams: SaveUserAccountRepository.Input

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
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

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
    sut = new AccountMongoRepository()
  })

  describe('AccountMongoRepository', () => {
    describe('saveUserAccount', () => {
      it('Should create an account on success', async () => {
        const userCreated = await sut.saveUserAccount(addAccountParams)
        const usersSavedInDb = await accountCollection.findOne()

        expect(usersSavedInDb).toBeTruthy()
        expect(usersSavedInDb?._id.toString()).toBe(userCreated.id)
        expect(usersSavedInDb?.cpf).toBe(addAccountParams.cpf)
        expect(usersSavedInDb?.name).toBe(addAccountParams.name)
      })
    })

    describe('verifyUserExists', () => {
      it('Should return false if account doesnt exist', async () => {
        const exists = await sut.verifyUserExists({ cpf: 'any_cpf' })

        expect(exists).toBe(false)
      })

      it('Should return true if account exists', async () => {
        await accountCollection.insertOne({ ...addAccountParams })

        const exists = await sut.verifyUserExists({ cpf: '12345678901' })

        expect(exists).toBe(true)
      })
    })
  })
})
