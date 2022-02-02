import { mock, MockProxy } from 'jest-mock-extended'
import { DbAddAccount } from '@/domain/use-cases'
import { AddAccount } from '@/domain/contracts/gateways/user'
import { SaveAccountRepository } from '@/domain/contracts/repos'

let userInput: AddAccount.Input
let userOutput: AddAccount.Output
let saveAccountRepository: MockProxy<SaveAccountRepository>
let sut: DbAddAccount

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

  saveAccountRepository = mock()
  saveAccountRepository.saveAccount.mockResolvedValue(userOutput)
})

beforeEach(() => {
  sut = new DbAddAccount(saveAccountRepository)
})

describe('SaveUserAccount UseCase', () => {
  it('Should call SaveAccountRepository with correct input', async () => {
    await sut.add(userInput)

    expect(saveAccountRepository.saveAccount).toHaveBeenCalledWith(userInput)
    expect(saveAccountRepository.saveAccount).toHaveBeenCalledTimes(1)
  })

  it('Should return an user account when succeds', async () => {
    const user = await sut.add(userInput)

    expect(user).toEqual(userOutput)
  })

  it('Should rethrow if SaveAccountRepository throws', async () => {
    saveAccountRepository.saveAccount.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.add(userInput)

    await expect(promise).rejects.toThrow()
  })
})
