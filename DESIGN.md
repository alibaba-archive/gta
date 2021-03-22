# A small design doc

## Cookie TB_GTA
```typescript
type {
  uk: string      // userKey
  up: {           // some persistent user property

  }
  pf: {           // preference
    dr?: 0 | 1    // dryRun: true / false
    cd?: string   // cookieDomain
  }
}
```

## Init Process
To init GTA, call `GTA.setUser()`, it accepts both user passed or not passed
- when userKey and data is passed, GTA will set cookie "TB_GTA", and set user to runtime properity
- when userKey and data is provided but internal user also existed,
  GTA will use provided user overwrite internal user, this will NOT tirgger LOGIN event
- when userKey and data is not provided, GTA will try recover last user information from cookie "TB_GTA"
  if failed, GTA will generate a UUID distinct id, treat it as userKey

P.S.: call `GTA.init()` only load provider/plugins from Element#gta-min or the passed GTAOptions

## Local user preference
A user have a local prefrence, currently only |pf.e| and |pf.d| is supported

### distinct id
A distinct id is a special userKey, in UUID format, but start with magic string `72616e64`, the hex format of string `rand`,
when userKey is not provided in initialize process, we will generate a distinct id for it

#### login(userKey, user)
You can use this function to link a real user with a random distinct id,
GTA will send an event { action: 'distinct id link', distinctid: 'xxxx', userKey: 'yyyy' } for call GTA.login() explictly

#### logout(userKey)
GTA will discard internal user and erase user from cookie, and generate a new UUID distinct id, treat it as userKey

### Persistent super properity
We will persistent these properities into |up| of cookie's sturct.
All events will carry these properities, even not set in current session.

## Runtime super properity
Runtime super properity won't be persistent, only available in current session

## UTM & Referral daemon
We provide two plugins, a UTM daemon and a Referral daemon for logging user's source
