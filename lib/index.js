(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Gta", [], factory);
	else if(typeof exports === 'object')
		exports["Gta"] = factory();
	else
		root["Gta"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Common, GTA, Plugins, Providers,
	  hasProp = {}.hasOwnProperty;

	Common = __webpack_require__(1);

	Plugins = __webpack_require__(2);

	Providers = __webpack_require__(6);

	GTA = (function() {
	  GTA.prototype.debug = false;

	  GTA.prototype.plugins = [];

	  GTA.prototype.providers = [];

	  GTA.prototype.mixPayload = {};

	  GTA.prototype.version = '1.0.10';

	  function GTA() {
	    var $el, Plugin, Provider, name;
	    $el = document.getElementById('gta-main');
	    if (!$el) {
	      return;
	    }
	    for (name in Providers) {
	      if (!hasProp.call(Providers, name)) continue;
	      Provider = Providers[name];
	      this.registerProvider(name, Provider, $el);
	    }
	    for (name in Plugins) {
	      if (!hasProp.call(Plugins, name)) continue;
	      Plugin = Plugins[name];
	      this.registerPlugin(Plugin);
	    }
	    this.delegateEvents();
	    Common.removeElement($el);
	  }

	  GTA.prototype.registerProperty = function(key, value) {
	    this.mixPayload[key] = value;
	    return this;
	  };

	  GTA.prototype.unregisterProperty = function(key) {
	    delete this.mixPayload[key];
	    return this;
	  };

	  GTA.prototype.registerProvider = function(name, Provider, $el) {
	    var account, randomProportion, scriptUrl, trackUrl;
	    if ($el == null) {
	      $el = document.getElementById('gta-main');
	    }
	    if (!$el) {
	      return false;
	    }
	    account = $el.getAttribute("data-" + name);
	    scriptUrl = $el.getAttribute("data-" + name + "-script");
	    trackUrl = $el.getAttribute("data-" + name + "-track");
	    randomProportion = $el.getAttribute("data-" + name + "-random-proportion");
	    if (randomProportion && Math.random() > randomProportion) {
	      return true;
	    }
	    if (account) {
	      this.providers.push(new Provider(account, scriptUrl, trackUrl));
	      return true;
	    }
	    return false;
	  };

	  GTA.prototype.registerPlugin = function(Plugin) {
	    var plugin;
	    plugin = new Plugin(this);
	    this.plugins.push(plugin);
	    return plugin;
	  };

	  GTA.prototype.setCurrentPage = function(page) {
	    return this.registerProperty('page', page);
	  };

	  GTA.prototype.setUser = function(id, user) {
	    var e, formattedUser, i, len, provider, ref, ref1;
	    try {
	      ref = this.providers;
	      for (i = 0, len = ref.length; i < len; i++) {
	        provider = ref[i];
	        formattedUser = Common.formatUser(provider, user);
	        if (this.debug || window._gta_debug) {
	          console.log('formatUser', provider.name, formattedUser);
	        }
	        if ((ref1 = provider.setUser) != null) {
	          ref1.call(provider, id, formattedUser);
	        }
	      }
	    } catch (error) {
	      e = error;
	      if (this.debug || window._gta_debug) {
	        console.error(e);
	      }
	    }
	    return this;
	  };

	  GTA.prototype.pageview = function() {
	    var e, i, len, provider, ref, ref1;
	    try {
	      ref = this.providers;
	      for (i = 0, len = ref.length; i < len; i++) {
	        provider = ref[i];
	        if ((ref1 = provider.pageview) != null) {
	          ref1.apply(provider, arguments);
	        }
	      }
	    } catch (error) {
	      e = error;
	    }
	    return this;
	  };

	  GTA.prototype.event = function(gtaOptions) {
	    var e, ee, i, j, len, len1, plugin, provider, ref, ref1;
	    try {
	      if (typeof gtaOptions === 'object' && !!gtaOptions) {
	        gtaOptions.method || (gtaOptions.method = 'click');
	        gtaOptions = Common.extend({}, this.mixPayload, gtaOptions);
	        ref = this.plugins;
	        for (i = 0, len = ref.length; i < len; i++) {
	          plugin = ref[i];
	          gtaOptions = typeof plugin.onGTAEvent === "function" ? plugin.onGTAEvent(gtaOptions) : void 0;
	          if (!gtaOptions) {
	            if (this.debug || window._gta_debug) {
	              console.info('An event was filtered by plugin:', plugin.name);
	            }
	            return this;
	          }
	        }
	        if (this.debug || window._gta_debug) {
	          console.log('GTA options: ', gtaOptions);
	        }
	        ref1 = this.providers;
	        for (j = 0, len1 = ref1.length; j < len1; j++) {
	          provider = ref1[j];
	          try {
	            if (typeof provider.event === "function") {
	              provider.event(gtaOptions);
	            }
	          } catch (error) {
	            ee = error;
	            if (this.debug || window._gta_debug) {
	              console.trace("error on gta provider: " + provider.name + ", " + ee);
	            }
	          }
	        }
	      }
	    } catch (error) {
	      e = error;
	      if (this.debug || window._gta_debug) {
	        console.trace("error on gta event: " + e);
	      }
	    }
	    return this;
	  };

	  GTA.prototype.delegateEvents = function() {
	    var listener, matches;
	    matches = function(el, selector) {
	      return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
	    };
	    listener = (function(_this) {
	      return function(e) {
	        return window.setTimeout(function() {
	          var el, gtaIgnore, gtaOptions, gtaString, ref, ref1, results;
	          el = e.target;
	          results = [];
	          while (el) {
	            gtaString = (ref = el.dataset) != null ? ref.gta : void 0;
	            gtaIgnore = (ref1 = el.dataset) != null ? ref1.gtaIgnore : void 0;
	            gtaOptions = Common.parseGta(gtaString);
	            if (gtaOptions && (!gtaIgnore || matches(e.target, gtaIgnore))) {
	              _this.event(gtaOptions);
	            }
	            results.push(el = el.parentElement);
	          }
	          return results;
	        }, 0);
	      };
	    })(this);
	    return document.body.addEventListener('click', listener, true);
	  };

	  return GTA;

	})();

	module.exports = new GTA();


/***/ },
/* 1 */
/***/ function(module, exports) {

	var Common, GTA_CHECK_REGEX, GTA_PARSE_REGEX,
	  slice = [].slice,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	module.exports = Common = {};

	GTA_CHECK_REGEX = /^\s*\{(.*)\}\s*$/;

	GTA_PARSE_REGEX = /[\s"']*([^:,"']+)[\s"']*:[\s"']*([^:,"']+)[\s"']*,?/g;

	Common.extend = function() {
	  var arg, dest, i, key, len, source, value;
	  dest = arguments[0], source = 2 <= arguments.length ? slice.call(arguments, 1) : [];
	  for (i = 0, len = source.length; i < len; i++) {
	    arg = source[i];
	    for (key in arg) {
	      value = arg[key];
	      dest[key] = value;
	    }
	  }
	  return dest;
	};

	Common.removeElement = function(el) {
	  return el.parentNode.removeChild(el);
	};

	Common.parseGta = function(gtaString) {
	  var _, gtaOptions, it, key, ref, value;
	  if (!gtaString) {
	    return;
	  }
	  gtaString = (ref = GTA_CHECK_REGEX.exec(gtaString)) != null ? ref[1] : void 0;
	  if (!(gtaString && gtaString.length)) {
	    return;
	  }
	  gtaOptions = {};
	  while (it = GTA_PARSE_REGEX.exec(gtaString)) {
	    _ = it[0], key = it[1], value = it[2];
	    gtaOptions[key] = value;
	  }
	  return gtaOptions;
	};

	Common.formatUser = function(provider, user) {
	  var key, ref, ref1, result, value;
	  result = {};
	  for (key in user) {
	    value = user[key];
	    if (!value) {
	      continue;
	    }
	    if ((value.wlist != null) && (ref = provider.name, indexOf.call(value.wlist, ref) < 0)) {
	      continue;
	    }
	    if ((ref1 = value.alias) != null ? ref1[provider.name] : void 0) {
	      result[value.alias[provider.name]] = value.value;
	    } else {
	      if (Object.prototype.toString.call(value) === '[object Object]' && 'value' in value) {
	        result[key] = value.value;
	      } else {
	        result[key] = value;
	      }
	    }
	  }
	  return result;
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Referral, UTM;

	UTM = __webpack_require__(3);

	Referral = __webpack_require__(5);

	module.exports = {
	  utm: UTM,
	  referral: Referral
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var BasePlugin, COOKIE_TEST_REGEX, UTMDaemon, UTM_TAG_REGEX,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	BasePlugin = __webpack_require__(4);

	UTM_TAG_REGEX = /utm_(\w+)=([^&]*)&?/ig;

	COOKIE_TEST_REGEX = /(^|;\s?)utm=(\S+)(?:;|$)/i;

	module.exports = UTMDaemon = (function(superClass) {
	  extend(UTMDaemon, superClass);

	  UTMDaemon.prototype.name = 'utm daemon';

	  function UTMDaemon(gta) {
	    var domain, e, encodedUTM, key, match, monthLater, part, utm, value;
	    try {
	      if (COOKIE_TEST_REGEX.test(document.cookie)) {
	        return;
	      }
	      utm = {};
	      while (match = UTM_TAG_REGEX.exec(window.location.search)) {
	        part = match[0], key = match[1], value = match[2];
	        utm[key] = value;
	      }
	      encodedUTM = encodeURIComponent(JSON.stringify(utm));
	      domain = "." + (/\.?([\w\-]+\.\w+)$/.exec(window.location.hostname)[1]);
	      monthLater = new Date(Date.now() + 2592000000).toGMTString();
	      if (part) {
	        document.cookie = "utm=" + encodedUTM + ";expires=" + monthLater + ";domain=" + domain + ";path=/";
	      }
	    } catch (error) {
	      e = error;
	      if (gta.debug || window._gta_debug) {
	        console.error(e);
	      }
	    }
	  }

	  return UTMDaemon;

	})(BasePlugin);


/***/ },
/* 4 */
/***/ function(module, exports) {

	var BasePlugin;

	module.exports = BasePlugin = (function() {
	  BasePlugin.prototype.name = 'base';

	  function BasePlugin(gta) {}

	  BasePlugin.prototype.onGTAEvent = function(gtaOptions) {
	    return gtaOptions;
	  };

	  return BasePlugin;

	})();


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var BasePlugin, COOKIE_TEST_REGEX, ReferralDaemon,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	BasePlugin = __webpack_require__(4);

	COOKIE_TEST_REGEX = /(^|;\s?)referral=(\S+)(?:;|$)/i;

	module.exports = ReferralDaemon = (function(superClass) {
	  extend(ReferralDaemon, superClass);

	  ReferralDaemon.prototype.name = 'referral daemon';

	  function ReferralDaemon(gta) {
	    var $parser, domain, e, encodedReferral, monthLater, referral;
	    try {
	      if (document.referrer && !COOKIE_TEST_REGEX.test(document.cookie)) {
	        $parser = document.createElement('a');
	        $parser.href = document.referrer;
	        referral = {
	          domain: $parser.hostname.slice(0, 100),
	          path: $parser.pathname.slice(0, 100),
	          query: $parser.search.slice(0, 100),
	          hash: $parser.hash.slice(0, 100)
	        };
	        encodedReferral = encodeURIComponent(JSON.stringify(referral));
	        domain = "." + (/\.?([\w\-]+\.\w+)$/.exec(window.location.hostname)[1]);
	        monthLater = new Date(Date.now() + 2592000000).toGMTString();
	        document.cookie = "referral=" + encodedReferral + ";expires=" + monthLater + ";domain=" + domain + ";path=/";
	      }
	    } catch (error) {
	      e = error;
	      if (gta.debug || window._gta_debug) {
	        console.error(e);
	      }
	    }
	  }

	  return ReferralDaemon;

	})(BasePlugin);


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Baidu, Customer, Fullstory, Google, GrowingIO, TBPanel;

	Google = __webpack_require__(7);

	Baidu = __webpack_require__(9);

	Customer = __webpack_require__(10);

	Fullstory = __webpack_require__(11);

	GrowingIO = __webpack_require__(12);

	TBPanel = __webpack_require__(13);

	module.exports = {
	  google: Google,
	  baidu: Baidu,
	  tbpanel: TBPanel,
	  customer: Customer,
	  fullstory: Fullstory,
	  growingio: GrowingIO
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var BaseProvider, Google,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	BaseProvider = __webpack_require__(8);

	module.exports = Google = (function(superClass) {
	  extend(Google, superClass);

	  Google.prototype.name = 'google';

	  function Google(account) {
	    var script;
	    if (!account) {
	      return;
	    }
	    window.GoogleAnalyticsObject = 'ga';
	    window.ga = function() {
	      return window.ga.q.push(arguments);
	    };
	    window.ga.q = [];
	    window.ga.l = 1 * new Date();
	    script = BaseProvider.createScript('//www.google-analytics.com/analytics.js');
	    BaseProvider.loadScript(script, 'ga');
	    window.ga('create', account, 'auto');
	    window.ga('require', 'displayfeatures');
	    window.ga('require', 'linkid', 'linkid.js');
	    window.ga('send', 'pageview');
	  }

	  Google.prototype.pageview = function() {
	    var args, data;
	    if (!window.ga) {
	      return;
	    }
	    args = Array.prototype.slice.call(arguments);
	    data = typeof args[0] === 'object' ? args[0] : args.join('_');
	    return window.ga('send', 'pageview', data);
	  };

	  Google.prototype.event = function(gtaOptions) {
	    var action, category, label;
	    if (!window.ga) {
	      return;
	    }
	    category = gtaOptions.page;
	    action = gtaOptions.action;
	    label = gtaOptions.type;
	    return window.ga('send', 'event', category, action, label);
	  };

	  return Google;

	})(BaseProvider);


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var BaseProvider, Common;

	Common = __webpack_require__(1);

	module.exports = BaseProvider = (function() {
	  function BaseProvider() {}

	  BaseProvider.prototype.name = 'base';

	  BaseProvider.prototype.event = function() {};

	  BaseProvider.prototype.setUser = function() {};

	  BaseProvider.prototype.pageview = function() {};

	  return BaseProvider;

	})();

	BaseProvider.createScript = function(src, id) {
	  var script;
	  script = document.createElement('script');
	  script.async = 1;
	  script.src = src;
	  if (id) {
	    script.id = id;
	  }
	  return script;
	};

	BaseProvider.loadScript = function(script, key, removeAfterLoad) {
	  var firstScript;
	  if (removeAfterLoad == null) {
	    removeAfterLoad = true;
	  }
	  script.onerror = function() {
	    window[key] = null;
	    return Common.removeElement(script);
	  };
	  script.onload = function() {
	    if (removeAfterLoad) {
	      return Common.removeElement(script);
	    }
	  };
	  firstScript = document.getElementsByTagName('script')[0];
	  return firstScript.parentNode.insertBefore(script, firstScript);
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Baidu, BaseProvider, Common,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	BaseProvider = __webpack_require__(8);

	Common = __webpack_require__(1);

	module.exports = Baidu = (function(superClass) {
	  extend(Baidu, superClass);

	  Baidu.prototype.name = 'baidu';

	  function Baidu(account) {
	    var script;
	    if (!account) {
	      return;
	    }
	    window._hmt = window._hmt || [];
	    script = BaseProvider.createScript("//hm.baidu.com/hm.js?" + account);
	    BaseProvider.loadScript(script, '_hmt');
	  }

	  Baidu.prototype.pageview = function() {
	    var args, data, key, val;
	    if (!window._hmt) {
	      return;
	    }
	    args = Array.prototype.slice.call(arguments);
	    if (typeof args[0] === 'object') {
	      data = args[0].page;
	      if (!data) {
	        data = ((function() {
	          var ref, results;
	          ref = args[0];
	          results = [];
	          for (key in ref) {
	            val = ref[key];
	            results.push(val);
	          }
	          return results;
	        })()).join('_');
	      }
	    } else {
	      data = args.join('_');
	    }
	    return window._hmt.push(['_trackPageview', data]);
	  };

	  Baidu.prototype.event = function(gtaOptions) {
	    var action, category, label;
	    if (!window._hmt) {
	      return;
	    }
	    category = gtaOptions.page || '';
	    action = gtaOptions.action || '';
	    label = gtaOptions.type || '';
	    return window._hmt.push(['_trackEvent', category, action, label]);
	  };

	  return Baidu;

	})(BaseProvider);


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var BaseProvider, Common, CustomerIO,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	BaseProvider = __webpack_require__(8);

	Common = __webpack_require__(1);

	module.exports = CustomerIO = (function(superClass) {
	  extend(CustomerIO, superClass);

	  CustomerIO.prototype.name = 'customer.io';

	  function CustomerIO(account) {
	    this.account = account;
	  }

	  CustomerIO.prototype.initCustomer = function(id) {
	    var _account, _cio, accounts, i, len, method, ref, script;
	    _cio = window._cio = window._cio || [];
	    _cio.invoked = true;
	    _cio.methods = ['trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview', 'reset', 'group', 'ready', 'alias', 'page', 'once', 'off', 'on', 'load', 'identify', 'sidentify', 'track'];
	    _cio.factory = function(method) {
	      return function() {
	        _cio.push([method].concat(Array.prototype.slice.call(arguments)));
	        return _cio;
	      };
	    };
	    ref = _cio.methods;
	    for (i = 0, len = ref.length; i < len; i++) {
	      method = ref[i];
	      _cio[method] = _cio.factory(method);
	    }
	    accounts = this.account.split(',');
	    _account = (id != null ? id.indexOf('@') : void 0) > 0 ? accounts[1] : accounts[0];
	    script = BaseProvider.createScript('//assets.customer.io/assets/track.js', 'cio-tracker');
	    script.setAttribute('data-site-id', _account);
	    return BaseProvider.loadScript(script, '_cio', false);
	  };

	  CustomerIO.prototype.setUser = function(id, raw_user) {
	    var ref, user;
	    if (!this.account) {
	      return;
	    }
	    user = Common.extend({}, raw_user);
	    user.id = id;
	    if (new Date(user.created_at) >= new Date('2016-01-01')) {
	      user.id = user.email;
	    }
	    user.created_at = Math.floor(new Date(user.created_at).valueOf() / 1000);
	    this.initCustomer(user.id);
	    return (ref = window._cio) != null ? ref.identify(user) : void 0;
	  };

	  CustomerIO.prototype.pageview = function(data) {};

	  CustomerIO.prototype.event = function(gtaOptions) {
	    var ref;
	    if (!this.account) {
	      return;
	    }
	    return (ref = window._cio) != null ? ref.track(gtaOptions.action, gtaOptions) : void 0;
	  };

	  return CustomerIO;

	})(BaseProvider);


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var BaseProvider, Common, Fullstory,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	BaseProvider = __webpack_require__(8);

	Common = __webpack_require__(1);

	module.exports = Fullstory = (function(superClass) {
	  extend(Fullstory, superClass);

	  Fullstory.prototype.name = 'fullstory';

	  function Fullstory(account) {
	    var _fs_debug, _fs_host, _fs_org, _fullstory, script;
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
	    _fs_org = window._fs_org = account;
	    script = BaseProvider.createScript("https://" + _fs_host + "/s/fs.js");
	    BaseProvider.loadScript(script);
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
	    _fullstory.clearUserCookie = function(identified_only) {
	      var domain, index, results;
	      if (!identified_only || document.cookie.match('fs_uid=[`;`]*`[`;`]*`[`;`]*`')) {
	        domain = document.domain;
	        results = [];
	        while (true) {
	          document.cookie = 'fs_uid=;domain=' + domain + ';path=/;expires=' + new Date(0);
	          index = domain.indexOf('.');
	          if (index < 0) {
	            break;
	          }
	          results.push(domain = domain.slice(index + 1));
	        }
	        return results;
	      }
	    };
	  }

	  Fullstory.prototype.setUser = function(id, raw_user) {
	    var k, user, v;
	    user = Common.extend({}, raw_user);
	    for (k in user) {
	      v = user[k];
	      if (!/(^(displayName|email)$)|(.*_(str|int|real|date|bool)$)/.test(k)) {
	        delete user[k];
	      }
	    }
	    user.displayName = id;
	    user.email = id + "@mail.teambition.com";
	    return window.FS.identify(id, user);
	  };

	  return Fullstory;

	})(BaseProvider);


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var BaseProvider, GrowingIO,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	BaseProvider = __webpack_require__(8);

	module.exports = GrowingIO = (function(superClass) {
	  extend(GrowingIO, superClass);

	  GrowingIO.prototype.name = 'growingio';

	  function GrowingIO(account) {
	    var _vds, script;
	    if (!account) {
	      return;
	    }
	    _vds = _vds || [];
	    window._vds = _vds;
	    _vds.push(['setAccountId', account]);
	    script = BaseProvider.createScript(('https:' === document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js');
	    BaseProvider.loadScript(script);
	  }

	  return GrowingIO;

	})(BaseProvider);


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var BaseProvider, Common, TBPanel,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	BaseProvider = __webpack_require__(8);

	Common = __webpack_require__(1);

	module.exports = TBPanel = (function(superClass) {
	  extend(TBPanel, superClass);

	  TBPanel.prototype.name = 'tbpanel';

	  function TBPanel(account, scriptUrl) {
	    var lib_name, script, tbpanel;
	    if (!account) {
	      return;
	    }
	    scriptUrl || (scriptUrl = '//dn-st.teambition.net/tbpanel/tbpanel.d812.js');
	    lib_name = 'tbpanel';
	    tbpanel = window.tbpanel = [];
	    tbpanel._i = [];
	    tbpanel.init = function(token, config, name) {
	      var _set_and_defer, fn, functions, i, len, target;
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
	          return target.push([fn].concat(Array.prototype.slice.call(arguments)));
	        };
	      };
	      functions = ['disable', 'track', 'track_pageview', 'track_links', 'track_forms', 'register', 'register_once', 'alias', 'unregister', 'identify', 'name_tag', 'set_config', 'people.set', 'people.set_once', 'people.increment', 'people.append', 'people.track_charge', 'people.clear_charges', 'people.delete_user'];
	      for (i = 0, len = functions.length; i < len; i++) {
	        fn = functions[i];
	        _set_and_defer(target, fn);
	      }
	      return tbpanel._i.push([token, config, name]);
	    };
	    tbpanel.__SV = 1.2;
	    tbpanel.init(account);
	    script = BaseProvider.createScript(scriptUrl);
	    BaseProvider.loadScript(script, lib_name);
	  }

	  TBPanel.prototype.setUser = function(id, raw_user) {
	    var all, client, dc, os, user, version;
	    user = Common.extend({}, raw_user);
	    if (id) {
	      user.userKey = id;
	    }
	    window.tbpanel.register(user);
	    dc = navigator.userAgent.match(/(Teambition(?:-UWP)?)\/([\d\.]+)/i);
	    if (dc) {
	      all = dc[0], client = dc[1], version = dc[2];
	      if (client === 'Teambition') {
	        client = 'Teambition_Desktop';
	      }
	      window.tbpanel.register({
	        $browser: client,
	        $browser_version: version
	      });
	    }
	    os = navigator.userAgent.match(/Windows NT [\d.]+|(?:Macintosh;|Linux|\b\w*BSD)[^;)]*?(?=\)|;)/i);
	    if (os) {
	      return window.tbpanel.register({
	        $os_version: os[0]
	      });
	    }
	  };

	  TBPanel.prototype.event = function(gtaOptions) {
	    var data, ref;
	    data = Common.extend({}, gtaOptions);
	    if (data.platform == null) {
	      data.platform = 'web';
	    }
	    return (ref = window.tbpanel) != null ? ref.track(data.action, data) : void 0;
	  };

	  return TBPanel;

	})(BaseProvider);


/***/ }
/******/ ])
});
;