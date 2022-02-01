import { UserAccountModel, UserAddAccountModel } from '@/domain/models'

export interface AddUserAccount {
  add: (input: AddUserAccount.Input) => Promise<AddUserAccount.Output>
}

export namespace AddUserAccount {
  export type Input = UserAddAccountModel
  export type Output = UserAccountModel
}
