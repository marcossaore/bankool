import { VerifyUserExists } from '@/domain/contracts/gateways'
import { VerifyUserExistsRepository } from '@/domain/contracts/repos'

export class DbVerifyUserExists {
  constructor (
    private readonly verifyUserExistsRepository: VerifyUserExistsRepository
  ) {}

  async exists (input: VerifyUserExists.Input): Promise<void> {
    await this.verifyUserExistsRepository.exists(input)
  }
}
