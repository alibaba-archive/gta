# Analysis Tool for Teambition

# Usage

First, use bower to install gta:
```
bower install gta
```

Then, include the following script in your html and you are ready to go:

```
<script src="bower_component/gta/lib/index.js"></script>
<script>
    gta = new Gta({
        Google: {
            account: 'UA-33186961-1'
        },
        Baidu: {
            account: 'ec912ecc405ccd050e4cdf452ef4e85a'
        }
    });
</script>
```

# Page View

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

# Events

You can call the `event` function to track an event:
```
gta.event('button', 'click', 'nav buttons', 4)  //@params: category, action, label, value
```
Or, easily add `data-gta='event'` to a dom element as:
```
<button data-gta='event' data-label='clicked a button' data-action='click' data-category='button'>click</button>
```
If `data-label` `data-action` `data-category` `data-value` is not provided then `className` `event type` `tagName` and `html` will be used instead.

# Api Documents

* [google](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
* [baidu](http://tongji.baidu.com/open/api/more?p=ref_trackPageview)
