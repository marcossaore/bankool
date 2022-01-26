import { SaveUserAccountRepository } from '@/domain/contracts/repos'
import { TokenGenerator } from '../contracts/gateways/token'
import { AccessToken } from '../entities/access-token'

type Setup = (saveUserAccountRepository: SaveUserAccountRepository, token: TokenGenerator) => AddUserAccount
type Input = SaveUserAccountRepository.Input
type Output = { accessToken: string }
export type AddUserAccount = (input: Input) => Promise<Output>

export const setupAddUserAccount: Setup = (saveUserAccountRepository, token) => async (addAccountParams) => {
  const user = await saveUserAccountRepository.saveUserAccount(addAccountParams)
  const accessToken = await token.generate({
    key: user.id,
    expirationInMs: AccessToken.expirationInMs
  })
  return { accessToken }
}
