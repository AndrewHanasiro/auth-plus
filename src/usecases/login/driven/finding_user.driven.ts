import { User } from '../../user/driver/create_user.driver'

export interface FindingUser {
  findUserByEmailAndPassword: (email: string, password: string) => Promise<User>
}

export enum FindingUserErrorsTypes {
  NOT_FOUND = 'NOT FOUND',
}

export class FindingUserErrors extends Error {
  constructor(message: FindingUserErrorsTypes) {
    super(message)
  }
}
