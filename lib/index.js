;(function(root, factory) {
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
  var $body, Providers, checkScript, getScript, gta, initGta, removeElement, slice;
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
      if (!script.getAttribute('data-site-id')) {
        return removeElement(script);
      }
    };
  };
  getScript = function(src, id) {
    var script, scripts;
    script = document.createElement('script');
    scripts = document.getElementsByTagName('script')[0];
    script.async = 1;
    script.src = src;
    if (id) {
      script.id = id;
    }
    scripts.parentNode.insertBefore(script, scripts);
    return script;
  };
  initGta = function() {
    var Provider, account, element, name, provider, providers, randomProportion, scriptUrl, trackUrl;
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
      randomProportion = element.getAttribute("data-" + name + "-random-proportion");
      if (randomProportion && Math.random() > randomProportion) {
        continue;
      }
      if (account && (provider = Provider(account, scriptUrl, trackUrl))) {
        providers.push(provider);
      }
    }
    gta.delegateEvents();
    removeElement(element);
    return providers;
  };
  gta = {
    setUser: function(id, user) {
      var e, provider, providers, _i, _len, _ref;
      try {
        providers = initGta();
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
    mixpanel: function(account) {
      var lib_name, script;
      if (!account) {
        return;
      }
      lib_name = 'mixpanel';
      window.mixpanel = [];
      mixpanel._i = [];
      mixpanel.init = function(token, config, name) {
        var fn, functions, target, _i, _len, _set_and_defer;
        target = mixpanel;
        if (name != null) {
          target = mixpanel[name] = [];
        } else {
          name = lib_name;
        }
        target.people || (target.people = []);
        target.toString = function(no_stub) {
          var str;
          str = lib_name;
          if (name !== lib_name) {
            str += '.' + name;
          }
          if (!no_stub) {
            str += ' (stub)';
          }
          return str;
        };
        target.people.toString = function() {
          return target.toString(1) + '.people (stub)';
        };
        _set_and_defer = function(target, fn) {
          var split;
          split = fn.split('.');
          if (split.length === 2) {
            target = target[split[0]];
            fn = split[1];
          }
          return target[fn] = function() {
            return target.push([fn].concat(slice.call(arguments)));
          };
        };
        functions = ['disable', 'track', 'track_pageview', 'track_links', 'track_forms', 'register', 'register_once', 'alias', 'unregister', 'identify', 'name_tag', 'set_config', 'people.set', 'people.set_once', 'people.increment', 'people.append', 'people.track_charge', 'people.clear_charges', 'people.delete_user'];
        for (_i = 0, _len = functions.length; _i < _len; _i++) {
          fn = functions[_i];
          _set_and_defer(target, fn);
        }
        return mixpanel._i.push([token, config, name]);
      };
      mixpanel.__SV = 1.2;
      mixpanel.init(account);
      script = getScript('//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js');
      checkScript(script, lib_name);
      return {
        name: 'mixpanel',
        pageview: function() {},
        event: function(category, action, label, value) {
          var data, _ref;
          data = {
            platform: 'web',
            category: category,
            action: action
          };
          if (value > 0) {
            data.value = value;
          }
          return (_ref = window.mixpanel) != null ? _ref.track(label, data) : void 0;
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
    customer: function(account) {
      var initCustomer;
      if (!account) {
        return;
      }
      initCustomer = function(id) {
        var accounts, method, script, _account, _cio, _i, _len, _ref;
        _cio = window._cio = window._cio || [];
        _cio.invoked = true;
        _cio.methods = ['trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview', 'reset', 'group', 'ready', 'alias', 'page', 'once', 'off', 'on', 'load', 'identify', 'sidentify', 'track'];
        _cio.factory = function(method) {
          return function() {
            _cio.push([method].concat(Array.prototype.slice.call(arguments, 0)));
            return _cio;
          };
        };
        _ref = _cio.methods;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          method = _ref[_i];
          _cio[method] = _cio.factory(method);
        }
        accounts = account.split(',');
        if ((id != null ? id.indexOf('@') : void 0) > 0) {
          _account = accounts[1];
        } else {
          _account = accounts[0];
        }
        script = getScript('//assets.customer.io/assets/track.js', 'cio-tracker');
        script.setAttribute('data-site-id', _account);
        return checkScript(script, '_cio');
      };
      return {
        name: 'customer',
        setUser: function(id, user) {
          var _ref;
          initCustomer(id);
          return (_ref = window._cio) != null ? _ref.identify({
            id: id,
            name: user.name,
            email: user.email,
            created_at: Math.floor(new Date(user.createdAt).valueOf() / 1000),
            language: user.language
          }) : void 0;
        },
        pageview: function(data) {
          var _ref;
          if (!account) {
            return;
          }
          return (_ref = window._cio) != null ? _ref.page(data.page, data.title) : void 0;
        },
        event: function(category, action, label, value) {
          var data, _ref;
          if (!account) {
            return;
          }
          data = {
            platform: 'web',
            category: category,
            action: label
          };
          if (value > 0) {
            data.value = value;
          }
          return (_ref = window._cio) != null ? _ref.track(label, data) : void 0;
        }
      };
    },
    fullstory: function(account) {
      var script, _fs_debug, _fs_host, _fs_org, _fullstory;
      if (!account) {
        return;
      }
      _fullstory = window.FS = function(id, user) {
        if (_fullstory.q) {
          return _fullstory.q.push(arguments);
        } else {
          return _fullstory._api(id, user);
        }
      };
      _fullstory.q = [];
      _fs_debug = window._fs_debug = window._fs_debug || false;
      _fs_host = window._fs_host = window._fs_host || 'www.fullstory.com';
      _fs_org = window['_fs_org'] = account;
      script = getScript("https://" + _fs_host + "/s/fs.js");
      checkScript(script);
      _fullstory.identify = function(id, user) {
        _fullstory('user', {
          uid: id
        });
        if (user) {
          return _fullstory('user', user);
        }
      };
      _fullstory.setUserVars = function(user) {
        return _fullstory('user', user);
      };
      _fullstory.identifyAccount = function(id, user) {
        if (user == null) {
          user = {};
        }
        user.acctId = id;
        return _fullstory('account', user);
      };
      return {
        name: 'fullstory',
        setUser: function(id, user) {
          return _fullstory.identify(id, user);
        }
      };
    }
  };
  return gta;
});
