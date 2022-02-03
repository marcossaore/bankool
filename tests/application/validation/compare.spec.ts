import { CompareFieldError } from '@/application/errors'
import { Compare } from '@/application/validation'

describe('Compare', () => {
  it('should return CompareFieldError if value is null', () => {
    const sut = new Compare('value', 'another_value', 'value_field_name', 'another_value_field_name')

    const error = sut.validate()

    expect(error).toEqual(new CompareFieldError('value_field_name', 'another_value_field_name'))
  })

  it('should return CompareFieldError if value is undefined', () => {
    const sut = new Compare(undefined as any, 'another_value', 'value_field_name', 'another_value_field_name')

    const error = sut.validate()

    expect(error).toEqual(new CompareFieldError('value_field_name', 'another_value_field_name'))
  })

  it('should not return when fields are the same', () => {
    const sut = new Compare(100 , 100 , 'value_field_name', 'another_value_field_name')

    const error = sut.validate()

    expect(error).toBeFalsy()
  })
})
