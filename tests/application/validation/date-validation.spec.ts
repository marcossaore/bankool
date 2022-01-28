import { DateValidation } from '@/application/validation'
import { InvalidDateError } from '@/application/errors'

const makeSut = (value: string, paramName: string): DateValidation => {
  const sut = new DateValidation(value, paramName)
  return sut
}

describe('Date Validation', () => {
  test('Should return an error if Date Validation is not formatted as expected', () => {
    const sut = makeSut('no formated', 'date')

    const error = sut.validate()
    expect(error).toEqual(new InvalidDateError('date'))
  })

  test('Should not return if Date Validation is correctly', () => {
    const sut = makeSut('2021-10-31', 'date')

    const error = sut.validate()
    expect(error).toBeFalsy()
  })
})
