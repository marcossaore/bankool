import { SaveAccountRepository } from '@/domain/contracts/repos'
import { AddAccount } from '@/domain/contracts/gateways/user'
import { Hasher } from '@/domain/contracts/gateways'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly saveAccountRepository: SaveAccountRepository
  ) {}

  async add (input: AddAccount.Input): Promise<AddAccount.Output> {
    await this.hasher.hash(input.password)
    return await this.saveAccountRepository.saveAccount(input)
  }
}