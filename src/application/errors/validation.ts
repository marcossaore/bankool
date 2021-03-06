export class RequiredFieldError extends Error {
  constructor (fieldName?: string) {
    const message = fieldName === undefined
      ? 'Field required'
      : `The field ${fieldName} is required`
    super(message)
    this.name = 'RequiredFieldError'
  }
}
export class InvalidMimeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Unsupported file. Allowed extensions: ${allowed.join(', ')}`)
    this.name = 'InvalidMimeTypeError'
  }
}
export class MaxFileSizeError extends Error {
  constructor (maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}MB`)
    this.name = 'MaxFileSizeError'
  }
}
export class RegexParamError extends Error {
  constructor (fieldName: string, format: string) {
    super(`${fieldName} must contains the format: ${format}`)
    this.name = 'RegexParamError'
  }
}
export class InvalidParamError extends Error {
  constructor (fieldName: string) {
    super(`Invalid param: ${fieldName}`)
    this.name = 'InvalidParamError'
  }
}
export class InvalidEmailParamError extends Error {
  constructor (fieldName: string) {
    super(`Invalid param: ${fieldName} is not a valid email`)
    this.name = 'InvalidEmailParamError'
  }
}
export class InvalidCpfParamError extends Error {
  constructor (fieldName: string) {
    super(`Invalid param: ${fieldName} is not a valid cpf`)
    this.name = 'InvalidCpfParamError'
  }
}
export class CompareFieldError extends Error {
  constructor (fieldName: string, compareFieldName: string) {
    super(`The field ${fieldName} must be equal to ${compareFieldName}`)
    this.name = 'CompareFieldError'
  }
}
export class InvalidDateError extends Error {
  constructor (fieldName: string) {
    super(`Invalid param: ${fieldName}, format date must be: YYYY-mm-dd (hh:mm) optional`)
    this.name = 'InvalidDateError'
  }
}
export class InvalidPhoneError extends Error {
  constructor (fieldName: string) {
    super(`Invalid param: ${fieldName}, phone must contains 9 digits`)
    this.name = 'InvalidPhoneError'
  }
}
