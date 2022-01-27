import { Email, ValidationBuilderStrict, RegexValidation } from '@/application/validation'

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

  it('should return regex ', () => {
    const params = { value: 'Text with Hour 13:00', fieldName: 'value' }
    const validators = ValidationBuilderStrict
      .of(params)
      .regex(/\d{2}:\d{2}/, '00:00')
      .build()

    expect(validators).toEqual([
      new RegexValidation(params.value, params.fieldName, /\d{2}:\d{2}/, '00:00')
    ])
  })

  it('should return correct validators', () => {
    const params = { value: 'any_email', fieldName: 'value' }
    const validators = ValidationBuilderStrict
      .of(params)
      .email()
      .regex(/@/, '@')
      .build()

    expect(validators).toEqual([
      new Email(params.value, params.fieldName, new EmailValidatorAdapter()),
      new RegexValidation(params.value, params.fieldName, /@/, '@')
    ])
  })
})
