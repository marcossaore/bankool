import { CpfValidator, Validator } from '@/application/validation'
import { InvalidCpfParamError } from '@/application/errors'

export class Cpf implements Validator {
  private readonly value: string
  private readonly field: string
  private readonly cpfValidator: CpfValidator

  constructor (value: string, field: string, cpfValidator: CpfValidator) {
    this.value = value
    this.field = field
    this.cpfValidator = cpfValidator
  }

  validate (): Error | undefined {
    const isValid = this.cpfValidator.isValid(this.value)
    if (!isValid) {
      return new InvalidCpfParamError(this.field)
    }
  }
}
