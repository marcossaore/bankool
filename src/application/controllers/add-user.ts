import { Controller } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { TokenGenerator } from '@/domain/contracts/gateways/token'
import { AccessToken } from '@/domain/entities/access-token'
import { AddUserAccount } from '@/domain/use-cases'
export class AddUser extends Controller {
  constructor (
    private readonly addUserAccount: AddUserAccount,
    private readonly tokenGenerator: TokenGenerator
  ) {
    super()
  }

  async perform (httpRequest: AddUser.HttpRequest): Promise<HttpResponse> {
    const user = await this.addUserAccount(httpRequest)
    await this.tokenGenerator.generate({ key: user.id, expirationInMs: AccessToken.expirationInMs })
    return ok({})
  }

  override buildValidators (httpRequest: AddUser.HttpRequest): Validator[] {
    const builder = []

    const requiredFields = [
      'name',
      'email',
      'birthDate',
      'phone',
      'password',
      'cpf',
      'rg'
    ]

    for (const [key, value] of Object.entries(httpRequest)) {
      if (requiredFields.includes(key)) {
        builder.push(...Builder.of({ value: value, fieldName: key }).required().build())
      }
    }

    return builder
  }
}

export namespace AddUser {
  export type HttpRequest = {
    name: string
    email: string
    birthDate: string
    phone: string
    password: string
    cpf: string
    rg: string
  }
}
