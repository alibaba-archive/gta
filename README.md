# Analysis Tool for Teambition

## Usage

First, use Bower to install GTA:

```bash
bower install gta
```

or with NPM:

```bash
npm install --save teambition/gta
```

Then, include the following script in your HTML and you are ready to go:

```html
<script id="gta-main"
  src="node_modules/gta/lib/index.js"
  data-google="UA-3318xxxx-1"
></script>
```

### Set User ID
```js
gta.setUser(id, user)
```

### Register Property
```js
gta.registerProperty(key, value)
gta.unregisterProperty(key)
gta.registerPersistentProperty(key, value)
gta.unregisterPersistentProperty(key)
```
All registered properties would be mixed with every events util unregister.
General properties last in session level, but persistent property stores in cookie under user's namespace.

### Register Provider
```js
gta.registerProvider(ProviderCtor, params)
```
Params could be omitted when params is provided during the initialize (in `options` or `#gta-main`).

### Register Plugin
```js
gta.registerPlugin(PluginCtor, params)
```
A plugin cloudn't be unregistered now, returns plugin instance.

### Set Current Page
```js
// Set the current page, default value of the 'page' field while invoking gta.events(gtaOptions)
gta.setCurrentPage('Home Page')
```

### Page View

Call the `pageview` function to record a new page view:
```js
// Use single object
gta.pageview({
    'page': '/my-overridden-page?id=1',
    'title': 'my overridden page'
})

// Use multiple string
gta.pageview('/api/hello', '?world');
```

### Events
1. `data-gta` property in DOM element use similar key-value format (`{"key": "value"}`) like JSON, and quota could be omitted.
2.  Colon, comma and quota cannot be used in `key` and `value`.

You can set current page `page`, it will be automatically added to the gtaOptions:
```js
// It is usually called when the route change
gta.setCurrentPage('Tasks Page')
```

You can call the `event` function to track an event:
```js
gta.event({action: 'add content', page: 'Project Page', type: 'task', control: 'tasks layout', method: 'double-click'})
```

either add `data-gta='event'` to a DOM element as:
```html
<button data-gta="{action: 'add content', page: 'Project Page', type: 'task', control: 'tasks layout', method: 'double-click'}">click</button>
```

To log gta event into console automatically, you can set the 'debug' mode:
```js
gta.debug = true
or
window._gta_debug = true
```
## API Documentations
* [Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/)

## Change Log
#### 2.0.0
1. Migrate to typescript
2. New provider: APlus.js
3. New local cookie stroage provides persistence preference and userdata storage
4. Drop support for tbtracking, baidu analytics, customer.io, fullstory, growing.io and sensorsdata
5. TBPanel has it's lite version
6. `data-random-proportion` is not supported anymore
7. Other `data-*` properties will passthough to provider directly
8. API arguments change: `setUser`, `registerProvider` and `registerPlugin`
