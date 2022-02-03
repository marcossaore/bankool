import { Validator } from '@/application/validation'
import { InvalidPhoneError } from '@/application/errors'

export class Phone implements Validator {
  constructor (
    readonly value: any,
    readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    if (this.value !== null || this.value !== undefined) {
      const isFormatedAsPhone = /^\d{9}$/.test(this.value)

      if (!isFormatedAsPhone) {
        return new InvalidPhoneError(this.fieldName)
      }
    }
  }
}
