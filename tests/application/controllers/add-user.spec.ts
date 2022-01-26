import { AddUser, Controller } from '@/application/controllers'
import { RequiredString } from '@/application/validation'

describe('AddUser Controller', () => {
  let sut: AddUser
  let addUserRequest: AddUser.HttpRequest

  beforeEach(() => {
    sut = new AddUser()
    addUserRequest = {
      name: 'any_name',
      email: 'any_email',
      birthDate: 'any_birthday',
      phone: 'any_phone',
      password: 'any_password',
      cpf: 'any_cpf',
      rg: 'any_rg'
    }
  })

  it('Should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators(addUserRequest)

    expect(validators).toEqual([
      new RequiredString('any_name', 'name'),
      new RequiredString('any_email', 'email'),
      new RequiredString('any_birthday', 'birthDate'),
      new RequiredString('any_phone', 'phone'),
      new RequiredString('any_password', 'password'),
      new RequiredString('any_cpf', 'cpf'),
      new RequiredString('any_rg', 'rg')
    ])
  })
})
