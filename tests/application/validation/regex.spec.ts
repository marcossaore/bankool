import { RegexParamError } from '@/application/errors/'
import { RegexValidation } from '@/application/validation/'

describe('RegexValidation', () => {
  let regexParamError: RegexParamError

  beforeAll(() => {
    regexParamError = new RegexParamError('paramName', '0000-00-00')
  })

  const makeSut = (dataParam: string, paramName: string): RegexValidation => {
    return new RegexValidation(dataParam, paramName, /\d{4}-\d{1,2}-\d{1,2}/, '0000-00-00')
  }

  test('should return a RegexParamError if regex do not match with param', () => {
    const data = {
      paramName: 'simple-date'
    }
    const sut = makeSut(data.paramName, 'paramName')

    const error = sut.validate()

    expect(error).toEqual(regexParamError)
  })

  test('should not return if regex match with param', () => {
    const data = {
      paramName: '2021-02-21'
    }
    const sut = makeSut(data.paramName, 'paramName')

    const error = sut.validate()

    expect(error).toBeFalsy()
  })
})
