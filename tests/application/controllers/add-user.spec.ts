import { AddUser, Controller } from '@/application/controllers'
import { RequiredString } from '@/application/validation'
import { TokenGenerator } from '@/domain/contracts/gateways/token'
import { AccessToken } from '@/domain/entities/access-token'

import { MockProxy, mock } from 'jest-mock-extended'

describe('AddUser Controller', () => {
  let sut: AddUser
  let addUserRequest: AddUser.HttpRequest
  let userModel: AddUser.HttpRequest & { id: string }
  let addUserAccount: jest.Mock
  let tokenGenerator: MockProxy<TokenGenerator>

  beforeAll(() => {
    addUserRequest = {
      name: 'any_name',
      email: 'any_email',
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
      new RequiredString('any_email', 'email'),
      new RequiredString('any_birthday', 'birthDate'),
      new RequiredString('any_phone', 'phone'),
      new RequiredString('any_password', 'password'),
      new RequiredString('any_cpf', 'cpf'),
      new RequiredString('any_rg', 'rg')
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
})
