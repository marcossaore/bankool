import { AddUser, Controller } from '@/application/controllers'
import { RequiredString, Email } from '@/application/validation'
import { TokenGenerator } from '@/domain/contracts/gateways/token'
import { AccessToken } from '@/domain/entities/access-token'

import { MockProxy, mock } from 'jest-mock-extended'
import { ServerError } from '@/application/errors'
import { EmailValidatorAdapter } from '@/infra/gateways'

describe('AddUser Controller', () => {
  let sut: AddUser
  let addUserRequest: AddUser.HttpRequest
  let userModel: AddUser.HttpRequest & { id: string }
  let addUserAccount: jest.Mock
  let tokenGenerator: MockProxy<TokenGenerator>

  beforeAll(() => {
    addUserRequest = {
      name: 'any_name',
      email: 'any_email@mail.com',
      birthDate: 'any_birthday',
      phone: 'any_phone',
      password: 'any_password',
      cpf: 'any_cpf',
      rg: 'any_rg'
    }

    userModel = {
      id: 'any_id',
      ...addUserRequest
    }

    addUserAccount = jest.fn().mockResolvedValue(userModel)
    tokenGenerator = mock()
    tokenGenerator.generate.mockResolvedValue('any_access_token')
  })

  beforeEach(() => {
    sut = new AddUser(addUserAccount, tokenGenerator)
  })

  it('Should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators(addUserRequest)

    expect(validators).toEqual([
      new RequiredString('any_name', 'name'),
      new RequiredString('any_email@mail.com', 'email'),
      new RequiredString('any_birthday', 'birthDate'),
      new RequiredString('any_phone', 'phone'),
      new RequiredString('any_password', 'password'),
      new RequiredString('any_cpf', 'cpf'),
      new RequiredString('any_rg', 'rg'),
      new Email('any_email@mail.com', 'email', new EmailValidatorAdapter())
    ])
  })

  it('Should call SaveUserAccount with correct Input', async () => {
    await sut.handle(addUserRequest)
    expect(addUserAccount).toBeCalledWith(addUserRequest)
  })

  it('Should call Token generator when SaveUserAccount succeds', async () => {
    await sut.handle(addUserRequest)
    expect(tokenGenerator.generate).toBeCalledWith({ key: userModel.id, expirationInMs: AccessToken.expirationInMs })
  })

  it('Should return 200 with an access token on success', async () => {
    const response = await sut.handle(addUserRequest)
    expect(response).toEqual({
      statusCode: 200,
      data: { accessToken: 'any_access_token' }
    })
  })

  it('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    tokenGenerator.generate.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle(addUserRequest)

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
