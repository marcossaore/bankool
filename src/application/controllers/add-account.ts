import { Controller } from '@/application/controllers'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { AccessToken } from '@/domain/entities'
import { TokenGenerator, AddAccount, VerifyAccountExists } from '@/domain/contracts/gateways'
import { AccountAlreadyInUseError } from '@/application/errors'
import { HttpResponse, ok, forbidden } from '@/application/helpers'
export class AddAccountController extends Controller {
  constructor (
    private readonly userAccount: AddAccount & VerifyAccountExists,
    private readonly tokenGenerator: TokenGenerator
  ) {
    super()
  }

  async perform (request: AddAccountController.RequestInput): Promise<HttpResponse<AddAccountController.RequestOutput>> {
    const { cpf, name, email, birthDate } = request
    const accountExists = await this.userAccount.verify({ cpf })
    if (accountExists) {
      return forbidden(new AccountAlreadyInUseError())
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

  override buildValidators (request: AddAccountController.RequestInput): Validator[] {
    const builder = []
    const requiredFields = [
      'name',
      'email',
      'birthDate',
      'phone',
      'password',
      'confirmPassword',
      'cpf',
      'rg'
    ]
    for (const requiredField of requiredFields) {
      const value = request as any
      builder.push(...Builder.of({ value: value[requiredField] ?? null, fieldName: requiredField }).required().build())
    }
    const { email, cpf, password, confirmPassword, birthDate } = request
    builder.push(...Builder.of({ value: password, fieldName: 'password' }).compare(confirmPassword, 'confirmPassword').build())
    builder.push(...Builder.of({ value: birthDate, fieldName: 'birthDate' }).date().build())
    builder.push(...Builder.of({ value: email, fieldName: 'email' }).email().build())
    builder.push(...Builder.of({ value: cpf, fieldName: 'cpf' }).cpf().build())
    return builder
  }
}

export namespace AddAccountController {
  export type RequestInput = {
    name: string
    email: string
    birthDate: string
    phone: string
    password: string
    confirmPassword: string
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
