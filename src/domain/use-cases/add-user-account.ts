import { SaveUserAccountRepository } from '@/domain/contracts/repos'

type Setup = (saveUserAccountRepository: SaveUserAccountRepository) => AddUserAccount
type Input = SaveUserAccountRepository.Input
type Output = SaveUserAccountRepository.Output
type AddUserAccount = (input: Input) => Promise<Output>

export const addUserAccount: Setup = (saveUserAccountRepository) => async (addAccountParams) => {
  const user = await saveUserAccountRepository.saveUserAccount(addAccountParams)
  return user
}