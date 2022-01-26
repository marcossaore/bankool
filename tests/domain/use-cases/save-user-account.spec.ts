import { mock, MockProxy } from 'jest-mock-extended'
import { SaveUserAccountRepository } from '@/domain/contracts/repos'
import { addUserAccount, AddUserAccount } from '@/domain/use-cases/add-user-account'
import { TokenGenerator } from '@/domain/contracts/gateways/token'
import { AccessToken } from '@/domain/entities/access-token'

let mockUserAddAccount: SaveUserAccountRepository.Input
let mockUserAccount: SaveUserAccountRepository.Output
let saveUserAccountRepositorySpy: MockProxy<SaveUserAccountRepository>
let tokenGenerator: MockProxy<TokenGenerator>
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

  tokenGenerator = mock()
  tokenGenerator.generate.mockResolvedValue('any_token')
})

beforeEach(() => {
  sut = addUserAccount(saveUserAccountRepositorySpy, tokenGenerator)
})

describe('SaveUserAccount UseCase', () => {
  it('Should call SaveUserAccountRepository with correct input', async () => {
    await sut(mockUserAddAccount)

    expect(saveUserAccountRepositorySpy.saveUserAccount).toHaveBeenCalledWith(mockUserAddAccount)
    expect(saveUserAccountRepositorySpy.saveUserAccount).toHaveBeenCalledTimes(1)
  })

  it('Should call TokenGenerator with correct input', async () => {
    await sut(mockUserAddAccount)

    expect(tokenGenerator.generate).toHaveBeenCalledWith({
      key: 'any_id',
      expirationInMs: AccessToken.expirationInMs
    })

    expect(tokenGenerator.generate).toBeCalledTimes(1)
  })

  it('Should return TokenGenerator when succeds', async () => {
    const accessToken = await sut(mockUserAddAccount)

    expect(accessToken).toEqual({
      accessToken: 'any_token'
    })
  })

  it('Should rethrow if SaveUserAccountRepository throws', async () => {
    saveUserAccountRepositorySpy.saveUserAccount.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut(mockUserAddAccount)

    await expect(promise).rejects.toThrow()
  })

  it('Should rethrow if TokenGenerator throws', async () => {
    tokenGenerator.generate.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut(mockUserAddAccount)

    await expect(promise).rejects.toThrow()
  })
})
