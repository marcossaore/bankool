import { Validator } from '@/application/validation'
import { InvalidDateError } from '@/application/errors'

export class DateValidation implements Validator {
  constructor (
    readonly value: any,
    readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    if (this.value !== null || this.value !== undefined) {
      const isFormatedAsDate = /^(\d{4}-(0[1-9]|1[0-2])-([0-2][1-9]|3[0-1]))\s?(\d{2}:\d{2})?$/.test(this.value)

      if (!isFormatedAsDate) {
        return new InvalidDateError(this.fieldName)
      }
    }
  }
}
