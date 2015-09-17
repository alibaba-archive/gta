(function(root, factory) {
  'use strict';
  var gta;
  gta = factory();
  if (typeof module === 'object' && typeof module.exports === 'object') {
    return module.exports = gta;
  } else if (typeof define === 'function' && define.amd) {
    return define(['jquery'], function() {
      return gta;
    });
  } else {
    return root.Gta = gta;
  }
})((typeof window === 'object' ? window : this), function() {
  'use strict';
  var $body, Provider, Providers, account, checkScript, element, getScript, gta, name, provider, providers, removeElement, scriptUrl, slice, trackUrl;
  slice = Array.prototype.slice;
  $body = null;
  removeElement = function(el) {
    return el.parentNode.removeChild(el);
  };
  checkScript = function(script, key) {
    script.onerror = function() {
      window[key] = null;
      return removeElement(script);
    };
    return script.onload = function() {
      return removeElement(script);
    };
  };
  getScript = function(src) {
    var script, scripts;
    script = document.createElement('script');
    scripts = document.getElementsByTagName('script')[0];
    script.async = 1;
    script.src = src;
    scripts.parentNode.insertBefore(script, scripts);
    return script;
  };
  gta = {
    setUser: function(id, user) {
      var e, provider, _i, _len, _ref;
      try {
        for (_i = 0, _len = providers.length; _i < _len; _i++) {
          provider = providers[_i];
          if ((_ref = provider.setUser) != null) {
            _ref.call(provider, id, user);
          }
        }
      } catch (_error) {
        e = _error;
      }
      return this;
    },
    pageview: function() {
      var e, provider, _i, _len;
      try {
        for (_i = 0, _len = providers.length; _i < _len; _i++) {
          provider = providers[_i];
          provider.pageview.apply(provider, arguments);
        }
      } catch (_error) {
        e = _error;
      }
      return this;
    },
    event: function() {
      var e, provider, _i, _len;
      try {
        arguments[0] || (arguments[0] = ($body != null ? $body.data('category') : void 0) || 'gta');
        for (_i = 0, _len = providers.length; _i < _len; _i++) {
          provider = providers[_i];
          provider.event.apply(provider, arguments);
        }
      } catch (_error) {
        e = _error;
      }
      return this;
    },
    delegateEvents: function() {
      if (!window.$) {
        return;
      }
      $body = $('body');
      return $(document).off('.gta').on('click.gta', '[data-gta="event"]', (function(_this) {
        return function(e) {
          var $target, action, category, label, value;
          $target = $(e.currentTarget);
          category = $target.data('category');
          if (!category) {
            category = $target.closest('[data-category]').data('category');
          }
          action = $target.data('action') || e.type;
          label = $target.data('label');
          value = parseInt($target.data('value'));
          return _this.event(category, action, label, value);
        };
      })(this));
    }
  };
  Providers = {
    google: function(account) {
      var script;
      if (!account) {
        return;
      }
      window.GoogleAnalyticsObject = '_ga';
      window._ga = function() {
        return _ga.q.push(arguments);
      };
      _ga.q = [];
      _ga.l = 1 * new Date();
      _ga('create', account, 'auto');
      _ga('require', 'displayfeatures');
      _ga('require', 'linkid', 'linkid.js');
      _ga('send', 'pageview');
      script = getScript('//www.google-analytics.com/analytics.js');
      checkScript(script, '_ga');
      return {
        name: 'google',
        pageview: function() {
          var args, data;
          if (!window._ga) {
            return;
          }
          args = slice.call(arguments);
          data = typeof args[0] === 'object' ? args[0] : args.join('_');
          return window._ga('send', 'pageview', data);
        },
        event: function(category, action, label, value) {
          var args;
          if (!window._ga) {
            return;
          }
          args = ['send', 'event', category, action, label];
          if (value > 0) {
            args.push(+value);
          }
          return window._ga.apply(null, args);
        }
      };
    },
    baidu: function(account) {
      var script;
      if (!account) {
        return;
      }
      window._hmt = [];
      script = getScript("//hm.baidu.com/hm.js?" + account);
      checkScript(script, '_hmt');
      return {
        name: 'baidu',
        pageview: function() {
          var args, data, key, val, _ref;
          if (!window._hmt) {
            return;
          }
          args = slice.call(arguments);
          if (typeof args[0] === 'object') {
            data = args[0].page;
            if (!data) {
              data = [];
              _ref = args[0];
              for (key in _ref) {
                val = _ref[key];
                data.push(val);
              }
              data = data.join('_');
            }
          } else {
            data = args.join('_');
          }
          return window._hmt.push(['_trackPageview', data]);
        },
        event: function(category, action, label, value) {
          var args;
          if (!window._hmt) {
            return;
          }
          args = ['_trackEvent', category, action, label];
          if (value > 0) {
            args.push(+value);
          }
          return window._hmt.push(args);
        }
      };
    },
    piwik: function(account, scriptUrl, trackUrl) {
      var script;
      if (!(account && scriptUrl && trackUrl)) {
        return;
      }
      window._paq = [['trackPageView'], ['enableLinkTracking'], ['setTrackerUrl', trackUrl], ['setSiteId', account]];
      script = getScript(scriptUrl);
      checkScript(script, '_paq');
      return {
        name: 'piwik',
        setUser: function(id) {
          if (!window._paq) {
            return;
          }
          return window._paq.push(['setUserId', id]);
        },
        pageview: function() {
          var args, data, key, val, _ref;
          if (!window._paq) {
            return;
          }
          args = slice.call(arguments);
          if (typeof args[0] === 'object') {
            data = args[0].page;
            if (!data) {
              data = [];
              _ref = args[0];
              for (key in _ref) {
                val = _ref[key];
                data.push(val);
              }
              data = data.join('_');
            }
          } else {
            data = args.join('_');
          }
          return window._paq.push(['trackPageView', data]);
        },
        event: function(category, action, label, value) {
          var args;
          if (!window._paq) {
            return;
          }
          args = ['trackEvent', category, action, label];
          if (value > 0) {
            args.push(+value);
          }
          return window._paq.push(args);
        }
      };
    },
    segment: function(account) {
      var analytics, method, script, _i, _len, _ref;
      if (!account) {
        return;
      }
      analytics = window.analytics = window.analytics || [];
      analytics.invoked = true;
      analytics.methods = ['trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview', 'identify', 'reset', 'group', 'track', 'ready', 'alias', 'page', 'once', 'off', 'on'];
      analytics.factory = function(method) {
        return function() {
          var args;
          args = slice.call(arguments);
          args.unshift(method);
          analytics.push(args);
          return analytics;
        };
      };
      _ref = analytics.methods;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        method = _ref[_i];
        analytics[method] = analytics.factory(method);
      }
      analytics.SNIPPET_VERSION = '3.1.0';
      script = getScript("//cdn.segment.com/analytics.js/v1/" + account + "/analytics.min.js");
      checkScript(script, 'analytics');
      analytics.page();
      return {
        name: 'segment',
        setUser: function(id, user) {
          var _ref1;
          return (_ref1 = window.analytics) != null ? _ref1.identify(id, user) : void 0;
        },
        pageview: function(data) {
          var _ref1;
          return (_ref1 = window.analytics) != null ? _ref1.page(data.page, data.title) : void 0;
        },
        event: function(category, action, label, value) {
          var data, _ref1;
          data = {
            platform: 'web',
            category: category,
            action: action,
            label: label
          };
          if (value > 0) {
            data.value = value;
          }
          return (_ref1 = window.analytics) != null ? _ref1.track(label, data) : void 0;
        }
      };
    }
  };
  element = document.getElementById('gta-main');
  providers = gta.providers = [];
  if (!element) {
    return gta;
  }
  for (name in Providers) {
    Provider = Providers[name];
    account = element.getAttribute("data-" + name);
    scriptUrl = element.getAttribute("data-" + name + "-script");
    trackUrl = element.getAttribute("data-" + name + "-track");
    if (account && (provider = Provider(account, scriptUrl, trackUrl))) {
      providers.push(provider);
    }
  }
  gta.delegateEvents();
  removeElement(element);
  return gta;
});
