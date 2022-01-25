import { mock } from 'jest-mock-extended'

type Setup = (saveUserAccountRepository: SaveUserAccountRepository) => AddUserAccount
type Input = UserAddAccountModel
type Output = UserAccountModel
type AddUserAccount = (input: Input) => Promise<Output>

const addUserAccount: Setup = (saveUserAccountRepository) => async (addAccountParams) => {
  const user = await saveUserAccountRepository.saveUserAccount(addAccountParams)
  return user
}

type UserAddAccountModel = {
  name: string
  email: string
  birthDate: string
  phone: string
  password: string
  cpf: string
  rg: string
}

type UserAccountModel = {
  id: string
  name: string
  email: string
  birthDate: string
  phone: string
  password: string
  cpf: string
  rg: string
}
interface SaveUserAccountRepository {
  saveUserAccount: (userAccount: UserAddAccountModel) => Promise<UserAccountModel>
}

describe('SaveUserAccount UseCase', () => {
  it('Should call SaveUserAccountRepository with correct input', async () => {
    const saveUserAccountRepositorySpy = mock<SaveUserAccountRepository>()
    const userAccount = {
      name: 'any_name',
      email: 'any_email',
      birthDate: 'any_birthDate',
      phone: 'any_phone',
      password: 'any_password',
      cpf: 'any_cpf',
      rg: 'any_rg',
      id: 'any_id'
    }
    const sut = addUserAccount(saveUserAccountRepositorySpy)

    await sut(userAccount)

    expect(saveUserAccountRepositorySpy.saveUserAccount).toHaveBeenCalledWith(userAccount)
    expect(saveUserAccountRepositorySpy.saveUserAccount).toHaveBeenCalledTimes(1)
  })

  it('Should return an user account when succeds', async () => {
    const saveUserAccountRepositorySpy = mock<SaveUserAccountRepository>()
    const sut = addUserAccount(saveUserAccountRepositorySpy)
    const userAccount = {
      name: 'any_name',
      email: 'any_email',
      birthDate: 'any_birthDate',
      phone: 'any_phone',
      password: 'any_password',
      cpf: 'any_cpf',
      rg: 'any_rg',
      id: 'any_id'
    }

    saveUserAccountRepositorySpy.saveUserAccount.mockResolvedValueOnce(userAccount)

    const user = await sut(userAccount)

    expect(user).toBe(userAccount)
  })
})
