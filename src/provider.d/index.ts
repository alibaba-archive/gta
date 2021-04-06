import { ProviderConstructor } from '../types'

import { APlus } from './aplus'
import { TBPanelLite } from './tbpanel'
import { GoogleAnalytics } from './google'

export const providers: ProviderConstructor<any>[] = [
  APlus,
  TBPanelLite,
  GoogleAnalytics,
]
