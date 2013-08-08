# Analysis Tool for Teambition

# Usage

```
bower install gta
```

include in html

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

    // track pageview
    gta.pageview({  // use single object
        'page': '/my-overridden-page?id=1',
        'title': 'my overridden page'
    })
    gta.pageview('/api/hello', '?world'); // use multiple string

    // track event
    gta.event('button', 'click', 'nav buttons', 4)  //@params: category, action, label, value
</script>
```

# Api Documents

* [google](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
* [baidu](http://tongji.baidu.com/open/api/more?p=ref_trackPageview)
