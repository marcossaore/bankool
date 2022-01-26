import { AddUser, Controller } from '@/application/controllers'

describe('AddUser Controller', () => {
  let sut: AddUser

  beforeEach(() => {
    sut = new AddUser()
  })

  it('Should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })
})
