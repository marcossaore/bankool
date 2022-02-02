import { VerifyAccountExists } from '@/domain/contracts/gateways'
import { DbVerifyAccountExists } from '@/domain/use-cases'
import { VerifyAccountExistsRepository } from '@/domain/contracts/repos'

import { mock, MockProxy } from 'jest-mock-extended'

let input: VerifyAccountExists.Input
let verifyAccountExistsRepository: MockProxy<VerifyAccountExistsRepository>
let sut: DbVerifyAccountExists

beforeAll(() => {
  input = {
    cpf: 'any_cpf'
  }

  verifyAccountExistsRepository = mock()
  verifyAccountExistsRepository.verifyAccountExists.mockResolvedValue(false)
})

beforeEach(() => {
  sut = new DbVerifyAccountExists(verifyAccountExistsRepository)
})

describe('DbVerifyAccountExists UseCase', () => {
  it('Should call VerifyAccountExistsRepo with correct input', async () => {
    await sut.verify(input)

    expect(verifyAccountExistsRepository.verifyAccountExists).toHaveBeenCalledWith(input)
  })

  it('Should return true if VerifyAccountExistsRepo returns true', async () => {
    verifyAccountExistsRepository.verifyAccountExists.mockResolvedValueOnce(true)

    const exists = await sut.verify(input)

    expect(exists).toBe(true)
  })

  it('Should return false if VerifyAccountExistsRepo returns false', async () => {
    const exists = await sut.verify(input)

    expect(exists).toBe(false)
  })

  it('Should rethrow if VerifyAccountExistsRepository throws', async () => {
    verifyAccountExistsRepository.verifyAccountExists.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.verify(input)

    await expect(promise).rejects.toThrow()
  })
})
