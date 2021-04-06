import { PluginConstructor } from '../types'

import { UTMDaemon } from './utm'
import { ReferralDaemon } from './referral'
import { DOMGTAEventPlugin } from './dom-gta-event'

export const plugins: PluginConstructor[] = [
  DOMGTAEventPlugin,
  UTMDaemon,
  ReferralDaemon,
]
