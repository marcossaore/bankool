export class UserAccountAlreadyInUseError extends Error {
  constructor () {
    super('The received cpf is already in use')
    this.name = 'UserAccountAlreadyInUseError'
  }
}
