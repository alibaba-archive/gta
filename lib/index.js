var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
  var $body, Providers, checkScript, formatUser, getScript, gta, initGta, newGtaReg, providers, removeElement, slice, utm_daemon;
  slice = Array.prototype.slice;
  $body = null;
  newGtaReg = /^\s*\{(.*)\}\s*$/;
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
    var firstScript, script;
    script = document.createElement('script');
    firstScript = document.getElementsByTagName('script')[0];
    script.async = 1;
    script.src = src;
    if (id) {
      script.id = id;
    }
    firstScript.parentNode.insertBefore(script, firstScript);
    return script;
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
      _ga.l = 1 * new Date;
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
        event: function(gtaOptions) {
          var action, category, label;
          if (!window._ga) {
            return;
          }
          category = gtaOptions.page;
          action = gtaOptions.action;
          label = gtaOptions.type;
          return window._ga('send', 'event', category, action, label);
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
          var args, data, key, val;
          if (!window._hmt) {
            return;
          }
          args = slice.call(arguments);
          if (typeof args[0] === 'object') {
            data = args[0].page;
            if (!data) {
              data = ((function() {
                var _ref, _results;
                _ref = args[0];
                _results = [];
                for (key in _ref) {
                  val = _ref[key];
                  _results.push(val);
                }
                return _results;
              })()).join('_');
            }
          } else {
            data = args.join('_');
          }
          return window._hmt.push(['_trackPageview', data]);
        },
        event: function(gtaOptions) {
          var action, category, label;
          if (!window._hmt) {
            return;
          }
          category = gtaOptions.page;
          action = gtaOptions.action;
          label = gtaOptions.type;
          return window._hmt.push(['_trackEvent', category, action, label]);
        }
      };
    },
    tbpanel: function(account) {
      var lib_name, script, tbpanel, _gtaUser, _gtaUserId;
      if (!account) {
        return;
      }
      lib_name = 'tbpanel';
      tbpanel = window.tbpanel = [];
      tbpanel._i = [];
      tbpanel.init = function(token, config, name) {
        var fn, functions, target, _i, _len, _set_and_defer;
        target = tbpanel;
        if (name != null) {
          target = tbpanel[name] = [];
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
        return tbpanel._i.push([token, config, name]);
      };
      tbpanel.__SV = 1.2;
      tbpanel.init(account);
      script = getScript('//dn-st.teambition.net/tbpanel/tbpanel.fc57.js');
      checkScript(script, lib_name);
      _gtaUser = null;
      _gtaUserId = null;
      return {
        name: 'tbpanel',
        pageview: function() {},
        setUser: function(id, user) {
          var all, client, dc, os, version;
          _gtaUserId = id;
          _gtaUser = user;
          dc = navigator.userAgent.match(/(Teambition(?:-UWP)?)\/([\d\.]+)/i);
          if (dc) {
            all = dc[0], client = dc[1], version = dc[2];
            if (client === 'Teambition') {
              client = 'Teambition_Desktop';
            }
            tbpanel.register({
              $browser: client,
              $browser_version: version
            });
          }
          os = navigator.userAgent.match(/Windows NT [\d.]+|(?:Macintosh;|Linux|\b\w*BSD)[^;)]*?(?=\)|;)/i);
          if (os) {
            return tbpanel.register({
              $os_version: os[0]
            });
          }
        },
        event: function(gtaOptions) {
          var data, _ref;
          data = window.$ ? $.extend({}, gtaOptions) : gtaOptions;
          if (data.platform == null) {
            data.platform = 'web';
          }
          if (_gtaUserId != null) {
            data.userKey = _gtaUserId;
          }
          if (_gtaUser != null) {
            if (typeof $ !== "undefined" && $ !== null) {
              $.extend(data, _gtaUser);
            }
          }
          return (_ref = window.tbpanel) != null ? _ref.track(data.action, data) : void 0;
        }
      };
    },
    mixpanel: function(account) {
      var lib_name, mixpanel, script, _gtaUser, _gtaUserId;
      if (!account) {
        return;
      }
      lib_name = 'mixpanel';
      mixpanel = window.mixpanel = [];
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
      _gtaUser = null;
      _gtaUserId = null;
      return {
        name: 'mixpanel',
        pageview: function() {},
        setUser: function(id, user) {
          var all, client, dc, os, version;
          _gtaUserId = id;
          _gtaUser = user;
          dc = navigator.userAgent.match(/(Teambition(?:-UWP)?)\/([\d\.]+)/i);
          if (dc) {
            all = dc[0], client = dc[1], version = dc[2];
            if (client === 'Teambition') {
              client = 'Teambition_Desktop';
            }
            mixpanel.register({
              $browser: client,
              $browser_version: version
            });
          }
          os = navigator.userAgent.match(/Windows NT [\d.]+|(?:Macintosh;|Linux|\b\w*BSD)[^;)]*?(?=\)|;)/i);
          if (os) {
            return mixpanel.register({
              $os_version: os[0]
            });
          }
        },
        event: function(gtaOptions) {
          var data, _ref;
          data = window.$ ? $.extend({}, gtaOptions) : gtaOptions;
          if (data.platform == null) {
            data.platform = 'web';
          }
          if (_gtaUserId != null) {
            data.userKey = _gtaUserId;
          }
          if (_gtaUser != null) {
            if (typeof $ !== "undefined" && $ !== null) {
              $.extend(data, _gtaUser);
            }
          }
          return (_ref = window.mixpanel) != null ? _ref.track(data.action, data) : void 0;
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
            _cio.push([method].concat(Array.prototype.slice.call(arguments)));
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
          user.id = id;
          if (new Date(user.created_at) >= new Date('2016-01-01')) {
            user.id = user.email;
          }
          user.created_at = Math.floor(new Date(user.created_at).valueOf() / 1000);
          initCustomer(user.id);
          return (_ref = window._cio) != null ? _ref.identify(user) : void 0;
        },
        pageview: function(data) {},
        event: function(gtaOptions) {
          var data, _ref;
          if (!account) {
            return;
          }
          data = gtaOptions;
          if (data.platform == null) {
            data.platform = 'web';
          }
          return (_ref = window._cio) != null ? _ref.track(data.action, data) : void 0;
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
          var clonedUser, k, v;
          clonedUser = typeof $ !== "undefined" && $ !== null ? $.extend({}, user) : void 0;
          for (k in clonedUser) {
            v = clonedUser[k];
            if (!/(^(displayName|email)$)|(.*_(str|int|real|date|bool)$)/.test(k)) {
              delete clonedUser[k];
            }
          }
          clonedUser.displayName = id;
          clonedUser.email = "" + id + "@mail.teambition.com";
          return _fullstory.identify(id, clonedUser);
        }
      };
    }
  };
  utm_daemon = function() {
    var domain, e, key, match, monthLater, part, re, utm, value;
    try {
      re = /utm_(\w+)=([^&]*)&?/ig;
      utm = {};
      while (match = re.exec(window.location.search)) {
        part = match[0], key = match[1], value = match[2];
        utm[key] = value;
      }
      domain = "." + (/\.?([\w-]+\.\w+)$/.exec(window.location.hostname)[1]);
      monthLater = new Date(Date.now() + 2592000000);
      if (part) {
        document.cookie = "utm=" + (encodeURI(JSON.stringify(utm))) + ";expires=" + (monthLater.toGMTString()) + ";domain=" + domain;
      }
    } catch (_error) {
      e = _error;
      if (gta.debug) {
        console.error(e);
      }
    }
    return this;
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
    utm_daemon();
    return providers;
  };
  providers = [];
  formatUser = function(provider, user) {
    var key, result, value, _ref, _ref1;
    result = {};
    for (key in user) {
      value = user[key];
      if (!value) {
        continue;
      }
      if ((value.wlist != null) && (_ref = provider.name, __indexOf.call(value.wlist, _ref) < 0)) {
        continue;
      }
      if ((_ref1 = value.alias) != null ? _ref1[provider.name] : void 0) {
        result[value.alias[provider.name]] = value.value;
      } else {
        result[key] = Object.prototype.toString.call(value) === '[object Object]' && 'value' in value ? value.value : value;
      }
    }
    return result;
  };
  gta = {
    debug: false,
    page: '',
    setCurrentPage: function(page) {
      this.page = page;
      return this;
    },
    setUser: function(id, user) {
      var e, provider, _i, _len, _ref;
      try {
        providers = initGta();
        for (_i = 0, _len = providers.length; _i < _len; _i++) {
          provider = providers[_i];
          if (this.debug) {
            console.log('formatUser', provider.name, formatUser(provider, user));
          }
          if ((_ref = provider.setUser) != null) {
            _ref.call(provider, id, formatUser(provider, user));
          }
        }
      } catch (_error) {
        e = _error;
        if (this.debug) {
          console.error(e);
        }
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
    event: function(gtaOptions) {
      var e, isObject, provider, _i, _len;
      try {
        isObject = typeof gtaOptions === 'object' && !!gtaOptions;
        if (isObject) {
          gtaOptions.page || (gtaOptions.page = this.page);
          gtaOptions.method || (gtaOptions.method = 'click');
          if (this.debug) {
            console.log('gtaOptions: ', gtaOptions);
          }
          for (_i = 0, _len = providers.length; _i < _len; _i++) {
            provider = providers[_i];
            if (typeof provider.event === "function") {
              provider.event(gtaOptions);
            }
          }
        }
      } catch (_error) {
        e = _error;
        if (this.debug) {
          console.error(e);
        }
      }
      return this;
    },
    delegateEvents: function() {
      if (!window.$) {
        return;
      }
      $body = $('body');
      return $(document).off('.gta').on('click.gta', '[data-gta]', (function(_this) {
        return function(e) {
          var $target, gtaOptions, gtaString;
          $target = $(e.currentTarget);
          gtaString = $target.data('gta');
          if (newGtaReg.test(gtaString)) {
            gtaOptions = _this.parseGta(gtaString);
            _this.event(gtaOptions);
          }
          return _this;
        };
      })(this));
    },
    parseGta: function(gtaString) {
      var gtaOptions, it, key, reg, value;
      gtaString = newGtaReg.exec(gtaString)[1];
      if (!gtaString.length) {
        return;
      }
      reg = /[\s"']*([^:,"']+)[\s"']*:[\s"']*([^:,"']+)[\s"']*,?/g;
      gtaOptions = {};
      while (it = reg.exec(gtaString)) {
        key = it[1];
        value = it[2];
        gtaOptions[key] = value;
      }
      return gtaOptions;
    }
  };
  return gta;
});
