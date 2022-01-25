import { mock } from 'jest-mock-extended'

class SaveUserAccount {
  constructor (private readonly saveUserAccountRepository: SaveUserAccountRepository) {}
  async save (userAccount: any): Promise<void> {
    await this.saveUserAccountRepository.saveUserAccount(userAccount)
  }
}

interface SaveUserAccountRepository {
  saveUserAccount: (userAccount: any) => Promise<void>
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
})
