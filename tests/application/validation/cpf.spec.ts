import { Cpf, CpfValidator } from '@/application/validation'
import { InvalidCpfParamError } from '@/application/errors'

import { mock, MockProxy } from 'jest-mock-extended'

const params = {
  cpf: 'any_cpf'
}

let cpfValidator: MockProxy<CpfValidator>

beforeAll(() => {
  cpfValidator = mock()
  cpfValidator.isValid.mockReturnValue(true)
})

const makeSut = (value: string, paramName: string): Cpf => {
  const sut = new Cpf(value, paramName, cpfValidator)
  return sut
}

describe('Cpf Validation', () => {
  test('Should return an error if CpfValidator returns false', () => {
    const sut = makeSut(params.cpf, 'cpf')

    cpfValidator.isValid.mockReturnValueOnce(false)

    const error = sut.validate()

    expect(error).toEqual(new InvalidCpfParamError('cpf'))
  })

  test('Should not return if CpfValidator returns true', () => {
    const sut = makeSut(params.cpf, 'cpf')

    const error = sut.validate()
    expect(error).toBeFalsy()
  })

  test('Should call CpfValidator with correct cpf', () => {
    const sut = makeSut(params.cpf, 'cpf')
    sut.validate()
    expect(cpfValidator.isValid).toHaveBeenCalledWith(params.cpf)
    expect(cpfValidator.isValid).toHaveBeenCalledTimes(1)
  })

  test('Should throw if CpfValidator throws', () => {
    const sut = makeSut(params.cpf, 'cpf')
    jest.spyOn(cpfValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error('')
    })
    expect(sut.validate).toThrow()
  })
})
