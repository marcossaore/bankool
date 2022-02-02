import { SaveUserAccountRepository } from '@/domain/contracts/repos'
import { AddAccount } from '@/domain/contracts/gateways/user'

export class DbAddUserAccount implements AddAccount {
  constructor (
    private readonly saveUserAccountRepository: SaveUserAccountRepository
  ) {}

  async add (input: AddAccount.Input): Promise<AddAccount.Output> {
    return await this.saveUserAccountRepository.saveUserAccount(input)
  }
}
