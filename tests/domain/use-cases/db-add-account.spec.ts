import { DbAddAccount } from '@/domain/use-cases'
import { AddAccount, Hasher } from '@/domain/contracts/gateways'
import { SaveAccountRepository } from '@/domain/contracts/repos'

import { mock, MockProxy } from 'jest-mock-extended'

let input: AddAccount.Input
let output: AddAccount.Output
let hasher: MockProxy<Hasher>
let saveAccountRepository: MockProxy<SaveAccountRepository>
let sut: DbAddAccount

beforeAll(() => {
  input = {
    name: 'any_name',
    email: 'any_email',
    birthDate: 'any_birthDate',
    phone: 'any_phone',
    password: 'any_password',
    cpf: 'any_cpf',
    rg: 'any_rg'
  }

  output = {
    id: 'any_id'
  }

  saveAccountRepository = mock()
  saveAccountRepository.saveAccount.mockResolvedValue(output)

  hasher = mock()
  hasher.hash.mockResolvedValue('hashed_password')
})

beforeEach(() => {
  sut = new DbAddAccount(hasher, saveAccountRepository)
})

describe('SaveUserAccount UseCase', () => {
  it('Should call Hasher with correct plaintext', async () => {
    await sut.add(input)
    expect(hasher.hash).toBeCalledWith(input.password)
  })

  it('Should call SaveAccountRepository with correct input', async () => {
    await sut.add(input)

    expect(saveAccountRepository.saveAccount).toHaveBeenCalledWith(input)
    expect(saveAccountRepository.saveAccount).toHaveBeenCalledTimes(1)
  })

  it('Should return an user account when succeds', async () => {
    const user = await sut.add(input)

    expect(user).toEqual(output)
  })

  it('Should rethrow if SaveAccountRepository throws', async () => {
    saveAccountRepository.saveAccount.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.add(input)

    await expect(promise).rejects.toThrow()
  })
})
