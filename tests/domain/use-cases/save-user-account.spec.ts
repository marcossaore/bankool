import { mock } from 'jest-mock-extended'
import { SaveUserAccountRepository } from '@/domain/contracts/repos'
import { addUserAccount } from '@/domain/use-cases/add-user-account'

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
