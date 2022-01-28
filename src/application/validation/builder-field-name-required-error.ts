export class BuilderFieldNameRequiredError extends Error {
  constructor (method: string) {
    super(`Field name is required to validate ${method} method`)
    this.name = 'BuilderFieldNameRequiredError'
  }
}
