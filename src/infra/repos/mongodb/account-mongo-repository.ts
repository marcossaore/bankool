import { SaveUserAccountRepository } from '@/domain/contracts/repos'
import { MongoHelper } from '@/infra/repos/mongodb'

export class AccountMongoRepository implements SaveUserAccountRepository {
  async saveUserAccount (userAccount: SaveUserAccountRepository.Input): Promise<SaveUserAccountRepository.Output> {
    const accountCollection = MongoHelper.getCollection('account')
    const result = await accountCollection.insertOne({ userAccount })
    return {
      id: result.insertedId.toString()
    }
  }
}
