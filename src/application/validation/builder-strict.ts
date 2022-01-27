import { Validator } from '@/application/validation'
import { Email } from './email'
import { RegexValidation } from './regex'
import { EmailValidatorAdapter } from '@/infra/gateways/'

export class ValidationBuilderStrict {
  private constructor (
    private readonly value: any,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []
  ) {}

  static of ({ value, fieldName }: { value: any, fieldName: string }): ValidationBuilderStrict {
    return new ValidationBuilderStrict(value, fieldName)
  }

  email (): ValidationBuilderStrict {
    this.validators.push(new Email(this.value, this.fieldName, new EmailValidatorAdapter()))
    return this
  }

  regex (regex: RegExp, format: string): ValidationBuilderStrict {
    this.validators.push(new RegexValidation(this.value, this.fieldName, regex, format))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
