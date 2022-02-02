import { UserAccountModel, UserAddAccountModel } from '@/domain/models'

export interface AddAccount {
  add: (input: AddAccount.Input) => Promise<AddAccount.Output>
}

export namespace AddAccount {
  export type Input = UserAddAccountModel
  export type Output = UserAccountModel
}

export interface VerifyAccountExists {
  verify: ({ cpf: string }: VerifyAccountExists.Input) => Promise<VerifyAccountExists.Output>
}

export namespace VerifyAccountExists {
  export type Input = { cpf: string }
  export type Output = boolean
}
