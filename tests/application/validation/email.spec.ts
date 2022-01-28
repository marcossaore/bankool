import { Email, EmailValidator } from '@/application/validation'
import { InvalidEmailParamError } from '@/application/errors'

import { mock, MockProxy } from 'jest-mock-extended'

const params = {
  email: 'any_email'
}

let emailValidator: MockProxy<EmailValidator>

beforeAll(() => {
  emailValidator = mock()
  emailValidator.isValid.mockReturnValue(false)
})

type SutTypes = {
  sut: Email
  emailValidator: MockProxy<EmailValidator>
}
const makeSut = (value: string, paramName: string): SutTypes => {
  const sut = new Email(value, paramName, emailValidator)
  return {
    sut,
    emailValidator
  }
}

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut } = makeSut(params.email, 'email')

    const error = sut.validate()
    expect(error).toEqual(new InvalidEmailParamError('email'))
  })

  test('Should not return an error if EmailValidator returns true', () => {
    const { sut } = makeSut(params.email, 'email')
    emailValidator.isValid.mockReturnValue(true)
    const error = sut.validate()
    expect(error).toBeFalsy()
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidator } = makeSut(params.email, 'email')
    sut.validate()
    expect(emailValidator.isValid).toHaveBeenCalledWith(params.email)
    expect(emailValidator.isValid).toHaveBeenCalledTimes(1)
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidator } = makeSut(params.email, 'email')
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error('')
    })
    expect(sut.validate).toThrow()
  })
})
