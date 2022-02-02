import { VerifyUserExists } from '@/domain/contracts/gateways'
import { DbVerifyUserExists } from '@/domain/use-cases'
import { VerifyUserExistsRepository } from '@/domain/contracts/repos'

import { mock, MockProxy } from 'jest-mock-extended'

let input: VerifyUserExists.Input
let verifyUserExistsRepository: MockProxy<VerifyUserExistsRepository>
let sut: DbVerifyUserExists

beforeAll(() => {
  input = {
    cpf: 'any_cpf'
  }

  verifyUserExistsRepository = mock()
  verifyUserExistsRepository.exists.mockResolvedValue(false)
})

beforeEach(() => {
  sut = new DbVerifyUserExists(verifyUserExistsRepository)
})

describe('DbVerifyUserExists UseCase', () => {
  it('Should call VerifyUserExistsRepo with correct input', async () => {
    await sut.exists(input)

    expect(verifyUserExistsRepository.exists).toHaveBeenCalledWith(input)
  })

  it('Should return true if VerifyUserExistsRepo returns true', async () => {
    verifyUserExistsRepository.exists.mockResolvedValueOnce(true)

    const exists = await sut.exists(input)

    expect(exists).toBe(true)
  })
})
