import { AddAccountController, Controller } from '@/application/controllers'
import { RequiredString, Email, Cpf, Compare, DateValidation, Phone } from '@/application/validation'
import { TokenGenerator, AddAccount, VerifyAccountExists } from '@/domain/contracts/gateways'
import { AccessToken } from '@/domain/entities'
import { ServerError, AccountAlreadyInUseError, RequiredFieldError, CompareFieldError, InvalidDateError, InvalidPhoneError } from '@/application/errors'

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
  let sut: AddAccountController
  let requestInput: AddAccountController.RequestInput
  let userModel: { id: string }
  let userAccount: MockProxy<AddAccount> & MockProxy<VerifyAccountExists>
  let tokenGenerator: MockProxy<TokenGenerator>

  beforeAll(() => {
    requestInput = {
      name: 'any_name',
      email: 'any_email',
      birthDate: '1984-11-06',
      phone: '123456789',
      password: 'any_password',
      confirmPassword: 'any_password',
      cpf: 'any_cpf',
      rg: 'any_rg'
    }

    userModel = {
      id: 'any_id'
    }

    userAccount = mock()
    userAccount.add.mockResolvedValue(userModel)
    userAccount.verify.mockResolvedValue(false)
    tokenGenerator = mock()
    tokenGenerator.generate.mockResolvedValue('any_access_token')
  })

  beforeEach(() => {
    sut = new AddAccountController(userAccount, tokenGenerator)
  })

  it('Should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    jest.mock('@/infra/gateways/email-validator-adapter').clearAllMocks()

    const validators = sut.buildValidators(requestInput)

    expect(validators[0]).toEqual(new RequiredString('any_name', 'name'))
    expect(validators[1]).toEqual(new RequiredString('any_email', 'email'))
    expect(validators[2]).toEqual(new RequiredString('1984-11-06', 'birthDate'))
    expect(validators[3]).toEqual(new RequiredString('123456789', 'phone'))
    expect(validators[4]).toEqual(new RequiredString('any_password', 'password'))
    expect(validators[5]).toEqual(new RequiredString('any_password', 'confirmPassword'))
    expect(validators[6]).toEqual(new RequiredString('any_cpf', 'cpf'))
    expect(validators[7]).toEqual(new RequiredString('any_rg', 'rg'))
    expect(validators[8]).toEqual(new Compare('any_password', 'any_password', 'password', 'confirmPassword'))
    expect(validators[9]).toEqual(new DateValidation('1984-11-06', 'birthDate'))
    expect(validators[10]).toEqual(new Phone('123456789', 'phone'))
    expect(validators[11]).toBeInstanceOf(Email)
    expect(validators[12]).toBeInstanceOf(Cpf)
  })

  it('should return 400 if name is not provided', async () => {
    const requestInputAlter = { ...requestInput }
    requestInputAlter.name = undefined as any

    const httpResponse = await sut.handle(requestInputAlter)

    expect(httpResponse).toEqual({
      data: new RequiredFieldError('name'),
      statusCode: 400
    })
  })

  it('should return 400 if date is invalid', async () => {
    const requestInputAlter = { ...requestInput }
    requestInputAlter.birthDate = 'any_date'

    const httpResponse = await sut.handle(requestInputAlter)

    expect(httpResponse).toEqual({
      data: new InvalidDateError('birthDate'),
      statusCode: 400
    })
  })

  it('should return 400 if passwordConfirm is not equal password', async () => {
    const requestInputAlter = { ...requestInput }
    requestInputAlter.confirmPassword = 'other_password'

    const httpResponse = await sut.handle(requestInputAlter)

    expect(httpResponse).toEqual({
      data: new CompareFieldError('password', 'confirmPassword'),
      statusCode: 400
    })
  })

  it('should return 400 if phone is invalid', async () => {
    const requestInputAlter = { ...requestInput }
    requestInputAlter.phone = 'invalid'

    const httpResponse = await sut.handle(requestInputAlter)

    expect(httpResponse).toEqual({
      data: new InvalidPhoneError('phone'),
      statusCode: 400
    })
  })

  it('Should call SaveUserAccount with correct Input', async () => {
    await sut.handle(requestInput)
    expect(userAccount.add).toBeCalledWith(requestInput)
  })

  it('Should call VerifyAccountExists with correct Input', async () => {
    await sut.handle(requestInput)
    expect(userAccount.verify).toBeCalledWith({ cpf: requestInput.cpf })
  })

  it('Should return 409 if VerifyAccountExists returns true', async () => {
    userAccount.verify.mockResolvedValueOnce(true)
    const httpResponse = await sut.handle(requestInput)
    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new AccountAlreadyInUseError()
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
        birthDate: '1984-11-06'
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
