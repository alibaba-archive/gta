## Change Log Archive for version below v2.0.0
For change log since v2.0.0, please see README.md.

### 1.1.6
1. Support boot params for providers

### 1.1.5
1. Add `gta.login(userId)` support
2. Implement `login` method on TBPanel

#### 1.1.4
1. Add `data-tbtracking` support

#### 1.1.1 - 1.1.2
1. New Plugin: `distinct id`

#### 1.1.0
1. New provider: SensorsData

#### 1.0.12
1. Deferred provider loading

#### 1.0.11
1. Disable `displayfeatures` for Google Analytics

#### 1.0.9 - 1.0.10
1. Plugin `referral` and `utm` will only record at first time.
2. Plugin `referral` and `utm` now use encodeURIComponent to prevent unexpected cookie cut off.

#### 1.0.8
1. Plugin is able to filter event now.

#### 1.0.7
1. New plugin `referral plugin`

#### 1.0.5 - 1.0.6
1. `gta.registerPlugin` now returns plugin's instance

#### 1.0.4
1. TBPanel now accepts optional `scriptUrl`

#### 1.0.3
1. New API: `registerProvider`

#### 1.0.2
1. Now library can be exported to `window.Gta`

#### 1.0.1
1. Fix GTA crash when provider Baidu crash.

#### 1.0.0
1. New architecture
2. New APIs: `(un)register(Property|Plugin)`

#### 0.9.8
1. New provider: GrowingIO

#### 0.9.7
1. Add `data-gta-ignore` support

#### 0.9.6
1. Update tbpanel script
2. Fix bug on `delegateEvents`

#### 0.9.5
1. Remove another jQuery dependency

#### 0.9.4
1. Fix cookie path in utm daemon

#### 0.9.3
1. Remove jQuery dependency
2. Minor bug fix

#### 0.9.1 - 0.9.2
1. New provider: tbpanel
2. Make property 'platform' changable
3. Minor bug fix

#### 0.9.0
1. utm daemon support

#### 0.8.13
1. Report system version, desktop client type&version to mixpanel

#### 0.8.12
1. For fullstory: Change `name` to `displayName`

#### 0.8.10 - 0.8.11
1. Fix push config object when value is the falsely value

#### 0.8.9
1. Add whitelist `wlist` support in `setUser`.
2. Teambition polyfill for desktop client in mixpanel

#### 0.8.6 - 0.8.8
1. Force `created_at` field for Customer.io be a number in seconds since epoch

#### 0.8.5
1. Fullstory will ignore unqualified field

#### 0.8.3 - 0.8.4
Minor bug fix

#### 0.8.2
1. Mixin user info into mixpanel data
2. Teambition polyfill for customer.io
3. Remove sensetive data from fullstory

#### 0.8.1
1. Add provider-specific alias support in method `setUser`

#### 0.8.0
1. remove the compatible code for old rules
2. add 'debug' mode

#### 0.7.2
1. remove the needless pageview method of customer.io
2. add setCurrentPage method

#### 0.7.1
1. add new rules
2. remove Piwik
3. remove field 'value'
