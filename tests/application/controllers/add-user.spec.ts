import { AddUser, Controller } from '@/application/controllers'
import { RequiredString, Email, Cpf } from '@/application/validation'
import { TokenGenerator, AddUserAccount, VerifyUserExists } from '@/domain/contracts/gateways'
import { AccessToken } from '@/domain/entities'
import { ServerError, UserAccountAlreadyInUseError } from '@/application/errors'

import { MockProxy, mock } from 'jest-mock-extended'

jest.mock('@/infra/gateways/email-validator-adapter', () => {
  return {
    EmailValidatorAdapter: jest.fn().mockImplementation(() => {
      return {
        isValid: jest.fn().mockReturnValue(true)
      }
    })
  }
})
jest.mock('@/infra/gateways/cpf-validator-adapter', () => {
  return {
    CpfValidatorAdapter: jest.fn().mockImplementation(() => {
      return {
        isValid: jest.fn().mockReturnValue(true)
      }
    })
  }
})

describe('AddUser Controller', () => {
  let sut: AddUser
  let requestInput: AddUser.RequestInput
  let userModel: { id: string }
  let userAccount: MockProxy<AddUserAccount> & MockProxy<VerifyUserExists>
  let tokenGenerator: MockProxy<TokenGenerator>

  beforeAll(() => {
    requestInput = {
      name: 'any_name',
      email: 'any_email',
      birthDate: 'any_birthday',
      phone: 'any_phone',
      password: 'any_password',
      cpf: 'any_cpf',
      rg: 'any_rg'
    }

    userModel = {
      id: 'any_id'
    }

    userAccount = mock()
    userAccount.add.mockResolvedValue(userModel)
    userAccount.exists.mockResolvedValue(false)
    tokenGenerator = mock()
    tokenGenerator.generate.mockResolvedValue('any_access_token')
  })

  beforeEach(() => {
    sut = new AddUser(userAccount, tokenGenerator)
  })

  it('Should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    jest.mock('@/infra/gateways/email-validator-adapter').clearAllMocks()

    const validators = sut.buildValidators(requestInput)

    expect(validators[0]).toEqual(new RequiredString('any_name', 'name'))
    expect(validators[1]).toEqual(new RequiredString('any_email', 'email'))
    expect(validators[2]).toEqual(new RequiredString('any_birthday', 'birthDate'))
    expect(validators[3]).toEqual(new RequiredString('any_phone', 'phone'))
    expect(validators[4]).toEqual(new RequiredString('any_password', 'password'))
    expect(validators[5]).toEqual(new RequiredString('any_cpf', 'cpf'))
    expect(validators[6]).toEqual(new RequiredString('any_rg', 'rg'))
    expect(validators[7]).toBeInstanceOf(Email)
    expect(validators[8]).toBeInstanceOf(Cpf)
  })

  it('Should call SaveUserAccount with correct Input', async () => {
    await sut.handle(requestInput)
    expect(userAccount.add).toBeCalledWith(requestInput)
  })

  it('Should call VerifyUserExists with correct Input', async () => {
    await sut.handle(requestInput)
    expect(userAccount.exists).toBeCalledWith({ cpf: requestInput.cpf })
  })

  it('Should return 409 if VerifyUserExists returns true', async () => {
    userAccount.exists.mockResolvedValueOnce(true)
    const httpResponse = await sut.handle(requestInput)
    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new UserAccountAlreadyInUseError()
    })
  })

  it('Should call Token Generator when SaveUserAccount succeds', async () => {
    await sut.handle(requestInput)
    expect(tokenGenerator.generate).toBeCalledWith({ key: userModel.id, expirationInMs: AccessToken.expirationInMs })
  })

  it('Should return 200 with an access token on success', async () => {
    const httpResponse = await sut.handle(requestInput)
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        id: userModel.id,
        accessToken: 'any_access_token',
        name: 'any_name',
        email: 'any_email',
        birthDate: 'any_birthday'
      }
    })
  })

  it('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    tokenGenerator.generate.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle(requestInput)

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
