import { UserAccountModel, UserAddAccountModel } from '@/domain/models'

export interface AddUserAccount {
  add: (input: AddUserAccount.Input) => Promise<AddUserAccount.Output>
}

export namespace AddUserAccount {
  export type Input = UserAddAccountModel
  export type Output = UserAccountModel
}

export interface VerifyUserExists {
  exists: ({ email: string }: VerifyUserExists.Input) => Promise<void>
}

export namespace VerifyUserExists {
  export type Input = { email: string }
  export type Output = UserAccountModel
}
