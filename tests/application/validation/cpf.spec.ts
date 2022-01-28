import { Cpf, CpfValidator } from '@/application/validation'
import { InvalidCpfParamError } from '@/application/errors'

import { mock, MockProxy } from 'jest-mock-extended'

const params = {
  cpf: 'any_cpf'
}

let cpfValidator: MockProxy<CpfValidator>

beforeAll(() => {
  cpfValidator = mock()
  cpfValidator.isValid.mockReturnValue(false)
})

type SutTypes = {
  sut: Cpf
  cpfValidator: MockProxy<CpfValidator>
}

const makeSut = (value: string, paramName: string): SutTypes => {
  const sut = new Cpf(value, paramName, cpfValidator)
  return {
    sut,
    cpfValidator
  }
}

describe('Email Validation', () => {
  test('Should return an error if Cpf returns false', () => {
    const { sut } = makeSut(params.cpf, 'cpf')

    const error = sut.validate()
    expect(error).toEqual(new InvalidCpfParamError('cpf'))
  })

  test('Should call CpfValidator with correct cpf', () => {
    const { sut, cpfValidator } = makeSut(params.cpf, 'cpf')
    sut.validate()
    expect(cpfValidator.isValid).toHaveBeenCalledWith(params.cpf)
    expect(cpfValidator.isValid).toHaveBeenCalledTimes(1)
  })

  test('Should throw if CpfValidator throws', () => {
    const { sut, cpfValidator } = makeSut(params.cpf, 'cpf')
    jest.spyOn(cpfValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error('')
    })
    expect(sut.validate).toThrow()
  })
})
