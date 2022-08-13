import faker from 'faker'
import { mock, instance, when, verify } from 'ts-mockito'

import { TokenRepository } from '../../../src/core/providers/token.repository'
import { InvalidatingToken } from '../../../src/core/usecases/driven/invalidating_token.driven'
import Logout from '../../../src/core/usecases/logout.usecase'

describe('logout usecase', function () {
  const token = faker.datatype.number(6).toString()
  it('should succeed when invalidate a single token', async () => {
    const mockInvalidatingToken: InvalidatingToken = mock(TokenRepository)
    when(mockInvalidatingToken.invalidate(token)).thenResolve()
    const invalidatingToken: InvalidatingToken = instance(mockInvalidatingToken)

    const testClass = new Logout(invalidatingToken)
    await testClass.logout(token)

    verify(mockInvalidatingToken.invalidate(token)).once()
  })
})
