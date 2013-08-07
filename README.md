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
            account: 'UA-33186961-1',
            domain: 'teambition.com'
        },
        Baidu: {
            account: '545c20cb01a1afsdfeb0d1f103f99c1'
        }
    });
    gta.pageview('/api/hello'); // bind pageview
    gta.event('button', 'click', 'other'); // bind events
</script>
```
