import { VerifyAccountExists } from '@/domain/contracts/gateways'
import { DbVerifyUserExists } from '@/domain/use-cases'
import { VerifyUserExistsRepository } from '@/domain/contracts/repos'

import { mock, MockProxy } from 'jest-mock-extended'

let input: VerifyAccountExists.Input
let verifyUserExistsRepository: MockProxy<VerifyUserExistsRepository>
let sut: DbVerifyUserExists

beforeAll(() => {
  input = {
    cpf: 'any_cpf'
  }

  verifyUserExistsRepository = mock()
  verifyUserExistsRepository.verifyUserExists.mockResolvedValue(false)
})

beforeEach(() => {
  sut = new DbVerifyUserExists(verifyUserExistsRepository)
})

describe('DbVerifyUserExists UseCase', () => {
  it('Should call VerifyUserExistsRepo with correct input', async () => {
    await sut.verify(input)

    expect(verifyUserExistsRepository.verifyUserExists).toHaveBeenCalledWith(input)
  })

  it('Should return true if VerifyUserExistsRepo returns true', async () => {
    verifyUserExistsRepository.verifyUserExists.mockResolvedValueOnce(true)

    const exists = await sut.verify(input)

    expect(exists).toBe(true)
  })

  it('Should return false if VerifyUserExistsRepo returns false', async () => {
    const exists = await sut.verify(input)

    expect(exists).toBe(false)
  })

  it('Should rethrow if VerifyUserExistsRepository throws', async () => {
    verifyUserExistsRepository.verifyUserExists.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.verify(input)

    await expect(promise).rejects.toThrow()
  })
})
