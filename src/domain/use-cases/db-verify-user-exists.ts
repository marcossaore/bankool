import { VerifyAccountExists } from '@/domain/contracts/gateways'
import { VerifyUserExistsRepository } from '@/domain/contracts/repos'

export class DbVerifyUserExists implements VerifyAccountExists {
  constructor (
    private readonly verifyUserExistsRepository: VerifyUserExistsRepository
  ) {}

  async verify (input: VerifyAccountExists.Input): Promise<VerifyAccountExists.Output> {
    const exists = await this.verifyUserExistsRepository.verifyUserExists(input)
    return exists
  }
}
