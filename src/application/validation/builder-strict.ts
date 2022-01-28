import { Validator , Cpf, Email, DateValidation } from '@/application/validation'

import { EmailValidatorAdapter, CpfValidatorAdapter } from '@/infra/gateways/'

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

  date (): ValidationBuilderStrict {
    this.validators.push(new DateValidation(this.value, this.fieldName))
    return this
  }

  cpf (): ValidationBuilderStrict {
    this.validators.push(new Cpf(this.value, this.fieldName, new CpfValidatorAdapter()))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
