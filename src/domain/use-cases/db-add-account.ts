import { SaveAccountRepository } from '@/domain/contracts/repos'
import { AddAccount } from '@/domain/contracts/gateways/user'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly saveAccountRepository: SaveAccountRepository
  ) {}

  async add (input: AddAccount.Input): Promise<AddAccount.Output> {
    return await this.saveAccountRepository.saveAccount(input)
  }
}
