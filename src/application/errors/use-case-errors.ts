export class AccountAlreadyInUseError extends Error {
  constructor () {
    super('The received cpf is already in use')
    this.name = 'AccountAlreadyInUseError'
  }
}
