import { Email, ValidationBuilderStrict, DateValidation } from '@/application/validation'

import { EmailValidatorAdapter } from '@/infra/gateways'

describe('ValidationBuilderStrict', () => {
  it('should return Email', () => {
    const params = { value: 'any_email', fieldName: 'value' }
    const validators = ValidationBuilderStrict
      .of(params)
      .email()
      .build()

    expect(validators).toEqual([
      new Email(params.value, params.fieldName, new EmailValidatorAdapter())
    ])
  })

  it('should return Date Validation ', () => {
    const params = { value: 'any_value', fieldName: 'value' }
    const validators = ValidationBuilderStrict
      .of(params)
      .date()
      .build()

    expect(validators).toEqual([
      new DateValidation(params.value, params.fieldName)
    ])
  })

  it('should return correct validators', () => {
    const params = { value: 'any_email', fieldName: 'value' }
    const validators = ValidationBuilderStrict
      .of(params)
      .email()
      .date()
      .build()

    expect(validators).toEqual([
      new Email(params.value, params.fieldName, new EmailValidatorAdapter()),
      new DateValidation(params.value, params.fieldName)
    ])
  })
})
