import { SaveUserAccountRepository } from '@/domain/contracts/repos'
import { AddUserAccount } from '@/domain/contracts/gateways/user'

export class DbAddUserAccount implements AddUserAccount {
  constructor (
    private readonly saveUserAccountRepository: SaveUserAccountRepository
  ) {}

  async add (input: AddUserAccount.Input): Promise<AddUserAccount.Output> {
    return await this.saveUserAccountRepository.saveUserAccount(input)
  }
}
