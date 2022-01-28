import { CpfValidatorAdapter } from '@/infra/gateways'

import { cpf } from 'cpf-cnpj-validator'

jest.mock('cpf-cnpj-validator')

const makeSut = (): CpfValidatorAdapter => {
  return new CpfValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  let mockCpf: string
  beforeAll(() => {
    mockCpf = '12345678901'
    jest.mocked(cpf).isValid.mockReturnValue(true)
  })

  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(cpf, 'isValid').mockReturnValueOnce(false)
    const isValid = sut.isValid(mockCpf)
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid(mockCpf)
    expect(isValid).toBe(true)
  })

  test('Should call validator with correct cpf', () => {
    const sut = makeSut()
    const isCpfSpy = jest.spyOn(cpf, 'isValid')
    sut.isValid(mockCpf)
    expect(isCpfSpy).toHaveBeenCalledWith(mockCpf)
  })
})
