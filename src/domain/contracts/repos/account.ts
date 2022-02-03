import { AddAccountModel, AccountModel } from '@/domain/models'

export interface SaveAccountRepository {
  saveAccount: (userAccount: SaveAccountRepository.Input) => Promise<SaveAccountRepository.Output>
}

export namespace SaveAccountRepository {
  export type Input = AddAccountModel
  export type Output = AccountModel
}

export interface VerifyAccountExistsRepository {
  verifyAccountExists: ({ cpf }: VerifyAccountExistsRepository.Input) => Promise<VerifyAccountExistsRepository.Output>
}

export namespace VerifyAccountExistsRepository {
  export type Input = { cpf: string }
  export type Output = boolean
}
