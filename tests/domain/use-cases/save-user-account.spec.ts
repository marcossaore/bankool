import { mock, MockProxy } from 'jest-mock-extended'
import { SaveUserAccountRepository } from '@/domain/contracts/repos'
import { addUserAccount, AddUserAccount } from '@/domain/use-cases/add-user-account'

let mockUserAddAccount: SaveUserAccountRepository.Input
let mockUserAccount: SaveUserAccountRepository.Output
let saveUserAccountRepositorySpy: MockProxy<SaveUserAccountRepository>
let sut: AddUserAccount

beforeAll(() => {
  mockUserAddAccount = {
    name: 'any_name',
    email: 'any_email',
    birthDate: 'any_birthDate',
    phone: 'any_phone',
    password: 'any_password',
    cpf: 'any_cpf',
    rg: 'any_rg'
  }

  mockUserAccount = {
    name: 'any_name',
    email: 'any_email',
    birthDate: 'any_birthDate',
    phone: 'any_phone',
    password: 'any_password',
    cpf: 'any_cpf',
    rg: 'any_rg',
    id: 'any_id'
  }
  saveUserAccountRepositorySpy = mock()
  saveUserAccountRepositorySpy.saveUserAccount.mockResolvedValue(mockUserAccount)
})

beforeEach(() => {
  sut = addUserAccount(saveUserAccountRepositorySpy)
})

describe('SaveUserAccount UseCase', () => {
  it('Should call SaveUserAccountRepository with correct input', async () => {
    await sut(mockUserAddAccount)

    expect(saveUserAccountRepositorySpy.saveUserAccount).toHaveBeenCalledWith(mockUserAddAccount)
    expect(saveUserAccountRepositorySpy.saveUserAccount).toHaveBeenCalledTimes(1)
  })

  it('Should return an user account when succeds', async () => {
    const user = await sut(mockUserAddAccount)

    expect(user).toBe(mockUserAccount)
  })

  it('Should rethrow if SaveUserAccountRepository throws', async () => {
    saveUserAccountRepositorySpy.saveUserAccount.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut(mockUserAddAccount)

    await expect(promise).rejects.toThrow()
  })
})
