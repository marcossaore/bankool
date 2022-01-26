import { SaveUserAccountRepository } from '@/domain/contracts/repos'

type Setup = (saveUserAccountRepository: SaveUserAccountRepository) => AddUserAccount
type Input = SaveUserAccountRepository.Input
type Output = SaveUserAccountRepository.Output
export type AddUserAccount = (input: Input) => Promise<Output>

export const setupAddUserAccount: Setup = (saveUserAccountRepository) => async (addAccountParams) => {
  const user = await saveUserAccountRepository.saveUserAccount(addAccountParams)
  return user
}
