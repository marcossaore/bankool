import { CompareFieldError } from '@/application/errors'
import { Validator } from '@/application/validation'

export class Compare implements Validator {
  constructor (
    readonly value: any,
    readonly compareTo: any,
    readonly fieldName: string,
    readonly compareFieldName: string
  ) {}

  validate (): Error | undefined {
    if (this.value !== this.compareTo) {
      return new CompareFieldError(this.fieldName, this.compareFieldName)
    }
  }
}
