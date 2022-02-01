import { Controller } from '@/application/controllers'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { AccessToken } from '@/domain/entities'
import { TokenGenerator, AddUserAccount, VerifyUserExists } from '@/domain/contracts/gateways'
import { UserAccountAlreadyInUseError } from '@/application/errors'
import { HttpResponse, ok, forbidden } from '@/application/helpers'
export class AddUser extends Controller {
  constructor (
    private readonly userAccount: AddUserAccount & VerifyUserExists,
    private readonly tokenGenerator: TokenGenerator
  ) {
    super()
  }

  async perform (request: AddUser.RequestInput): Promise<HttpResponse<AddUser.RequestOutput>> {
    const { cpf, name, email, birthDate } = request
    const accountExists = await this.userAccount.exists({ cpf })
    if (accountExists) {
      return forbidden(new UserAccountAlreadyInUseError())
    }
    const { id } = await this.userAccount.add(request)
    const accessToken = await this.tokenGenerator.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
    return ok({
      accessToken,
      id,
      name,
      email,
      birthDate
    })
  }

  override buildValidators (request: AddUser.RequestInput): Validator[] {
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

    for (const [key, value] of Object.entries(request)) {
      if (requiredFields.includes(key)) {
        builder.push(...Builder.of({ value: value, fieldName: key }).required().build())
      }
    }

    const { email, cpf } = request

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

  export type RequestOutput = {
    id: string
    name: string
    email: string
    birthDate: string
    accessToken: string
  } | Error
}
