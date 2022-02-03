import { CompareFieldError } from '@/application/errors'
import { Validator } from '@/application/validation'

export class Compare implements Validator {
  constructor (
    readonly value: string | number | null,
    readonly compareTo: string | number | null,
    readonly fieldName: string,
    readonly compareFieldName: string
  ) {}

  validate (): Error | undefined {
    if (this.value !== this.compareTo) {
      return new CompareFieldError(this.fieldName, this.compareFieldName)
    }
  }
}
