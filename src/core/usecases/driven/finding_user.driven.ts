import { User } from '../../entities/user'

export interface FindingUser {
  findUserByEmailAndPassword: (email: string, password: string) => Promise<User>
  findById: (userId: string) => Promise<User>
}

export enum FindingUserErrorsTypes {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  PASSWORD_WRONG = 'PASSWORD_WRONG',
}

export class FindingUserErrors extends Error {
  constructor(message: FindingUserErrorsTypes) {
    super(message)
    this.name = 'FindingUser'
  }
}
