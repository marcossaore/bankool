import { SaveUserAccountRepository, VerifyUserExistsRepository } from '@/domain/contracts/repos'
import { MongoHelper } from '@/infra/repos/mongodb'

export class AccountMongoRepository implements SaveUserAccountRepository, VerifyUserExistsRepository {
  async saveUserAccount (userAccount: SaveUserAccountRepository.Input): Promise<SaveUserAccountRepository.Output> {
    const accountCollection = MongoHelper.getCollection('account')
    const result = await accountCollection.insertOne({ userAccount })
    return {
      id: result.insertedId.toString()
    }
  }

  async verifyUserExists (cpf: VerifyUserExistsRepository.Input): Promise<VerifyUserExistsRepository.Output> {
    const accountCollection = MongoHelper.getCollection('account')
    const exists = await accountCollection.findOne({ cpf })
    return !!exists?.cpf
  }
}
