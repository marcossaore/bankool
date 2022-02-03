import { Phone } from '@/application/validation'
import { InvalidPhoneError } from '@/application/errors'

const makeSut = (value: string, paramName: string): Phone => {
  const sut = new Phone(value, paramName)
  return sut
}

describe('Phone Validation', () => {
  test('Should return an error phone is wrong', () => {
    const sut = makeSut('wrong_phone', 'phone')

    const error = sut.validate()

    expect(error).toEqual(new InvalidPhoneError('phone'))
  })

  test('Should return an error if phone contains more than 9 digits', () => {
    const sut = makeSut('1234567890', 'phone')

    const error = sut.validate()

    expect(error).toEqual(new InvalidPhoneError('phone'))
  })

  test('Should not return when succeds', () => {
    const sut = makeSut('987654321', 'phone')

    const error = sut.validate()

    expect(error).toBeFalsy()
  })
})
