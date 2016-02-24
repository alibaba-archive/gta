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

To automatically log gtaOptions, you can open the 'debug' mode:
```
gta.debug = true
```
#### Warning! old rules not supported in v0.8.0

## API Documentations

* [Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
* [Baidu Analytics](http://tongji.baidu.com/open/api/more?p=ref_trackPageview)
* [Mixpanel](https://mixpanel.com/help/reference/javascript)
* [Customer.io](https://customer.io/docs/api/javascript.html)
* [Fullstory](http://help.fullstory.com/using-ref/getting-started)


## Change Log
#### 0.8.6 - 0.8.8
1. Force 'created_at' field for Customer.io be a number in seconds since epoch

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
