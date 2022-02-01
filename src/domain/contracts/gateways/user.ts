import { UserAccountModel, UserAddAccountModel } from '@/domain/models'

export interface AddUserAccount {
  add: (input: AddUserAccount.Input) => Promise<AddUserAccount.Output>
}

export namespace AddUserAccount {
  export type Input = UserAddAccountModel
  export type Output = UserAccountModel
}

export interface VerifyUserExists {
  exists: ({ cpf: string }: VerifyUserExists.Input) => Promise<VerifyUserExists.Output>
}

export namespace VerifyUserExists {
  export type Input = { cpf: string }
  export type Output = boolean
}
