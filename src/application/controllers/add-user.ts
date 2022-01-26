import { Controller } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'

type HttpRequest = {
  name: string
  email: string
  birthDate: string
  phone: string
  password: string
  cpf: string
  rg: string
}

export class AddUser extends Controller {
  async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    return ok({})
  }

  override buildValidators (httpRequest: HttpRequest): Validator[] {
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
