import { SaveAccountRepository, VerifyAccountExistsRepository } from '@/domain/contracts/repos'
import { MongoHelper } from '@/infra/repos/mongodb'

export class AccountMongoRepository implements SaveAccountRepository, VerifyAccountExistsRepository {
  async saveAccount (userAccount: SaveAccountRepository.Input): Promise<SaveAccountRepository.Output> {
    const accountCollection = MongoHelper.getCollection('account')
    const result = await accountCollection.insertOne({ ...userAccount })
    return {
      id: result.insertedId.toString()
    }
  }

  async verifyAccountExists ({ cpf }: VerifyAccountExistsRepository.Input): Promise<VerifyAccountExistsRepository.Output> {
    const accountCollection = MongoHelper.getCollection('account')
    const exists = await accountCollection.findOne({ cpf })
    return !!exists
  }
}
