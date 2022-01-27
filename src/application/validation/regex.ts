import { Validator } from '@/application/validation/validator'
import { RegexParamError } from '@/application/errors/'

export class RegexValidation implements Validator {
  constructor (
    private readonly value: string,
    private readonly paramName: string,
    private readonly regex: RegExp,
    private readonly format: string
  ) {}

  public validate (): Error | undefined {
    if (!this.regex.test(this.value)) {
      return new RegexParamError(this.paramName, this.format)
    }
  }
}
