import { Controller } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { TokenGenerator } from '@/domain/contracts/gateways/token'
import { AddUserAccount } from '@/domain/contracts/gateways/user'
import { AccessToken } from '@/domain/entities/access-token'
export class AddUser extends Controller {
  constructor (
    private readonly addUserAccount: AddUserAccount,
    private readonly tokenGenerator: TokenGenerator
  ) {
    super()
  }

  async perform (httpRequest: AddUser.RequestInput): Promise<HttpResponse> {
    const user = await this.addUserAccount.add(httpRequest)
    const accessToken = await this.tokenGenerator.generate({ key: user.id, expirationInMs: AccessToken.expirationInMs })
    return ok({
      accessToken
    })
  }

  override buildValidators (httpRequest: AddUser.RequestInput): Validator[] {
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

    const { email, cpf } = httpRequest

    builder.push(...Builder.of({ value: email, fieldName: 'email' }).email().build())

    builder.push(...Builder.of({ value: cpf, fieldName: 'cpf' }).cpf().build())
    return builder
  }
}

export namespace AddUser {
  export type RequestInput = {
    name: string
    email: string
    birthDate: string
    phone: string
    password: string
    cpf: string
    rg: string
  }
}
