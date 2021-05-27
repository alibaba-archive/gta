import { PluginConstructor } from '../types'

import { UTMDaemon } from './utm'
import { ReferralDaemon } from './referral'
import { DOMGTAEventPlugin } from './dom-gta-event'
import { RetireTBPanelPlugin } from './retire-tbpanel'

export const plugins: PluginConstructor[] = [
  DOMGTAEventPlugin,
  UTMDaemon,
  ReferralDaemon,
  RetireTBPanelPlugin,
]
