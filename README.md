# Analysis Tool for Teambition

## Usage

First, use bower to install gta:

```bash
bower install gta
```

or with npm:

```bash
npm i --save teambition-gta
```

Then, include the following script in your html and you are ready to go:

```
<script id="gta-main" src="bower_component/gta/lib/index.js"
  data-baidu="ec912ecc405ccd050e4cdf452ef4xxxx"
  data-google="UA-3318xxxx-1"
  data-piwik="1"
  data-piwik-track="https://piwik.teambition.com/piwik.php"
  data-piwik-script="https://dn-st.b0.upaiyun.com/libs/piwik/v2/piwik.js"></script>
```

### set userID
```
// currently only piwik support userId
gta.setUserId('userxxxxxid')
```

### Page View

Call the `pageview` function to record a new page view:
```
// use single object
gta.pageview({
    'page': '/my-overridden-page?id=1',
    'title': 'my overridden page'
})

// use multiple string
gta.pageview('/api/hello', '?world');
```

### Events

You can call the `event` function to track an event:
```
gta.event('button', 'click', 'nav buttons', 4)  //@params: category, action, label, value
```
Or, easily add `data-gta='event'` to a dom element as:
```
<button data-gta='event' data-label='clicked a button' data-action='click' data-category='button'>click</button>
```
If `data-label` `data-action` `data-category` `data-value` is not provided then `className` `event type` `tagName` and `html` will be used instead.

## Api Documents

* [google](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
* [baidu](http://tongji.baidu.com/open/api/more?p=ref_trackPageview)
