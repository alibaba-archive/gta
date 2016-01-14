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

#### new rules:
**('page' is equal to 'category', 'type' is equal to 'label')**
1、data-gta属性 类似JSON的 {key: value}格式，不同的是key和value两端的引号可以省略；
2、key 和 value 中不可以包含： 冒号、逗号、单引号、双引号。

You can call the `event` function to track an event:
```
gta.event({action: 'add content', page: 'Project Page', type: 'task', control: 'tasks layout', method: 'double-click'})
```

Or, easily add `data-gta='event'` to a DOM element as:
```
<button data-gta="{action: 'add content', page: 'Project Page', type: 'task', control: 'tasks layout', method: 'double-click'}">click</button>
```


#### old rules:
**(You can also use the old rules temporarily, but we advise you to use the new rules）**
You can call the `event` function to track an event:
```
gta.event('button', 'click', 'nav buttons', 4)  //@params: category, action, label
```
Or, easily add `data-gta='event'` to a DOM element as:
```
<button data-gta='event' data-label='clicked a button' data-action='click' data-category='button'>click</button>
```
If `data-label` `data-action` `data-category` is not provided then `className` `event type` `tagName` will be used instead.

## API Documentations

* [Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
* [Baidu Analytics](http://tongji.baidu.com/open/api/more?p=ref_trackPageview)
* [Mixpanel](https://mixpanel.com/help/reference/javascript)
* [Customer.io](https://customer.io/docs/api/javascript.html)
* [Fullstory](http://help.fullstory.com/using-ref/getting-started)

## Change Log
###0.7.0
1. add new rules
2. remove Piwik
3. remove field 'value'
