import { VerifyAccountExists } from '@/domain/contracts/gateways'
import { VerifyAccountExistsRepository } from '@/domain/contracts/repos'

export class DbVerifyAccountExists implements VerifyAccountExists {
  constructor (
    private readonly verifyAccountExistsRepository: VerifyAccountExistsRepository
  ) {}

  async verify (input: VerifyAccountExists.Input): Promise<VerifyAccountExists.Output> {
    const exists = await this.verifyAccountExistsRepository.verifyAccountExists(input)
    return exists
  }
}
