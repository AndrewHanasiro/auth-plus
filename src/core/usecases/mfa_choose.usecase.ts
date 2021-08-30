/* eslint-disable no-duplicate-case */
import { Strategy } from '../entities/strategy'

import {
  CreatingMFACode,
  CreatingMFACodeErrorsTypes,
} from './driven/creating_mfa_code.driven'
import {
  FindingMFAChoose,
  FindingMFAChooseErrorsTypes,
} from './driven/finding_mfa_choose.driven'
import {
  SendingMFACode,
  SendingMFACodeErrorsTypes,
} from './driven/sending_mfa_code.driven'
import {
  ChooseMFA,
  ChooseMFAErrors,
  ChooseMFAErrorsTypes,
} from './driver/choose_mfa.driver'

export default class MFAChoose implements ChooseMFA {
  constructor(
    private findingMFAChoose: FindingMFAChoose,
    private creatingMFACode: CreatingMFACode,
    private sendingMFACode: SendingMFACode
  ) {}

  async choose(
    hash: string,
    strategy: Strategy
  ): Promise<{ hash: string; code: string }> {
    try {
      const resp = await this.findingMFAChoose.findByHash(hash)
      if (!resp.strategyList.some((_) => _ === strategy)) {
        throw new ChooseMFAErrors(ChooseMFAErrorsTypes.STRATEGY_NOT_LISTED)
      }
      const { hash: newHash, code } =
        await this.creatingMFACode.creatingCodeForStrategy(
          resp.userId,
          strategy
        )
      this.sendingMFACode.sendCodeForUser(resp.userId, code + newHash)
      return { hash: newHash, code }
    } catch (error) {
      throw this.handleError(error as Error)
    }
  }
  private handleError(error: Error) {
    switch (error.message) {
      case FindingMFAChooseErrorsTypes.CACHE_DEPENDECY_ERROR:
        return new ChooseMFAErrors(ChooseMFAErrorsTypes.DEPENDECY_ERROR)
      case FindingMFAChooseErrorsTypes.NOT_FOUND:
        return new ChooseMFAErrors(ChooseMFAErrorsTypes.NOT_FOUND)
      case CreatingMFACodeErrorsTypes.CACHE_DEPENDECY_ERROR:
        return new ChooseMFAErrors(ChooseMFAErrorsTypes.DEPENDECY_ERROR)
      case SendingMFACodeErrorsTypes.NOT_FOUND:
        return new ChooseMFAErrors(ChooseMFAErrorsTypes.NOT_FOUND)
      case SendingMFACodeErrorsTypes.PROVIDER_ERROR:
        return new ChooseMFAErrors(ChooseMFAErrorsTypes.DEPENDECY_ERROR)
      case ChooseMFAErrorsTypes.STRATEGY_NOT_LISTED:
        return new ChooseMFAErrors(ChooseMFAErrorsTypes.STRATEGY_NOT_LISTED)
      default:
        return new ChooseMFAErrors(ChooseMFAErrorsTypes.DEPENDECY_ERROR)
    }
  }
}
