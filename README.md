# Analysis Tool for Teambition

## Usage

First, use Bower to install GTA:

```bash
bower install gta
```

or with NPM:

```bash
npm i --save teambition-gta
```

Then, include the following script in your HTML and you are ready to go:

```
<script id="gta-main"
  src="bower_component/gta/lib/index.js"
  data-baidu="ec912ecc405ccd050e4cdf452ef4xxxx"
  data-google="UA-3318xxxx-1"
  data-mixpanel="77e13d08ba42fe31932a1f1418aea7b2"
  data-customer="2ac3fd02efd1f9c57ae9"
></script>
```

### Set User ID
```
// Currently only Customer.io and Fullstory support userId
gta.setUser(id, user)
```

### Register Property
```
gta.registerProperty(key, value)
gta.unregisterProperty(key)
```
All registered properties would be mixed with every events util unregister.

### Register Plugin
```
gta.registerPlugin(Plugin)
```
A plugin cloudn't be unregistered now.

### Set Current Page
```
// Set the current page, default value of the 'page' field while invoking gta.events(gtaOptions)
gta.setCurrentPage('Home Page')
```

### Page View

Call the `pageview` function to record a new page view:
```
// Use single object
gta.pageview({
    'page': '/my-overridden-page?id=1',
    'title': 'my overridden page'
})

// Use multiple string
gta.pageview('/api/hello', '?world');
```

### Events
#### Tips: 'page' equals to 'category' in old rules, 'type' equals to 'label' in old rules.

1. `data-gta` property in DOM element use similar key-value format (`{"key": "value"}`) like JSON, and quota could be omitted.
2.  Colon, comma and quota cannot be used in `key` and `value`.

You can set current page `page`, it will be automatically added to the gtaOptions:
```
// It is usually called when the route change
gta.setCurrentPage('Tasks Page')
```

You can call the `event` function to track an event:
```
gta.event({action: 'add content', page: 'Project Page', type: 'task', control: 'tasks layout', method: 'double-click'})
```

Or, easily add `data-gta='event'` to a DOM element as:
```
<button data-gta="{action: 'add content', page: 'Project Page', type: 'task', control: 'tasks layout', method: 'double-click'}">click</button>
```

To automatically log gtaOptions, you can use the 'debug' mode:
```
gta.debug = true
or
window._gta_debug = true
```
#### Warning! old rules not supported since v0.8.0

## API Documentations

* [Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
* [Baidu Analytics](http://tongji.baidu.com/open/api/more?p=ref_trackPageview)
* [Mixpanel](https://mixpanel.com/help/reference/javascript)
* [Customer.io](https://customer.io/docs/api/javascript.html)
* [Fullstory](http://help.fullstory.com/using-ref/getting-started)
* [GrowingIO](https://help.growingio.com/Developer%20Document.html)

## Change Log
#### 1.0.0
1. New architecture
2. New APIs: `(un)register(Property|Plugin)`
