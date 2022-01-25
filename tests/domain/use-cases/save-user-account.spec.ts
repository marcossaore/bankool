import { mock } from 'jest-mock-extended'

class SaveUserAccount {
  constructor (private readonly saveUserAccountRepository: SaveUserAccountRepository) {}
  async save (userAccount: any): Promise<any> {
    const user = await this.saveUserAccountRepository.saveUserAccount(userAccount)
    return user
  }
}

interface SaveUserAccountRepository {
  saveUserAccount: (userAccount: any) => Promise<any>
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
      rg: 'any_rg'
    }
    const sut = new SaveUserAccount(saveUserAccountRepositorySpy)

    await sut.save(userAccount)

    expect(saveUserAccountRepositorySpy.saveUserAccount).toHaveBeenCalledWith(userAccount)
    expect(saveUserAccountRepositorySpy.saveUserAccount).toHaveBeenCalledTimes(1)
  })

  it('Should return an user account when succeds', async () => {
    const saveUserAccountRepositorySpy = mock<SaveUserAccountRepository>()
    const sut = new SaveUserAccount(saveUserAccountRepositorySpy)
    const userAccount = {
      name: 'any_name',
      email: 'any_email',
      birthDate: 'any_birthDate',
      phone: 'any_phone',
      password: 'any_password',
      cpf: 'any_cpf',
      rg: 'any_rg'
    }
    saveUserAccountRepositorySpy.saveUserAccount.mockResolvedValueOnce(userAccount)

    const user = await sut.save(userAccount)

    expect(user).toBe(userAccount)
  })
})
