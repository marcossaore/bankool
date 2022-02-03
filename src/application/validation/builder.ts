import { Validator, AllowedMimeTypes, Extension, MaxFileSize, Required, RequiredBuffer, RequiredString, Email, DateValidation, Cpf, Compare } from '@/application/validation'
import { CpfValidatorAdapter, EmailValidatorAdapter } from '@/infra/gateways'
import { BuilderFieldNameRequiredError } from './builder-field-name-required-error'

export class ValidationBuilder {
  private constructor (
    private readonly value: any,
    private readonly fieldName?: string,
    private readonly validators: Validator[] = []
  ) {}

  static of ({ value, fieldName }: { value: any, fieldName?: string }): ValidationBuilder {
    return new ValidationBuilder(value, fieldName)
  }

  required (): ValidationBuilder {
    if (this.value instanceof Buffer) {
      this.validators.push(new RequiredBuffer(this.value, this.fieldName))
    } else if (typeof this.value === 'string') {
      this.validators.push(new RequiredString(this.value, this.fieldName))
    } else {
      this.validators.push(new Required(this.value, this.fieldName))
      if (this.value.buffer !== undefined) {
        this.validators.push(new RequiredBuffer(this.value.buffer, this.fieldName))
      }
    }
    return this
  }

  image ({ allowed, maxSizeInMb }: { allowed: Extension[], maxSizeInMb: number }): ValidationBuilder {
    if (this.value.mimeType !== undefined) {
      this.validators.push(new AllowedMimeTypes(allowed, this.value.mimeType))
    }
    if (this.value.buffer !== undefined) {
      this.validators.push(new MaxFileSize(maxSizeInMb, this.value.buffer))
    }
    return this
  }

  email (): ValidationBuilder {
    if (!this?.fieldName) {
      throw new BuilderFieldNameRequiredError('email')
    }
    this.validators.push(new Email(this.value, this.fieldName, new EmailValidatorAdapter()))
    return this
  }

  date (): ValidationBuilder {
    if (!this?.fieldName) {
      throw new BuilderFieldNameRequiredError('date')
    }
    this.validators.push(new DateValidation(this.value, this.fieldName))
    return this
  }

  cpf (): ValidationBuilder {
    if (!this?.fieldName) {
      throw new BuilderFieldNameRequiredError('cpf')
    }
    this.validators.push(new Cpf(this.value, this.fieldName, new CpfValidatorAdapter()))
    return this
  }

  compare (valueToCompare: number | string, fieldNameToCompare: string): ValidationBuilder {
    if (!this?.fieldName) {
      throw new BuilderFieldNameRequiredError('compare')
    }
    this.validators.push(new Compare(this.value, valueToCompare, this.fieldName, fieldNameToCompare))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
