import { MongoHelper } from '@/infra/repos/mongodb'
import { app } from '@/main/config/app'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { Collection } from 'mongodb'
import { cpf } from 'cpf-cnpj-validator'

type RequestInput = {
  name: string
  email: string
  password: string
  confirmPassword: string
  birthDate: string
  phone: string
  rg: string
  cpf: string
}

describe('User Routes', () => {
  let accountCollection: Collection
  let requestInput: RequestInput

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as any)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})

    const password = faker.internet.password()
    const randomDate = faker.date.past()
    const month = (randomDate.getMonth() + 1) >= 10 ? randomDate.getMonth() + 1 : `0${randomDate.getMonth() + 1}`
    const day = randomDate.getDate() >= 10 ? randomDate.getDate() : `0${randomDate.getDate()}`
    const birthDate = `${randomDate.getFullYear()}-${month}-${day}`

    requestInput = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email().toString(),
      password,
      confirmPassword: password,
      phone: '988888888',
      birthDate,
      rg: '123456789',
      cpf: cpf.generate().toString()
    }
  })

  describe('POST /account', () => {
    it('should return 200 with valid data', async () => {
      const { body, status } = await request(app)
        .post('/api/account')
        .send({ ...requestInput })

      expect(status).toBe(200)
      expect(body.accessToken).toBeTruthy()
      expect(body.birthDate).toBe(requestInput.birthDate)
      expect(body.email).toBe(requestInput.email)
      expect(body.name).toBe(requestInput.name)
    })
  })
})
