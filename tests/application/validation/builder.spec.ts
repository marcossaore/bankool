import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer, RequiredString, ValidationBuilder, Email, DateValidation, Cpf, Compare } from '@/application/validation'
import { CpfValidatorAdapter, EmailValidatorAdapter } from '@/infra/gateways'
import { BuilderFieldNameRequiredError } from '@/application/validation/builder-field-name-required-error'

describe('ValidationBuilder', () => {
  it('should return RequiredString', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString('any_value')])
  })

  it('should return RequiredBuffer', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: buffer })
      .required()
      .build()

    expect(validators).toEqual([new RequiredBuffer(buffer)])
  })

  it('should return Required', () => {
    const validators = ValidationBuilder
      .of({ value: { any: 'any' } })
      .required()
      .build()

    expect(validators).toEqual([new Required({ any: 'any' })])
  })

  it('should return Required', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: { buffer } })
      .required()
      .build()

    expect(validators).toEqual([
      new Required({ buffer }),
      new RequiredBuffer(buffer)
    ])
  })

  it('should return Required when value is undefind', () => {
    const validators = ValidationBuilder
      .of({ value: undefined as any })
      .required()
      .build()

    expect(validators).toEqual([
      new Required(undefined)
    ])
  })

  it('should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: { buffer } })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([new MaxFileSize(6, buffer)])
  })

  it('should return correct image validators', () => {
    const validators = ValidationBuilder
      .of({ value: { mimeType: 'image/png' } })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['png'], 'image/png')])
  })

  it('should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: { buffer, mimeType: 'image/png' } })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([
      new AllowedMimeTypes(['png'], 'image/png'),
      new MaxFileSize(6, buffer)
    ])
  })

  it('should return Email', () => {
    const params = { value: 'any_email', fieldName: 'value' }
    const validators = ValidationBuilder
      .of(params)
      .email()
      .build()

    expect(validators).toEqual([
      new Email(params.value, params.fieldName, new EmailValidatorAdapter())
    ])
  })

  it('should return Date Validation ', () => {
    const params = { value: 'any_value', fieldName: 'value' }
    const validators = ValidationBuilder
      .of(params)
      .date()
      .build()

    expect(validators).toEqual([
      new DateValidation(params.value, params.fieldName)
    ])
  })

  it('should return Cpf Validation ', () => {
    const params = { value: 'any_value', fieldName: 'value' }
    const validators = ValidationBuilder
      .of(params)
      .cpf()
      .build()

    expect(validators).toEqual([
      new Cpf(params.value, params.fieldName, new CpfValidatorAdapter())
    ])
  })

  it('should return Compare Validation ', () => {
    const params = { value: 'any_value', fieldName: 'value' }
    const validators = ValidationBuilder
      .of(params)
      .compare('valueToCompare', 'fieldNameToCompare')
      .build()

    expect(validators).toEqual([
      new Compare(params.value, 'valueToCompare', params.fieldName, 'fieldNameToCompare')
    ])
  })

  it('should return correct validators', () => {
    const params = { value: 'any_email', fieldName: 'value' }
    const validators = ValidationBuilder
      .of(params)
      .email()
      .date()
      .cpf()
      .build()

    expect(validators).toEqual([
      new Email(params.value, params.fieldName, new EmailValidatorAdapter()),
      new DateValidation(params.value, params.fieldName),
      new Cpf(params.value, params.fieldName, new CpfValidatorAdapter())
    ])
  })

  it('should throw if fieldName is no provided when call email method', () => {
    const builder = ValidationBuilder.of({ value: 'any_email' })

    expect(builder.email).toThrowError(new BuilderFieldNameRequiredError('email'))
  })

  it('should throw if fieldName is no provided when call date method', () => {
    const builder = ValidationBuilder.of({ value: 'any_date' })

    expect(builder.date).toThrowError(new BuilderFieldNameRequiredError('date'))
  })

  it('should throw if fieldName is no provided when call cpf method', () => {
    const builder = ValidationBuilder.of({ value: 'any_date' })

    expect(builder.cpf).toThrowError(new BuilderFieldNameRequiredError('cpf'))
  })
})
