import { UserAddAccountModel, UserAccountModel } from '@/domain/models'

export interface SaveUserAccountRepository {
  saveUserAccount: (userAccount: SaveUserAccountRepository.Input) => Promise<SaveUserAccountRepository.Output>
}

export namespace SaveUserAccountRepository {
  export type Input = UserAddAccountModel
  export type Output = UserAccountModel
}
