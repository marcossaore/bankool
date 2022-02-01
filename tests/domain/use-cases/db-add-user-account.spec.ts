import { mock, MockProxy } from 'jest-mock-extended'
import { DbAddUserAccount } from '@/domain/use-cases'
import { AddUserAccount } from '@/domain/contracts/gateways/user'
import { SaveUserAccountRepository } from '@/domain/contracts/repos'

let userInput: AddUserAccount.Input
let userOutput: AddUserAccount.Output
let saveUserAccountRepositorySpy: MockProxy<SaveUserAccountRepository>
let sut: DbAddUserAccount

beforeAll(() => {
  userInput = {
    name: 'any_name',
    email: 'any_email',
    birthDate: 'any_birthDate',
    phone: 'any_phone',
    password: 'any_password',
    cpf: 'any_cpf',
    rg: 'any_rg'
  }

  userOutput = {
    id: 'any_id'
  }

  saveUserAccountRepositorySpy = mock()
  saveUserAccountRepositorySpy.saveUserAccount.mockResolvedValue(userOutput)
})

beforeEach(() => {
  sut = new DbAddUserAccount(saveUserAccountRepositorySpy)
})

describe('SaveUserAccount UseCase', () => {
  it('Should call SaveUserAccountRepository with correct input', async () => {
    await sut.add(userInput)

    expect(saveUserAccountRepositorySpy.saveUserAccount).toHaveBeenCalledWith(userInput)
    expect(saveUserAccountRepositorySpy.saveUserAccount).toHaveBeenCalledTimes(1)
  })

  it('Should return an user account when succeds', async () => {
    const user = await sut.add(userInput)

    expect(user).toEqual(userOutput)
  })

  it('Should rethrow if SaveUserAccountRepository throws', async () => {
    saveUserAccountRepositorySpy.saveUserAccount.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.add(userInput)

    await expect(promise).rejects.toThrow()
  })
})
