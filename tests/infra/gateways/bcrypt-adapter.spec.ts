import { BcryptAdapter } from '@/infra/gateways'

import bcrypt from 'bcrypt'

jest.mock('bcrypt')

describe('Bcrypt Adapter', () => {
  let salt: number
  let fakeBcrypt: jest.Mocked<typeof bcrypt>
  let sut: BcryptAdapter

  beforeAll(() => {
    fakeBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
    fakeBcrypt.hash.mockImplementation(() => {
      return 'hashed'
    })
    salt = 12
  })

  beforeEach(() => {
    sut = new BcryptAdapter(salt)
  })

  describe('hash()', () => {
    test('Should call hash with correct input', async () => {
      await sut.hash('any_value')
      expect(fakeBcrypt.hash).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hashed')
    })

    test('Should throw if hash throws', async () => {
      fakeBcrypt.hash.mockImplementation(() => {
        throw new Error()
      })
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })
})
