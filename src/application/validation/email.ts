import { EmailValidator, Validator } from '@/application/validation'
import { InvalidParamError } from '@/application/errors'

export class Email implements Validator {
  private readonly value: string
  private readonly field: string
  private readonly emailValidator: EmailValidator

  constructor (value: string, field: string, emailValidator: EmailValidator) {
    this.value = value
    this.field = field
    this.emailValidator = emailValidator
  }

  validate (): Error | undefined {
    const isValid = this.emailValidator.isValid(this.value)
    if (!isValid) {
      return new InvalidParamError(this.field)
    }
  }
}
