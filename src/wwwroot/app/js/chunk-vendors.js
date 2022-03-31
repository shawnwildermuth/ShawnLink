(self["webpackChunkclient"] = self["webpackChunkclient"] || []).push([["chunk-vendors"],{

/***/ "./node_modules/@vue/devtools-api/lib/esm/const.js":
/*!*********************************************************!*\
  !*** ./node_modules/@vue/devtools-api/lib/esm/const.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HOOK_PLUGIN_SETTINGS_SET": function() { return /* binding */ HOOK_PLUGIN_SETTINGS_SET; },
/* harmony export */   "HOOK_SETUP": function() { return /* binding */ HOOK_SETUP; }
/* harmony export */ });
const HOOK_SETUP = 'devtools-plugin:setup';
const HOOK_PLUGIN_SETTINGS_SET = 'plugin:settings:set';

/***/ }),

/***/ "./node_modules/@vue/devtools-api/lib/esm/env.js":
/*!*******************************************************!*\
  !*** ./node_modules/@vue/devtools-api/lib/esm/env.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDevtoolsGlobalHook": function() { return /* binding */ getDevtoolsGlobalHook; },
/* harmony export */   "getTarget": function() { return /* binding */ getTarget; },
/* harmony export */   "isProxyAvailable": function() { return /* binding */ isProxyAvailable; }
/* harmony export */ });
function getDevtoolsGlobalHook() {
  return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function getTarget() {
  // @ts-ignore
  return typeof navigator !== 'undefined' && typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : {};
}
const isProxyAvailable = typeof Proxy === 'function';

/***/ }),

/***/ "./node_modules/@vue/devtools-api/lib/esm/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@vue/devtools-api/lib/esm/index.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPerformanceSupported": function() { return /* reexport safe */ _time__WEBPACK_IMPORTED_MODULE_0__.isPerformanceSupported; },
/* harmony export */   "now": function() { return /* reexport safe */ _time__WEBPACK_IMPORTED_MODULE_0__.now; },
/* harmony export */   "setupDevtoolsPlugin": function() { return /* binding */ setupDevtoolsPlugin; }
/* harmony export */ });
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./env */ "./node_modules/@vue/devtools-api/lib/esm/env.js");
/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./const */ "./node_modules/@vue/devtools-api/lib/esm/const.js");
/* harmony import */ var _proxy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./proxy */ "./node_modules/@vue/devtools-api/lib/esm/proxy.js");
/* harmony import */ var _time__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./time */ "./node_modules/@vue/devtools-api/lib/esm/time.js");






function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
  const descriptor = pluginDescriptor;
  const target = (0,_env__WEBPACK_IMPORTED_MODULE_1__.getTarget)();
  const hook = (0,_env__WEBPACK_IMPORTED_MODULE_1__.getDevtoolsGlobalHook)();
  const enableProxy = _env__WEBPACK_IMPORTED_MODULE_1__.isProxyAvailable && descriptor.enableEarlyProxy;

  if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
    hook.emit(_const__WEBPACK_IMPORTED_MODULE_2__.HOOK_SETUP, pluginDescriptor, setupFn);
  } else {
    const proxy = enableProxy ? new _proxy__WEBPACK_IMPORTED_MODULE_3__.ApiProxy(descriptor, hook) : null;
    const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
    list.push({
      pluginDescriptor: descriptor,
      setupFn,
      proxy
    });
    if (proxy) setupFn(proxy.proxiedTarget);
  }
}

/***/ }),

/***/ "./node_modules/@vue/devtools-api/lib/esm/proxy.js":
/*!*********************************************************!*\
  !*** ./node_modules/@vue/devtools-api/lib/esm/proxy.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApiProxy": function() { return /* binding */ ApiProxy; }
/* harmony export */ });
/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./const */ "./node_modules/@vue/devtools-api/lib/esm/const.js");
/* harmony import */ var _time__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./time */ "./node_modules/@vue/devtools-api/lib/esm/time.js");


class ApiProxy {
  constructor(plugin, hook) {
    this.target = null;
    this.targetQueue = [];
    this.onQueue = [];
    this.plugin = plugin;
    this.hook = hook;
    const defaultSettings = {};

    if (plugin.settings) {
      for (const id in plugin.settings) {
        const item = plugin.settings[id];
        defaultSettings[id] = item.defaultValue;
      }
    }

    const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
    let currentSettings = Object.assign({}, defaultSettings);

    try {
      const raw = localStorage.getItem(localSettingsSaveId);
      const data = JSON.parse(raw);
      Object.assign(currentSettings, data);
    } catch (e) {// noop
    }

    this.fallbacks = {
      getSettings() {
        return currentSettings;
      },

      setSettings(value) {
        try {
          localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
        } catch (e) {// noop
        }

        currentSettings = value;
      },

      now() {
        return (0,_time__WEBPACK_IMPORTED_MODULE_0__.now)();
      }

    };

    if (hook) {
      hook.on(_const__WEBPACK_IMPORTED_MODULE_1__.HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
        if (pluginId === this.plugin.id) {
          this.fallbacks.setSettings(value);
        }
      });
    }

    this.proxiedOn = new Proxy({}, {
      get: (_target, prop) => {
        if (this.target) {
          return this.target.on[prop];
        } else {
          return (...args) => {
            this.onQueue.push({
              method: prop,
              args
            });
          };
        }
      }
    });
    this.proxiedTarget = new Proxy({}, {
      get: (_target, prop) => {
        if (this.target) {
          return this.target[prop];
        } else if (prop === 'on') {
          return this.proxiedOn;
        } else if (Object.keys(this.fallbacks).includes(prop)) {
          return (...args) => {
            this.targetQueue.push({
              method: prop,
              args,
              resolve: () => {}
            });
            return this.fallbacks[prop](...args);
          };
        } else {
          return (...args) => {
            return new Promise(resolve => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve
              });
            });
          };
        }
      }
    });
  }

  async setRealTarget(target) {
    this.target = target;

    for (const item of this.onQueue) {
      this.target.on[item.method](...item.args);
    }

    for (const item of this.targetQueue) {
      item.resolve(await this.target[item.method](...item.args));
    }
  }

}

/***/ }),

/***/ "./node_modules/@vue/devtools-api/lib/esm/time.js":
/*!********************************************************!*\
  !*** ./node_modules/@vue/devtools-api/lib/esm/time.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPerformanceSupported": function() { return /* binding */ isPerformanceSupported; },
/* harmony export */   "now": function() { return /* binding */ now; }
/* harmony export */ });
let supported;
let perf;
function isPerformanceSupported() {
  var _a;

  if (supported !== undefined) {
    return supported;
  }

  if (typeof window !== 'undefined' && window.performance) {
    supported = true;
    perf = window.performance;
  } else if (typeof __webpack_require__.g !== 'undefined' && ((_a = __webpack_require__.g.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
    supported = true;
    perf = __webpack_require__.g.perf_hooks.performance;
  } else {
    supported = false;
  }

  return supported;
}
function now() {
  return isPerformanceSupported() ? perf.now() : Date.now();
}

/***/ }),

/***/ "./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EffectScope": function() { return /* binding */ EffectScope; },
/* harmony export */   "ITERATE_KEY": function() { return /* binding */ ITERATE_KEY; },
/* harmony export */   "ReactiveEffect": function() { return /* binding */ ReactiveEffect; },
/* harmony export */   "computed": function() { return /* binding */ computed; },
/* harmony export */   "customRef": function() { return /* binding */ customRef; },
/* harmony export */   "deferredComputed": function() { return /* binding */ deferredComputed; },
/* harmony export */   "effect": function() { return /* binding */ effect; },
/* harmony export */   "effectScope": function() { return /* binding */ effectScope; },
/* harmony export */   "enableTracking": function() { return /* binding */ enableTracking; },
/* harmony export */   "getCurrentScope": function() { return /* binding */ getCurrentScope; },
/* harmony export */   "isProxy": function() { return /* binding */ isProxy; },
/* harmony export */   "isReactive": function() { return /* binding */ isReactive; },
/* harmony export */   "isReadonly": function() { return /* binding */ isReadonly; },
/* harmony export */   "isRef": function() { return /* binding */ isRef; },
/* harmony export */   "isShallow": function() { return /* binding */ isShallow; },
/* harmony export */   "markRaw": function() { return /* binding */ markRaw; },
/* harmony export */   "onScopeDispose": function() { return /* binding */ onScopeDispose; },
/* harmony export */   "pauseTracking": function() { return /* binding */ pauseTracking; },
/* harmony export */   "proxyRefs": function() { return /* binding */ proxyRefs; },
/* harmony export */   "reactive": function() { return /* binding */ reactive; },
/* harmony export */   "readonly": function() { return /* binding */ readonly; },
/* harmony export */   "ref": function() { return /* binding */ ref; },
/* harmony export */   "resetTracking": function() { return /* binding */ resetTracking; },
/* harmony export */   "shallowReactive": function() { return /* binding */ shallowReactive; },
/* harmony export */   "shallowReadonly": function() { return /* binding */ shallowReadonly; },
/* harmony export */   "shallowRef": function() { return /* binding */ shallowRef; },
/* harmony export */   "stop": function() { return /* binding */ stop; },
/* harmony export */   "toRaw": function() { return /* binding */ toRaw; },
/* harmony export */   "toRef": function() { return /* binding */ toRef; },
/* harmony export */   "toRefs": function() { return /* binding */ toRefs; },
/* harmony export */   "track": function() { return /* binding */ track; },
/* harmony export */   "trigger": function() { return /* binding */ trigger; },
/* harmony export */   "triggerRef": function() { return /* binding */ triggerRef; },
/* harmony export */   "unref": function() { return /* binding */ unref; }
/* harmony export */ });
/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");


function warn(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}

let activeEffectScope;

class EffectScope {
  constructor(detached = false) {
    this.active = true;
    this.effects = [];
    this.cleanups = [];

    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope;
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }

  run(fn) {
    if (this.active) {
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = this.parent;
      }
    } else if (true) {
      warn(`cannot run an inactive effect scope.`);
    }
  }

  on() {
    activeEffectScope = this;
  }

  off() {
    activeEffectScope = this.parent;
  }

  stop(fromParent) {
    if (this.active) {
      let i, l;

      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }

      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }

      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      } // nested scope, dereference from parent to avoid memory leaks


      if (this.parent && !fromParent) {
        // optimized O(1) removal
        const last = this.parent.scopes.pop();

        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }

      this.active = false;
    }
  }

}

function effectScope(detached) {
  return new EffectScope(detached);
}

function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}

function getCurrentScope() {
  return activeEffectScope;
}

function onScopeDispose(fn) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  } else if (true) {
    warn(`onScopeDispose() is called when there is no active effect scope` + ` to be associated with.`);
  }
}

const createDep = effects => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};

const wasTracked = dep => (dep.w & trackOpBit) > 0;

const newTracked = dep => (dep.n & trackOpBit) > 0;

const initDepMarkers = ({
  deps
}) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit; // set was tracked
    }
  }
};

const finalizeDepMarkers = effect => {
  const {
    deps
  } = effect;

  if (deps.length) {
    let ptr = 0;

    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];

      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      } // clear bits


      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }

    deps.length = ptr;
  }
};

const targetMap = new WeakMap(); // The number of effects currently being tracked recursively.

let effectTrackDepth = 0;
let trackOpBit = 1;
/**
 * The bitwise track markers support at most 30 levels of recursion.
 * This value is chosen to enable modern JS engines to use a SMI on all platforms.
 * When recursion depth is greater, fall back to using a full cleanup.
 */

const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol( true ? 'iterate' : 0);
const MAP_KEY_ITERATE_KEY = Symbol( true ? 'Map key iterate' : 0);

class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = undefined;
    recordEffectScope(this, scope);
  }

  run() {
    if (!this.active) {
      return this.fn();
    }

    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;

    while (parent) {
      if (parent === this) {
        return;
      }

      parent = parent.parent;
    }

    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;

      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }

      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }

      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = undefined;
    }
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);

      if (this.onStop) {
        this.onStop();
      }

      this.active = false;
    }
  }

}

function cleanupEffect(effect) {
  const {
    deps
  } = effect;

  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }

    deps.length = 0;
  }
}

function effect(fn, options) {
  if (fn.effect) {
    fn = fn.effect.fn;
  }

  const _effect = new ReactiveEffect(fn);

  if (options) {
    (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.extend)(_effect, options);
    if (options.scope) recordEffectScope(_effect, options.scope);
  }

  if (!options || !options.lazy) {
    _effect.run();
  }

  const runner = _effect.run.bind(_effect);

  runner.effect = _effect;
  return runner;
}

function stop(runner) {
  runner.effect.stop();
}

let shouldTrack = true;
const trackStack = [];

function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}

function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}

function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === undefined ? true : last;
}

function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);

    if (!depsMap) {
      targetMap.set(target, depsMap = new Map());
    }

    let dep = depsMap.get(key);

    if (!dep) {
      depsMap.set(key, dep = createDep());
    }

    const eventInfo =  true ? {
      effect: activeEffect,
      target,
      type,
      key
    } : 0;
    trackEffects(dep, eventInfo);
  }
}

function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack = false;

  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit; // set newly tracked

      shouldTrack = !wasTracked(dep);
    }
  } else {
    // Full cleanup mode.
    shouldTrack = !dep.has(activeEffect);
  }

  if (shouldTrack) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);

    if ( true && activeEffect.onTrack) {
      activeEffect.onTrack(Object.assign({
        effect: activeEffect
      }, debuggerEventExtraInfo));
    }
  }
}

function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);

  if (!depsMap) {
    // never been tracked
    return;
  }

  let deps = [];

  if (type === "clear"
  /* CLEAR */
  ) {
    // collection being cleared
    // trigger all effects for target
    deps = [...depsMap.values()];
  } else if (key === 'length' && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target)) {
    depsMap.forEach((dep, key) => {
      if (key === 'length' || key >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    // schedule runs for SET | ADD | DELETE
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    } // also run for iteration key on ADD | DELETE | Map.SET


    switch (type) {
      case "add"
      /* ADD */
      :
        if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target)) {
          deps.push(depsMap.get(ITERATE_KEY));

          if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isIntegerKey)(key)) {
          // new index added to array -> length changes
          deps.push(depsMap.get('length'));
        }

        break;

      case "delete"
      /* DELETE */
      :
        if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target)) {
          deps.push(depsMap.get(ITERATE_KEY));

          if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }

        break;

      case "set"
      /* SET */
      :
        if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }

        break;
    }
  }

  const eventInfo =  true ? {
    target,
    type,
    key,
    newValue,
    oldValue,
    oldTarget
  } : 0;

  if (deps.length === 1) {
    if (deps[0]) {
      if (true) {
        triggerEffects(deps[0], eventInfo);
      } else {}
    }
  } else {
    const effects = [];

    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }

    if (true) {
      triggerEffects(createDep(effects), eventInfo);
    } else {}
  }
}

function triggerEffects(dep, debuggerEventExtraInfo) {
  // spread into array for stabilization
  for (const effect of (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(dep) ? dep : [...dep]) {
    if (effect !== activeEffect || effect.allowRecurse) {
      if ( true && effect.onTrigger) {
        effect.onTrigger((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.extend)({
          effect
        }, debuggerEventExtraInfo));
      }

      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect.run();
      }
    }
  }
}

const isNonTrackableKeys = /*#__PURE__*/(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.makeMap)(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map(key => Symbol[key]).filter(_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isSymbol));
const get = /*#__PURE__*/createGetter();
const shallowGet = /*#__PURE__*/createGetter(false, true);
const readonlyGet = /*#__PURE__*/createGetter(true);
const shallowReadonlyGet = /*#__PURE__*/createGetter(true, true);
const arrayInstrumentations = /*#__PURE__*/createArrayInstrumentations();

function createArrayInstrumentations() {
  const instrumentations = {};
  ['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
    instrumentations[key] = function (...args) {
      const arr = toRaw(this);

      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get"
        /* GET */
        , i + '');
      } // we run the method using the original args first (which may be reactive)


      const res = arr[key](...args);

      if (res === -1 || res === false) {
        // if that didn't work, run it again using raw values.
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ['push', 'pop', 'shift', 'unshift', 'splice'].forEach(key => {
    instrumentations[key] = function (...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    if (key === "__v_isReactive"
    /* IS_REACTIVE */
    ) {
      return !isReadonly;
    } else if (key === "__v_isReadonly"
    /* IS_READONLY */
    ) {
      return isReadonly;
    } else if (key === "__v_isShallow"
    /* IS_SHALLOW */
    ) {
      return shallow;
    } else if (key === "__v_raw"
    /* RAW */
    && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }

    const targetIsArray = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target);

    if (!isReadonly && targetIsArray && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }

    const res = Reflect.get(target, key, receiver);

    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isSymbol)(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }

    if (!isReadonly) {
      track(target, "get"
      /* GET */
      , key);
    }

    if (shallow) {
      return res;
    }

    if (isRef(res)) {
      // ref unwrapping - does not apply for Array + integer key.
      const shouldUnwrap = !targetIsArray || !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isIntegerKey)(key);
      return shouldUnwrap ? res.value : res;
    }

    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(res)) {
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}

const set = /*#__PURE__*/createSetter();
const shallowSet = /*#__PURE__*/createSetter(true);

function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    let oldValue = target[key];

    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }

    if (!shallow && !isReadonly(value)) {
      if (!isShallow(value)) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);
      }

      if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }

    const hadKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isIntegerKey)(key) ? Number(key) < target.length : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(target, key);
    const result = Reflect.set(target, key, value, receiver); // don't trigger if target is something up in the prototype chain of original

    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add"
        /* ADD */
        , key, value);
      } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasChanged)(value, oldValue)) {
        trigger(target, "set"
        /* SET */
        , key, value, oldValue);
      }
    }

    return result;
  };
}

function deleteProperty(target, key) {
  const hadKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(target, key);
  const oldValue = target[key];
  const result = Reflect.deleteProperty(target, key);

  if (result && hadKey) {
    trigger(target, "delete"
    /* DELETE */
    , key, undefined, oldValue);
  }

  return result;
}

function has(target, key) {
  const result = Reflect.has(target, key);

  if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isSymbol)(key) || !builtInSymbols.has(key)) {
    track(target, "has"
    /* HAS */
    , key);
  }

  return result;
}

function ownKeys(target) {
  track(target, "iterate"
  /* ITERATE */
  , (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target) ? 'length' : ITERATE_KEY);
  return Reflect.ownKeys(target);
}

const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,

  set(target, key) {
    if (true) {
      console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
    }

    return true;
  },

  deleteProperty(target, key) {
    if (true) {
      console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
    }

    return true;
  }

};
const shallowReactiveHandlers = /*#__PURE__*/(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.extend)({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
}); // Props handlers are special in the sense that it should not unwrap top-level
// refs (in order to allow refs to be explicitly passed down), but should
// retain the reactivity of the normal readonly object.

const shallowReadonlyHandlers = /*#__PURE__*/(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.extend)({}, readonlyHandlers, {
  get: shallowReadonlyGet
});

const toShallow = value => value;

const getProto = v => Reflect.getPrototypeOf(v);

function get$1(target, key, isReadonly = false, isShallow = false) {
  // #1772: readonly(reactive(Map)) should return readonly + reactive version
  // of the value
  target = target["__v_raw"
  /* RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);

  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "get"
    /* GET */
    , key);
  }

  !isReadonly && track(rawTarget, "get"
  /* GET */
  , rawKey);
  const {
    has
  } = getProto(rawTarget);
  const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;

  if (has.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    // #3602 readonly(reactive(Map))
    // ensure that the nested reactive `Map` can do tracking for itself
    target.get(key);
  }
}

function has$1(key, isReadonly = false) {
  const target = this["__v_raw"
  /* RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);

  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "has"
    /* HAS */
    , key);
  }

  !isReadonly && track(rawTarget, "has"
  /* HAS */
  , rawKey);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}

function size(target, isReadonly = false) {
  target = target["__v_raw"
  /* RAW */
  ];
  !isReadonly && track(toRaw(target), "iterate"
  /* ITERATE */
  , ITERATE_KEY);
  return Reflect.get(target, 'size', target);
}

function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);

  if (!hadKey) {
    target.add(value);
    trigger(target, "add"
    /* ADD */
    , value, value);
  }

  return this;
}

function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const {
    has,
    get
  } = getProto(target);
  let hadKey = has.call(target, key);

  if (!hadKey) {
    key = toRaw(key);
    hadKey = has.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has, key);
  }

  const oldValue = get.call(target, key);
  target.set(key, value);

  if (!hadKey) {
    trigger(target, "add"
    /* ADD */
    , key, value);
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasChanged)(value, oldValue)) {
    trigger(target, "set"
    /* SET */
    , key, value, oldValue);
  }

  return this;
}

function deleteEntry(key) {
  const target = toRaw(this);
  const {
    has,
    get
  } = getProto(target);
  let hadKey = has.call(target, key);

  if (!hadKey) {
    key = toRaw(key);
    hadKey = has.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has, key);
  }

  const oldValue = get ? get.call(target, key) : undefined; // forward the operation before queueing reactions

  const result = target.delete(key);

  if (hadKey) {
    trigger(target, "delete"
    /* DELETE */
    , key, undefined, oldValue);
  }

  return result;
}

function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget =  true ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(target) ? new Map(target) : new Set(target) : 0; // forward the operation before queueing reactions

  const result = target.clear();

  if (hadItems) {
    trigger(target, "clear"
    /* CLEAR */
    , undefined, undefined, oldTarget);
  }

  return result;
}

function createForEach(isReadonly, isShallow) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"
    /* RAW */
    ];
    const rawTarget = toRaw(target);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate"
    /* ITERATE */
    , ITERATE_KEY);
    return target.forEach((value, key) => {
      // important: make sure the callback is
      // 1. invoked with the reactive map as `this` and 3rd arg
      // 2. the value received should be a corresponding reactive/readonly.
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}

function createIterableMethod(method, isReadonly, isShallow) {
  return function (...args) {
    const target = this["__v_raw"
    /* RAW */
    ];
    const rawTarget = toRaw(target);
    const targetIsMap = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(rawTarget);
    const isPair = method === 'entries' || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === 'keys' && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate"
    /* ITERATE */
    , isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY); // return a wrapped iterator which returns observed versions of the
    // values emitted from the real iterator

    return {
      // iterator protocol
      next() {
        const {
          value,
          done
        } = innerIterator.next();
        return done ? {
          value,
          done
        } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },

      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }

    };
  };
}

function createReadonlyMethod(type) {
  return function (...args) {
    if (true) {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      console.warn(`${(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.capitalize)(type)} operation ${key}failed: target is readonly.`, toRaw(this));
    }

    return type === "delete"
    /* DELETE */
    ? false : this;
  };
}

function createInstrumentations() {
  const mutableInstrumentations = {
    get(key) {
      return get$1(this, key);
    },

    get size() {
      return size(this);
    },

    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations = {
    get(key) {
      return get$1(this, key, false, true);
    },

    get size() {
      return size(this);
    },

    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations = {
    get(key) {
      return get$1(this, key, true);
    },

    get size() {
      return size(this, true);
    },

    has(key) {
      return has$1.call(this, key, true);
    },

    add: createReadonlyMethod("add"
    /* ADD */
    ),
    set: createReadonlyMethod("set"
    /* SET */
    ),
    delete: createReadonlyMethod("delete"
    /* DELETE */
    ),
    clear: createReadonlyMethod("clear"
    /* CLEAR */
    ),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations = {
    get(key) {
      return get$1(this, key, true, true);
    },

    get size() {
      return size(this, true);
    },

    has(key) {
      return has$1.call(this, key, true);
    },

    add: createReadonlyMethod("add"
    /* ADD */
    ),
    set: createReadonlyMethod("set"
    /* SET */
    ),
    delete: createReadonlyMethod("delete"
    /* DELETE */
    ),
    clear: createReadonlyMethod("clear"
    /* CLEAR */
    ),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
  iteratorMethods.forEach(method => {
    mutableInstrumentations[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations[method] = createIterableMethod(method, true, false);
    shallowInstrumentations[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations[method] = createIterableMethod(method, true, true);
  });
  return [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations];
}

const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* #__PURE__*/createInstrumentations();

function createInstrumentationGetter(isReadonly, shallow) {
  const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive"
    /* IS_REACTIVE */
    ) {
      return !isReadonly;
    } else if (key === "__v_isReadonly"
    /* IS_READONLY */
    ) {
      return isReadonly;
    } else if (key === "__v_raw"
    /* RAW */
    ) {
      return target;
    }

    return Reflect.get((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}

const mutableCollectionHandlers = {
  get: /*#__PURE__*/createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /*#__PURE__*/createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /*#__PURE__*/createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /*#__PURE__*/createInstrumentationGetter(true, true)
};

function checkIdentityKeys(target, has, key) {
  const rawKey = toRaw(key);

  if (rawKey !== key && has.call(target, rawKey)) {
    const type = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.toRawType)(target);
    console.warn(`Reactive ${type} contains both the raw and reactive ` + `versions of the same object${type === `Map` ? ` as keys` : ``}, ` + `which can lead to inconsistencies. ` + `Avoid differentiating between the raw and reactive versions ` + `of an object and only use the reactive version if possible.`);
  }
}

const reactiveMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();

function targetTypeMap(rawType) {
  switch (rawType) {
    case 'Object':
    case 'Array':
      return 1
      /* COMMON */
      ;

    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return 2
      /* COLLECTION */
      ;

    default:
      return 0
      /* INVALID */
      ;
  }
}

function getTargetType(value) {
  return value["__v_skip"
  /* SKIP */
  ] || !Object.isExtensible(value) ? 0
  /* INVALID */
  : targetTypeMap((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.toRawType)(value));
}

function reactive(target) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (isReadonly(target)) {
    return target;
  }

  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
/**
 * Return a shallowly-reactive copy of the original object, where only the root
 * level properties are reactive. It also does not auto-unwrap refs (even at the
 * root level).
 */


function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
/**
 * Creates a readonly copy of the original object. Note the returned copy is not
 * made reactive, but `readonly` can be called on an already reactive object.
 */


function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
/**
 * Returns a reactive-copy of the original object, where only the root level
 * properties are readonly, and does NOT unwrap refs nor recursively convert
 * returned properties.
 * This is used for creating the props proxy object for stateful components.
 */


function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
}

function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
  if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(target)) {
    if (true) {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }

    return target;
  } // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object


  if (target["__v_raw"
  /* RAW */
  ] && !(isReadonly && target["__v_isReactive"
  /* IS_REACTIVE */
  ])) {
    return target;
  } // target already has corresponding Proxy


  const existingProxy = proxyMap.get(target);

  if (existingProxy) {
    return existingProxy;
  } // only a whitelist of value types can be observed.


  const targetType = getTargetType(target);

  if (targetType === 0
  /* INVALID */
  ) {
    return target;
  }

  const proxy = new Proxy(target, targetType === 2
  /* COLLECTION */
  ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}

function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"
    /* RAW */
    ]);
  }

  return !!(value && value["__v_isReactive"
  /* IS_REACTIVE */
  ]);
}

function isReadonly(value) {
  return !!(value && value["__v_isReadonly"
  /* IS_READONLY */
  ]);
}

function isShallow(value) {
  return !!(value && value["__v_isShallow"
  /* IS_SHALLOW */
  ]);
}

function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

function toRaw(observed) {
  const raw = observed && observed["__v_raw"
  /* RAW */
  ];
  return raw ? toRaw(raw) : observed;
}

function markRaw(value) {
  (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.def)(value, "__v_skip"
  /* SKIP */
  , true);
  return value;
}

const toReactive = value => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(value) ? reactive(value) : value;

const toReadonly = value => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(value) ? readonly(value) : value;

function trackRefValue(ref) {
  if (shouldTrack && activeEffect) {
    ref = toRaw(ref);

    if (true) {
      trackEffects(ref.dep || (ref.dep = createDep()), {
        target: ref,
        type: "get"
        /* GET */
        ,
        key: 'value'
      });
    } else {}
  }
}

function triggerRefValue(ref, newVal) {
  ref = toRaw(ref);

  if (ref.dep) {
    if (true) {
      triggerEffects(ref.dep, {
        target: ref,
        type: "set"
        /* SET */
        ,
        key: 'value',
        newValue: newVal
      });
    } else {}
  }
}

function isRef(r) {
  return !!(r && r.__v_isRef === true);
}

function ref(value) {
  return createRef(value, false);
}

function shallowRef(value) {
  return createRef(value, true);
}

function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }

  return new RefImpl(rawValue, shallow);
}

class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = undefined;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal);

    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasChanged)(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = this.__v_isShallow ? newVal : toReactive(newVal);
      triggerRefValue(this, newVal);
    }
  }

}

function triggerRef(ref) {
  triggerRefValue(ref,  true ? ref.value : 0);
}

function unref(ref) {
  return isRef(ref) ? ref.value : ref;
}

const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];

    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};

function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}

class CustomRefImpl {
  constructor(factory) {
    this.dep = undefined;
    this.__v_isRef = true;
    const {
      get,
      set
    } = factory(() => trackRefValue(this), () => triggerRefValue(this));
    this._get = get;
    this._set = set;
  }

  get value() {
    return this._get();
  }

  set value(newVal) {
    this._set(newVal);
  }

}

function customRef(factory) {
  return new CustomRefImpl(factory);
}

function toRefs(object) {
  if ( true && !isProxy(object)) {
    console.warn(`toRefs() expects a reactive object but received a plain one.`);
  }

  const ret = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(object) ? new Array(object.length) : {};

  for (const key in object) {
    ret[key] = toRef(object, key);
  }

  return ret;
}

class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }

  get value() {
    const val = this._object[this._key];
    return val === undefined ? this._defaultValue : val;
  }

  set value(newVal) {
    this._object[this._key] = newVal;
  }

}

function toRef(object, key, defaultValue) {
  const val = object[key];
  return isRef(val) ? val : new ObjectRefImpl(object, key, defaultValue);
}

class ComputedRefImpl {
  constructor(getter, _setter, isReadonly, isSSR) {
    this._setter = _setter;
    this.dep = undefined;
    this.__v_isRef = true;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"
    /* IS_READONLY */
    ] = isReadonly;
  }

  get value() {
    // the computed ref may get wrapped by other proxies e.g. readonly() #3376
    const self = toRaw(this);
    trackRefValue(self);

    if (self._dirty || !self._cacheable) {
      self._dirty = false;
      self._value = self.effect.run();
    }

    return self._value;
  }

  set value(newValue) {
    this._setter(newValue);
  }

}

function computed(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isFunction)(getterOrOptions);

  if (onlyGetter) {
    getter = getterOrOptions;
    setter =  true ? () => {
      console.warn('Write operation failed: computed value is readonly');
    } : 0;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);

  if ( true && debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack;
    cRef.effect.onTrigger = debugOptions.onTrigger;
  }

  return cRef;
}

var _a;

const tick = Promise.resolve();
const queue = [];
let queued = false;

const scheduler = fn => {
  queue.push(fn);

  if (!queued) {
    queued = true;
    tick.then(flush);
  }
};

const flush = () => {
  for (let i = 0; i < queue.length; i++) {
    queue[i]();
  }

  queue.length = 0;
  queued = false;
};

class DeferredComputedRefImpl {
  constructor(getter) {
    this.dep = undefined;
    this._dirty = true;
    this.__v_isRef = true;
    this[_a] = true;
    let compareTarget;
    let hasCompareTarget = false;
    let scheduled = false;
    this.effect = new ReactiveEffect(getter, computedTrigger => {
      if (this.dep) {
        if (computedTrigger) {
          compareTarget = this._value;
          hasCompareTarget = true;
        } else if (!scheduled) {
          const valueToCompare = hasCompareTarget ? compareTarget : this._value;
          scheduled = true;
          hasCompareTarget = false;
          scheduler(() => {
            if (this.effect.active && this._get() !== valueToCompare) {
              triggerRefValue(this);
            }

            scheduled = false;
          });
        } // chained upstream computeds are notified synchronously to ensure
        // value invalidation in case of sync access; normal effects are
        // deferred to be triggered in scheduler.


        for (const e of this.dep) {
          if (e.computed instanceof DeferredComputedRefImpl) {
            e.scheduler(true
            /* computedTrigger */
            );
          }
        }
      }

      this._dirty = true;
    });
    this.effect.computed = this;
  }

  _get() {
    if (this._dirty) {
      this._dirty = false;
      return this._value = this.effect.run();
    }

    return this._value;
  }

  get value() {
    trackRefValue(this); // the computed ref may get wrapped by other proxies e.g. readonly() #3376

    return toRaw(this)._get();
  }

}

_a = "__v_isReadonly"
/* IS_READONLY */
;

function deferredComputed(getter) {
  return new DeferredComputedRefImpl(getter);
}



/***/ }),

/***/ "./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseTransition": function() { return /* binding */ BaseTransition; },
/* harmony export */   "Comment": function() { return /* binding */ Comment; },
/* harmony export */   "EffectScope": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.EffectScope; },
/* harmony export */   "Fragment": function() { return /* binding */ Fragment; },
/* harmony export */   "KeepAlive": function() { return /* binding */ KeepAlive; },
/* harmony export */   "ReactiveEffect": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.ReactiveEffect; },
/* harmony export */   "Static": function() { return /* binding */ Static; },
/* harmony export */   "Suspense": function() { return /* binding */ Suspense; },
/* harmony export */   "Teleport": function() { return /* binding */ Teleport; },
/* harmony export */   "Text": function() { return /* binding */ Text; },
/* harmony export */   "callWithAsyncErrorHandling": function() { return /* binding */ callWithAsyncErrorHandling; },
/* harmony export */   "callWithErrorHandling": function() { return /* binding */ callWithErrorHandling; },
/* harmony export */   "camelize": function() { return /* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_2__.camelize; },
/* harmony export */   "capitalize": function() { return /* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_2__.capitalize; },
/* harmony export */   "cloneVNode": function() { return /* binding */ cloneVNode; },
/* harmony export */   "compatUtils": function() { return /* binding */ compatUtils; },
/* harmony export */   "computed": function() { return /* binding */ computed; },
/* harmony export */   "createBlock": function() { return /* binding */ createBlock; },
/* harmony export */   "createCommentVNode": function() { return /* binding */ createCommentVNode; },
/* harmony export */   "createElementBlock": function() { return /* binding */ createElementBlock; },
/* harmony export */   "createElementVNode": function() { return /* binding */ createBaseVNode; },
/* harmony export */   "createHydrationRenderer": function() { return /* binding */ createHydrationRenderer; },
/* harmony export */   "createPropsRestProxy": function() { return /* binding */ createPropsRestProxy; },
/* harmony export */   "createRenderer": function() { return /* binding */ createRenderer; },
/* harmony export */   "createSlots": function() { return /* binding */ createSlots; },
/* harmony export */   "createStaticVNode": function() { return /* binding */ createStaticVNode; },
/* harmony export */   "createTextVNode": function() { return /* binding */ createTextVNode; },
/* harmony export */   "createVNode": function() { return /* binding */ createVNode; },
/* harmony export */   "customRef": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.customRef; },
/* harmony export */   "defineAsyncComponent": function() { return /* binding */ defineAsyncComponent; },
/* harmony export */   "defineComponent": function() { return /* binding */ defineComponent; },
/* harmony export */   "defineEmits": function() { return /* binding */ defineEmits; },
/* harmony export */   "defineExpose": function() { return /* binding */ defineExpose; },
/* harmony export */   "defineProps": function() { return /* binding */ defineProps; },
/* harmony export */   "devtools": function() { return /* binding */ devtools; },
/* harmony export */   "effect": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.effect; },
/* harmony export */   "effectScope": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.effectScope; },
/* harmony export */   "getCurrentInstance": function() { return /* binding */ getCurrentInstance; },
/* harmony export */   "getCurrentScope": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.getCurrentScope; },
/* harmony export */   "getTransitionRawChildren": function() { return /* binding */ getTransitionRawChildren; },
/* harmony export */   "guardReactiveProps": function() { return /* binding */ guardReactiveProps; },
/* harmony export */   "h": function() { return /* binding */ h; },
/* harmony export */   "handleError": function() { return /* binding */ handleError; },
/* harmony export */   "initCustomFormatter": function() { return /* binding */ initCustomFormatter; },
/* harmony export */   "inject": function() { return /* binding */ inject; },
/* harmony export */   "isMemoSame": function() { return /* binding */ isMemoSame; },
/* harmony export */   "isProxy": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isProxy; },
/* harmony export */   "isReactive": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isReactive; },
/* harmony export */   "isReadonly": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isReadonly; },
/* harmony export */   "isRef": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isRef; },
/* harmony export */   "isRuntimeOnly": function() { return /* binding */ isRuntimeOnly; },
/* harmony export */   "isShallow": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isShallow; },
/* harmony export */   "isVNode": function() { return /* binding */ isVNode; },
/* harmony export */   "markRaw": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.markRaw; },
/* harmony export */   "mergeDefaults": function() { return /* binding */ mergeDefaults; },
/* harmony export */   "mergeProps": function() { return /* binding */ mergeProps; },
/* harmony export */   "nextTick": function() { return /* binding */ nextTick; },
/* harmony export */   "normalizeClass": function() { return /* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_2__.normalizeClass; },
/* harmony export */   "normalizeProps": function() { return /* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_2__.normalizeProps; },
/* harmony export */   "normalizeStyle": function() { return /* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_2__.normalizeStyle; },
/* harmony export */   "onActivated": function() { return /* binding */ onActivated; },
/* harmony export */   "onBeforeMount": function() { return /* binding */ onBeforeMount; },
/* harmony export */   "onBeforeUnmount": function() { return /* binding */ onBeforeUnmount; },
/* harmony export */   "onBeforeUpdate": function() { return /* binding */ onBeforeUpdate; },
/* harmony export */   "onDeactivated": function() { return /* binding */ onDeactivated; },
/* harmony export */   "onErrorCaptured": function() { return /* binding */ onErrorCaptured; },
/* harmony export */   "onMounted": function() { return /* binding */ onMounted; },
/* harmony export */   "onRenderTracked": function() { return /* binding */ onRenderTracked; },
/* harmony export */   "onRenderTriggered": function() { return /* binding */ onRenderTriggered; },
/* harmony export */   "onScopeDispose": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.onScopeDispose; },
/* harmony export */   "onServerPrefetch": function() { return /* binding */ onServerPrefetch; },
/* harmony export */   "onUnmounted": function() { return /* binding */ onUnmounted; },
/* harmony export */   "onUpdated": function() { return /* binding */ onUpdated; },
/* harmony export */   "openBlock": function() { return /* binding */ openBlock; },
/* harmony export */   "popScopeId": function() { return /* binding */ popScopeId; },
/* harmony export */   "provide": function() { return /* binding */ provide; },
/* harmony export */   "proxyRefs": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.proxyRefs; },
/* harmony export */   "pushScopeId": function() { return /* binding */ pushScopeId; },
/* harmony export */   "queuePostFlushCb": function() { return /* binding */ queuePostFlushCb; },
/* harmony export */   "reactive": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.reactive; },
/* harmony export */   "readonly": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.readonly; },
/* harmony export */   "ref": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.ref; },
/* harmony export */   "registerRuntimeCompiler": function() { return /* binding */ registerRuntimeCompiler; },
/* harmony export */   "renderList": function() { return /* binding */ renderList; },
/* harmony export */   "renderSlot": function() { return /* binding */ renderSlot; },
/* harmony export */   "resolveComponent": function() { return /* binding */ resolveComponent; },
/* harmony export */   "resolveDirective": function() { return /* binding */ resolveDirective; },
/* harmony export */   "resolveDynamicComponent": function() { return /* binding */ resolveDynamicComponent; },
/* harmony export */   "resolveFilter": function() { return /* binding */ resolveFilter; },
/* harmony export */   "resolveTransitionHooks": function() { return /* binding */ resolveTransitionHooks; },
/* harmony export */   "setBlockTracking": function() { return /* binding */ setBlockTracking; },
/* harmony export */   "setDevtoolsHook": function() { return /* binding */ setDevtoolsHook; },
/* harmony export */   "setTransitionHooks": function() { return /* binding */ setTransitionHooks; },
/* harmony export */   "shallowReactive": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.shallowReactive; },
/* harmony export */   "shallowReadonly": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.shallowReadonly; },
/* harmony export */   "shallowRef": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.shallowRef; },
/* harmony export */   "ssrContextKey": function() { return /* binding */ ssrContextKey; },
/* harmony export */   "ssrUtils": function() { return /* binding */ ssrUtils; },
/* harmony export */   "stop": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.stop; },
/* harmony export */   "toDisplayString": function() { return /* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_2__.toDisplayString; },
/* harmony export */   "toHandlerKey": function() { return /* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_2__.toHandlerKey; },
/* harmony export */   "toHandlers": function() { return /* binding */ toHandlers; },
/* harmony export */   "toRaw": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRaw; },
/* harmony export */   "toRef": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRef; },
/* harmony export */   "toRefs": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRefs; },
/* harmony export */   "transformVNodeArgs": function() { return /* binding */ transformVNodeArgs; },
/* harmony export */   "triggerRef": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.triggerRef; },
/* harmony export */   "unref": function() { return /* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.unref; },
/* harmony export */   "useAttrs": function() { return /* binding */ useAttrs; },
/* harmony export */   "useSSRContext": function() { return /* binding */ useSSRContext; },
/* harmony export */   "useSlots": function() { return /* binding */ useSlots; },
/* harmony export */   "useTransitionState": function() { return /* binding */ useTransitionState; },
/* harmony export */   "version": function() { return /* binding */ version; },
/* harmony export */   "warn": function() { return /* binding */ warn; },
/* harmony export */   "watch": function() { return /* binding */ watch; },
/* harmony export */   "watchEffect": function() { return /* binding */ watchEffect; },
/* harmony export */   "watchPostEffect": function() { return /* binding */ watchPostEffect; },
/* harmony export */   "watchSyncEffect": function() { return /* binding */ watchSyncEffect; },
/* harmony export */   "withAsyncContext": function() { return /* binding */ withAsyncContext; },
/* harmony export */   "withCtx": function() { return /* binding */ withCtx; },
/* harmony export */   "withDefaults": function() { return /* binding */ withDefaults; },
/* harmony export */   "withDirectives": function() { return /* binding */ withDirectives; },
/* harmony export */   "withMemo": function() { return /* binding */ withMemo; },
/* harmony export */   "withScopeId": function() { return /* binding */ withScopeId; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.error.cause.js */ "./node_modules/core-js/modules/es.error.cause.js");
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vue/reactivity */ "./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js");
/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");





const stack = [];

function pushWarningContext(vnode) {
  stack.push(vnode);
}

function popWarningContext() {
  stack.pop();
}

function warn(msg, ...args) {
  // avoid props formatting or warn handler tracking deps that might be mutated
  // during patch, leading to infinite recursion.
  (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.pauseTracking)();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();

  if (appWarnHandler) {
    callWithErrorHandling(appWarnHandler, instance, 11
    /* APP_WARN_HANDLER */
    , [msg + args.join(''), instance && instance.proxy, trace.map(({
      vnode
    }) => `at <${formatComponentName(instance, vnode.type)}>`).join('\n'), trace]);
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    /* istanbul ignore if */

    if (trace.length && // avoid spamming console during tests
    !false) {
      warnArgs.push(`\n`, ...formatTrace(trace));
    }

    console.warn(...warnArgs);
  }

  (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.resetTracking)();
}

function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];

  if (!currentVNode) {
    return [];
  } // we can't just use the stack because it will be incomplete during updates
  // that did not start from the root. Re-construct the parent chain using
  // instance parent pointers.


  const normalizedStack = [];

  while (currentVNode) {
    const last = normalizedStack[0];

    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }

    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }

  return normalizedStack;
}
/* istanbul ignore next */


function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...(i === 0 ? [] : [`\n`]), ...formatTraceEntry(entry));
  });
  return logs;
}

function formatTraceEntry({
  vnode,
  recurseCount
}) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
/* istanbul ignore next */


function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach(key => {
    res.push(...formatProp(key, props[key]));
  });

  if (keys.length > 3) {
    res.push(` ...`);
  }

  return res;
}
/* istanbul ignore next */


function formatProp(key, value, raw) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === 'number' || typeof value === 'boolean' || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isRef)(value)) {
    value = formatProp(key, (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRaw)(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRaw)(value);
    return raw ? value : [`${key}=`, value];
  }
}

const ErrorTypeStrings = {
  ["sp"
  /* SERVER_PREFETCH */
  ]: 'serverPrefetch hook',
  ["bc"
  /* BEFORE_CREATE */
  ]: 'beforeCreate hook',
  ["c"
  /* CREATED */
  ]: 'created hook',
  ["bm"
  /* BEFORE_MOUNT */
  ]: 'beforeMount hook',
  ["m"
  /* MOUNTED */
  ]: 'mounted hook',
  ["bu"
  /* BEFORE_UPDATE */
  ]: 'beforeUpdate hook',
  ["u"
  /* UPDATED */
  ]: 'updated',
  ["bum"
  /* BEFORE_UNMOUNT */
  ]: 'beforeUnmount hook',
  ["um"
  /* UNMOUNTED */
  ]: 'unmounted hook',
  ["a"
  /* ACTIVATED */
  ]: 'activated hook',
  ["da"
  /* DEACTIVATED */
  ]: 'deactivated hook',
  ["ec"
  /* ERROR_CAPTURED */
  ]: 'errorCaptured hook',
  ["rtc"
  /* RENDER_TRACKED */
  ]: 'renderTracked hook',
  ["rtg"
  /* RENDER_TRIGGERED */
  ]: 'renderTriggered hook',
  [0
  /* SETUP_FUNCTION */
  ]: 'setup function',
  [1
  /* RENDER_FUNCTION */
  ]: 'render function',
  [2
  /* WATCH_GETTER */
  ]: 'watcher getter',
  [3
  /* WATCH_CALLBACK */
  ]: 'watcher callback',
  [4
  /* WATCH_CLEANUP */
  ]: 'watcher cleanup function',
  [5
  /* NATIVE_EVENT_HANDLER */
  ]: 'native event handler',
  [6
  /* COMPONENT_EVENT_HANDLER */
  ]: 'component event handler',
  [7
  /* VNODE_HOOK */
  ]: 'vnode hook',
  [8
  /* DIRECTIVE_HOOK */
  ]: 'directive hook',
  [9
  /* TRANSITION_HOOK */
  ]: 'transition hook',
  [10
  /* APP_ERROR_HANDLER */
  ]: 'app errorHandler',
  [11
  /* APP_WARN_HANDLER */
  ]: 'app warnHandler',
  [12
  /* FUNCTION_REF */
  ]: 'ref function',
  [13
  /* ASYNC_COMPONENT_LOADER */
  ]: 'async component loader',
  [14
  /* SCHEDULER */
  ]: 'scheduler flush. This is likely a Vue internals bug. ' + 'Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core'
};

function callWithErrorHandling(fn, instance, type, args) {
  let res;

  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }

  return res;
}

function callWithAsyncErrorHandling(fn, instance, type, args) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);

    if (res && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isPromise)(res)) {
      res.catch(err => {
        handleError(err, instance, type);
      });
    }

    return res;
  }

  const values = [];

  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }

  return values;
}

function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;

  if (instance) {
    let cur = instance.parent; // the exposed instance is the render proxy to keep it consistent with 2.x

    const exposedInstance = instance.proxy; // in production the hook receives only the error code

    const errorInfo =  true ? ErrorTypeStrings[type] : 0;

    while (cur) {
      const errorCapturedHooks = cur.ec;

      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }

      cur = cur.parent;
    } // app-level handling


    const appErrorHandler = instance.appContext.config.errorHandler;

    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10
      /* APP_ERROR_HANDLER */
      , [err, exposedInstance, errorInfo]);
      return;
    }
  }

  logError(err, type, contextVNode, throwInDev);
}

function logError(err, type, contextVNode, throwInDev = true) {
  if (true) {
    const info = ErrorTypeStrings[type];

    if (contextVNode) {
      pushWarningContext(contextVNode);
    }

    warn(`Unhandled error${info ? ` during execution of ${info}` : ``}`);

    if (contextVNode) {
      popWarningContext();
    } // crash in dev by default so it's more noticeable


    if (throwInDev) {
      throw err;
    } else {
      console.error(err);
    }
  } else {}
}

let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPreFlushCbs = [];
let activePreFlushCbs = null;
let preFlushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;
let currentPreFlushParentJob = null;
const RECURSION_LIMIT = 100;

function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
} // #2768
// Use binary-search to find a suitable position in the queue,
// so that the queue maintains the increasing order of job's id,
// which can prevent the job from being skipped and also can avoid repeated patching.


function findInsertionIndex(id) {
  // the start index should be `flushIndex + 1`
  let start = flushIndex + 1;
  let end = queue.length;

  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }

  return start;
}

function queueJob(job) {
  // the dedupe search uses the startIndex argument of Array.includes()
  // by default the search index includes the current job that is being run
  // so it cannot recursively trigger itself again.
  // if the job is a watch() callback, the search will start with a +1 index to
  // allow it recursively trigger itself - it is the user's responsibility to
  // ensure it doesn't end up in an infinite loop.
  if ((!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }

    queueFlush();
  }
}

function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}

function invalidateJob(job) {
  const i = queue.indexOf(job);

  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}

function queueCb(cb, activeQueue, pendingQueue, index) {
  if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(cb)) {
    if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index + 1 : index)) {
      pendingQueue.push(cb);
    }
  } else {
    // if cb is an array, it is a component lifecycle hook which can only be
    // triggered by a job, which is already deduped in the main queue, so
    // we can skip duplicate check here to improve perf
    pendingQueue.push(...cb);
  }

  queueFlush();
}

function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
}

function queuePostFlushCb(cb) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}

function flushPreFlushCbs(seen, parentJob = null) {
  if (pendingPreFlushCbs.length) {
    currentPreFlushParentJob = parentJob;
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    pendingPreFlushCbs.length = 0;

    if (true) {
      seen = seen || new Map();
    }

    for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
      if ( true && checkRecursiveUpdates(seen, activePreFlushCbs[preFlushIndex])) {
        continue;
      }

      activePreFlushCbs[preFlushIndex]();
    }

    activePreFlushCbs = null;
    preFlushIndex = 0;
    currentPreFlushParentJob = null; // recursively flush until it drains

    flushPreFlushCbs(seen, parentJob);
  }
}

function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0; // #1947 already has active queue, nested flushPostFlushCbs call

    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }

    activePostFlushCbs = deduped;

    if (true) {
      seen = seen || new Map();
    }

    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));

    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if ( true && checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
        continue;
      }

      activePostFlushCbs[postFlushIndex]();
    }

    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}

const getId = job => job.id == null ? Infinity : job.id;

function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;

  if (true) {
    seen = seen || new Map();
  }

  flushPreFlushCbs(seen); // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child so its render effect will have smaller
  //    priority number)
  // 2. If a component is unmounted during a parent component's update,
  //    its update can be skipped.

  queue.sort((a, b) => getId(a) - getId(b)); // conditional usage of checkRecursiveUpdate must be determined out of
  // try ... catch block since Rollup by default de-optimizes treeshaking
  // inside try-catch. This can leave all warning code unshaked. Although
  // they would get eventually shaken by a minifier like terser, some minifiers
  // would fail to do that (e.g. https://github.com/evanw/esbuild/issues/1610)

  const check =  true ? job => checkRecursiveUpdates(seen, job) : 0;

  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];

      if (job && job.active !== false) {
        if ( true && check(job)) {
          continue;
        } // console.log(`running:`, job.id)


        callWithErrorHandling(job, null, 14
        /* SCHEDULER */
        );
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null; // some postFlushCb queued jobs!
    // keep flushing until it drains.

    if (queue.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}

function checkRecursiveUpdates(seen, fn) {
  if (!seen.has(fn)) {
    seen.set(fn, 1);
  } else {
    const count = seen.get(fn);

    if (count > RECURSION_LIMIT) {
      const instance = fn.ownerInstance;
      const componentName = instance && getComponentName(instance.type);
      warn(`Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. ` + `This means you have a reactive effect that is mutating its own ` + `dependencies and thus recursively triggering itself. Possible sources ` + `include component template, render function, updated hook or ` + `watcher source function.`);
      return true;
    } else {
      seen.set(fn, count + 1);
    }
  }
}
/* eslint-disable no-restricted-globals */


let isHmrUpdating = false;
const hmrDirtyComponents = new Set(); // Expose the HMR runtime on the global object
// This makes it entirely tree-shakable without polluting the exports and makes
// it easier to be used in toolings like vue-loader
// Note: for a component to be eligible for HMR it also needs the __hmrId option
// to be set so that its instances can be registered / removed.

if (true) {
  (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.getGlobalThis)().__VUE_HMR_RUNTIME__ = {
    createRecord: tryWrap(createRecord),
    rerender: tryWrap(rerender),
    reload: tryWrap(reload)
  };
}

const map = new Map();

function registerHMR(instance) {
  const id = instance.type.__hmrId;
  let record = map.get(id);

  if (!record) {
    createRecord(id, instance.type);
    record = map.get(id);
  }

  record.instances.add(instance);
}

function unregisterHMR(instance) {
  map.get(instance.type.__hmrId).instances.delete(instance);
}

function createRecord(id, initialDef) {
  if (map.has(id)) {
    return false;
  }

  map.set(id, {
    initialDef: normalizeClassComponent(initialDef),
    instances: new Set()
  });
  return true;
}

function normalizeClassComponent(component) {
  return isClassComponent(component) ? component.__vccOpts : component;
}

function rerender(id, newRender) {
  const record = map.get(id);

  if (!record) {
    return;
  } // update initial record (for not-yet-rendered component)


  record.initialDef.render = newRender;
  [...record.instances].forEach(instance => {
    if (newRender) {
      instance.render = newRender;
      normalizeClassComponent(instance.type).render = newRender;
    }

    instance.renderCache = []; // this flag forces child components with slot content to update

    isHmrUpdating = true;
    instance.update();
    isHmrUpdating = false;
  });
}

function reload(id, newComp) {
  const record = map.get(id);
  if (!record) return;
  newComp = normalizeClassComponent(newComp); // update initial def (for not-yet-rendered components)

  updateComponentDef(record.initialDef, newComp); // create a snapshot which avoids the set being mutated during updates

  const instances = [...record.instances];

  for (const instance of instances) {
    const oldComp = normalizeClassComponent(instance.type);

    if (!hmrDirtyComponents.has(oldComp)) {
      // 1. Update existing comp definition to match new one
      if (oldComp !== record.initialDef) {
        updateComponentDef(oldComp, newComp);
      } // 2. mark definition dirty. This forces the renderer to replace the
      // component on patch.


      hmrDirtyComponents.add(oldComp);
    } // 3. invalidate options resolution cache


    instance.appContext.optionsCache.delete(instance.type); // 4. actually update

    if (instance.ceReload) {
      // custom element
      hmrDirtyComponents.add(oldComp);
      instance.ceReload(newComp.styles);
      hmrDirtyComponents.delete(oldComp);
    } else if (instance.parent) {
      // 4. Force the parent instance to re-render. This will cause all updated
      // components to be unmounted and re-mounted. Queue the update so that we
      // don't end up forcing the same parent to re-render multiple times.
      queueJob(instance.parent.update); // instance is the inner component of an async custom element
      // invoke to reset styles

      if (instance.parent.type.__asyncLoader && instance.parent.ceReload) {
        instance.parent.ceReload(newComp.styles);
      }
    } else if (instance.appContext.reload) {
      // root instance mounted via createApp() has a reload method
      instance.appContext.reload();
    } else if (typeof window !== 'undefined') {
      // root instance inside tree created via raw render(). Force reload.
      window.location.reload();
    } else {
      console.warn('[HMR] Root or manually mounted instance modified. Full reload required.');
    }
  } // 5. make sure to cleanup dirty hmr components after update


  queuePostFlushCb(() => {
    for (const instance of instances) {
      hmrDirtyComponents.delete(normalizeClassComponent(instance.type));
    }
  });
}

function updateComponentDef(oldComp, newComp) {
  (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)(oldComp, newComp);

  for (const key in oldComp) {
    if (key !== '__file' && !(key in newComp)) {
      delete oldComp[key];
    }
  }
}

function tryWrap(fn) {
  return (id, arg) => {
    try {
      return fn(id, arg);
    } catch (e) {
      console.error(e);
      console.warn(`[HMR] Something went wrong during Vue component hot-reload. ` + `Full reload required.`);
    }
  };
}

let devtools;
let buffer = [];
let devtoolsNotInstalled = false;

function emit(event, ...args) {
  if (devtools) {
    devtools.emit(event, ...args);
  } else if (!devtoolsNotInstalled) {
    buffer.push({
      event,
      args
    });
  }
}

function setDevtoolsHook(hook, target) {
  var _a, _b;

  devtools = hook;

  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({
      event,
      args
    }) => devtools.emit(event, ...args));
    buffer = [];
  } else if ( // handle late devtools injection - only do this if we are in an actual
  // browser environment to avoid the timer handle stalling test runner exit
  // (#4815)
  // eslint-disable-next-line no-restricted-globals
  typeof window !== 'undefined' && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  !((_b = (_a = window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent) === null || _b === void 0 ? void 0 : _b.includes('jsdom'))) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push(newHook => {
      setDevtoolsHook(newHook, target);
    }); // clear buffer after 3s - the user probably doesn't have devtools installed
    // at all, and keeping the buffer will cause memory leaks (#4738)

    setTimeout(() => {
      if (!devtools) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        devtoolsNotInstalled = true;
        buffer = [];
      }
    }, 3000);
  } else {
    // non-browser env, assume not installed
    devtoolsNotInstalled = true;
    buffer = [];
  }
}

function devtoolsInitApp(app, version) {
  emit("app:init"
  /* APP_INIT */
  , app, version, {
    Fragment,
    Text,
    Comment,
    Static
  });
}

function devtoolsUnmountApp(app) {
  emit("app:unmount"
  /* APP_UNMOUNT */
  , app);
}

const devtoolsComponentAdded = /*#__PURE__*/createDevtoolsComponentHook("component:added"
/* COMPONENT_ADDED */
);
const devtoolsComponentUpdated = /*#__PURE__*/createDevtoolsComponentHook("component:updated"
/* COMPONENT_UPDATED */
);
const devtoolsComponentRemoved = /*#__PURE__*/createDevtoolsComponentHook("component:removed"
/* COMPONENT_REMOVED */
);

function createDevtoolsComponentHook(hook) {
  return component => {
    emit(hook, component.appContext.app, component.uid, component.parent ? component.parent.uid : undefined, component);
  };
}

const devtoolsPerfStart = /*#__PURE__*/createDevtoolsPerformanceHook("perf:start"
/* PERFORMANCE_START */
);
const devtoolsPerfEnd = /*#__PURE__*/createDevtoolsPerformanceHook("perf:end"
/* PERFORMANCE_END */
);

function createDevtoolsPerformanceHook(hook) {
  return (component, type, time) => {
    emit(hook, component.appContext.app, component.uid, component, type, time);
  };
}

function devtoolsComponentEmit(component, event, params) {
  emit("component:emit"
  /* COMPONENT_EMIT */
  , component.appContext.app, component, event, params);
}

function emit$1(instance, event, ...rawArgs) {
  const props = instance.vnode.props || _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ;

  if (true) {
    const {
      emitsOptions,
      propsOptions: [propsOptions]
    } = instance;

    if (emitsOptions) {
      if (!(event in emitsOptions) && !false) {
        if (!propsOptions || !((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.toHandlerKey)(event) in propsOptions)) {
          warn(`Component emitted event "${event}" but it is neither declared in ` + `the emits option nor as an "${(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.toHandlerKey)(event)}" prop.`);
        }
      } else {
        const validator = emitsOptions[event];

        if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(validator)) {
          const isValid = validator(...rawArgs);

          if (!isValid) {
            warn(`Invalid event arguments: event validation failed for event "${event}".`);
          }
        }
      }
    }
  }

  let args = rawArgs;
  const isModelListener = event.startsWith('update:'); // for v-model update:xxx events, apply modifiers on args

  const modelArg = isModelListener && event.slice(7);

  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === 'modelValue' ? 'model' : modelArg}Modifiers`;
    const {
      number,
      trim
    } = props[modifiersKey] || _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ;

    if (trim) {
      args = rawArgs.map(a => a.trim());
    } else if (number) {
      args = rawArgs.map(_vue_shared__WEBPACK_IMPORTED_MODULE_2__.toNumber);
    }
  }

  if (true) {
    devtoolsComponentEmit(instance, event, args);
  }

  if (true) {
    const lowerCaseEvent = event.toLowerCase();

    if (lowerCaseEvent !== event && props[(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.toHandlerKey)(lowerCaseEvent)]) {
      warn(`Event "${lowerCaseEvent}" is emitted in component ` + `${formatComponentName(instance, instance.type)} but the handler is registered for "${event}". ` + `Note that HTML attributes are case-insensitive and you cannot use ` + `v-on to listen to camelCase events when using in-DOM templates. ` + `You should probably use "${(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hyphenate)(event)}" instead of "${event}".`);
    }
  }

  let handlerName;
  let handler = props[handlerName = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.toHandlerKey)(event)] || // also try camelCase event handler (#2249)
  props[handlerName = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.toHandlerKey)((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.camelize)(event))]; // for v-model update:xxx events, also trigger kebab-case equivalent
  // for props passed via kebab-case

  if (!handler && isModelListener) {
    handler = props[handlerName = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.toHandlerKey)((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hyphenate)(event))];
  }

  if (handler) {
    callWithAsyncErrorHandling(handler, instance, 6
    /* COMPONENT_EVENT_HANDLER */
    , args);
  }

  const onceHandler = props[handlerName + `Once`];

  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }

    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance, 6
    /* COMPONENT_EVENT_HANDLER */
    , args);
  }
}

function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);

  if (cached !== undefined) {
    return cached;
  }

  const raw = comp.emits;
  let normalized = {}; // apply mixin/extends props

  let hasExtends = false;

  if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(comp)) {
    const extendEmits = raw => {
      const normalizedFromExtend = normalizeEmitsOptions(raw, appContext, true);

      if (normalizedFromExtend) {
        hasExtends = true;
        (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)(normalized, normalizedFromExtend);
      }
    };

    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }

    if (comp.extends) {
      extendEmits(comp.extends);
    }

    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }

  if (!raw && !hasExtends) {
    cache.set(comp, null);
    return null;
  }

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(raw)) {
    raw.forEach(key => normalized[key] = null);
  } else {
    (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)(normalized, raw);
  }

  cache.set(comp, normalized);
  return normalized;
} // Check if an incoming prop key is a declared emit event listener.
// e.g. With `emits: { click: null }`, props named `onClick` and `onclick` are
// both considered matched listeners.


function isEmitListener(options, key) {
  if (!options || !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isOn)(key)) {
    return false;
  }

  key = key.slice(2).replace(/Once$/, '');
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(options, key[0].toLowerCase() + key.slice(1)) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(options, (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hyphenate)(key)) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(options, key);
}
/**
 * mark the current rendering instance for asset resolution (e.g.
 * resolveComponent, resolveDirective) during render
 */


let currentRenderingInstance = null;
let currentScopeId = null;
/**
 * Note: rendering calls maybe nested. The function returns the parent rendering
 * instance if present, which should be restored after the render is done:
 *
 * ```js
 * const prev = setCurrentRenderingInstance(i)
 * // ...render
 * setCurrentRenderingInstance(prev)
 * ```
 */

function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
/**
 * Set scope id when creating hoisted vnodes.
 * @private compiler helper
 */


function pushScopeId(id) {
  currentScopeId = id;
}
/**
 * Technically we no longer need this after 3.0.8 but we need to keep the same
 * API for backwards compat w/ code generated by compilers.
 * @private
 */


function popScopeId() {
  currentScopeId = null;
}
/**
 * Only for backwards compat
 * @private
 */


const withScopeId = _id => withCtx;
/**
 * Wrap a slot function to memoize current rendering instance
 * @private compiler helper
 */


function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot // false only
) {
  if (!ctx) return fn; // already normalized

  if (fn._n) {
    return fn;
  }

  const renderFnWithContext = (...args) => {
    // If a user calls a compiled slot inside a template expression (#1745), it
    // can mess up block tracking, so by default we disable block tracking and
    // force bail out when invoking a compiled slot (indicated by the ._d flag).
    // This isn't necessary if rendering a compiled `<slot>`, so we flip the
    // ._d flag off when invoking the wrapped fn inside `renderSlot`.
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }

    const prevInstance = setCurrentRenderingInstance(ctx);
    const res = fn(...args);
    setCurrentRenderingInstance(prevInstance);

    if (renderFnWithContext._d) {
      setBlockTracking(1);
    }

    if (true) {
      devtoolsComponentUpdated(ctx);
    }

    return res;
  }; // mark normalized to avoid duplicated wrapping


  renderFnWithContext._n = true; // mark this as compiled by default
  // this is used in vnode.ts -> normalizeChildren() to set the slot
  // rendering flag.

  renderFnWithContext._c = true; // disable block tracking by default

  renderFnWithContext._d = true;
  return renderFnWithContext;
}
/**
 * dev only flag to track whether $attrs was used during render.
 * If $attrs was used during render then the warning for failed attrs
 * fallthrough can be suppressed.
 */


let accessedAttrs = false;

function markAttrsAccessed() {
  accessedAttrs = true;
}

function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);

  if (true) {
    accessedAttrs = false;
  }

  try {
    if (vnode.shapeFlag & 4
    /* STATEFUL_COMPONENT */
    ) {
      // withProxy is a proxy with a different `has` trap only for
      // runtime-compiled render functions using `with` block.
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
      fallthroughAttrs = attrs;
    } else {
      // functional
      const render = Component; // in dev, mark attrs accessed if optional props (attrs === props)

      if ( true && attrs === props) {
        markAttrsAccessed();
      }

      result = normalizeVNode(render.length > 1 ? render(props,  true ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },

        slots,
        emit
      } : 0) : render(props, null
      /* we know it doesn't need it */
      ));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1
    /* RENDER_FUNCTION */
    );
    result = createVNode(Comment);
  } // attr merging
  // in dev mode, comments are preserved, and it's possible for a template
  // to have comments along side the root element which makes it a fragment


  let root = result;
  let setRoot = undefined;

  if ( true && result.patchFlag > 0 && result.patchFlag & 2048
  /* DEV_ROOT_FRAGMENT */
  ) {
    [root, setRoot] = getChildRoot(result);
  }

  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const {
      shapeFlag
    } = root;

    if (keys.length) {
      if (shapeFlag & (1
      /* ELEMENT */
      | 6
      /* COMPONENT */
      )) {
        if (propsOptions && keys.some(_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isModelListener)) {
          // If a v-model listener (onUpdate:xxx) has a corresponding declared
          // prop, it indicates this component expects to handle v-model and
          // it should not fallthrough.
          // related: #1543, #1643, #1989
          fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
        }

        root = cloneVNode(root, fallthroughAttrs);
      } else if ( true && !accessedAttrs && root.type !== Comment) {
        const allAttrs = Object.keys(attrs);
        const eventAttrs = [];
        const extraAttrs = [];

        for (let i = 0, l = allAttrs.length; i < l; i++) {
          const key = allAttrs[i];

          if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isOn)(key)) {
            // ignore v-model handlers when they fail to fallthrough
            if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isModelListener)(key)) {
              // remove `on`, lowercase first letter to reflect event casing
              // accurately
              eventAttrs.push(key[2].toLowerCase() + key.slice(3));
            }
          } else {
            extraAttrs.push(key);
          }
        }

        if (extraAttrs.length) {
          warn(`Extraneous non-props attributes (` + `${extraAttrs.join(', ')}) ` + `were passed to component but could not be automatically inherited ` + `because component renders fragment or text root nodes.`);
        }

        if (eventAttrs.length) {
          warn(`Extraneous non-emits event listeners (` + `${eventAttrs.join(', ')}) ` + `were passed to component but could not be automatically inherited ` + `because component renders fragment or text root nodes. ` + `If the listener is intended to be a component custom event listener only, ` + `declare it using the "emits" option.`);
        }
      }
    }
  } // inherit directives


  if (vnode.dirs) {
    if ( true && !isElementRoot(root)) {
      warn(`Runtime directive used on component with non-element root node. ` + `The directives will not function as intended.`);
    }

    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  } // inherit transition data


  if (vnode.transition) {
    if ( true && !isElementRoot(root)) {
      warn(`Component inside <Transition> renders non-element root node ` + `that cannot be animated.`);
    }

    root.transition = vnode.transition;
  }

  if ( true && setRoot) {
    setRoot(root);
  } else {
    result = root;
  }

  setCurrentRenderingInstance(prev);
  return result;
}
/**
 * dev only
 * In dev mode, template root level comments are rendered, which turns the
 * template into a fragment root, but we need to locate the single element
 * root for attrs and scope id processing.
 */


const getChildRoot = vnode => {
  const rawChildren = vnode.children;
  const dynamicChildren = vnode.dynamicChildren;
  const childRoot = filterSingleRoot(rawChildren);

  if (!childRoot) {
    return [vnode, undefined];
  }

  const index = rawChildren.indexOf(childRoot);
  const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1;

  const setRoot = updatedRoot => {
    rawChildren[index] = updatedRoot;

    if (dynamicChildren) {
      if (dynamicIndex > -1) {
        dynamicChildren[dynamicIndex] = updatedRoot;
      } else if (updatedRoot.patchFlag > 0) {
        vnode.dynamicChildren = [...dynamicChildren, updatedRoot];
      }
    }
  };

  return [normalizeVNode(childRoot), setRoot];
};

function filterSingleRoot(children) {
  let singleRoot;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (isVNode(child)) {
      // ignore user comment
      if (child.type !== Comment || child.children === 'v-if') {
        if (singleRoot) {
          // has more than 1 non-comment child, return now
          return;
        } else {
          singleRoot = child;
        }
      }
    } else {
      return;
    }
  }

  return singleRoot;
}

const getFunctionalFallthrough = attrs => {
  let res;

  for (const key in attrs) {
    if (key === 'class' || key === 'style' || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isOn)(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }

  return res;
};

const filterModelListeners = (attrs, props) => {
  const res = {};

  for (const key in attrs) {
    if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isModelListener)(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }

  return res;
};

const isElementRoot = vnode => {
  return vnode.shapeFlag & (6
  /* COMPONENT */
  | 1
  /* ELEMENT */
  ) || vnode.type === Comment // potential v-if branch switch
  ;
};

function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const {
    props: prevProps,
    children: prevChildren,
    component
  } = prevVNode;
  const {
    props: nextProps,
    children: nextChildren,
    patchFlag
  } = nextVNode;
  const emits = component.emitsOptions; // Parent component's render function was hot-updated. Since this may have
  // caused the child component's slots content to have changed, we need to
  // force the child to update as well.

  if ( true && (prevChildren || nextChildren) && isHmrUpdating) {
    return true;
  } // force child update for runtime directive or transition on component vnode.


  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }

  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024
    /* DYNAMIC_SLOTS */
    ) {
      // slot content that references values that might have changed,
      // e.g. in a v-for
      return true;
    }

    if (patchFlag & 16
    /* FULL_PROPS */
    ) {
      if (!prevProps) {
        return !!nextProps;
      } // presence of this flag indicates props are always non-null


      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8
    /* PROPS */
    ) {
      const dynamicProps = nextVNode.dynamicProps;

      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];

        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    // this path is only taken by manually written render functions
    // so presence of any children leads to a forced update
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }

    if (prevProps === nextProps) {
      return false;
    }

    if (!prevProps) {
      return !!nextProps;
    }

    if (!nextProps) {
      return true;
    }

    return hasPropsChanged(prevProps, nextProps, emits);
  }

  return false;
}

function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);

  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }

  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];

    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }

  return false;
}

function updateHOCHostEl({
  vnode,
  parent
}, el // HostNode
) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}

const isSuspense = type => type.__isSuspense; // Suspense exposes a component-like API, and is treated like a component
// in the compiler, but internally it's a special built-in type that hooks
// directly into the renderer.


const SuspenseImpl = {
  name: 'Suspense',
  // In order to make Suspense tree-shakable, we need to avoid importing it
  // directly in the renderer. The renderer checks for the __isSuspense flag
  // on a vnode's type and calls the `process` method, passing in renderer
  // internals.
  __isSuspense: true,

  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, // platform-specific impl passed from renderer
  rendererInternals) {
    if (n1 == null) {
      mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals);
    } else {
      patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, rendererInternals);
    }
  },

  hydrate: hydrateSuspense,
  create: createSuspenseBoundary,
  normalize: normalizeSuspenseChildren
}; // Force-casted public typing for h and TSX props inference

const Suspense = SuspenseImpl;

function triggerEvent(vnode, name) {
  const eventListener = vnode.props && vnode.props[name];

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(eventListener)) {
    eventListener();
  }
}

function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
  const {
    p: patch,
    o: {
      createElement
    }
  } = rendererInternals;
  const hiddenContainer = createElement('div');
  const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals); // start mounting the content subtree in an off-dom container

  patch(null, suspense.pendingBranch = vnode.ssContent, hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds); // now check if we have encountered any async deps

  if (suspense.deps > 0) {
    // has async
    // invoke @fallback event
    triggerEvent(vnode, 'onPending');
    triggerEvent(vnode, 'onFallback'); // mount the fallback tree

    patch(null, vnode.ssFallback, container, anchor, parentComponent, null, // fallback tree will not have suspense context
    isSVG, slotScopeIds);
    setActiveBranch(suspense, vnode.ssFallback);
  } else {
    // Suspense has no async deps. Just resolve.
    suspense.resolve();
  }
}

function patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, {
  p: patch,
  um: unmount,
  o: {
    createElement
  }
}) {
  const suspense = n2.suspense = n1.suspense;
  suspense.vnode = n2;
  n2.el = n1.el;
  const newBranch = n2.ssContent;
  const newFallback = n2.ssFallback;
  const {
    activeBranch,
    pendingBranch,
    isInFallback,
    isHydrating
  } = suspense;

  if (pendingBranch) {
    suspense.pendingBranch = newBranch;

    if (isSameVNodeType(newBranch, pendingBranch)) {
      // same root type but content may have changed.
      patch(pendingBranch, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);

      if (suspense.deps <= 0) {
        suspense.resolve();
      } else if (isInFallback) {
        patch(activeBranch, newFallback, container, anchor, parentComponent, null, // fallback tree will not have suspense context
        isSVG, slotScopeIds, optimized);
        setActiveBranch(suspense, newFallback);
      }
    } else {
      // toggled before pending tree is resolved
      suspense.pendingId++;

      if (isHydrating) {
        // if toggled before hydration is finished, the current DOM tree is
        // no longer valid. set it as the active branch so it will be unmounted
        // when resolved
        suspense.isHydrating = false;
        suspense.activeBranch = pendingBranch;
      } else {
        unmount(pendingBranch, parentComponent, suspense);
      } // increment pending ID. this is used to invalidate async callbacks
      // reset suspense state


      suspense.deps = 0; // discard effects from pending branch

      suspense.effects.length = 0; // discard previous container

      suspense.hiddenContainer = createElement('div');

      if (isInFallback) {
        // already in fallback state
        patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);

        if (suspense.deps <= 0) {
          suspense.resolve();
        } else {
          patch(activeBranch, newFallback, container, anchor, parentComponent, null, // fallback tree will not have suspense context
          isSVG, slotScopeIds, optimized);
          setActiveBranch(suspense, newFallback);
        }
      } else if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
        // toggled "back" to current active branch
        patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, isSVG, slotScopeIds, optimized); // force resolve

        suspense.resolve(true);
      } else {
        // switched to a 3rd branch
        patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);

        if (suspense.deps <= 0) {
          suspense.resolve();
        }
      }
    }
  } else {
    if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
      // root did not change, just normal patch
      patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, isSVG, slotScopeIds, optimized);
      setActiveBranch(suspense, newBranch);
    } else {
      // root node toggled
      // invoke @pending event
      triggerEvent(n2, 'onPending'); // mount pending branch in off-dom container

      suspense.pendingBranch = newBranch;
      suspense.pendingId++;
      patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);

      if (suspense.deps <= 0) {
        // incoming branch has no async deps, resolve now.
        suspense.resolve();
      } else {
        const {
          timeout,
          pendingId
        } = suspense;

        if (timeout > 0) {
          setTimeout(() => {
            if (suspense.pendingId === pendingId) {
              suspense.fallback(newFallback);
            }
          }, timeout);
        } else if (timeout === 0) {
          suspense.fallback(newFallback);
        }
      }
    }
  }
}

let hasWarned = false;

function createSuspenseBoundary(vnode, parent, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
  /* istanbul ignore if */
  if ( true && !hasWarned) {
    hasWarned = true; // @ts-ignore `console.info` cannot be null error

    console[console.info ? 'info' : 'log'](`<Suspense> is an experimental feature and its API will likely change.`);
  }

  const {
    p: patch,
    m: move,
    um: unmount,
    n: next,
    o: {
      parentNode,
      remove
    }
  } = rendererInternals;
  const timeout = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.toNumber)(vnode.props && vnode.props.timeout);
  const suspense = {
    vnode,
    parent,
    parentComponent,
    isSVG,
    container,
    hiddenContainer,
    anchor,
    deps: 0,
    pendingId: 0,
    timeout: typeof timeout === 'number' ? timeout : -1,
    activeBranch: null,
    pendingBranch: null,
    isInFallback: true,
    isHydrating,
    isUnmounted: false,
    effects: [],

    resolve(resume = false) {
      if (true) {
        if (!resume && !suspense.pendingBranch) {
          throw new Error(`suspense.resolve() is called without a pending branch.`);
        }

        if (suspense.isUnmounted) {
          throw new Error(`suspense.resolve() is called on an already unmounted suspense boundary.`);
        }
      }

      const {
        vnode,
        activeBranch,
        pendingBranch,
        pendingId,
        effects,
        parentComponent,
        container
      } = suspense;

      if (suspense.isHydrating) {
        suspense.isHydrating = false;
      } else if (!resume) {
        const delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === 'out-in';

        if (delayEnter) {
          activeBranch.transition.afterLeave = () => {
            if (pendingId === suspense.pendingId) {
              move(pendingBranch, container, anchor, 0
              /* ENTER */
              );
            }
          };
        } // this is initial anchor on mount


        let {
          anchor
        } = suspense; // unmount current active tree

        if (activeBranch) {
          // if the fallback tree was mounted, it may have been moved
          // as part of a parent suspense. get the latest anchor for insertion
          anchor = next(activeBranch);
          unmount(activeBranch, parentComponent, suspense, true);
        }

        if (!delayEnter) {
          // move content from off-dom container to actual container
          move(pendingBranch, container, anchor, 0
          /* ENTER */
          );
        }
      }

      setActiveBranch(suspense, pendingBranch);
      suspense.pendingBranch = null;
      suspense.isInFallback = false; // flush buffered effects
      // check if there is a pending parent suspense

      let parent = suspense.parent;
      let hasUnresolvedAncestor = false;

      while (parent) {
        if (parent.pendingBranch) {
          // found a pending parent suspense, merge buffered post jobs
          // into that parent
          parent.effects.push(...effects);
          hasUnresolvedAncestor = true;
          break;
        }

        parent = parent.parent;
      } // no pending parent suspense, flush all jobs


      if (!hasUnresolvedAncestor) {
        queuePostFlushCb(effects);
      }

      suspense.effects = []; // invoke @resolve event

      triggerEvent(vnode, 'onResolve');
    },

    fallback(fallbackVNode) {
      if (!suspense.pendingBranch) {
        return;
      }

      const {
        vnode,
        activeBranch,
        parentComponent,
        container,
        isSVG
      } = suspense; // invoke @fallback event

      triggerEvent(vnode, 'onFallback');
      const anchor = next(activeBranch);

      const mountFallback = () => {
        if (!suspense.isInFallback) {
          return;
        } // mount the fallback tree


        patch(null, fallbackVNode, container, anchor, parentComponent, null, // fallback tree will not have suspense context
        isSVG, slotScopeIds, optimized);
        setActiveBranch(suspense, fallbackVNode);
      };

      const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === 'out-in';

      if (delayEnter) {
        activeBranch.transition.afterLeave = mountFallback;
      }

      suspense.isInFallback = true; // unmount current active branch

      unmount(activeBranch, parentComponent, null, // no suspense so unmount hooks fire now
      true // shouldRemove
      );

      if (!delayEnter) {
        mountFallback();
      }
    },

    move(container, anchor, type) {
      suspense.activeBranch && move(suspense.activeBranch, container, anchor, type);
      suspense.container = container;
    },

    next() {
      return suspense.activeBranch && next(suspense.activeBranch);
    },

    registerDep(instance, setupRenderEffect) {
      const isInPendingSuspense = !!suspense.pendingBranch;

      if (isInPendingSuspense) {
        suspense.deps++;
      }

      const hydratedEl = instance.vnode.el;
      instance.asyncDep.catch(err => {
        handleError(err, instance, 0
        /* SETUP_FUNCTION */
        );
      }).then(asyncSetupResult => {
        // retry when the setup() promise resolves.
        // component may have been unmounted before resolve.
        if (instance.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance.suspenseId) {
          return;
        } // retry from this component


        instance.asyncResolved = true;
        const {
          vnode
        } = instance;

        if (true) {
          pushWarningContext(vnode);
        }

        handleSetupResult(instance, asyncSetupResult, false);

        if (hydratedEl) {
          // vnode may have been replaced if an update happened before the
          // async dep is resolved.
          vnode.el = hydratedEl;
        }

        const placeholder = !hydratedEl && instance.subTree.el;
        setupRenderEffect(instance, vnode, // component may have been moved before resolve.
        // if this is not a hydration, instance.subTree will be the comment
        // placeholder.
        parentNode(hydratedEl || instance.subTree.el), // anchor will not be used if this is hydration, so only need to
        // consider the comment placeholder case.
        hydratedEl ? null : next(instance.subTree), suspense, isSVG, optimized);

        if (placeholder) {
          remove(placeholder);
        }

        updateHOCHostEl(instance, vnode.el);

        if (true) {
          popWarningContext();
        } // only decrease deps count if suspense is not already resolved


        if (isInPendingSuspense && --suspense.deps === 0) {
          suspense.resolve();
        }
      });
    },

    unmount(parentSuspense, doRemove) {
      suspense.isUnmounted = true;

      if (suspense.activeBranch) {
        unmount(suspense.activeBranch, parentComponent, parentSuspense, doRemove);
      }

      if (suspense.pendingBranch) {
        unmount(suspense.pendingBranch, parentComponent, parentSuspense, doRemove);
      }
    }

  };
  return suspense;
}

function hydrateSuspense(node, vnode, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals, hydrateNode) {
  /* eslint-disable no-restricted-globals */
  const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, node.parentNode, document.createElement('div'), null, isSVG, slotScopeIds, optimized, rendererInternals, true
  /* hydrating */
  ); // there are two possible scenarios for server-rendered suspense:
  // - success: ssr content should be fully resolved
  // - failure: ssr content should be the fallback branch.
  // however, on the client we don't really know if it has failed or not
  // attempt to hydrate the DOM assuming it has succeeded, but we still
  // need to construct a suspense boundary first

  const result = hydrateNode(node, suspense.pendingBranch = vnode.ssContent, parentComponent, suspense, slotScopeIds, optimized);

  if (suspense.deps === 0) {
    suspense.resolve();
  }

  return result;
  /* eslint-enable no-restricted-globals */
}

function normalizeSuspenseChildren(vnode) {
  const {
    shapeFlag,
    children
  } = vnode;
  const isSlotChildren = shapeFlag & 32
  /* SLOTS_CHILDREN */
  ;
  vnode.ssContent = normalizeSuspenseSlot(isSlotChildren ? children.default : children);
  vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment);
}

function normalizeSuspenseSlot(s) {
  let block;

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(s)) {
    const trackBlock = isBlockTreeEnabled && s._c;

    if (trackBlock) {
      // disableTracking: false
      // allow block tracking for compiled slots
      // (see ./componentRenderContext.ts)
      s._d = false;
      openBlock();
    }

    s = s();

    if (trackBlock) {
      s._d = true;
      block = currentBlock;
      closeBlock();
    }
  }

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(s)) {
    const singleChild = filterSingleRoot(s);

    if ( true && !singleChild) {
      warn(`<Suspense> slots expect a single root node.`);
    }

    s = singleChild;
  }

  s = normalizeVNode(s);

  if (block && !s.dynamicChildren) {
    s.dynamicChildren = block.filter(c => c !== s);
  }

  return s;
}

function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}

function setActiveBranch(suspense, branch) {
  suspense.activeBranch = branch;
  const {
    vnode,
    parentComponent
  } = suspense;
  const el = vnode.el = branch.el; // in case suspense is the root node of a component,
  // recursively update the HOC el

  if (parentComponent && parentComponent.subTree === vnode) {
    parentComponent.vnode.el = el;
    updateHOCHostEl(parentComponent, el);
  }
}

function provide(key, value) {
  if (!currentInstance) {
    if (true) {
      warn(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides; // by default an instance inherits its parent's provides object
    // but when it needs to provide values of its own, it creates its
    // own provides object using parent provides object as prototype.
    // this way in `inject` we can simply look up injections from direct
    // parent and let the prototype chain do the work.

    const parentProvides = currentInstance.parent && currentInstance.parent.provides;

    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    } // TS doesn't allow symbol as index type


    provides[key] = value;
  }
}

function inject(key, defaultValue, treatDefaultAsFactory = false) {
  // fallback to `currentRenderingInstance` so that this can be called in
  // a functional component
  const instance = currentInstance || currentRenderingInstance;

  if (instance) {
    // #2400
    // to support `app.use` plugins,
    // fallback to appContext's `provides` if the instance is at root
    const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;

    if (provides && key in provides) {
      // TS doesn't allow symbol as index type
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
    } else if (true) {
      warn(`injection "${String(key)}" not found.`);
    }
  } else if (true) {
    warn(`inject() can only be used inside setup() or functional components.`);
  }
} // Simple effect.


function watchEffect(effect, options) {
  return doWatch(effect, null, options);
}

function watchPostEffect(effect, options) {
  return doWatch(effect, null,  true ? Object.assign(options || {}, {
    flush: 'post'
  }) : 0);
}

function watchSyncEffect(effect, options) {
  return doWatch(effect, null,  true ? Object.assign(options || {}, {
    flush: 'sync'
  }) : 0);
} // initial value for watchers to trigger on undefined initial values


const INITIAL_WATCHER_VALUE = {}; // implementation

function watch(source, cb, options) {
  if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(cb)) {
    warn(`\`watch(fn, options?)\` signature has been moved to a separate API. ` + `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` + `supports \`watch(source, cb, options?) signature.`);
  }

  return doWatch(source, cb, options);
}

function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  onTrack,
  onTrigger
} = _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ) {
  if ( true && !cb) {
    if (immediate !== undefined) {
      warn(`watch() "immediate" option is only respected when using the ` + `watch(source, callback, options?) signature.`);
    }

    if (deep !== undefined) {
      warn(`watch() "deep" option is only respected when using the ` + `watch(source, callback, options?) signature.`);
    }
  }

  const warnInvalidSource = s => {
    warn(`Invalid watch source: `, s, `A watch source can only be a getter/effect function, a ref, ` + `a reactive object, or an array of these types.`);
  };

  const instance = currentInstance;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;

  if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isRef)(source)) {
    getter = () => source.value;

    forceTrigger = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isShallow)(source);
  } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isReactive)(source)) {
    getter = () => source;

    deep = true;
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(source)) {
    isMultiSource = true;
    forceTrigger = source.some(_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isReactive);

    getter = () => source.map(s => {
      if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isRef)(s)) {
        return s.value;
      } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isReactive)(s)) {
        return traverse(s);
      } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(s)) {
        return callWithErrorHandling(s, instance, 2
        /* WATCH_GETTER */
        );
      } else {
         true && warnInvalidSource(s);
      }
    });
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(source)) {
    if (cb) {
      // getter with cb
      getter = () => callWithErrorHandling(source, instance, 2
      /* WATCH_GETTER */
      );
    } else {
      // no cb -> simple effect
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }

        if (cleanup) {
          cleanup();
        }

        return callWithAsyncErrorHandling(source, instance, 3
        /* WATCH_CALLBACK */
        , [onCleanup]);
      };
    }
  } else {
    getter = _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP;
     true && warnInvalidSource(source);
  }

  if (cb && deep) {
    const baseGetter = getter;

    getter = () => traverse(baseGetter());
  }

  let cleanup;

  let onCleanup = fn => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4
      /* WATCH_CLEANUP */
      );
    };
  }; // in SSR there is no need to setup an actual effect, and it should be noop
  // unless it's eager


  if (isInSSRComponentSetup) {
    // we will also not call the invalidate callback (+ runner is not set up)
    onCleanup = _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP;

    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3
      /* WATCH_CALLBACK */
      , [getter(), isMultiSource ? [] : undefined, onCleanup]);
    }

    return _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP;
  }

  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;

  const job = () => {
    if (!effect.active) {
      return;
    }

    if (cb) {
      // watch(source, cb)
      const newValue = effect.run();

      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasChanged)(v, oldValue[i])) : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasChanged)(newValue, oldValue)) || false) {
        // cleanup before running cb again
        if (cleanup) {
          cleanup();
        }

        callWithAsyncErrorHandling(cb, instance, 3
        /* WATCH_CALLBACK */
        , [newValue, // pass undefined as the old value when it's changed for the first time
        oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue, onCleanup]);
        oldValue = newValue;
      }
    } else {
      // watchEffect
      effect.run();
    }
  }; // important: mark the job as a watcher callback so that scheduler knows
  // it is allowed to self-trigger (#1727)


  job.allowRecurse = !!cb;
  let scheduler;

  if (flush === 'sync') {
    scheduler = job; // the scheduler function gets called directly
  } else if (flush === 'post') {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    // default: 'pre'
    scheduler = () => {
      if (!instance || instance.isMounted) {
        queuePreFlushCb(job);
      } else {
        // with 'pre' option, the first call must happen before
        // the component is mounted so it is called synchronously.
        job();
      }
    };
  }

  const effect = new _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.ReactiveEffect(getter, scheduler);

  if (true) {
    effect.onTrack = onTrack;
    effect.onTrigger = onTrigger;
  } // initial run


  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === 'post') {
    queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
  } else {
    effect.run();
  }

  return () => {
    effect.stop();

    if (instance && instance.scope) {
      (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.remove)(instance.scope.effects, effect);
    }
  };
} // this.$watch


function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(source) ? source.includes('.') ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }

  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);

  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }

  return res;
}

function createPathGetter(ctx, path) {
  const segments = path.split('.');
  return () => {
    let cur = ctx;

    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }

    return cur;
  };
}

function traverse(value, seen) {
  if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(value) || value["__v_skip"
  /* SKIP */
  ]) {
    return value;
  }

  seen = seen || new Set();

  if (seen.has(value)) {
    return value;
  }

  seen.add(value);

  if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isRef)(value)) {
    traverse(value.value, seen);
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isSet)(value) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isMap)(value)) {
    value.forEach(v => {
      traverse(v, seen);
    });
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isPlainObject)(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }

  return value;
}

function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}

const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    // enter
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    // leave
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    // appear
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },

  setup(props, {
    slots
  }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);

      if (!children || !children.length) {
        return;
      } // warn multiple elements


      if ( true && children.length > 1) {
        warn('<transition> can only be used on a single element or component. Use ' + '<transition-group> for lists.');
      } // there's no need to track reactivity for these props so use the raw
      // props for a bit better perf


      const rawProps = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRaw)(props);
      const {
        mode
      } = rawProps; // check mode

      if ( true && mode && mode !== 'in-out' && mode !== 'out-in' && mode !== 'default') {
        warn(`invalid <transition> mode: ${mode}`);
      } // at this point children has a guaranteed length of 1.


      const child = children[0];

      if (state.isLeaving) {
        return emptyPlaceholder(child);
      } // in the case of <transition><keep-alive/></transition>, we need to
      // compare the type of the kept-alive children.


      const innerChild = getKeepAliveChild(child);

      if (!innerChild) {
        return emptyPlaceholder(child);
      }

      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const {
        getTransitionKey
      } = innerChild.type;

      if (getTransitionKey) {
        const key = getTransitionKey();

        if (prevTransitionKey === undefined) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      } // handle mode


      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance); // update old tree's hooks in case of dynamic transition

        setTransitionHooks(oldInnerChild, leavingHooks); // switching between different views

        if (mode === 'out-in') {
          state.isLeaving = true; // return placeholder node and queue update when leave finishes

          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            instance.update();
          };

          return emptyPlaceholder(child);
        } else if (mode === 'in-out' && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild; // early removal callback

            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = undefined;
              delete enterHooks.delayedLeave;
            };

            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }

      return child;
    };
  }

}; // export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files

const BaseTransition = BaseTransitionImpl;

function getLeavingNodesForType(state, vnode) {
  const {
    leavingVNodes
  } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);

  if (!leavingVNodesCache) {
    leavingVNodesCache = Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }

  return leavingVNodesCache;
} // The transition hooks are attached to the vnode as vnode.transition
// and will be called at appropriate timing in the renderer.


function resolveTransitionHooks(vnode, props, state, instance) {
  const {
    appear,
    mode,
    persisted = false,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
    onBeforeAppear,
    onAppear,
    onAfterAppear,
    onAppearCancelled
  } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);

  const callHook = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance, 9
    /* TRANSITION_HOOK */
    , args);
  };

  const hooks = {
    mode,
    persisted,

    beforeEnter(el) {
      let hook = onBeforeEnter;

      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      } // for same element (v-show)


      if (el._leaveCb) {
        el._leaveCb(true
        /* cancelled */
        );
      } // for toggled element with same key (v-if)


      const leavingVNode = leavingVNodesCache[key];

      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        // force early removal (not cancelled)
        leavingVNode.el._leaveCb();
      }

      callHook(hook, [el]);
    },

    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;

      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }

      let called = false;

      const done = el._enterCb = cancelled => {
        if (called) return;
        called = true;

        if (cancelled) {
          callHook(cancelHook, [el]);
        } else {
          callHook(afterHook, [el]);
        }

        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }

        el._enterCb = undefined;
      };

      if (hook) {
        hook(el, done);

        if (hook.length <= 1) {
          done();
        }
      } else {
        done();
      }
    },

    leave(el, remove) {
      const key = String(vnode.key);

      if (el._enterCb) {
        el._enterCb(true
        /* cancelled */
        );
      }

      if (state.isUnmounting) {
        return remove();
      }

      callHook(onBeforeLeave, [el]);
      let called = false;

      const done = el._leaveCb = cancelled => {
        if (called) return;
        called = true;
        remove();

        if (cancelled) {
          callHook(onLeaveCancelled, [el]);
        } else {
          callHook(onAfterLeave, [el]);
        }

        el._leaveCb = undefined;

        if (leavingVNodesCache[key] === vnode) {
          delete leavingVNodesCache[key];
        }
      };

      leavingVNodesCache[key] = vnode;

      if (onLeave) {
        onLeave(el, done);

        if (onLeave.length <= 1) {
          done();
        }
      } else {
        done();
      }
    },

    clone(vnode) {
      return resolveTransitionHooks(vnode, props, state, instance);
    }

  };
  return hooks;
} // the placeholder really only handles one special case: KeepAlive
// in the case of a KeepAlive in a leave phase we need to return a KeepAlive
// placeholder with empty content to avoid the KeepAlive instance from being
// unmounted.


function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}

function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : undefined : vnode;
}

function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6
  /* COMPONENT */
  && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128
  /* SUSPENSE */
  ) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}

function getTransitionRawChildren(children, keepComment = false) {
  let ret = [];
  let keyedFragmentCount = 0;

  for (let i = 0; i < children.length; i++) {
    const child = children[i]; // handle fragment children case, e.g. v-for

    if (child.type === Fragment) {
      if (child.patchFlag & 128
      /* KEYED_FRAGMENT */
      ) keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment));
    } // comment placeholders should be skipped, e.g. v-if
    else if (keepComment || child.type !== Comment) {
      ret.push(child);
    }
  } // #1126 if a transition children list contains multiple sub fragments, these
  // fragments will be merged into a flat children array. Since each v-for
  // fragment may contain different static bindings inside, we need to de-op
  // these children to force full diffs to ensure correct behavior.


  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2
      /* BAIL */
      ;
    }
  }

  return ret;
} // implementation, close to no-op


function defineComponent(options) {
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(options) ? {
    setup: options,
    name: options.name
  } : options;
}

const isAsyncWrapper = i => !!i.type.__asyncLoader;

function defineAsyncComponent(source) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(source)) {
    source = {
      loader: source
    };
  }

  const {
    loader,
    loadingComponent,
    errorComponent,
    delay = 200,
    timeout,
    // undefined = never times out
    suspensible = true,
    onError: userOnError
  } = source;
  let pendingRequest = null;
  let resolvedComp;
  let retries = 0;

  const retry = () => {
    retries++;
    pendingRequest = null;
    return load();
  };

  const load = () => {
    let thisRequest;
    return pendingRequest || (thisRequest = pendingRequest = loader().catch(err => {
      err = err instanceof Error ? err : new Error(String(err));

      if (userOnError) {
        return new Promise((resolve, reject) => {
          const userRetry = () => resolve(retry());

          const userFail = () => reject(err);

          userOnError(err, userRetry, userFail, retries + 1);
        });
      } else {
        throw err;
      }
    }).then(comp => {
      if (thisRequest !== pendingRequest && pendingRequest) {
        return pendingRequest;
      }

      if ( true && !comp) {
        warn(`Async component loader resolved to undefined. ` + `If you are using retry(), make sure to return its return value.`);
      } // interop module default


      if (comp && (comp.__esModule || comp[Symbol.toStringTag] === 'Module')) {
        comp = comp.default;
      }

      if ( true && comp && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(comp) && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(comp)) {
        throw new Error(`Invalid async component load result: ${comp}`);
      }

      resolvedComp = comp;
      return comp;
    }));
  };

  return defineComponent({
    name: 'AsyncComponentWrapper',
    __asyncLoader: load,

    get __asyncResolved() {
      return resolvedComp;
    },

    setup() {
      const instance = currentInstance; // already resolved

      if (resolvedComp) {
        return () => createInnerComp(resolvedComp, instance);
      }

      const onError = err => {
        pendingRequest = null;
        handleError(err, instance, 13
        /* ASYNC_COMPONENT_LOADER */
        , !errorComponent
        /* do not throw in dev if user provided error component */
        );
      }; // suspense-controlled or SSR.


      if (suspensible && instance.suspense || isInSSRComponentSetup) {
        return load().then(comp => {
          return () => createInnerComp(comp, instance);
        }).catch(err => {
          onError(err);
          return () => errorComponent ? createVNode(errorComponent, {
            error: err
          }) : null;
        });
      }

      const loaded = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.ref)(false);
      const error = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.ref)();
      const delayed = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.ref)(!!delay);

      if (delay) {
        setTimeout(() => {
          delayed.value = false;
        }, delay);
      }

      if (timeout != null) {
        setTimeout(() => {
          if (!loaded.value && !error.value) {
            const err = new Error(`Async component timed out after ${timeout}ms.`);
            onError(err);
            error.value = err;
          }
        }, timeout);
      }

      load().then(() => {
        loaded.value = true;

        if (instance.parent && isKeepAlive(instance.parent.vnode)) {
          // parent is keep-alive, force update so the loaded component's
          // name is taken into account
          queueJob(instance.parent.update);
        }
      }).catch(err => {
        onError(err);
        error.value = err;
      });
      return () => {
        if (loaded.value && resolvedComp) {
          return createInnerComp(resolvedComp, instance);
        } else if (error.value && errorComponent) {
          return createVNode(errorComponent, {
            error: error.value
          });
        } else if (loadingComponent && !delayed.value) {
          return createVNode(loadingComponent);
        }
      };
    }

  });
}

function createInnerComp(comp, {
  vnode: {
    ref,
    props,
    children
  }
}) {
  const vnode = createVNode(comp, props, children); // ensure inner component inherits the async wrapper's ref owner

  vnode.ref = ref;
  return vnode;
}

const isKeepAlive = vnode => vnode.type.__isKeepAlive;

const KeepAliveImpl = {
  name: `KeepAlive`,
  // Marker for special handling inside the renderer. We are not using a ===
  // check directly on KeepAlive in the renderer, because importing it directly
  // would prevent it from being tree-shaken.
  __isKeepAlive: true,
  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },

  setup(props, {
    slots
  }) {
    const instance = getCurrentInstance(); // KeepAlive communicates with the instantiated renderer via the
    // ctx where the renderer passes in its internals,
    // and the KeepAlive instance exposes activate/deactivate implementations.
    // The whole point of this is to avoid importing KeepAlive directly in the
    // renderer to facilitate tree-shaking.

    const sharedContext = instance.ctx; // if the internal renderer is not registered, it indicates that this is server-side rendering,
    // for KeepAlive, we just need to render its children

    if (!sharedContext.renderer) {
      return slots.default;
    }

    const cache = new Map();
    const keys = new Set();
    let current = null;

    if (true) {
      instance.__v_cache = cache;
    }

    const parentSuspense = instance.suspense;
    const {
      renderer: {
        p: patch,
        m: move,
        um: _unmount,
        o: {
          createElement
        }
      }
    } = sharedContext;
    const storageContainer = createElement('div');

    sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
      const instance = vnode.component;
      move(vnode, container, anchor, 0
      /* ENTER */
      , parentSuspense); // in case props have changed

      patch(instance.vnode, vnode, container, anchor, instance, parentSuspense, isSVG, vnode.slotScopeIds, optimized);
      queuePostRenderEffect(() => {
        instance.isDeactivated = false;

        if (instance.a) {
          (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.invokeArrayFns)(instance.a);
        }

        const vnodeHook = vnode.props && vnode.props.onVnodeMounted;

        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode);
        }
      }, parentSuspense);

      if (true) {
        // Update components tree
        devtoolsComponentAdded(instance);
      }
    };

    sharedContext.deactivate = vnode => {
      const instance = vnode.component;
      move(vnode, storageContainer, null, 1
      /* LEAVE */
      , parentSuspense);
      queuePostRenderEffect(() => {
        if (instance.da) {
          (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.invokeArrayFns)(instance.da);
        }

        const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;

        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode);
        }

        instance.isDeactivated = true;
      }, parentSuspense);

      if (true) {
        // Update components tree
        devtoolsComponentAdded(instance);
      }
    };

    function unmount(vnode) {
      // reset the shapeFlag so it can be properly unmounted
      resetShapeFlag(vnode);

      _unmount(vnode, instance, parentSuspense, true);
    }

    function pruneCache(filter) {
      cache.forEach((vnode, key) => {
        const name = getComponentName(vnode.type);

        if (name && (!filter || !filter(name))) {
          pruneCacheEntry(key);
        }
      });
    }

    function pruneCacheEntry(key) {
      const cached = cache.get(key);

      if (!current || cached.type !== current.type) {
        unmount(cached);
      } else if (current) {
        // current active instance should no longer be kept-alive.
        // we can't unmount it now but it might be later, so reset its flag now.
        resetShapeFlag(current);
      }

      cache.delete(key);
      keys.delete(key);
    } // prune cache on include/exclude prop change


    watch(() => [props.include, props.exclude], ([include, exclude]) => {
      include && pruneCache(name => matches(include, name));
      exclude && pruneCache(name => !matches(exclude, name));
    }, // prune post-render after `current` has been updated
    {
      flush: 'post',
      deep: true
    }); // cache sub tree after render

    let pendingCacheKey = null;

    const cacheSubtree = () => {
      // fix #1621, the pendingCacheKey could be 0
      if (pendingCacheKey != null) {
        cache.set(pendingCacheKey, getInnerChild(instance.subTree));
      }
    };

    onMounted(cacheSubtree);
    onUpdated(cacheSubtree);
    onBeforeUnmount(() => {
      cache.forEach(cached => {
        const {
          subTree,
          suspense
        } = instance;
        const vnode = getInnerChild(subTree);

        if (cached.type === vnode.type) {
          // current instance will be unmounted as part of keep-alive's unmount
          resetShapeFlag(vnode); // but invoke its deactivated hook here

          const da = vnode.component.da;
          da && queuePostRenderEffect(da, suspense);
          return;
        }

        unmount(cached);
      });
    });
    return () => {
      pendingCacheKey = null;

      if (!slots.default) {
        return null;
      }

      const children = slots.default();
      const rawVNode = children[0];

      if (children.length > 1) {
        if (true) {
          warn(`KeepAlive should contain exactly one component child.`);
        }

        current = null;
        return children;
      } else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & 4
      /* STATEFUL_COMPONENT */
      ) && !(rawVNode.shapeFlag & 128
      /* SUSPENSE */
      )) {
        current = null;
        return rawVNode;
      }

      let vnode = getInnerChild(rawVNode);
      const comp = vnode.type; // for async components, name check should be based in its loaded
      // inner component if available

      const name = getComponentName(isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp);
      const {
        include,
        exclude,
        max
      } = props;

      if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
        current = vnode;
        return rawVNode;
      }

      const key = vnode.key == null ? comp : vnode.key;
      const cachedVNode = cache.get(key); // clone vnode if it's reused because we are going to mutate it

      if (vnode.el) {
        vnode = cloneVNode(vnode);

        if (rawVNode.shapeFlag & 128
        /* SUSPENSE */
        ) {
          rawVNode.ssContent = vnode;
        }
      } // #1513 it's possible for the returned vnode to be cloned due to attr
      // fallthrough or scopeId, so the vnode here may not be the final vnode
      // that is mounted. Instead of caching it directly, we store the pending
      // key and cache `instance.subTree` (the normalized vnode) in
      // beforeMount/beforeUpdate hooks.


      pendingCacheKey = key;

      if (cachedVNode) {
        // copy over mounted state
        vnode.el = cachedVNode.el;
        vnode.component = cachedVNode.component;

        if (vnode.transition) {
          // recursively update transition hooks on subTree
          setTransitionHooks(vnode, vnode.transition);
        } // avoid vnode being mounted as fresh


        vnode.shapeFlag |= 512
        /* COMPONENT_KEPT_ALIVE */
        ; // make this key the freshest

        keys.delete(key);
        keys.add(key);
      } else {
        keys.add(key); // prune oldest entry

        if (max && keys.size > parseInt(max, 10)) {
          pruneCacheEntry(keys.values().next().value);
        }
      } // avoid vnode being unmounted


      vnode.shapeFlag |= 256
      /* COMPONENT_SHOULD_KEEP_ALIVE */
      ;
      current = vnode;
      return rawVNode;
    };
  }

}; // export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files

const KeepAlive = KeepAliveImpl;

function matches(pattern, name) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(pattern)) {
    return pattern.some(p => matches(p, name));
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(pattern)) {
    return pattern.split(',').includes(name);
  } else if (pattern.test) {
    return pattern.test(name);
  }
  /* istanbul ignore next */


  return false;
}

function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a"
  /* ACTIVATED */
  , target);
}

function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da"
  /* DEACTIVATED */
  , target);
}

function registerKeepAliveHook(hook, type, target = currentInstance) {
  // cache the deactivate branch check wrapper for injected hooks so the same
  // hook can be properly deduped by the scheduler. "__wdc" stands for "with
  // deactivation check".
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    // only fire the hook if the target instance is NOT in a deactivated branch.
    let current = target;

    while (current) {
      if (current.isDeactivated) {
        return;
      }

      current = current.parent;
    }

    return hook();
  });

  injectHook(type, wrappedHook, target); // In addition to registering it on the target instance, we walk up the parent
  // chain and register it on all ancestor instances that are keep-alive roots.
  // This avoids the need to walk the entire component tree when invoking these
  // hooks, and more importantly, avoids the need to track child components in
  // arrays.

  if (target) {
    let current = target.parent;

    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }

      current = current.parent;
    }
  }
}

function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  // injectHook wraps the original for error handling, so make sure to remove
  // the wrapped version.
  const injected = injectHook(type, hook, keepAliveRoot, true
  /* prepend */
  );
  onUnmounted(() => {
    (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.remove)(keepAliveRoot[type], injected);
  }, target);
}

function resetShapeFlag(vnode) {
  let shapeFlag = vnode.shapeFlag;

  if (shapeFlag & 256
  /* COMPONENT_SHOULD_KEEP_ALIVE */
  ) {
    shapeFlag -= 256
    /* COMPONENT_SHOULD_KEEP_ALIVE */
    ;
  }

  if (shapeFlag & 512
  /* COMPONENT_KEPT_ALIVE */
  ) {
    shapeFlag -= 512
    /* COMPONENT_KEPT_ALIVE */
    ;
  }

  vnode.shapeFlag = shapeFlag;
}

function getInnerChild(vnode) {
  return vnode.shapeFlag & 128
  /* SUSPENSE */
  ? vnode.ssContent : vnode;
}

function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []); // cache the error handling wrapper for injected hooks so the same hook
    // can be properly deduped by the scheduler. "__weh" stands for "with error
    // handling".

    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      } // disable tracking inside all lifecycle hooks
      // since they can potentially be called inside effects.


      (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.pauseTracking)(); // Set currentInstance during hook invocation.
      // This assumes the hook does not synchronously trigger other hooks, which
      // can only be false when the user does something really funky.

      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.resetTracking)();
      return res;
    });

    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }

    return wrappedHook;
  } else if (true) {
    const apiName = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.toHandlerKey)(ErrorTypeStrings[type].replace(/ hook$/, ''));
    warn(`${apiName} is called when there is no active component instance to be ` + `associated with. ` + `Lifecycle injection APIs can only be used during execution of setup().` + (` If you are using async setup(), make sure to register lifecycle ` + `hooks before the first await statement.`));
  }
}

const createHook = lifecycle => (hook, target = currentInstance) => // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
(!isInSSRComponentSetup || lifecycle === "sp"
/* SERVER_PREFETCH */
) && injectHook(lifecycle, hook, target);

const onBeforeMount = createHook("bm"
/* BEFORE_MOUNT */
);
const onMounted = createHook("m"
/* MOUNTED */
);
const onBeforeUpdate = createHook("bu"
/* BEFORE_UPDATE */
);
const onUpdated = createHook("u"
/* UPDATED */
);
const onBeforeUnmount = createHook("bum"
/* BEFORE_UNMOUNT */
);
const onUnmounted = createHook("um"
/* UNMOUNTED */
);
const onServerPrefetch = createHook("sp"
/* SERVER_PREFETCH */
);
const onRenderTriggered = createHook("rtg"
/* RENDER_TRIGGERED */
);
const onRenderTracked = createHook("rtc"
/* RENDER_TRACKED */
);

function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec"
  /* ERROR_CAPTURED */
  , hook, target);
}

function createDuplicateChecker() {
  const cache = Object.create(null);
  return (type, key) => {
    if (cache[key]) {
      warn(`${type} property "${key}" is already defined in ${cache[key]}.`);
    } else {
      cache[key] = type;
    }
  };
}

let shouldCacheAccess = true;

function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx; // do not cache property access on public proxy during state initialization

  shouldCacheAccess = false; // call beforeCreate first before accessing other options since
  // the hook may mutate resolved options (#2791)

  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc"
    /* BEFORE_CREATE */
    );
  }

  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties =  true ? createDuplicateChecker() : 0;

  if (true) {
    const [propsOptions] = instance.propsOptions;

    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties("Props"
        /* PROPS */
        , key);
      }
    }
  } // options initialization order (to be consistent with Vue 2):
  // - props (already done outside of this function)
  // - inject
  // - methods
  // - data (deferred since it relies on `this` access)
  // - computed
  // - watch (deferred since it relies on `this` access)


  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
  }

  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];

      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(methodHandler)) {
        // In dev mode, we use the `createRenderContext` function to define
        // methods to the proxy target, and those are read-only but
        // reconfigurable, so it needs to be redefined here
        if (true) {
          Object.defineProperty(ctx, key, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          });
        } else {}

        if (true) {
          checkDuplicateProperties("Methods"
          /* METHODS */
          , key);
        }
      } else if (true) {
        warn(`Method "${key}" has type "${typeof methodHandler}" in the component definition. ` + `Did you reference the function correctly?`);
      }
    }
  }

  if (dataOptions) {
    if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(dataOptions)) {
      warn(`The data option must be a function. ` + `Plain object usage is no longer supported.`);
    }

    const data = dataOptions.call(publicThis, publicThis);

    if ( true && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isPromise)(data)) {
      warn(`data() returned a Promise - note data() cannot be async; If you ` + `intend to perform data fetching before component renders, use ` + `async setup() + <Suspense>.`);
    }

    if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(data)) {
       true && warn(`data() should return an object.`);
    } else {
      instance.data = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.reactive)(data);

      if (true) {
        for (const key in data) {
          checkDuplicateProperties("Data"
          /* DATA */
          , key); // expose data on ctx during dev

          if (key[0] !== '$' && key[0] !== '_') {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => data[key],
              set: _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP
            });
          }
        }
      }
    }
  } // state initialization complete at this point - start caching access


  shouldCacheAccess = true;

  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(opt) ? opt.bind(publicThis, publicThis) : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(opt.get) ? opt.get.bind(publicThis, publicThis) : _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP;

      if ( true && get === _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP) {
        warn(`Computed property "${key}" has no getter.`);
      }

      const set = !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(opt) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(opt.set) ? opt.set.bind(publicThis) :  true ? () => {
        warn(`Write operation failed: computed property "${key}" is readonly.`);
      } : 0;
      const c = computed({
        get,
        set
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: v => c.value = v
      });

      if (true) {
        checkDuplicateProperties("Computed"
        /* COMPUTED */
        , key);
      }
    }
  }

  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }

  if (provideOptions) {
    const provides = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach(key => {
      provide(key, provides[key]);
    });
  }

  if (created) {
    callHook(created, instance, "c"
    /* CREATED */
    );
  }

  function registerLifecycleHook(register, hook) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(hook)) {
      hook.forEach(_hook => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }

  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach(key => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: val => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  } // options that are handled when creating the instance but also need to be
  // applied from mixins


  if (render && instance.render === _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP) {
    instance.render = render;
  }

  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  } // asset options.


  if (components) instance.components = components;
  if (directives) instance.directives = directives;
}

function resolveInjections(injectOptions, ctx, checkDuplicateProperties = _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP, unwrapRef = false) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }

  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;

    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(opt)) {
      if ('default' in opt) {
        injected = inject(opt.from || key, opt.default, true
        /* treat default function as factory */
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }

    if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isRef)(injected)) {
      // TODO remove the check in 3.3
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: v => injected.value = v
        });
      } else {
        if (true) {
          warn(`injected property "${key}" is a ref and will be auto-unwrapped ` + `and no longer needs \`.value\` in the next minor release. ` + `To opt-in to the new behavior now, ` + `set \`app.config.unwrapInjectedRef = true\` (this config is ` + `temporary and will not be needed in the future.)`);
        }

        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }

    if (true) {
      checkDuplicateProperties("Inject"
      /* INJECT */
      , key);
    }
  }
}

function callHook(hook, instance, type) {
  callWithAsyncErrorHandling((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(hook) ? hook.map(h => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}

function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes('.') ? createPathGetter(publicThis, key) : () => publicThis[key];

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(raw)) {
    const handler = ctx[raw];

    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(handler)) {
      watch(getter, handler);
    } else if (true) {
      warn(`Invalid watch handler specified by key "${raw}"`, handler);
    }
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(raw)) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(raw)) {
      raw.forEach(r => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];

      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(handler)) {
        watch(getter, handler, raw);
      } else if (true) {
        warn(`Invalid watch handler specified by key "${raw.handler}"`, handler);
      }
    }
  } else if (true) {
    warn(`Invalid watch option: "${key}"`, raw);
  }
}
/**
 * Resolve merged options and cache it on the component.
 * This is done only once per-component since the merging does not involve
 * instances.
 */


function resolveMergedOptions(instance) {
  const base = instance.type;
  const {
    mixins,
    extends: extendsOptions
  } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: {
      optionMergeStrategies
    }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;

  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};

    if (globalMixins.length) {
      globalMixins.forEach(m => mergeOptions(resolved, m, optionMergeStrategies, true));
    }

    mergeOptions(resolved, base, optionMergeStrategies);
  }

  cache.set(base, resolved);
  return resolved;
}

function mergeOptions(to, from, strats, asMixin = false) {
  const {
    mixins,
    extends: extendsOptions
  } = from;

  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }

  if (mixins) {
    mixins.forEach(m => mergeOptions(to, m, strats, true));
  }

  for (const key in from) {
    if (asMixin && key === 'expose') {
       true && warn(`"expose" option is ignored when declared in mixins or extends. ` + `It should only be declared in the base component itself.`);
    } else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }

  return to;
}

const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};

function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }

  if (!to) {
    return from;
  }

  return function mergedDataFn() {
    return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(to) ? to.call(this, this) : to, (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(from) ? from.call(this, this) : from);
  };
}

function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}

function normalizeInject(raw) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(raw)) {
    const res = {};

    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }

    return res;
  }

  return raw;
}

function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}

function mergeObjectOptions(to, from) {
  return to ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)(Object.create(null), to), from) : from;
}

function mergeWatchOptions(to, from) {
  if (!to) return from;
  if (!from) return to;
  const merged = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)(Object.create(null), to);

  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }

  return merged;
}

function initProps(instance, rawProps, isStateful, // result of bitwise flag comparison
isSSR = false) {
  const props = {};
  const attrs = {};
  (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.def)(attrs, InternalObjectKey, 1);
  instance.propsDefaults = Object.create(null);
  setFullProps(instance, rawProps, props, attrs); // ensure all declared prop keys are present

  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = undefined;
    }
  } // validation


  if (true) {
    validateProps(rawProps || {}, props, instance);
  }

  if (isStateful) {
    // stateful
    instance.props = isSSR ? props : (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.shallowReactive)(props);
  } else {
    if (!instance.type.props) {
      // functional w/ optional props, props === attrs
      instance.props = attrs;
    } else {
      // functional w/ declared props
      instance.props = props;
    }
  }

  instance.attrs = attrs;
}

function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: {
      patchFlag
    }
  } = instance;
  const rawCurrentProps = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRaw)(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;

  if ( // always force full diff in dev
  // - #1942 if hmr is enabled with sfc component
  // - vite#872 non-sfc component used by sfc component
  !( true && (instance.type.__hmrId || instance.parent && instance.parent.type.__hmrId)) && (optimized || patchFlag > 0) && !(patchFlag & 16
  /* FULL_PROPS */
  )) {
    if (patchFlag & 8
    /* PROPS */
    ) {
      // Compiler-generated props & no keys change, just set the updated
      // the props.
      const propsToUpdate = instance.vnode.dynamicProps;

      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i]; // PROPS flag guarantees rawProps to be non-null

        const value = rawProps[key];

        if (options) {
          // attr / props separation was done on init and will be consistent
          // in this code path, so just check if attrs have it.
          if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.camelize)(key);
            props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false
            /* isAbsent */
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    // full props update.
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    } // in case of dynamic props, check if we need to delete keys from
    // the props object


    let kebabKey;

    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(rawProps, key) && ( // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      (kebabKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hyphenate)(key)) === key || !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && ( // for camelCase
          rawPrevProps[key] !== undefined || // for kebab-case
          rawPrevProps[kebabKey] !== undefined)) {
            props[key] = resolvePropValue(options, rawCurrentProps, key, undefined, instance, true
            /* isAbsent */
            );
          }
        } else {
          delete props[key];
        }
      }
    } // in the case of functional component w/o props declaration, props and
    // attrs point to the same object so it should already have been updated.


    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(rawProps, key) && !false) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  } // trigger updates for $attrs in case it's used in component slots


  if (hasAttrsChanged) {
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.trigger)(instance, "set"
    /* SET */
    , '$attrs');
  }

  if (true) {
    validateProps(rawProps || {}, props, instance);
  }
}

function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;

  if (rawProps) {
    for (let key in rawProps) {
      // key, ref are reserved and never passed down
      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isReservedProp)(key)) {
        continue;
      }

      const value = rawProps[key]; // prop option names are camelized during normalization, so to support
      // kebab -> camel conversion here we need to camelize the key.

      let camelKey;

      if (options && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(options, camelKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.camelize)(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }

  if (needCastKeys) {
    const rawCurrentProps = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRaw)(props);
    const castValues = rawCastValues || _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ;

    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(castValues, key));
    }
  }

  return hasAttrsChanged;
}

function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];

  if (opt != null) {
    const hasDefault = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(opt, 'default'); // default values

    if (hasDefault && value === undefined) {
      const defaultValue = opt.default;

      if (opt.type !== Function && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(defaultValue)) {
        const {
          propsDefaults
        } = instance;

        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    } // boolean casting


    if (opt[0
    /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[1
      /* shouldCastTrue */
      ] && (value === '' || value === (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hyphenate)(key))) {
        value = true;
      }
    }
  }

  return value;
}

function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);

  if (cached) {
    return cached;
  }

  const raw = comp.props;
  const normalized = {};
  const needCastKeys = []; // apply mixin/extends props

  let hasExtends = false;

  if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(comp)) {
    const extendProps = raw => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw, appContext, true);
      (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)(normalized, props);
      if (keys) needCastKeys.push(...keys);
    };

    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }

    if (comp.extends) {
      extendProps(comp.extends);
    }

    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }

  if (!raw && !hasExtends) {
    cache.set(comp, _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_ARR);
    return _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_ARR;
  }

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(raw)) {
    for (let i = 0; i < raw.length; i++) {
      if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(raw[i])) {
        warn(`props must be strings when using array syntax.`, raw[i]);
      }

      const normalizedKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.camelize)(raw[i]);

      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ;
      }
    }
  } else if (raw) {
    if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(raw)) {
      warn(`invalid props options`, raw);
    }

    for (const key in raw) {
      const normalizedKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.camelize)(key);

      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(opt) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(opt) ? {
          type: opt
        } : opt;

        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0
          /* shouldCast */
          ] = booleanIndex > -1;
          prop[1
          /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex; // if the prop needs boolean casting or default value

          if (booleanIndex > -1 || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(prop, 'default')) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }

  const res = [normalized, needCastKeys];
  cache.set(comp, res);
  return res;
}

function validatePropName(key) {
  if (key[0] !== '$') {
    return true;
  } else if (true) {
    warn(`Invalid prop name: "${key}" is a reserved property.`);
  }

  return false;
} // use function string name to check type constructors
// so that it works across vms / iframes.


function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ctor === null ? 'null' : '';
}

function isSameType(a, b) {
  return getType(a) === getType(b);
}

function getTypeIndex(type, expectedTypes) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(expectedTypes)) {
    return expectedTypes.findIndex(t => isSameType(t, type));
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }

  return -1;
}
/**
 * dev only
 */


function validateProps(rawProps, props, instance) {
  const resolvedValues = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRaw)(props);
  const options = instance.propsOptions[0];

  for (const key in options) {
    let opt = options[key];
    if (opt == null) continue;
    validateProp(key, resolvedValues[key], opt, !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(rawProps, key) && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(rawProps, (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hyphenate)(key)));
  }
}
/**
 * dev only
 */


function validateProp(name, value, prop, isAbsent) {
  const {
    type,
    required,
    validator
  } = prop; // required!

  if (required && isAbsent) {
    warn('Missing required prop: "' + name + '"');
    return;
  } // missing but optional


  if (value == null && !prop.required) {
    return;
  } // type check


  if (type != null && type !== true) {
    let isValid = false;
    const types = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(type) ? type : [type];
    const expectedTypes = []; // value is valid as long as one of the specified types match

    for (let i = 0; i < types.length && !isValid; i++) {
      const {
        valid,
        expectedType
      } = assertType(value, types[i]);
      expectedTypes.push(expectedType || '');
      isValid = valid;
    }

    if (!isValid) {
      warn(getInvalidTypeMessage(name, value, expectedTypes));
      return;
    }
  } // custom validator


  if (validator && !validator(value)) {
    warn('Invalid prop: custom validator check failed for prop "' + name + '".');
  }
}

const isSimpleType = /*#__PURE__*/(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.makeMap)('String,Number,Boolean,Function,Symbol,BigInt');
/**
 * dev only
 */

function assertType(value, type) {
  let valid;
  const expectedType = getType(type);

  if (isSimpleType(expectedType)) {
    const t = typeof value;
    valid = t === expectedType.toLowerCase(); // for primitive wrapper objects

    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(value);
  } else if (expectedType === 'Array') {
    valid = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(value);
  } else if (expectedType === 'null') {
    valid = value === null;
  } else {
    valid = value instanceof type;
  }

  return {
    valid,
    expectedType
  };
}
/**
 * dev only
 */


function getInvalidTypeMessage(name, value, expectedTypes) {
  let message = `Invalid prop: type check failed for prop "${name}".` + ` Expected ${expectedTypes.map(_vue_shared__WEBPACK_IMPORTED_MODULE_2__.capitalize).join(' | ')}`;
  const expectedType = expectedTypes[0];
  const receivedType = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.toRawType)(value);
  const expectedValue = styleValue(value, expectedType);
  const receivedValue = styleValue(value, receivedType); // check if we need to specify expected value

  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }

  message += `, got ${receivedType} `; // check if we need to specify received value

  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }

  return message;
}
/**
 * dev only
 */


function styleValue(value, type) {
  if (type === 'String') {
    return `"${value}"`;
  } else if (type === 'Number') {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
/**
 * dev only
 */


function isExplicable(type) {
  const explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(elem => type.toLowerCase() === elem);
}
/**
 * dev only
 */


function isBoolean(...args) {
  return args.some(elem => elem.toLowerCase() === 'boolean');
}

const isInternalKey = key => key[0] === '_' || key === '$stable';

const normalizeSlotValue = value => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];

const normalizeSlot = (key, rawSlot, ctx) => {
  const normalized = withCtx((...args) => {
    if ( true && currentInstance) {
      warn(`Slot "${key}" invoked outside of the render function: ` + `this will not track dependencies used in the slot. ` + `Invoke the slot function inside the render function instead.`);
    }

    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};

const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;

  for (const key in rawSlots) {
    if (isInternalKey(key)) continue;
    const value = rawSlots[key];

    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      if (true) {
        warn(`Non-function value encountered for slot "${key}". ` + `Prefer function slots for better performance.`);
      }

      const normalized = normalizeSlotValue(value);

      slots[key] = () => normalized;
    }
  }
};

const normalizeVNodeSlots = (instance, children) => {
  if ( true && !isKeepAlive(instance.vnode) && !false) {
    warn(`Non-function value encountered for default slot. ` + `Prefer function slots for better performance.`);
  }

  const normalized = normalizeSlotValue(children);

  instance.slots.default = () => normalized;
};

const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32
  /* SLOTS_CHILDREN */
  ) {
    const type = children._;

    if (type) {
      // users can get the shallow readonly version of the slots object through `this.$slots`,
      // we should avoid the proxy object polluting the slots of the internal instance
      instance.slots = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRaw)(children); // make compiler marker non-enumerable

      (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.def)(children, '_', type);
    } else {
      normalizeObjectSlots(children, instance.slots = {});
    }
  } else {
    instance.slots = {};

    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }

  (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.def)(instance.slots, InternalObjectKey, 1);
};

const updateSlots = (instance, children, optimized) => {
  const {
    vnode,
    slots
  } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ;

  if (vnode.shapeFlag & 32
  /* SLOTS_CHILDREN */
  ) {
    const type = children._;

    if (type) {
      // compiled slots.
      if ( true && isHmrUpdating) {
        // Parent was HMR updated so slot content may have changed.
        // force update slots and mark instance for hmr as well
        (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)(slots, children);
      } else if (optimized && type === 1
      /* STABLE */
      ) {
        // compiled AND stable.
        // no need to update, and skip stale slots removal.
        needDeletionCheck = false;
      } else {
        // compiled but dynamic (v-if/v-for on slots) - update slots, but skip
        // normalization.
        (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)(slots, children); // #2893
        // when rendering the optimized slots by manually written render function,
        // we need to delete the `slots._` flag if necessary to make subsequent updates reliable,
        // i.e. let the `renderSlot` create the bailed Fragment

        if (!optimized && type === 1
        /* STABLE */
        ) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }

    deletionComparisonTarget = children;
  } else if (children) {
    // non slot object children (direct value) passed to a component
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = {
      default: 1
    };
  } // delete stale slots


  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
/**
Runtime helper for applying directives to a vnode. Example usage:

const comp = resolveComponent('comp')
const foo = resolveDirective('foo')
const bar = resolveDirective('bar')

return withDirectives(h(comp), [
  [foo, this.x],
  [bar, this.y]
])
*/


function validateDirectiveName(name) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isBuiltInDirective)(name)) {
    warn('Do not use built-in directive ids as custom directive id: ' + name);
  }
}
/**
 * Adds directives to a VNode.
 */


function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;

  if (internalInstance === null) {
     true && warn(`withDirectives can only be used inside render functions.`);
    return vnode;
  }

  const instance = internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);

  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ] = directives[i];

    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(dir)) {
      dir = {
        mounted: dir,
        updated: dir
      };
    }

    if (dir.deep) {
      traverse(value);
    }

    bindings.push({
      dir,
      instance,
      value,
      oldValue: void 0,
      arg,
      modifiers
    });
  }

  return vnode;
}

function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;

  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];

    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }

    let hook = binding.dir[name];

    if (hook) {
      // disable tracking inside all lifecycle hooks
      // since they can potentially be called inside effects.
      (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.pauseTracking)();
      callWithAsyncErrorHandling(hook, instance, 8
      /* DIRECTIVE_HOOK */
      , [vnode.el, binding, vnode, prevVNode]);
      (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.resetTracking)();
    }
  }
}

function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: undefined,
      warnHandler: undefined,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap()
  };
}

let uid = 0;

function createAppAPI(render, hydrate) {
  return function createApp(rootComponent, rootProps = null) {
    if (rootProps != null && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(rootProps)) {
       true && warn(`root props passed to app.mount() must be an object.`);
      rootProps = null;
    }

    const context = createAppContext();
    const installedPlugins = new Set();
    let isMounted = false;
    const app = context.app = {
      _uid: uid++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,

      get config() {
        return context.config;
      },

      set config(v) {
        if (true) {
          warn(`app.config cannot be replaced. Modify individual options instead.`);
        }
      },

      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) {
           true && warn(`Plugin has already been applied to target app.`);
        } else if (plugin && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else if (true) {
          warn(`A plugin must either be a function or an object with an "install" ` + `function.`);
        }

        return app;
      },

      mixin(mixin) {
        if (true) {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          } else if (true) {
            warn('Mixin has already been applied to target app' + (mixin.name ? `: ${mixin.name}` : ''));
          }
        } else {}

        return app;
      },

      component(name, component) {
        if (true) {
          validateComponentName(name, context.config);
        }

        if (!component) {
          return context.components[name];
        }

        if ( true && context.components[name]) {
          warn(`Component "${name}" has already been registered in target app.`);
        }

        context.components[name] = component;
        return app;
      },

      directive(name, directive) {
        if (true) {
          validateDirectiveName(name);
        }

        if (!directive) {
          return context.directives[name];
        }

        if ( true && context.directives[name]) {
          warn(`Directive "${name}" has already been registered in target app.`);
        }

        context.directives[name] = directive;
        return app;
      },

      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps); // store app context on the root VNode.
          // this will be set on the root instance on initial mount.

          vnode.appContext = context; // HMR root reload

          if (true) {
            context.reload = () => {
              render(cloneVNode(vnode), rootContainer, isSVG);
            };
          }

          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, isSVG);
          }

          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;

          if (true) {
            app._instance = vnode.component;
            devtoolsInitApp(app, version);
          }

          return getExposeProxy(vnode.component) || vnode.component.proxy;
        } else if (true) {
          warn(`App has already been mounted.\n` + `If you want to remount the same app, move your app creation logic ` + `into a factory function and create fresh app instances for each ` + `mount - e.g. \`const createMyApp = () => createApp(App)\``);
        }
      },

      unmount() {
        if (isMounted) {
          render(null, app._container);

          if (true) {
            app._instance = null;
            devtoolsUnmountApp(app);
          }

          delete app._container.__vue_app__;
        } else if (true) {
          warn(`Cannot unmount an app that is not mounted.`);
        }
      },

      provide(key, value) {
        if ( true && key in context.provides) {
          warn(`App already provides property with key "${String(key)}". ` + `It will be overwritten with the new value.`);
        } // TypeScript doesn't allow symbols as index type
        // https://github.com/Microsoft/TypeScript/issues/24587


        context.provides[key] = value;
        return app;
      }

    };
    return app;
  };
}
/**
 * Function for handling a template ref
 */


function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }

  if (isAsyncWrapper(vnode) && !isUnmount) {
    // when mounting async components, nothing needs to be done,
    // because the template ref is forwarded to inner component
    return;
  }

  const refValue = vnode.shapeFlag & 4
  /* STATEFUL_COMPONENT */
  ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const {
    i: owner,
    r: ref
  } = rawRef;

  if ( true && !owner) {
    warn(`Missing ref owner context. ref cannot be used on hoisted vnodes. ` + `A vnode with ref must be created inside the render function.`);
    return;
  }

  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState; // dynamic ref changed. unset old ref

  if (oldRef != null && oldRef !== ref) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(oldRef)) {
      refs[oldRef] = null;

      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isRef)(oldRef)) {
      oldRef.value = null;
    }
  }

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(ref)) {
    callWithErrorHandling(ref, owner, 12
    /* FUNCTION_REF */
    , [value, refs]);
  } else {
    const _isString = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(ref);

    const _isRef = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isRef)(ref);

    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? refs[ref] : ref.value;

          if (isUnmount) {
            (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(existing) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.remove)(existing, refValue);
          } else {
            if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(existing)) {
              if (_isString) {
                refs[ref] = [refValue];
              } else {
                ref.value = [refValue];
                if (rawRef.k) refs[rawRef.k] = ref.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref] = value;

          if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(setupState, ref)) {
            setupState[ref] = value;
          }
        } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isRef)(ref)) {
          ref.value = value;
          if (rawRef.k) refs[rawRef.k] = value;
        } else if (true) {
          warn('Invalid template ref type:', ref, `(${typeof ref})`);
        }
      };

      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    } else if (true) {
      warn('Invalid template ref type:', ref, `(${typeof ref})`);
    }
  }
}

let hasMismatch = false;

const isSVGContainer = container => /svg/.test(container.namespaceURI) && container.tagName !== 'foreignObject';

const isComment = node => node.nodeType === 8
/* COMMENT */
; // Note: hydration is DOM-specific
// But we have to place it in core due to tight coupling with core - splitting
// it out creates a ton of unnecessary complexity.
// Hydration also depends on some renderer internal logic which needs to be
// passed in via arguments.


function createHydrationFunctions(rendererInternals) {
  const {
    mt: mountComponent,
    p: patch,
    o: {
      patchProp,
      nextSibling,
      parentNode,
      remove,
      insert,
      createComment
    }
  } = rendererInternals;

  const hydrate = (vnode, container) => {
    if (!container.hasChildNodes()) {
       true && warn(`Attempting to hydrate existing markup but container is empty. ` + `Performing full mount instead.`);
      patch(null, vnode, container);
      flushPostFlushCbs();
      return;
    }

    hasMismatch = false;
    hydrateNode(container.firstChild, vnode, null, null, null);
    flushPostFlushCbs();

    if (hasMismatch && !false) {
      // this error should show up in production
      console.error(`Hydration completed but contains mismatches.`);
    }
  };

  const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
    const isFragmentStart = isComment(node) && node.data === '[';

    const onMismatch = () => handleMismatch(node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragmentStart);

    const {
      type,
      ref,
      shapeFlag
    } = vnode;
    const domType = node.nodeType;
    vnode.el = node;
    let nextNode = null;

    switch (type) {
      case Text:
        if (domType !== 3
        /* TEXT */
        ) {
          nextNode = onMismatch();
        } else {
          if (node.data !== vnode.children) {
            hasMismatch = true;
             true && warn(`Hydration text mismatch:` + `\n- Client: ${JSON.stringify(node.data)}` + `\n- Server: ${JSON.stringify(vnode.children)}`);
            node.data = vnode.children;
          }

          nextNode = nextSibling(node);
        }

        break;

      case Comment:
        if (domType !== 8
        /* COMMENT */
        || isFragmentStart) {
          nextNode = onMismatch();
        } else {
          nextNode = nextSibling(node);
        }

        break;

      case Static:
        if (domType !== 1
        /* ELEMENT */
        ) {
          nextNode = onMismatch();
        } else {
          // determine anchor, adopt content
          nextNode = node; // if the static vnode has its content stripped during build,
          // adopt it from the server-rendered HTML.

          const needToAdoptContent = !vnode.children.length;

          for (let i = 0; i < vnode.staticCount; i++) {
            if (needToAdoptContent) vnode.children += nextNode.outerHTML;

            if (i === vnode.staticCount - 1) {
              vnode.anchor = nextNode;
            }

            nextNode = nextSibling(nextNode);
          }

          return nextNode;
        }

        break;

      case Fragment:
        if (!isFragmentStart) {
          nextNode = onMismatch();
        } else {
          nextNode = hydrateFragment(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
        }

        break;

      default:
        if (shapeFlag & 1
        /* ELEMENT */
        ) {
          if (domType !== 1
          /* ELEMENT */
          || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) {
            nextNode = onMismatch();
          } else {
            nextNode = hydrateElement(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
          }
        } else if (shapeFlag & 6
        /* COMPONENT */
        ) {
          // when setting up the render effect, if the initial vnode already
          // has .el set, the component will perform hydration instead of mount
          // on its sub-tree.
          vnode.slotScopeIds = slotScopeIds;
          const container = parentNode(node);
          mountComponent(vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), optimized); // component may be async, so in the case of fragments we cannot rely
          // on component's rendered output to determine the end of the fragment
          // instead, we do a lookahead to find the end anchor node.

          nextNode = isFragmentStart ? locateClosingAsyncAnchor(node) : nextSibling(node); // #3787
          // if component is async, it may get moved / unmounted before its
          // inner component is loaded, so we need to give it a placeholder
          // vnode that matches its adopted DOM.

          if (isAsyncWrapper(vnode)) {
            let subTree;

            if (isFragmentStart) {
              subTree = createVNode(Fragment);
              subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
            } else {
              subTree = node.nodeType === 3 ? createTextVNode('') : createVNode('div');
            }

            subTree.el = node;
            vnode.component.subTree = subTree;
          }
        } else if (shapeFlag & 64
        /* TELEPORT */
        ) {
          if (domType !== 8
          /* COMMENT */
          ) {
            nextNode = onMismatch();
          } else {
            nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, rendererInternals, hydrateChildren);
          }
        } else if (shapeFlag & 128
        /* SUSPENSE */
        ) {
          nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, isSVGContainer(parentNode(node)), slotScopeIds, optimized, rendererInternals, hydrateNode);
        } else if (true) {
          warn('Invalid HostVNode type:', type, `(${typeof type})`);
        }

    }

    if (ref != null) {
      setRef(ref, null, parentSuspense, vnode);
    }

    return nextNode;
  };

  const hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    optimized = optimized || !!vnode.dynamicChildren;
    const {
      type,
      props,
      patchFlag,
      shapeFlag,
      dirs
    } = vnode; // #4006 for form elements with non-string v-model value bindings
    // e.g. <option :value="obj">, <input type="checkbox" :true-value="1">

    const forcePatchValue = type === 'input' && dirs || type === 'option'; // skip props & children if this is hoisted static nodes
    // #5405 in dev, always hydrate children for HMR

    if (true
    /* HOISTED */
    ) {
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, 'created');
      } // props


      if (props) {
        if (forcePatchValue || !optimized || patchFlag & (16
        /* FULL_PROPS */
        | 32
        /* HYDRATE_EVENTS */
        )) {
          for (const key in props) {
            if (forcePatchValue && key.endsWith('value') || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isOn)(key) && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isReservedProp)(key)) {
              patchProp(el, key, null, props[key], false, undefined, parentComponent);
            }
          }
        } else if (props.onClick) {
          // Fast path for click listeners (which is most often) to avoid
          // iterating through props.
          patchProp(el, 'onClick', null, props.onClick, false, undefined, parentComponent);
        }
      } // vnode / directive hooks


      let vnodeHooks;

      if (vnodeHooks = props && props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHooks, parentComponent, vnode);
      }

      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount');
      }

      if ((vnodeHooks = props && props.onVnodeMounted) || dirs) {
        queueEffectWithSuspense(() => {
          vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
        }, parentSuspense);
      } // children


      if (shapeFlag & 16
      /* ARRAY_CHILDREN */
      && // skip if element has innerHTML / textContent
      !(props && (props.innerHTML || props.textContent))) {
        let next = hydrateChildren(el.firstChild, vnode, el, parentComponent, parentSuspense, slotScopeIds, optimized);
        let hasWarned = false;

        while (next) {
          hasMismatch = true;

          if ( true && !hasWarned) {
            warn(`Hydration children mismatch in <${vnode.type}>: ` + `server rendered element contains more child nodes than client vdom.`);
            hasWarned = true;
          } // The SSRed DOM contains more nodes than it should. Remove them.


          const cur = next;
          next = next.nextSibling;
          remove(cur);
        }
      } else if (shapeFlag & 8
      /* TEXT_CHILDREN */
      ) {
        if (el.textContent !== vnode.children) {
          hasMismatch = true;
           true && warn(`Hydration text content mismatch in <${vnode.type}>:\n` + `- Client: ${el.textContent}\n` + `- Server: ${vnode.children}`);
          el.textContent = vnode.children;
        }
      }
    }

    return el.nextSibling;
  };

  const hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    optimized = optimized || !!parentVNode.dynamicChildren;
    const children = parentVNode.children;
    const l = children.length;
    let hasWarned = false;

    for (let i = 0; i < l; i++) {
      const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);

      if (node) {
        node = hydrateNode(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
      } else if (vnode.type === Text && !vnode.children) {
        continue;
      } else {
        hasMismatch = true;

        if ( true && !hasWarned) {
          warn(`Hydration children mismatch in <${container.tagName.toLowerCase()}>: ` + `server rendered element contains fewer child nodes than client vdom.`);
          hasWarned = true;
        } // the SSRed DOM didn't contain enough nodes. Mount the missing ones.


        patch(null, vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), slotScopeIds);
      }
    }

    return node;
  };

  const hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    const {
      slotScopeIds: fragmentSlotScopeIds
    } = vnode;

    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }

    const container = parentNode(node);
    const next = hydrateChildren(nextSibling(node), vnode, container, parentComponent, parentSuspense, slotScopeIds, optimized);

    if (next && isComment(next) && next.data === ']') {
      return nextSibling(vnode.anchor = next);
    } else {
      // fragment didn't hydrate successfully, since we didn't get a end anchor
      // back. This should have led to node/children mismatch warnings.
      hasMismatch = true; // since the anchor is missing, we need to create one and insert it

      insert(vnode.anchor = createComment(`]`), container, next);
      return next;
    }
  };

  const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
    hasMismatch = true;
     true && warn(`Hydration node mismatch:\n- Client vnode:`, vnode.type, `\n- Server rendered DOM:`, node, node.nodeType === 3
    /* TEXT */
    ? `(text)` : isComment(node) && node.data === '[' ? `(start of fragment)` : ``);
    vnode.el = null;

    if (isFragment) {
      // remove excessive fragment nodes
      const end = locateClosingAsyncAnchor(node);

      while (true) {
        const next = nextSibling(node);

        if (next && next !== end) {
          remove(next);
        } else {
          break;
        }
      }
    }

    const next = nextSibling(node);
    const container = parentNode(node);
    remove(node);
    patch(null, vnode, container, next, parentComponent, parentSuspense, isSVGContainer(container), slotScopeIds);
    return next;
  };

  const locateClosingAsyncAnchor = node => {
    let match = 0;

    while (node) {
      node = nextSibling(node);

      if (node && isComment(node)) {
        if (node.data === '[') match++;

        if (node.data === ']') {
          if (match === 0) {
            return nextSibling(node);
          } else {
            match--;
          }
        }
      }
    }

    return node;
  };

  return [hydrate, hydrateNode];
}
/* eslint-disable no-restricted-globals */


let supported;
let perf;

function startMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    perf.mark(`vue-${type}-${instance.uid}`);
  }

  if (true) {
    devtoolsPerfStart(instance, type, supported ? perf.now() : Date.now());
  }
}

function endMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    const startTag = `vue-${type}-${instance.uid}`;
    const endTag = startTag + `:end`;
    perf.mark(endTag);
    perf.measure(`<${formatComponentName(instance, instance.type)}> ${type}`, startTag, endTag);
    perf.clearMarks(startTag);
    perf.clearMarks(endTag);
  }

  if (true) {
    devtoolsPerfEnd(instance, type, supported ? perf.now() : Date.now());
  }
}

function isSupported() {
  if (supported !== undefined) {
    return supported;
  }

  if (typeof window !== 'undefined' && window.performance) {
    supported = true;
    perf = window.performance;
  } else {
    supported = false;
  }

  return supported;
}
/**
 * This is only called in esm-bundler builds.
 * It is called when a renderer is created, in `baseCreateRenderer` so that
 * importing runtime-core is side-effects free.
 *
 * istanbul-ignore-next
 */


function initFeatureFlags() {
  const needWarn = [];

  if (false) {}

  if (false) {}

  if ( true && needWarn.length) {
    const multi = needWarn.length > 1;
    console.warn(`Feature flag${multi ? `s` : ``} ${needWarn.join(', ')} ${multi ? `are` : `is`} not explicitly defined. You are running the esm-bundler build of Vue, ` + `which expects these compile-time feature flags to be globally injected ` + `via the bundler config in order to get better tree-shaking in the ` + `production bundle.\n\n` + `For more details, see https://link.vuejs.org/feature-flags.`);
  }
}

const queuePostRenderEffect = queueEffectWithSuspense;
/**
 * The createRenderer function accepts two generic arguments:
 * HostNode and HostElement, corresponding to Node and Element types in the
 * host environment. For example, for runtime-dom, HostNode would be the DOM
 * `Node` interface and HostElement would be the DOM `Element` interface.
 *
 * Custom renderers can pass in the platform specific types like this:
 *
 * ``` js
 * const { render, createApp } = createRenderer<Node, Element>({
 *   patchProp,
 *   ...nodeOps
 * })
 * ```
 */

function createRenderer(options) {
  return baseCreateRenderer(options);
} // Separate API for creating hydration-enabled renderer.
// Hydration logic is only used when calling this function, making it
// tree-shakable.


function createHydrationRenderer(options) {
  return baseCreateRenderer(options, createHydrationFunctions);
} // implementation


function baseCreateRenderer(options, createHydrationFns) {
  // compile-time feature flags check
  {
    initFeatureFlags();
  }
  const target = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.getGlobalThis)();
  target.__VUE__ = true;

  if (true) {
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
  }

  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP,
    cloneNode: hostCloneNode,
    insertStaticContent: hostInsertStaticContent
  } = options; // Note: functions inside this closure should use `const xxx = () => {}`
  // style in order to prevent being inlined by minifiers.

  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized =  true && isHmrUpdating ? false : !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    } // patching & not same type, unmount old tree


    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }

    if (n2.patchFlag === -2
    /* BAIL */
    ) {
      optimized = false;
      n2.dynamicChildren = null;
    }

    const {
      type,
      ref,
      shapeFlag
    } = n2;

    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;

      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;

      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        } else if (true) {
          patchStaticNode(n1, n2, container, isSVG);
        }

        break;

      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;

      default:
        if (shapeFlag & 1
        /* ELEMENT */
        ) {
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6
        /* COMPONENT */
        ) {
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64
        /* TELEPORT */
        ) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128
        /* SUSPENSE */
        ) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (true) {
          warn('Invalid VNode type:', type, `(${typeof type})`);
        }

    } // set ref


    if (ref != null && parentComponent) {
      setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };

  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el = n2.el = n1.el;

      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };

  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ''), container, anchor);
    } else {
      // there's no support for dynamic comments
      n2.el = n1.el;
    }
  };

  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
  };
  /**
   * Dev / HMR only
   */


  const patchStaticNode = (n1, n2, container, isSVG) => {
    // static nodes are only patched during dev for HMR
    if (n2.children !== n1.children) {
      const anchor = hostNextSibling(n1.anchor); // remove existing

      removeStaticNode(n1);
      [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
    } else {
      n2.el = n1.el;
      n2.anchor = n1.anchor;
    }
  };

  const moveStaticNode = ({
    el,
    anchor
  }, container, nextSibling) => {
    let next;

    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }

    hostInsert(anchor, container, nextSibling);
  };

  const removeStaticNode = ({
    el,
    anchor
  }) => {
    let next;

    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }

    hostRemove(anchor);
  };

  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === 'svg';

    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };

  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const {
      type,
      props,
      shapeFlag,
      transition,
      patchFlag,
      dirs
    } = vnode;

    if (false
    /* HOISTED */
    ) {} else {
      el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props); // mount children first, since some props may rely on child content
      // being already rendered, e.g. `<select value>`

      if (shapeFlag & 8
      /* TEXT_CHILDREN */
      ) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16
      /* ARRAY_CHILDREN */
      ) {
        mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== 'foreignObject', slotScopeIds, optimized);
      }

      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, 'created');
      } // props


      if (props) {
        for (const key in props) {
          if (key !== 'value' && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isReservedProp)(key)) {
            hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        /**
         * Special case for setting value on DOM elements:
         * - it can be order-sensitive (e.g. should be set *after* min/max, #2325, #4024)
         * - it needs to be forced (#1471)
         * #2353 proposes adding another renderer option to configure this, but
         * the properties affects are so finite it is worth special casing it
         * here to reduce the complexity. (Special casing it also should not
         * affect non-DOM renderers)
         */


        if ('value' in props) {
          hostPatchProp(el, 'value', null, props.value);
        }

        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      } // scopeId


      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    }

    if (true) {
      Object.defineProperty(el, '__vnode', {
        value: vnode,
        enumerable: false
      });
      Object.defineProperty(el, '__vueParentComponent', {
        value: parentComponent,
        enumerable: false
      });
    }

    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount');
    } // #1583 For inside suspense + suspense not resolved case, enter hook should call when suspense resolved
    // #1689 For inside suspense + suspense resolved case, just call it


    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;

    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }

    hostInsert(el, container, anchor);

    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
      }, parentSuspense);
    }
  };

  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }

    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }

    if (parentComponent) {
      let subTree = parentComponent.subTree;

      if ( true && subTree.patchFlag > 0 && subTree.patchFlag & 2048
      /* DEV_ROOT_FRAGMENT */
      ) {
        subTree = filterSingleRoot(subTree.children) || subTree;
      }

      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };

  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };

  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let {
      patchFlag,
      dynamicChildren,
      dirs
    } = n2; // #1426 take the old vnode's patch flag into account since user may clone a
    // compiler-generated vnode, which de-opts to FULL_PROPS

    patchFlag |= n1.patchFlag & 16
    /* FULL_PROPS */
    ;
    const oldProps = n1.props || _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ;
    const newProps = n2.props || _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ;
    let vnodeHook; // disable recurse in beforeUpdate hooks

    parentComponent && toggleRecurse(parentComponent, false);

    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }

    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, 'beforeUpdate');
    }

    parentComponent && toggleRecurse(parentComponent, true);

    if ( true && isHmrUpdating) {
      // HMR updated, force full diff
      patchFlag = 0;
      optimized = false;
      dynamicChildren = null;
    }

    const areChildrenSVG = isSVG && n2.type !== 'foreignObject';

    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);

      if ( true && parentComponent && parentComponent.type.__hmrId) {
        traverseStaticChildren(n1, n2);
      }
    } else if (!optimized) {
      // full diff
      patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }

    if (patchFlag > 0) {
      // the presence of a patchFlag means this element's render code was
      // generated by the compiler and can take the fast path.
      // in this path old node and new node are guaranteed to have the same shape
      // (i.e. at the exact same position in the source template)
      if (patchFlag & 16
      /* FULL_PROPS */
      ) {
        // element props contain dynamic keys, full diff needed
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        // class
        // this flag is matched when the element has dynamic class bindings.
        if (patchFlag & 2
        /* CLASS */
        ) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, 'class', null, newProps.class, isSVG);
          }
        } // style
        // this flag is matched when the element has dynamic style bindings


        if (patchFlag & 4
        /* STYLE */
        ) {
          hostPatchProp(el, 'style', oldProps.style, newProps.style, isSVG);
        } // props
        // This flag is matched when the element has dynamic prop/attr bindings
        // other than class and style. The keys of dynamic prop/attrs are saved for
        // faster iteration.
        // Note dynamic keys like :[foo]="bar" will cause this optimization to
        // bail out and go through a full diff because we need to unset the old key


        if (patchFlag & 8
        /* PROPS */
        ) {
          // if the flag is present then dynamicProps must be non-null
          const propsToUpdate = n2.dynamicProps;

          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key]; // #1471 force patch value

            if (next !== prev || key === 'value') {
              hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      } // text
      // This flag is matched when the element has only dynamic text children.


      if (patchFlag & 1
      /* TEXT */
      ) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      // unoptimized, full diff
      patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }

    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, 'updated');
      }, parentSuspense);
    }
  }; // The fast path for blocks.


  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i]; // Determine the container (parent element) for the patch.

      const container = // oldVNode may be an errored async setup() component inside Suspense
      // which will not have a mounted element
      oldVNode.el && ( // - In the case of a Fragment, we need to provide the actual parent
      // of the Fragment itself so it can move its children.
      oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
      // which also requires the correct parent container
      !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
      oldVNode.shapeFlag & (6
      /* COMPONENT */
      | 64
      /* TELEPORT */
      )) ? hostParentNode(oldVNode.el) : // In other cases, the parent container is not actually used so we
      // just pass the block element here to avoid a DOM parentNode call.
      fallbackContainer;
      patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };

  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        // empty string is not valid prop
        if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isReservedProp)(key)) continue;
        const next = newProps[key];
        const prev = oldProps[key]; // defer patching value

        if (next !== prev && key !== 'value') {
          hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }

      if (oldProps !== _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isReservedProp)(key) && !(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }

      if ('value' in newProps) {
        hostPatchProp(el, 'value', oldProps.value, newProps.value);
      }
    }
  };

  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText('');
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText('');
    let {
      patchFlag,
      dynamicChildren,
      slotScopeIds: fragmentSlotScopeIds
    } = n2;

    if ( true && isHmrUpdating) {
      // HMR updated, force full diff
      patchFlag = 0;
      optimized = false;
      dynamicChildren = null;
    } // check if this is a slot fragment with :slotted scope ids


    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }

    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor); // a fragment can only have array children
      // since they are either generated by the compiler, or implicitly created
      // from arrays.

      mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64
      /* STABLE_FRAGMENT */
      && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        // a stable fragment (template root or <template v-for>) doesn't need to
        // patch children order, but it may contain dynamicChildren.
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);

        if ( true && parentComponent && parentComponent.type.__hmrId) {
          traverseStaticChildren(n1, n2);
        } else if ( // #2080 if the stable fragment has a key, it's a <template v-for> that may
        //  get moved around. Make sure all root level vnodes inherit el.
        // #2134 or if it's a component root, it may also get moved around
        // as the component is being moved.
        n2.key != null || parentComponent && n2 === parentComponent.subTree) {
          traverseStaticChildren(n1, n2, true
          /* shallow */
          );
        }
      } else {
        // keyed / unkeyed, or manual fragments.
        // for keyed & unkeyed, since they are compiler generated from v-for,
        // each child is guaranteed to be a block so the fragment will never
        // have dynamicChildren.
        patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };

  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;

    if (n1 == null) {
      if (n2.shapeFlag & 512
      /* COMPONENT_KEPT_ALIVE */
      ) {
        parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
      } else {
        mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };

  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);

    if ( true && instance.type.__hmrId) {
      registerHMR(instance);
    }

    if (true) {
      pushWarningContext(initialVNode);
      startMeasure(instance, `mount`);
    } // inject renderer internals for keepAlive


    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    } // resolve props and slots for setup context


    {
      if (true) {
        startMeasure(instance, `init`);
      }

      setupComponent(instance);

      if (true) {
        endMeasure(instance, `init`);
      }
    } // setup() is async. This component relies on async logic to be resolved
    // before proceeding

    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect); // Give it a placeholder if this is not hydration
      // TODO handle self-defined fallback

      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }

      return;
    }

    setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);

    if (true) {
      popWarningContext();
      endMeasure(instance, `mount`);
    }
  };

  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;

    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        // async & still pending - just update props and slots
        // since the component's reactive effect for render isn't set-up yet
        if (true) {
          pushWarningContext(n2);
        }

        updateComponentPreRender(instance, n2, optimized);

        if (true) {
          popWarningContext();
        }

        return;
      } else {
        // normal update
        instance.next = n2; // in case the child component is also queued, remove it to avoid
        // double updating the same child component in the same flush.

        invalidateJob(instance.update); // instance.update is the reactive effect.

        instance.update();
      }
    } else {
      // no update needed. just copy over properties
      n2.component = n1.component;
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };

  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const {
          el,
          props
        } = initialVNode;
        const {
          bm,
          m,
          parent
        } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false); // beforeMount hook

        if (bm) {
          (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.invokeArrayFns)(bm);
        } // onVnodeBeforeMount


        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }

        toggleRecurse(instance, true);

        if (el && hydrateNode) {
          // vnode has adopted host node - perform hydration instead of mount.
          const hydrateSubTree = () => {
            if (true) {
              startMeasure(instance, `render`);
            }

            instance.subTree = renderComponentRoot(instance);

            if (true) {
              endMeasure(instance, `render`);
            }

            if (true) {
              startMeasure(instance, `hydrate`);
            }

            hydrateNode(el, instance.subTree, instance, parentSuspense, null);

            if (true) {
              endMeasure(instance, `hydrate`);
            }
          };

          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then( // note: we are moving the render call into an async callback,
            // which means it won't track dependencies - but it's ok because
            // a server-rendered async wrapper is already in resolved state
            // and it will never need to change.
            () => !instance.isUnmounted && hydrateSubTree());
          } else {
            hydrateSubTree();
          }
        } else {
          if (true) {
            startMeasure(instance, `render`);
          }

          const subTree = instance.subTree = renderComponentRoot(instance);

          if (true) {
            endMeasure(instance, `render`);
          }

          if (true) {
            startMeasure(instance, `patch`);
          }

          patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);

          if (true) {
            endMeasure(instance, `patch`);
          }

          initialVNode.el = subTree.el;
        } // mounted hook


        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        } // onVnodeMounted


        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        } // activated hook for keep-alive roots.
        // #1742 activated hook must be accessed after first render
        // since the hook may be injected by a child keep-alive


        if (initialVNode.shapeFlag & 256
        /* COMPONENT_SHOULD_KEEP_ALIVE */
        ) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }

        instance.isMounted = true;

        if (true) {
          devtoolsComponentAdded(instance);
        } // #2458: deference mount-only object parameters to prevent memleaks


        initialVNode = container = anchor = null;
      } else {
        // updateComponent
        // This is triggered by mutation of component's own state (next: null)
        // OR parent calling processComponent (next: VNode)
        let {
          next,
          bu,
          u,
          parent,
          vnode
        } = instance;
        let originNext = next;
        let vnodeHook;

        if (true) {
          pushWarningContext(next || instance.vnode);
        } // Disallow component effect recursion during pre-lifecycle hooks.


        toggleRecurse(instance, false);

        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        } // beforeUpdate hook


        if (bu) {
          (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.invokeArrayFns)(bu);
        } // onVnodeBeforeUpdate


        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }

        toggleRecurse(instance, true); // render

        if (true) {
          startMeasure(instance, `render`);
        }

        const nextTree = renderComponentRoot(instance);

        if (true) {
          endMeasure(instance, `render`);
        }

        const prevTree = instance.subTree;
        instance.subTree = nextTree;

        if (true) {
          startMeasure(instance, `patch`);
        }

        patch(prevTree, nextTree, // parent may have changed if it's in a teleport
        hostParentNode(prevTree.el), // anchor may have changed if it's in a fragment
        getNextHostNode(prevTree), instance, parentSuspense, isSVG);

        if (true) {
          endMeasure(instance, `patch`);
        }

        next.el = nextTree.el;

        if (originNext === null) {
          // self-triggered update. In case of HOC, update parent component
          // vnode el. HOC is indicated by parent instance's subTree pointing
          // to child component's vnode
          updateHOCHostEl(instance, nextTree.el);
        } // updated hook


        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        } // onVnodeUpdated


        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
        }

        if (true) {
          devtoolsComponentUpdated(instance);
        }

        if (true) {
          popWarningContext();
        }
      }
    }; // create reactive effect for rendering


    const effect = instance.effect = new _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.ReactiveEffect(componentUpdateFn, () => queueJob(instance.update), instance.scope // track it in component's effect scope
    );
    const update = instance.update = effect.run.bind(effect);
    update.id = instance.uid; // allowRecurse
    // #1801, #2043 component render effects should allow recursive updates

    toggleRecurse(instance, true);

    if (true) {
      effect.onTrack = instance.rtc ? e => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.invokeArrayFns)(instance.rtc, e) : void 0;
      effect.onTrigger = instance.rtg ? e => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.invokeArrayFns)(instance.rtg, e) : void 0; // @ts-ignore (for scheduler)

      update.ownerInstance = instance;
    }

    update();
  };

  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.pauseTracking)(); // props update may have triggered pre-flush watchers.
    // flush them before the render update.

    flushPreFlushCbs(undefined, instance.update);
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.resetTracking)();
  };

  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const {
      patchFlag,
      shapeFlag
    } = n2; // fast path

    if (patchFlag > 0) {
      if (patchFlag & 128
      /* KEYED_FRAGMENT */
      ) {
        // this could be either fully-keyed or mixed (some keyed some not)
        // presence of patchFlag means children are guaranteed to be arrays
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256
      /* UNKEYED_FRAGMENT */
      ) {
        // unkeyed
        patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    } // children has 3 possibilities: text, array or no children.


    if (shapeFlag & 8
    /* TEXT_CHILDREN */
    ) {
      // text children fast path
      if (prevShapeFlag & 16
      /* ARRAY_CHILDREN */
      ) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }

      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16
      /* ARRAY_CHILDREN */
      ) {
        // prev children was array
        if (shapeFlag & 16
        /* ARRAY_CHILDREN */
        ) {
          // two arrays, cannot assume anything, do full diff
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          // no new children, just unmount old
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        // prev children was text OR null
        // new children is array OR null
        if (prevShapeFlag & 8
        /* TEXT_CHILDREN */
        ) {
          hostSetElementText(container, '');
        } // mount new if array


        if (shapeFlag & 16
        /* ARRAY_CHILDREN */
        ) {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };

  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_ARR;
    c2 = c2 || _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;

    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }

    if (oldLength > newLength) {
      // remove old
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      // mount new
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  }; // can be all-keyed or mixed


  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1; // prev ending index

    let e2 = l2 - 1; // next ending index
    // 1. sync from start
    // (a b) c
    // (a b) d e

    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }

      i++;
    } // 2. sync from end
    // a (b c)
    // d e (b c)


    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }

      e1--;
      e2--;
    } // 3. common sequence + mount
    // (a b)
    // (a b) c
    // i = 2, e1 = 1, e2 = 2
    // (a b)
    // c (a b)
    // i = 0, e1 = -1, e2 = 0


    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;

        while (i <= e2) {
          patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i++;
        }
      }
    } // 4. common sequence + unmount
    // (a b) c
    // (a b)
    // i = 2, e1 = 2, e2 = 1
    // a (b c)
    // (b c)
    // i = 0, e1 = 0, e2 = -1
    else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } // 5. unknown sequence
    // [i ... e1 + 1]: a b [c d e] f g
    // [i ... e2 + 1]: a b [e d c h] f g
    // i = 2, e1 = 4, e2 = 5
    else {
      const s1 = i; // prev starting index

      const s2 = i; // next starting index
      // 5.1 build key:index map for newChildren

      const keyToNewIndexMap = new Map();

      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);

        if (nextChild.key != null) {
          if ( true && keyToNewIndexMap.has(nextChild.key)) {
            warn(`Duplicate keys found during update:`, JSON.stringify(nextChild.key), `Make sure keys are unique.`);
          }

          keyToNewIndexMap.set(nextChild.key, i);
        }
      } // 5.2 loop through old children left to be patched and try to patch
      // matching nodes & remove nodes that are no longer present


      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false; // used to track whether any node has moved

      let maxNewIndexSoFar = 0; // works as Map<newIndex, oldIndex>
      // Note that oldIndex is offset by +1
      // and oldIndex = 0 is a special value indicating the new node has
      // no corresponding old node.
      // used for determining longest stable subsequence

      const newIndexToOldIndexMap = new Array(toBePatched);

      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;

      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];

        if (patched >= toBePatched) {
          // all new children have been patched so this can only be a removal
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }

        let newIndex;

        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          // key-less node, try to locate a key-less node of the same type
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }

        if (newIndex === undefined) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;

          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }

          patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      } // 5.3 move and mount
      // generate longest stable subsequence only when nodes have moved


      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1; // looping backwards so that we can use last patched node as anchor

      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;

        if (newIndexToOldIndexMap[i] === 0) {
          // mount new
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          // move if:
          // There is no stable subsequence (e.g. a reverse)
          // OR current node is not among the stable sequence
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2
            /* REORDER */
            );
          } else {
            j--;
          }
        }
      }
    }
  };

  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const {
      el,
      type,
      transition,
      children,
      shapeFlag
    } = vnode;

    if (shapeFlag & 6
    /* COMPONENT */
    ) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }

    if (shapeFlag & 128
    /* SUSPENSE */
    ) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }

    if (shapeFlag & 64
    /* TELEPORT */
    ) {
      type.move(vnode, container, anchor, internals);
      return;
    }

    if (type === Fragment) {
      hostInsert(el, container, anchor);

      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }

      hostInsert(vnode.anchor, container, anchor);
      return;
    }

    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    } // single nodes


    const needTransition = moveType !== 2
    /* REORDER */
    && shapeFlag & 1
    /* ELEMENT */
    && transition;

    if (needTransition) {
      if (moveType === 0
      /* ENTER */
      ) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const {
          leave,
          delayLeave,
          afterLeave
        } = transition;

        const remove = () => hostInsert(el, container, anchor);

        const performLeave = () => {
          leave(el, () => {
            remove();
            afterLeave && afterLeave();
          });
        };

        if (delayLeave) {
          delayLeave(el, remove, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };

  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs
    } = vnode; // unset ref

    if (ref != null) {
      setRef(ref, null, parentSuspense, vnode, true);
    }

    if (shapeFlag & 256
    /* COMPONENT_SHOULD_KEEP_ALIVE */
    ) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }

    const shouldInvokeDirs = shapeFlag & 1
    /* ELEMENT */
    && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;

    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }

    if (shapeFlag & 6
    /* COMPONENT */
    ) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128
      /* SUSPENSE */
      ) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }

      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, 'beforeUnmount');
      }

      if (shapeFlag & 64
      /* TELEPORT */
      ) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && ( // #1153: fast path should not be taken for non-stable (v-for) fragments
      type !== Fragment || patchFlag > 0 && patchFlag & 64
      /* STABLE_FRAGMENT */
      )) {
        // fast path for block nodes: only need to unmount dynamic children.
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type === Fragment && patchFlag & (128
      /* KEYED_FRAGMENT */
      | 256
      /* UNKEYED_FRAGMENT */
      ) || !optimized && shapeFlag & 16
      /* ARRAY_CHILDREN */
      ) {
        unmountChildren(children, parentComponent, parentSuspense);
      }

      if (doRemove) {
        remove(vnode);
      }
    }

    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, 'unmounted');
      }, parentSuspense);
    }
  };

  const remove = vnode => {
    const {
      type,
      el,
      anchor,
      transition
    } = vnode;

    if (type === Fragment) {
      removeFragment(el, anchor);
      return;
    }

    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }

    const performRemove = () => {
      hostRemove(el);

      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };

    if (vnode.shapeFlag & 1
    /* ELEMENT */
    && transition && !transition.persisted) {
      const {
        leave,
        delayLeave
      } = transition;

      const performLeave = () => leave(el, performRemove);

      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };

  const removeFragment = (cur, end) => {
    // For fragments, directly remove all contained DOM nodes.
    // (fragment child nodes cannot have transition)
    let next;

    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }

    hostRemove(end);
  };

  const unmountComponent = (instance, parentSuspense, doRemove) => {
    if ( true && instance.type.__hmrId) {
      unregisterHMR(instance);
    }

    const {
      bum,
      scope,
      update,
      subTree,
      um
    } = instance; // beforeUnmount hook

    if (bum) {
      (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.invokeArrayFns)(bum);
    } // stop effects in component scope


    scope.stop(); // update may be null if a component is unmounted before its async
    // setup has resolved.

    if (update) {
      // so that scheduler will no longer invoke it
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    } // unmounted hook


    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }

    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense); // A component with async dep inside a pending suspense is unmounted before
    // its async dep resolves. This should remove the dep from the suspense, and
    // cause the suspense to resolve immediately if that was the last dep.

    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;

      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }

    if (true) {
      devtoolsComponentRemoved(instance);
    }
  };

  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };

  const getNextHostNode = vnode => {
    if (vnode.shapeFlag & 6
    /* COMPONENT */
    ) {
      return getNextHostNode(vnode.component.subTree);
    }

    if (vnode.shapeFlag & 128
    /* SUSPENSE */
    ) {
      return vnode.suspense.next();
    }

    return hostNextSibling(vnode.anchor || vnode.el);
  };

  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }

    flushPostFlushCbs();
    container._vnode = vnode;
  };

  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;

  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }

  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}

function toggleRecurse({
  effect,
  update
}, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
/**
 * #1156
 * When a component is HMR-enabled, we need to make sure that all static nodes
 * inside a block also inherit the DOM element from the previous tree so that
 * HMR updates (which are full updates) can retrieve the element for patching.
 *
 * #2080
 * Inside keyed `template` fragment static children, if a fragment is moved,
 * the children will always be moved. Therefore, in order to ensure correct move
 * position, el should be inherited from previous nodes.
 */


function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(ch1) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      // this is only called in the optimized path so array children are
      // guaranteed to be vnodes
      const c1 = ch1[i];
      let c2 = ch2[i];

      if (c2.shapeFlag & 1
      /* ELEMENT */
      && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32
        /* HYDRATE_EVENTS */
        ) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }

        if (!shallow) traverseStaticChildren(c1, c2);
      } // also inherit for comment nodes, but not placeholders (e.g. v-if which
      // would have received .el during block patch)


      if ( true && c2.type === Comment && !c2.el) {
        c2.el = c1.el;
      }
    }
  }
} // https://en.wikipedia.org/wiki/Longest_increasing_subsequence


function getSequence(arr) {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;

  for (i = 0; i < len; i++) {
    const arrI = arr[i];

    if (arrI !== 0) {
      j = result[result.length - 1];

      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }

      u = 0;
      v = result.length - 1;

      while (u < v) {
        c = u + v >> 1;

        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }

      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }

        result[u] = i;
      }
    }
  }

  u = result.length;
  v = result[u - 1];

  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }

  return result;
}

const isTeleport = type => type.__isTeleport;

const isTeleportDisabled = props => props && (props.disabled || props.disabled === '');

const isTargetSVG = target => typeof SVGElement !== 'undefined' && target instanceof SVGElement;

const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(targetSelector)) {
    if (!select) {
       true && warn(`Current renderer does not support string target for Teleports. ` + `(missing querySelector renderer option)`);
      return null;
    } else {
      const target = select(targetSelector);

      if (!target) {
         true && warn(`Failed to locate Teleport target with selector "${targetSelector}". ` + `Note the target element must exist before the component is mounted - ` + `i.e. the target cannot be rendered by the component itself, and ` + `ideally should be outside of the entire Vue component tree.`);
      }

      return target;
    }
  } else {
    if ( true && !targetSelector && !isTeleportDisabled(props)) {
      warn(`Invalid Teleport target: ${targetSelector}`);
    }

    return targetSelector;
  }
};

const TeleportImpl = {
  __isTeleport: true,

  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
    const {
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      o: {
        insert,
        querySelector,
        createText,
        createComment
      }
    } = internals;
    const disabled = isTeleportDisabled(n2.props);
    let {
      shapeFlag,
      children,
      dynamicChildren
    } = n2; // #3302
    // HMR updated, force full diff

    if ( true && isHmrUpdating) {
      optimized = false;
      dynamicChildren = null;
    }

    if (n1 == null) {
      // insert anchors in the main view
      const placeholder = n2.el =  true ? createComment('teleport start') : 0;
      const mainAnchor = n2.anchor =  true ? createComment('teleport end') : 0;
      insert(placeholder, container, anchor);
      insert(mainAnchor, container, anchor);
      const target = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = n2.targetAnchor = createText('');

      if (target) {
        insert(targetAnchor, target); // #2652 we could be teleporting from a non-SVG tree into an SVG tree

        isSVG = isSVG || isTargetSVG(target);
      } else if ( true && !disabled) {
        warn('Invalid Teleport target on mount:', target, `(${typeof target})`);
      }

      const mount = (container, anchor) => {
        // Teleport *always* has Array children. This is enforced in both the
        // compiler and vnode children normalization.
        if (shapeFlag & 16
        /* ARRAY_CHILDREN */
        ) {
          mountChildren(children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      };

      if (disabled) {
        mount(container, mainAnchor);
      } else if (target) {
        mount(target, targetAnchor);
      }
    } else {
      // update content
      n2.el = n1.el;
      const mainAnchor = n2.anchor = n1.anchor;
      const target = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      isSVG = isSVG || isTargetSVG(target);

      if (dynamicChildren) {
        // fast path when the teleport happens to be a block root
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG, slotScopeIds); // even in block tree mode we need to make sure all root-level nodes
        // in the teleport inherit previous DOM references so that they can
        // be moved in future patches.

        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, false);
      }

      if (disabled) {
        if (!wasDisabled) {
          // enabled -> disabled
          // move into main container
          moveTeleport(n2, container, mainAnchor, internals, 1
          /* TOGGLE */
          );
        }
      } else {
        // target changed
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(n2.props, querySelector);

          if (nextTarget) {
            moveTeleport(n2, nextTarget, null, internals, 0
            /* TARGET_CHANGE */
            );
          } else if (true) {
            warn('Invalid Teleport target on update:', target, `(${typeof target})`);
          }
        } else if (wasDisabled) {
          // disabled -> enabled
          // move into teleport target
          moveTeleport(n2, target, targetAnchor, internals, 1
          /* TOGGLE */
          );
        }
      }
    }
  },

  remove(vnode, parentComponent, parentSuspense, optimized, {
    um: unmount,
    o: {
      remove: hostRemove
    }
  }, doRemove) {
    const {
      shapeFlag,
      children,
      anchor,
      targetAnchor,
      target,
      props
    } = vnode;

    if (target) {
      hostRemove(targetAnchor);
    } // an unmounted teleport should always remove its children if not disabled


    if (doRemove || !isTeleportDisabled(props)) {
      hostRemove(anchor);

      if (shapeFlag & 16
      /* ARRAY_CHILDREN */
      ) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          unmount(child, parentComponent, parentSuspense, true, !!child.dynamicChildren);
        }
      }
    }
  },

  move: moveTeleport,
  hydrate: hydrateTeleport
};

function moveTeleport(vnode, container, parentAnchor, {
  o: {
    insert
  },
  m: move
}, moveType = 2
/* REORDER */
) {
  // move target anchor if this is a target change.
  if (moveType === 0
  /* TARGET_CHANGE */
  ) {
    insert(vnode.targetAnchor, container, parentAnchor);
  }

  const {
    el,
    anchor,
    shapeFlag,
    children,
    props
  } = vnode;
  const isReorder = moveType === 2
  /* REORDER */
  ; // move main view anchor if this is a re-order.

  if (isReorder) {
    insert(el, container, parentAnchor);
  } // if this is a re-order and teleport is enabled (content is in target)
  // do not move children. So the opposite is: only move children if this
  // is not a reorder, or the teleport is disabled


  if (!isReorder || isTeleportDisabled(props)) {
    // Teleport has either Array children or no children.
    if (shapeFlag & 16
    /* ARRAY_CHILDREN */
    ) {
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, parentAnchor, 2
        /* REORDER */
        );
      }
    }
  } // move main view anchor if this is a re-order.


  if (isReorder) {
    insert(anchor, container, parentAnchor);
  }
}

function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
  o: {
    nextSibling,
    parentNode,
    querySelector
  }
}, hydrateChildren) {
  const target = vnode.target = resolveTarget(vnode.props, querySelector);

  if (target) {
    // if multiple teleports rendered to the same target element, we need to
    // pick up from where the last teleport finished instead of the first node
    const targetNode = target._lpa || target.firstChild;

    if (vnode.shapeFlag & 16
    /* ARRAY_CHILDREN */
    ) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, slotScopeIds, optimized);
        vnode.targetAnchor = targetNode;
      } else {
        vnode.anchor = nextSibling(node);
        vnode.targetAnchor = hydrateChildren(targetNode, vnode, target, parentComponent, parentSuspense, slotScopeIds, optimized);
      }

      target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
    }
  }

  return vnode.anchor && nextSibling(vnode.anchor);
} // Force-casted public typing for h and TSX props inference


const Teleport = TeleportImpl;
const COMPONENTS = 'components';
const DIRECTIVES = 'directives';
/**
 * @private
 */

function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}

const NULL_DYNAMIC_COMPONENT = Symbol();
/**
 * @private
 */

function resolveDynamicComponent(component) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    // invalid types will fallthrough to createVNode and raise warning
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
/**
 * @private
 */


function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
} // implementation


function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;

  if (instance) {
    const Component = instance.type; // explicit self name has highest priority

    if (type === COMPONENTS) {
      const selfName = getComponentName(Component);

      if (selfName && (selfName === name || selfName === (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.camelize)(name) || selfName === (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.capitalize)((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.camelize)(name)))) {
        return Component;
      }
    }

    const res = // local registration
    // check instance[type] first which is resolved for options API
    resolve(instance[type] || Component[type], name) || // global registration
    resolve(instance.appContext[type], name);

    if (!res && maybeSelfReference) {
      // fallback to implicit self-reference
      return Component;
    }

    if ( true && warnMissing && !res) {
      const extra = type === COMPONENTS ? `\nIf this is a native custom element, make sure to exclude it from ` + `component resolution via compilerOptions.isCustomElement.` : ``;
      warn(`Failed to resolve ${type.slice(0, -1)}: ${name}${extra}`);
    }

    return res;
  } else if (true) {
    warn(`resolve${(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.capitalize)(type.slice(0, -1))} ` + `can only be used in render() or setup().`);
  }
}

function resolve(registry, name) {
  return registry && (registry[name] || registry[(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.camelize)(name)] || registry[(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.capitalize)((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.camelize)(name))]);
}

const Fragment = Symbol( true ? 'Fragment' : 0);
const Text = Symbol( true ? 'Text' : 0);
const Comment = Symbol( true ? 'Comment' : 0);
const Static = Symbol( true ? 'Static' : 0); // Since v-if and v-for are the two possible ways node structure can dynamically
// change, once we consider v-if branches and each v-for fragment a block, we
// can divide a template into nested blocks, and within each block the node
// structure would be stable. This allows us to skip most children diffing
// and only worry about the dynamic nodes (indicated by patch flags).

const blockStack = [];
let currentBlock = null;
/**
 * Open a block.
 * This must be called before `createBlock`. It cannot be part of `createBlock`
 * because the children of the block are evaluated before `createBlock` itself
 * is called. The generated code typically looks like this:
 *
 * ```js
 * function render() {
 *   return (openBlock(),createBlock('div', null, [...]))
 * }
 * ```
 * disableTracking is true when creating a v-for fragment block, since a v-for
 * fragment always diffs its children.
 *
 * @private
 */

function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}

function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
} // Whether we should be tracking dynamic child nodes inside a block.
// Only tracks when this value is > 0
// We are not using a simple boolean because this value may need to be
// incremented/decremented by nested usage of v-once (see below)


let isBlockTreeEnabled = 1;
/**
 * Block tracking sometimes needs to be disabled, for example during the
 * creation of a tree that needs to be cached by v-once. The compiler generates
 * code like this:
 *
 * ``` js
 * _cache[1] || (
 *   setBlockTracking(-1),
 *   _cache[1] = createVNode(...),
 *   setBlockTracking(1),
 *   _cache[1]
 * )
 * ```
 *
 * @private
 */

function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}

function setupBlock(vnode) {
  // save current block children on the block vnode
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_ARR : null; // close block

  closeBlock(); // a block is always going to be patched, so track it as a child of its
  // parent block

  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }

  return vnode;
}
/**
 * @private
 */


function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true
  /* isBlock */
  ));
}
/**
 * Create a block root vnode. Takes the same exact arguments as `createVNode`.
 * A block root keeps track of dynamic nodes within the block in the
 * `dynamicChildren` array.
 *
 * @private
 */


function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true
  /* isBlock: prevent a block from tracking itself */
  ));
}

function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}

function isSameVNodeType(n1, n2) {
  if ( true && n2.shapeFlag & 6
  /* COMPONENT */
  && hmrDirtyComponents.has(n2.type)) {
    // HMR only: if the component has been hot-updated, force a reload.
    return false;
  }

  return n1.type === n2.type && n1.key === n2.key;
}

let vnodeArgsTransformer;
/**
 * Internal API for registering an arguments transform for createVNode
 * used for creating stubs in the test-utils
 * It is *internal* but needs to be exposed for test-utils to pick up proper
 * typings
 */

function transformVNodeArgs(transformer) {
  vnodeArgsTransformer = transformer;
}

const createVNodeWithArgsTransform = (...args) => {
  return _createVNode(...(vnodeArgsTransformer ? vnodeArgsTransformer(args, currentRenderingInstance) : args));
};

const InternalObjectKey = `__vInternal`;

const normalizeKey = ({
  key
}) => key != null ? key : null;

const normalizeRef = ({
  ref,
  ref_key,
  ref_for
}) => {
  return ref != null ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(ref) || (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isRef)(ref) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(ref) ? {
    i: currentRenderingInstance,
    r: ref,
    k: ref_key,
    f: !!ref_for
  } : ref : null;
};

function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1
/* ELEMENT */
, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  };

  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children); // normalize suspense children

    if (shapeFlag & 128
    /* SUSPENSE */
    ) {
      type.normalize(vnode);
    }
  } else if (children) {
    // compiled element vnode - if children is passed, only possible types are
    // string or Array.
    vnode.shapeFlag |= (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(children) ? 8
    /* TEXT_CHILDREN */
    : 16
    /* ARRAY_CHILDREN */
    ;
  } // validate key


  if ( true && vnode.key !== vnode.key) {
    warn(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
  } // track vnode for block tree


  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && ( // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  vnode.patchFlag > 0 || shapeFlag & 6
  /* COMPONENT */
  ) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32
  /* HYDRATE_EVENTS */
  ) {
    currentBlock.push(vnode);
  }

  return vnode;
}

const createVNode =  true ? createVNodeWithArgsTransform : 0;

function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    if ( true && !type) {
      warn(`Invalid vnode type when creating vnode: ${type}.`);
    }

    type = Comment;
  }

  if (isVNode(type)) {
    // createVNode receiving an existing vnode. This happens in cases like
    // <component :is="vnode"/>
    // #2078 make sure to merge refs during the clone instead of overwriting it
    const cloned = cloneVNode(type, props, true
    /* mergeRef: true */
    );

    if (children) {
      normalizeChildren(cloned, children);
    }

    return cloned;
  } // class component normalization.


  if (isClassComponent(type)) {
    type = type.__vccOpts;
  } // class & style normalization.


  if (props) {
    // for reactive or proxy objects, we need to clone it to enable mutation.
    props = guardReactiveProps(props);
    let {
      class: klass,
      style
    } = props;

    if (klass && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(klass)) {
      props.class = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.normalizeClass)(klass);
    }

    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(style)) {
      // reactive state objects need to be cloned since they are likely to be
      // mutated
      if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isProxy)(style) && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(style)) {
        style = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)({}, style);
      }

      props.style = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.normalizeStyle)(style);
    }
  } // encode the vnode type information into a bitmap


  const shapeFlag = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(type) ? 1
  /* ELEMENT */
  : isSuspense(type) ? 128
  /* SUSPENSE */
  : isTeleport(type) ? 64
  /* TELEPORT */
  : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(type) ? 4
  /* STATEFUL_COMPONENT */
  : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(type) ? 2
  /* FUNCTIONAL_COMPONENT */
  : 0;

  if ( true && shapeFlag & 4
  /* STATEFUL_COMPONENT */
  && (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isProxy)(type)) {
    type = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRaw)(type);
    warn(`Vue received a Component which was made a reactive object. This can ` + `lead to unnecessary performance overhead, and should be avoided by ` + `marking the component with \`markRaw\` or using \`shallowRef\` ` + `instead of \`ref\`.`, `\nComponent that was made reactive: `, type);
  }

  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}

function guardReactiveProps(props) {
  if (!props) return null;
  return (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isProxy)(props) || InternalObjectKey in props ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)({}, props) : props;
}

function cloneVNode(vnode, extraProps, mergeRef = false) {
  // This is intentionally NOT using spread or extend to avoid the runtime
  // key enumeration cost.
  const {
    props,
    ref,
    patchFlag,
    children
  } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? // #2078 in the case of <component :is="vnode" ref="extra"/>
    // if the vnode itself already has a ref, cloneVNode will need to merge
    // the refs so the single vnode can be set on multiple refs
    mergeRef && ref ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children:  true && patchFlag === -1
    /* HOISTED */
    && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(children) ? children.map(deepCloneVNode) : children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 // hoisted node
    ? 16
    /* FULL_PROPS */
    : patchFlag | 16
    /* FULL_PROPS */
    : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
  return cloned;
}
/**
 * Dev only, for HMR of hoisted vnodes reused in v-for
 * https://github.com/vitejs/vite/issues/2022
 */


function deepCloneVNode(vnode) {
  const cloned = cloneVNode(vnode);

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(vnode.children)) {
    cloned.children = vnode.children.map(deepCloneVNode);
  }

  return cloned;
}
/**
 * @private
 */


function createTextVNode(text = ' ', flag = 0) {
  return createVNode(Text, null, text, flag);
}
/**
 * @private
 */


function createStaticVNode(content, numberOfNodes) {
  // A static vnode can contain multiple stringified elements, and the number
  // of elements is necessary for hydration.
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
/**
 * @private
 */


function createCommentVNode(text = '', // when used as the v-else branch, the comment node must be created as a
// block to ensure correct updates.
asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}

function normalizeVNode(child) {
  if (child == null || typeof child === 'boolean') {
    // empty placeholder
    return createVNode(Comment);
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(child)) {
    // fragment
    return createVNode(Fragment, null, // #3666, avoid reference pollution when reusing vnode
    child.slice());
  } else if (typeof child === 'object') {
    // already vnode, this should be the most common since compiled templates
    // always produce all-vnode children arrays
    return cloneIfMounted(child);
  } else {
    // strings and numbers
    return createVNode(Text, null, String(child));
  }
} // optimized normalization for template-compiled render fns


function cloneIfMounted(child) {
  return child.el === null || child.memo ? child : cloneVNode(child);
}

function normalizeChildren(vnode, children) {
  let type = 0;
  const {
    shapeFlag
  } = vnode;

  if (children == null) {
    children = null;
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(children)) {
    type = 16
    /* ARRAY_CHILDREN */
    ;
  } else if (typeof children === 'object') {
    if (shapeFlag & (1
    /* ELEMENT */
    | 64
    /* TELEPORT */
    )) {
      // Normalize slot to plain children for plain element and Teleport
      const slot = children.default;

      if (slot) {
        // _c marker is added by withCtx() indicating this is a compiled slot
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }

      return;
    } else {
      type = 32
      /* SLOTS_CHILDREN */
      ;
      const slotFlag = children._;

      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3
      /* FORWARDED */
      && currentRenderingInstance) {
        // a child component receives forwarded slots from the parent.
        // its slot type is determined by its parent's slot type.
        if (currentRenderingInstance.slots._ === 1
        /* STABLE */
        ) {
          children._ = 1
          /* STABLE */
          ;
        } else {
          children._ = 2
          /* DYNAMIC */
          ;
          vnode.patchFlag |= 1024
          /* DYNAMIC_SLOTS */
          ;
        }
      }
    }
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(children)) {
    children = {
      default: children,
      _ctx: currentRenderingInstance
    };
    type = 32
    /* SLOTS_CHILDREN */
    ;
  } else {
    children = String(children); // force teleport children to array so it can be moved around

    if (shapeFlag & 64
    /* TELEPORT */
    ) {
      type = 16
      /* ARRAY_CHILDREN */
      ;
      children = [createTextVNode(children)];
    } else {
      type = 8
      /* TEXT_CHILDREN */
      ;
    }
  }

  vnode.children = children;
  vnode.shapeFlag |= type;
}

function mergeProps(...args) {
  const ret = {};

  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];

    for (const key in toMerge) {
      if (key === 'class') {
        if (ret.class !== toMerge.class) {
          ret.class = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.normalizeClass)([ret.class, toMerge.class]);
        }
      } else if (key === 'style') {
        ret.style = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.normalizeStyle)([ret.style, toMerge.style]);
      } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isOn)(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];

        if (incoming && existing !== incoming && !((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== '') {
        ret[key] = toMerge[key];
      }
    }
  }

  return ret;
}

function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7
  /* VNODE_HOOK */
  , [vnode, prevVNode]);
}
/**
 * Actual implementation
 */


function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache && cache[index];

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(source) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(source)) {
    ret = new Array(source.length);

    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, undefined, cached && cached[i]);
    }
  } else if (typeof source === 'number') {
    if ( true && !Number.isInteger(source)) {
      warn(`The v-for range expect an integer value but got ${source}.`);
      return [];
    }

    ret = new Array(source);

    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, undefined, cached && cached[i]);
    }
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, undefined, cached && cached[i]));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);

      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }

  if (cache) {
    cache[index] = ret;
  }

  return ret;
}
/**
 * Compiler runtime helper for creating dynamic slots object
 * @private
 */


function createSlots(slots, dynamicSlots) {
  for (let i = 0; i < dynamicSlots.length; i++) {
    const slot = dynamicSlots[i]; // array of dynamic slot generated by <template v-for="..." #[...]>

    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(slot)) {
      for (let j = 0; j < slot.length; j++) {
        slots[slot[j].name] = slot[j].fn;
      }
    } else if (slot) {
      // conditional single slot generated by <template v-if="..." #foo>
      slots[slot.name] = slot.fn;
    }
  }

  return slots;
}
/**
 * Compiler runtime helper for rendering `<slot/>`
 * @private
 */


function renderSlot(slots, name, props = {}, // this is not a user-facing function, so the fallback is always generated by
// the compiler and guaranteed to be a function returning an array
fallback, noSlotted) {
  if (currentRenderingInstance.isCE) {
    return createVNode('slot', name === 'default' ? null : {
      name
    }, fallback && fallback());
  }

  let slot = slots[name];

  if ( true && slot && slot.length > 1) {
    warn(`SSR-optimized slot function detected in a non-SSR-optimized render ` + `function. You need to mark this component with $dynamic-slots in the ` + `parent template.`);

    slot = () => [];
  } // a compiled slot disables block tracking by default to avoid manual
  // invocation interfering with template-based block tracking, but in
  // `renderSlot` we can be sure that it's template-based so we can force
  // enable it.


  if (slot && slot._c) {
    slot._d = false;
  }

  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(Fragment, {
    key: props.key || `_${name}`
  }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1
  /* STABLE */
  ? 64
  /* STABLE_FRAGMENT */
  : -2
  /* BAIL */
  );

  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + '-s'];
  }

  if (slot && slot._c) {
    slot._d = true;
  }

  return rendered;
}

function ensureValidVNode(vnodes) {
  return vnodes.some(child => {
    if (!isVNode(child)) return true;
    if (child.type === Comment) return false;
    if (child.type === Fragment && !ensureValidVNode(child.children)) return false;
    return true;
  }) ? vnodes : null;
}
/**
 * For prefixing keys in v-on="obj" with "on"
 * @private
 */


function toHandlers(obj) {
  const ret = {};

  if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(obj)) {
    warn(`v-on with no argument expects an object value.`);
    return ret;
  }

  for (const key in obj) {
    ret[(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.toHandlerKey)(key)] = obj[key];
  }

  return ret;
}
/**
 * #2437 In Vue 3, functional components do not have a public instance proxy but
 * they exist in the internal parent chain. For code that relies on traversing
 * public $parent chains, skip functional ones and go to the parent instead.
 */


const getPublicInstance = i => {
  if (!i) return null;
  if (isStatefulComponent(i)) return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};

const publicPropertiesMap = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)(Object.create(null), {
  $: i => i,
  $el: i => i.vnode.el,
  $data: i => i.data,
  $props: i =>  true ? (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.shallowReadonly)(i.props) : 0,
  $attrs: i =>  true ? (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.shallowReadonly)(i.attrs) : 0,
  $slots: i =>  true ? (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.shallowReadonly)(i.slots) : 0,
  $refs: i =>  true ? (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.shallowReadonly)(i.refs) : 0,
  $parent: i => getPublicInstance(i.parent),
  $root: i => getPublicInstance(i.root),
  $emit: i => i.emit,
  $options: i =>  true ? resolveMergedOptions(i) : 0,
  $forceUpdate: i => () => queueJob(i.update),
  $nextTick: i => nextTick.bind(i.proxy),
  $watch: i =>  true ? instanceWatch.bind(i) : 0
});
const PublicInstanceProxyHandlers = {
  get({
    _: instance
  }, key) {
    const {
      ctx,
      setupState,
      data,
      props,
      accessCache,
      type,
      appContext
    } = instance; // for internal formatters to know that this is a Vue instance

    if ( true && key === '__isVue') {
      return true;
    } // prioritize <script setup> bindings during dev.
    // this allows even properties that start with _ or $ to be used - so that
    // it aligns with the production behavior where the render fn is inlined and
    // indeed has access to all declared variables.


    if ( true && setupState !== _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ && setupState.__isScriptSetup && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(setupState, key)) {
      return setupState[key];
    } // data / props / ctx
    // This getter gets called for every property access on the render context
    // during render and is a major hotspot. The most expensive part of this
    // is the multiple hasOwn() calls. It's much faster to do a simple property
    // access on a plain object, so we use an accessCache object (with null
    // prototype) to memoize what access type a key corresponds to.


    let normalizedProps;

    if (key[0] !== '$') {
      const n = accessCache[key];

      if (n !== undefined) {
        switch (n) {
          case 1
          /* SETUP */
          :
            return setupState[key];

          case 2
          /* DATA */
          :
            return data[key];

          case 4
          /* CONTEXT */
          :
            return ctx[key];

          case 3
          /* PROPS */
          :
            return props[key];
          // default: just fallthrough
        }
      } else if (setupState !== _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(setupState, key)) {
        accessCache[key] = 1
        /* SETUP */
        ;
        return setupState[key];
      } else if (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(data, key)) {
        accessCache[key] = 2
        /* DATA */
        ;
        return data[key];
      } else if ( // only cache other properties when instance has declared (thus stable)
      // props
      (normalizedProps = instance.propsOptions[0]) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(normalizedProps, key)) {
        accessCache[key] = 3
        /* PROPS */
        ;
        return props[key];
      } else if (ctx !== _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(ctx, key)) {
        accessCache[key] = 4
        /* CONTEXT */
        ;
        return ctx[key];
      } else if ( false || shouldCacheAccess) {
        accessCache[key] = 0
        /* OTHER */
        ;
      }
    }

    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties; // public $xxx properties

    if (publicGetter) {
      if (key === '$attrs') {
        (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.track)(instance, "get"
        /* GET */
        , key);
         true && markAttrsAccessed();
      }

      return publicGetter(instance);
    } else if ( // css module (injected by vue-loader)
    (cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
      return cssModule;
    } else if (ctx !== _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(ctx, key)) {
      // user may set custom properties to `this` that start with `$`
      accessCache[key] = 4
      /* CONTEXT */
      ;
      return ctx[key];
    } else if ( // global properties
    globalProperties = appContext.config.globalProperties, (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(globalProperties, key)) {
      {
        return globalProperties[key];
      }
    } else if ( true && currentRenderingInstance && (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    key.indexOf('__v') !== 0)) {
      if (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ && (key[0] === '$' || key[0] === '_') && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(data, key)) {
        warn(`Property ${JSON.stringify(key)} must be accessed via $data because it starts with a reserved ` + `character ("$" or "_") and is not proxied on the render context.`);
      } else if (instance === currentRenderingInstance) {
        warn(`Property ${JSON.stringify(key)} was accessed during render ` + `but is not defined on instance.`);
      }
    }
  },

  set({
    _: instance
  }, key, value) {
    const {
      data,
      setupState,
      ctx
    } = instance;

    if (setupState !== _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(data, key)) {
      data[key] = value;
      return true;
    } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(instance.props, key)) {
       true && warn(`Attempting to mutate prop "${key}". Props are readonly.`, instance);
      return false;
    }

    if (key[0] === '$' && key.slice(1) in instance) {
       true && warn(`Attempting to mutate public property "${key}". ` + `Properties starting with $ are reserved and readonly.`, instance);
      return false;
    } else {
      if ( true && key in instance.appContext.config.globalProperties) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          value
        });
      } else {
        ctx[key] = value;
      }
    }

    return true;
  },

  has({
    _: {
      data,
      setupState,
      accessCache,
      ctx,
      appContext,
      propsOptions
    }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(data, key) || setupState !== _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(setupState, key) || (normalizedProps = propsOptions[0]) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(normalizedProps, key) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(ctx, key) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(publicPropertiesMap, key) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.hasOwn)(appContext.config.globalProperties, key);
  },

  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      this.set(target, key, descriptor.get(), null);
    } else if (descriptor.value != null) {
      this.set(target, key, descriptor.value, null);
    }

    return Reflect.defineProperty(target, key, descriptor);
  }

};

if (true) {
  PublicInstanceProxyHandlers.ownKeys = target => {
    warn(`Avoid app logic that relies on enumerating keys on a component instance. ` + `The keys will be empty in production mode to avoid performance overhead.`);
    return Reflect.ownKeys(target);
  };
}

const RuntimeCompiledPublicInstanceProxyHandlers = /*#__PURE__*/(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)({}, PublicInstanceProxyHandlers, {
  get(target, key) {
    // fast path for unscopables when using `with` block
    if (key === Symbol.unscopables) {
      return;
    }

    return PublicInstanceProxyHandlers.get(target, key, target);
  },

  has(_, key) {
    const has = key[0] !== '_' && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isGloballyWhitelisted)(key);

    if ( true && !has && PublicInstanceProxyHandlers.has(_, key)) {
      warn(`Property ${JSON.stringify(key)} should not start with _ which is a reserved prefix for Vue internals.`);
    }

    return has;
  }

}); // dev only
// In dev mode, the proxy target exposes the same properties as seen on `this`
// for easier console inspection. In prod mode it will be an empty object so
// these properties definitions can be skipped.

function createDevRenderContext(instance) {
  const target = {}; // expose internal instance for proxy handlers

  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  }); // expose public properties

  Object.keys(publicPropertiesMap).forEach(key => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key](instance),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP
    });
  });
  return target;
} // dev only


function exposePropsOnRenderContext(instance) {
  const {
    ctx,
    propsOptions: [propsOptions]
  } = instance;

  if (propsOptions) {
    Object.keys(propsOptions).forEach(key => {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => instance.props[key],
        set: _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP
      });
    });
  }
} // dev only


function exposeSetupStateOnRenderContext(instance) {
  const {
    ctx,
    setupState
  } = instance;
  Object.keys((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRaw)(setupState)).forEach(key => {
    if (!setupState.__isScriptSetup) {
      if (key[0] === '$' || key[0] === '_') {
        warn(`setup() return property ${JSON.stringify(key)} should not start with "$" or "_" ` + `which are reserved prefixes for Vue internals.`);
        return;
      }

      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key],
        set: _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP
      });
    }
  });
}

const emptyAppContext = createAppContext();
let uid$1 = 0;

function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type; // inherit parent app context - or - if root, adopt from root vnode

  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid$1++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new _vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.EffectScope(true
    /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resovled assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    emitted: null,
    // props default value
    propsDefaults: _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ,
    data: _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ,
    props: _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ,
    attrs: _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ,
    slots: _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ,
    refs: _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ,
    setupState: _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };

  if (true) {
    instance.ctx = createDevRenderContext(instance);
  } else {}

  instance.root = parent ? parent.root : instance;
  instance.emit = emit$1.bind(null, instance); // apply custom element special handling

  if (vnode.ce) {
    vnode.ce(instance);
  }

  return instance;
}

let currentInstance = null;

const getCurrentInstance = () => currentInstance || currentRenderingInstance;

const setCurrentInstance = instance => {
  currentInstance = instance;
  instance.scope.on();
};

const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};

const isBuiltInTag = /*#__PURE__*/(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.makeMap)('slot,component');

function validateComponentName(name, config) {
  const appIsNativeTag = config.isNativeTag || _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NO;

  if (isBuiltInTag(name) || appIsNativeTag(name)) {
    warn('Do not use built-in or reserved HTML elements as component id: ' + name);
  }
}

function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4
  /* STATEFUL_COMPONENT */
  ;
}

let isInSSRComponentSetup = false;

function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const {
    props,
    children
  } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : undefined;
  isInSSRComponentSetup = false;
  return setupResult;
}

function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;

  if (true) {
    if (Component.name) {
      validateComponentName(Component.name, instance.appContext.config);
    }

    if (Component.components) {
      const names = Object.keys(Component.components);

      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config);
      }
    }

    if (Component.directives) {
      const names = Object.keys(Component.directives);

      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i]);
      }
    }

    if (Component.compilerOptions && isRuntimeOnly()) {
      warn(`"compilerOptions" is only supported when using a build of Vue that ` + `includes the runtime compiler. Since you are using a runtime-only ` + `build, the options should be passed via your build tool config instead.`);
    }
  } // 0. create render proxy property access cache


  instance.accessCache = Object.create(null); // 1. create public instance / render proxy
  // also mark it raw so it's never observed

  instance.proxy = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.markRaw)(new Proxy(instance.ctx, PublicInstanceProxyHandlers));

  if (true) {
    exposePropsOnRenderContext(instance);
  } // 2. call setup()


  const {
    setup
  } = Component;

  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.pauseTracking)();
    const setupResult = callWithErrorHandling(setup, instance, 0
    /* SETUP_FUNCTION */
    , [ true ? (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.shallowReadonly)(instance.props) : 0, setupContext]);
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.resetTracking)();
    unsetCurrentInstance();

    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isPromise)(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);

      if (isSSR) {
        // return the promise so server-renderer can wait on it
        return setupResult.then(resolvedResult => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch(e => {
          handleError(e, instance, 0
          /* SETUP_FUNCTION */
          );
        });
      } else {
        // async setup returned Promise.
        // bail here and wait for re-entry.
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}

function handleSetupResult(instance, setupResult, isSSR) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(setupResult)) {
    // setup returned an inline render function
    if (instance.type.__ssrInlineRender) {
      // when the function's name is `ssrRender` (compiled by SFC inline mode),
      // set it as ssrRender instead.
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(setupResult)) {
    if ( true && isVNode(setupResult)) {
      warn(`setup() should not return VNodes directly - ` + `return a render function instead.`);
    } // setup returned bindings.
    // assuming a render function compiled from template is present.


    if (true) {
      instance.devtoolsRawSetupState = setupResult;
    }

    instance.setupState = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.proxyRefs)(setupResult);

    if (true) {
      exposeSetupStateOnRenderContext(instance);
    }
  } else if ( true && setupResult !== undefined) {
    warn(`setup() should return an object. Received: ${setupResult === null ? 'null' : typeof setupResult}`);
  }

  finishComponentSetup(instance, isSSR);
}

let compile;
let installWithProxy;
/**
 * For runtime-dom to register the compiler.
 * Note the exported method uses any to avoid d.ts relying on the compiler types.
 */

function registerRuntimeCompiler(_compile) {
  compile = _compile;

  installWithProxy = i => {
    if (i.render._rc) {
      i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
    }
  };
} // dev only


const isRuntimeOnly = () => !compile;

function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type; // template / render function normalization
  // could be already set when returned from setup()

  if (!instance.render) {
    // only do on-the-fly compile if not in SSR - SSR on-the-fly compilation
    // is done by server-renderer
    if (!isSSR && compile && !Component.render) {
      const template = Component.template;

      if (template) {
        if (true) {
          startMeasure(instance, `compile`);
        }

        const {
          isCustomElement,
          compilerOptions
        } = instance.appContext.config;
        const {
          delimiters,
          compilerOptions: componentCompilerOptions
        } = Component;
        const finalCompilerOptions = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)({
          isCustomElement,
          delimiters
        }, compilerOptions), componentCompilerOptions);
        Component.render = compile(template, finalCompilerOptions);

        if (true) {
          endMeasure(instance, `compile`);
        }
      }
    }

    instance.render = Component.render || _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP; // for runtime-compiled render functions using `with` blocks, the render
    // proxy used needs a different `has` handler which is more performant and
    // also only allows a whitelist of globals to fallthrough.

    if (installWithProxy) {
      installWithProxy(instance);
    }
  } // support for 2.x options


  if (true) {
    setCurrentInstance(instance);
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.pauseTracking)();
    applyOptions(instance);
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.resetTracking)();
    unsetCurrentInstance();
  } // warn missing template/render
  // the runtime compilation of template in SSR is done by server-render


  if ( true && !Component.render && instance.render === _vue_shared__WEBPACK_IMPORTED_MODULE_2__.NOOP && !isSSR) {
    /* istanbul ignore if */
    if (!compile && Component.template) {
      warn(`Component provided template option but ` + `runtime compilation is not supported in this build of Vue.` + ` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
      /* should not happen */
      );
    } else {
      warn(`Component is missing template or render function.`);
    }
  }
}

function createAttrsProxy(instance) {
  return new Proxy(instance.attrs,  true ? {
    get(target, key) {
      markAttrsAccessed();
      (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.track)(instance, "get"
      /* GET */
      , '$attrs');
      return target[key];
    },

    set() {
      warn(`setupContext.attrs is readonly.`);
      return false;
    },

    deleteProperty() {
      warn(`setupContext.attrs is readonly.`);
      return false;
    }

  } : 0);
}

function createSetupContext(instance) {
  const expose = exposed => {
    if ( true && instance.exposed) {
      warn(`expose() should be called only once per setup().`);
    }

    instance.exposed = exposed || {};
  };

  let attrs;

  if (true) {
    // We use getters in dev in case libs like test-utils overwrite instance
    // properties (overwrites should not be done in prod)
    return Object.freeze({
      get attrs() {
        return attrs || (attrs = createAttrsProxy(instance));
      },

      get slots() {
        return (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.shallowReadonly)(instance.slots);
      },

      get emit() {
        return (event, ...args) => instance.emit(event, ...args);
      },

      expose
    });
  } else {}
}

function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.proxyRefs)((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.markRaw)(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      }

    }));
  }
}

const classifyRE = /(?:^|[-_])(\w)/g;

const classify = str => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');

function getComponentName(Component) {
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(Component) ? Component.displayName || Component.name : Component.name;
}
/* istanbul ignore next */


function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);

  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);

    if (match) {
      name = match[1];
    }
  }

  if (!name && instance && instance.parent) {
    // try to infer the name based on reverse resolution
    const inferFromRegistry = registry => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };

    name = inferFromRegistry(instance.components || instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
  }

  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}

function isClassComponent(value) {
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(value) && '__vccOpts' in value;
}

const computed = (getterOrOptions, debugOptions) => {
  // @ts-ignore
  return (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.computed)(getterOrOptions, debugOptions, isInSSRComponentSetup);
}; // dev only


const warnRuntimeUsage = method => warn(`${method}() is a compiler-hint helper that is only usable inside ` + `<script setup> of a single file component. Its arguments should be ` + `compiled away and passing it at runtime has no effect.`); // implementation


function defineProps() {
  if (true) {
    warnRuntimeUsage(`defineProps`);
  }

  return null;
} // implementation


function defineEmits() {
  if (true) {
    warnRuntimeUsage(`defineEmits`);
  }

  return null;
}
/**
 * Vue `<script setup>` compiler macro for declaring a component's exposed
 * instance properties when it is accessed by a parent component via template
 * refs.
 *
 * `<script setup>` components are closed by default - i.e. variables inside
 * the `<script setup>` scope is not exposed to parent unless explicitly exposed
 * via `defineExpose`.
 *
 * This is only usable inside `<script setup>`, is compiled away in the
 * output and should **not** be actually called at runtime.
 */


function defineExpose(exposed) {
  if (true) {
    warnRuntimeUsage(`defineExpose`);
  }
}
/**
 * Vue `<script setup>` compiler macro for providing props default values when
 * using type-based `defineProps` declaration.
 *
 * Example usage:
 * ```ts
 * withDefaults(defineProps<{
 *   size?: number
 *   labels?: string[]
 * }>(), {
 *   size: 3,
 *   labels: () => ['default label']
 * })
 * ```
 *
 * This is only usable inside `<script setup>`, is compiled away in the output
 * and should **not** be actually called at runtime.
 */


function withDefaults(props, defaults) {
  if (true) {
    warnRuntimeUsage(`withDefaults`);
  }

  return null;
}

function useSlots() {
  return getContext().slots;
}

function useAttrs() {
  return getContext().attrs;
}

function getContext() {
  const i = getCurrentInstance();

  if ( true && !i) {
    warn(`useContext() called without active instance.`);
  }

  return i.setupContext || (i.setupContext = createSetupContext(i));
}
/**
 * Runtime helper for merging default declarations. Imported by compiled code
 * only.
 * @internal
 */


function mergeDefaults(raw, defaults) {
  const props = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(raw) ? raw.reduce((normalized, p) => (normalized[p] = {}, normalized), {}) : raw;

  for (const key in defaults) {
    const opt = props[key];

    if (opt) {
      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(opt) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(opt)) {
        props[key] = {
          type: opt,
          default: defaults[key]
        };
      } else {
        opt.default = defaults[key];
      }
    } else if (opt === null) {
      props[key] = {
        default: defaults[key]
      };
    } else if (true) {
      warn(`props default key "${key}" has no corresponding declaration.`);
    }
  }

  return props;
}
/**
 * Used to create a proxy for the rest element when destructuring props with
 * defineProps().
 * @internal
 */


function createPropsRestProxy(props, excludedKeys) {
  const ret = {};

  for (const key in props) {
    if (!excludedKeys.includes(key)) {
      Object.defineProperty(ret, key, {
        enumerable: true,
        get: () => props[key]
      });
    }
  }

  return ret;
}
/**
 * `<script setup>` helper for persisting the current instance context over
 * async/await flows.
 *
 * `@vue/compiler-sfc` converts the following:
 *
 * ```ts
 * const x = await foo()
 * ```
 *
 * into:
 *
 * ```ts
 * let __temp, __restore
 * const x = (([__temp, __restore] = withAsyncContext(() => foo())),__temp=await __temp,__restore(),__temp)
 * ```
 * @internal
 */


function withAsyncContext(getAwaitable) {
  const ctx = getCurrentInstance();

  if ( true && !ctx) {
    warn(`withAsyncContext called without active current instance. ` + `This is likely a bug.`);
  }

  let awaitable = getAwaitable();
  unsetCurrentInstance();

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isPromise)(awaitable)) {
    awaitable = awaitable.catch(e => {
      setCurrentInstance(ctx);
      throw e;
    });
  }

  return [awaitable, () => setCurrentInstance(ctx)];
} // Actual implementation


function h(type, propsOrChildren, children) {
  const l = arguments.length;

  if (l === 2) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(propsOrChildren) && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(propsOrChildren)) {
      // single vnode without props
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      } // props without children


      return createVNode(type, propsOrChildren);
    } else {
      // omit props
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }

    return createVNode(type, propsOrChildren, children);
  }
}

const ssrContextKey = Symbol( true ? `ssrContext` : 0);

const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);

    if (!ctx) {
      warn(`Server rendering context not provided. Make sure to only call ` + `useSSRContext() conditionally in the server build.`);
    }

    return ctx;
  }
};

function isShallow(value) {
  return !!(value && value["__v_isShallow"
  /* IS_SHALLOW */
  ]);
}

function initCustomFormatter() {
  /* eslint-disable no-restricted-globals */
  if ( false || typeof window === 'undefined') {
    return;
  }

  const vueStyle = {
    style: 'color:#3ba776'
  };
  const numberStyle = {
    style: 'color:#0b1bc9'
  };
  const stringStyle = {
    style: 'color:#b62e24'
  };
  const keywordStyle = {
    style: 'color:#9d288c'
  }; // custom formatter for Chrome
  // https://www.mattzeunert.com/2016/02/19/custom-chrome-devtools-object-formatters.html

  const formatter = {
    header(obj) {
      // TODO also format ComponentPublicInstance & ctx.slots/attrs in setup
      if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(obj)) {
        return null;
      }

      if (obj.__isVue) {
        return ['div', vueStyle, `VueInstance`];
      } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isRef)(obj)) {
        return ['div', {}, ['span', vueStyle, genRefFlag(obj)], '<', formatValue(obj.value), `>`];
      } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isReactive)(obj)) {
        return ['div', {}, ['span', vueStyle, isShallow(obj) ? 'ShallowReactive' : 'Reactive'], '<', formatValue(obj), `>${(0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isReadonly)(obj) ? ` (readonly)` : ``}`];
      } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.isReadonly)(obj)) {
        return ['div', {}, ['span', vueStyle, isShallow(obj) ? 'ShallowReadonly' : 'Readonly'], '<', formatValue(obj), '>'];
      }

      return null;
    },

    hasBody(obj) {
      return obj && obj.__isVue;
    },

    body(obj) {
      if (obj && obj.__isVue) {
        return ['div', {}, ...formatInstance(obj.$)];
      }
    }

  };

  function formatInstance(instance) {
    const blocks = [];

    if (instance.type.props && instance.props) {
      blocks.push(createInstanceBlock('props', (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRaw)(instance.props)));
    }

    if (instance.setupState !== _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ) {
      blocks.push(createInstanceBlock('setup', instance.setupState));
    }

    if (instance.data !== _vue_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ) {
      blocks.push(createInstanceBlock('data', (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRaw)(instance.data)));
    }

    const computed = extractKeys(instance, 'computed');

    if (computed) {
      blocks.push(createInstanceBlock('computed', computed));
    }

    const injected = extractKeys(instance, 'inject');

    if (injected) {
      blocks.push(createInstanceBlock('injected', injected));
    }

    blocks.push(['div', {}, ['span', {
      style: keywordStyle.style + ';opacity:0.66'
    }, '$ (internal): '], ['object', {
      object: instance
    }]]);
    return blocks;
  }

  function createInstanceBlock(type, target) {
    target = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.extend)({}, target);

    if (!Object.keys(target).length) {
      return ['span', {}];
    }

    return ['div', {
      style: 'line-height:1.25em;margin-bottom:0.6em'
    }, ['div', {
      style: 'color:#476582'
    }, type], ['div', {
      style: 'padding-left:1.25em'
    }, ...Object.keys(target).map(key => {
      return ['div', {}, ['span', keywordStyle, key + ': '], formatValue(target[key], false)];
    })]];
  }

  function formatValue(v, asRaw = true) {
    if (typeof v === 'number') {
      return ['span', numberStyle, v];
    } else if (typeof v === 'string') {
      return ['span', stringStyle, JSON.stringify(v)];
    } else if (typeof v === 'boolean') {
      return ['span', keywordStyle, v];
    } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(v)) {
      return ['object', {
        object: asRaw ? (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_1__.toRaw)(v) : v
      }];
    } else {
      return ['span', stringStyle, String(v)];
    }
  }

  function extractKeys(instance, type) {
    const Comp = instance.type;

    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(Comp)) {
      return;
    }

    const extracted = {};

    for (const key in instance.ctx) {
      if (isKeyOfType(Comp, key, type)) {
        extracted[key] = instance.ctx[key];
      }
    }

    return extracted;
  }

  function isKeyOfType(Comp, key, type) {
    const opts = Comp[type];

    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(opts) && opts.includes(key) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_2__.isObject)(opts) && key in opts) {
      return true;
    }

    if (Comp.extends && isKeyOfType(Comp.extends, key, type)) {
      return true;
    }

    if (Comp.mixins && Comp.mixins.some(m => isKeyOfType(m, key, type))) {
      return true;
    }
  }

  function genRefFlag(v) {
    if (isShallow(v)) {
      return `ShallowRef`;
    }

    if (v.effect) {
      return `ComputedRef`;
    }

    return `Ref`;
  }

  if (window.devtoolsFormatters) {
    window.devtoolsFormatters.push(formatter);
  } else {
    window.devtoolsFormatters = [formatter];
  }
}

function withMemo(memo, render, cache, index) {
  const cached = cache[index];

  if (cached && isMemoSame(cached, memo)) {
    return cached;
  }

  const ret = render(); // shallow clone

  ret.memo = memo.slice();
  return cache[index] = ret;
}

function isMemoSame(cached, memo) {
  const prev = cached.memo;

  if (prev.length != memo.length) {
    return false;
  }

  for (let i = 0; i < prev.length; i++) {
    if (prev[i] !== memo[i]) {
      return false;
    }
  } // make sure to let parent block track it when returning cached


  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(cached);
  }

  return true;
} // Core API ------------------------------------------------------------------


const version = "3.2.31";
const _ssrUtils = {
  createComponentInstance,
  setupComponent,
  renderComponentRoot,
  setCurrentRenderingInstance,
  isVNode,
  normalizeVNode
};
/**
 * SSR utils for \@vue/server-renderer. Only exposed in cjs builds.
 * @internal
 */

const ssrUtils = _ssrUtils;
/**
 * @internal only exposed in compat builds
 */

const resolveFilter = null;
/**
 * @internal only exposed in compat builds.
 */

const compatUtils = null;


/***/ }),

/***/ "./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseTransition": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.BaseTransition; },
/* harmony export */   "Comment": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Comment; },
/* harmony export */   "EffectScope": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.EffectScope; },
/* harmony export */   "Fragment": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Fragment; },
/* harmony export */   "KeepAlive": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.KeepAlive; },
/* harmony export */   "ReactiveEffect": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.ReactiveEffect; },
/* harmony export */   "Static": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Static; },
/* harmony export */   "Suspense": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Suspense; },
/* harmony export */   "Teleport": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Teleport; },
/* harmony export */   "Text": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Text; },
/* harmony export */   "Transition": function() { return /* binding */ Transition; },
/* harmony export */   "TransitionGroup": function() { return /* binding */ TransitionGroup; },
/* harmony export */   "VueElement": function() { return /* binding */ VueElement; },
/* harmony export */   "callWithAsyncErrorHandling": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.callWithAsyncErrorHandling; },
/* harmony export */   "callWithErrorHandling": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling; },
/* harmony export */   "camelize": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.camelize; },
/* harmony export */   "capitalize": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.capitalize; },
/* harmony export */   "cloneVNode": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.cloneVNode; },
/* harmony export */   "compatUtils": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.compatUtils; },
/* harmony export */   "computed": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.computed; },
/* harmony export */   "createApp": function() { return /* binding */ createApp; },
/* harmony export */   "createBlock": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createBlock; },
/* harmony export */   "createCommentVNode": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode; },
/* harmony export */   "createElementBlock": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createElementBlock; },
/* harmony export */   "createElementVNode": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createElementVNode; },
/* harmony export */   "createHydrationRenderer": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createHydrationRenderer; },
/* harmony export */   "createPropsRestProxy": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createPropsRestProxy; },
/* harmony export */   "createRenderer": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createRenderer; },
/* harmony export */   "createSSRApp": function() { return /* binding */ createSSRApp; },
/* harmony export */   "createSlots": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createSlots; },
/* harmony export */   "createStaticVNode": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createStaticVNode; },
/* harmony export */   "createTextVNode": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createTextVNode; },
/* harmony export */   "createVNode": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createVNode; },
/* harmony export */   "customRef": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.customRef; },
/* harmony export */   "defineAsyncComponent": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineAsyncComponent; },
/* harmony export */   "defineComponent": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineComponent; },
/* harmony export */   "defineCustomElement": function() { return /* binding */ defineCustomElement; },
/* harmony export */   "defineEmits": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineEmits; },
/* harmony export */   "defineExpose": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineExpose; },
/* harmony export */   "defineProps": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineProps; },
/* harmony export */   "defineSSRCustomElement": function() { return /* binding */ defineSSRCustomElement; },
/* harmony export */   "devtools": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.devtools; },
/* harmony export */   "effect": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.effect; },
/* harmony export */   "effectScope": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.effectScope; },
/* harmony export */   "getCurrentInstance": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance; },
/* harmony export */   "getCurrentScope": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getCurrentScope; },
/* harmony export */   "getTransitionRawChildren": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getTransitionRawChildren; },
/* harmony export */   "guardReactiveProps": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.guardReactiveProps; },
/* harmony export */   "h": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.h; },
/* harmony export */   "handleError": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.handleError; },
/* harmony export */   "hydrate": function() { return /* binding */ hydrate; },
/* harmony export */   "initCustomFormatter": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.initCustomFormatter; },
/* harmony export */   "initDirectivesForSSR": function() { return /* binding */ initDirectivesForSSR; },
/* harmony export */   "inject": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.inject; },
/* harmony export */   "isMemoSame": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isMemoSame; },
/* harmony export */   "isProxy": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isProxy; },
/* harmony export */   "isReactive": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isReactive; },
/* harmony export */   "isReadonly": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isReadonly; },
/* harmony export */   "isRef": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isRef; },
/* harmony export */   "isRuntimeOnly": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isRuntimeOnly; },
/* harmony export */   "isShallow": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isShallow; },
/* harmony export */   "isVNode": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isVNode; },
/* harmony export */   "markRaw": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.markRaw; },
/* harmony export */   "mergeDefaults": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.mergeDefaults; },
/* harmony export */   "mergeProps": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.mergeProps; },
/* harmony export */   "nextTick": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.nextTick; },
/* harmony export */   "normalizeClass": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.normalizeClass; },
/* harmony export */   "normalizeProps": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.normalizeProps; },
/* harmony export */   "normalizeStyle": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.normalizeStyle; },
/* harmony export */   "onActivated": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onActivated; },
/* harmony export */   "onBeforeMount": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onBeforeMount; },
/* harmony export */   "onBeforeUnmount": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onBeforeUnmount; },
/* harmony export */   "onBeforeUpdate": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onBeforeUpdate; },
/* harmony export */   "onDeactivated": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onDeactivated; },
/* harmony export */   "onErrorCaptured": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onErrorCaptured; },
/* harmony export */   "onMounted": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onMounted; },
/* harmony export */   "onRenderTracked": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onRenderTracked; },
/* harmony export */   "onRenderTriggered": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onRenderTriggered; },
/* harmony export */   "onScopeDispose": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onScopeDispose; },
/* harmony export */   "onServerPrefetch": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onServerPrefetch; },
/* harmony export */   "onUnmounted": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onUnmounted; },
/* harmony export */   "onUpdated": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onUpdated; },
/* harmony export */   "openBlock": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.openBlock; },
/* harmony export */   "popScopeId": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.popScopeId; },
/* harmony export */   "provide": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.provide; },
/* harmony export */   "proxyRefs": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.proxyRefs; },
/* harmony export */   "pushScopeId": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.pushScopeId; },
/* harmony export */   "queuePostFlushCb": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.queuePostFlushCb; },
/* harmony export */   "reactive": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.reactive; },
/* harmony export */   "readonly": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.readonly; },
/* harmony export */   "ref": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.ref; },
/* harmony export */   "registerRuntimeCompiler": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.registerRuntimeCompiler; },
/* harmony export */   "render": function() { return /* binding */ render; },
/* harmony export */   "renderList": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.renderList; },
/* harmony export */   "renderSlot": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.renderSlot; },
/* harmony export */   "resolveComponent": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveComponent; },
/* harmony export */   "resolveDirective": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveDirective; },
/* harmony export */   "resolveDynamicComponent": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveDynamicComponent; },
/* harmony export */   "resolveFilter": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveFilter; },
/* harmony export */   "resolveTransitionHooks": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveTransitionHooks; },
/* harmony export */   "setBlockTracking": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.setBlockTracking; },
/* harmony export */   "setDevtoolsHook": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.setDevtoolsHook; },
/* harmony export */   "setTransitionHooks": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.setTransitionHooks; },
/* harmony export */   "shallowReactive": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.shallowReactive; },
/* harmony export */   "shallowReadonly": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly; },
/* harmony export */   "shallowRef": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.shallowRef; },
/* harmony export */   "ssrContextKey": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.ssrContextKey; },
/* harmony export */   "ssrUtils": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.ssrUtils; },
/* harmony export */   "stop": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.stop; },
/* harmony export */   "toDisplayString": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.toDisplayString; },
/* harmony export */   "toHandlerKey": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.toHandlerKey; },
/* harmony export */   "toHandlers": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.toHandlers; },
/* harmony export */   "toRaw": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.toRaw; },
/* harmony export */   "toRef": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.toRef; },
/* harmony export */   "toRefs": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.toRefs; },
/* harmony export */   "transformVNodeArgs": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.transformVNodeArgs; },
/* harmony export */   "triggerRef": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.triggerRef; },
/* harmony export */   "unref": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.unref; },
/* harmony export */   "useAttrs": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.useAttrs; },
/* harmony export */   "useCssModule": function() { return /* binding */ useCssModule; },
/* harmony export */   "useCssVars": function() { return /* binding */ useCssVars; },
/* harmony export */   "useSSRContext": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.useSSRContext; },
/* harmony export */   "useSlots": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.useSlots; },
/* harmony export */   "useTransitionState": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.useTransitionState; },
/* harmony export */   "vModelCheckbox": function() { return /* binding */ vModelCheckbox; },
/* harmony export */   "vModelDynamic": function() { return /* binding */ vModelDynamic; },
/* harmony export */   "vModelRadio": function() { return /* binding */ vModelRadio; },
/* harmony export */   "vModelSelect": function() { return /* binding */ vModelSelect; },
/* harmony export */   "vModelText": function() { return /* binding */ vModelText; },
/* harmony export */   "vShow": function() { return /* binding */ vShow; },
/* harmony export */   "version": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.version; },
/* harmony export */   "warn": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn; },
/* harmony export */   "watch": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.watch; },
/* harmony export */   "watchEffect": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.watchEffect; },
/* harmony export */   "watchPostEffect": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.watchPostEffect; },
/* harmony export */   "watchSyncEffect": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.watchSyncEffect; },
/* harmony export */   "withAsyncContext": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.withAsyncContext; },
/* harmony export */   "withCtx": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.withCtx; },
/* harmony export */   "withDefaults": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.withDefaults; },
/* harmony export */   "withDirectives": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.withDirectives; },
/* harmony export */   "withKeys": function() { return /* binding */ withKeys; },
/* harmony export */   "withMemo": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.withMemo; },
/* harmony export */   "withModifiers": function() { return /* binding */ withModifiers; },
/* harmony export */   "withScopeId": function() { return /* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.withScopeId; }
/* harmony export */ });
/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");
/* harmony import */ var _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/runtime-core */ "./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js");
/* harmony import */ var _vue_runtime_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vue/runtime-core */ "./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js");



const svgNS = 'http://www.w3.org/2000/svg';
const doc = typeof document !== 'undefined' ? document : null;
const templateContainer = doc && doc.createElement('template');
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: child => {
    const parent = child.parentNode;

    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? {
      is
    } : undefined);

    if (tag === 'select' && props && props.multiple != null) {
      el.setAttribute('multiple', props.multiple);
    }

    return el;
  },
  createText: text => doc.createTextNode(text),
  createComment: text => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: node => node.parentNode,
  nextSibling: node => node.nextSibling,
  querySelector: selector => doc.querySelector(selector),

  setScopeId(el, id) {
    el.setAttribute(id, '');
  },

  cloneNode(el) {
    const cloned = el.cloneNode(true); // #3072
    // - in `patchDOMProp`, we store the actual value in the `el._value` property.
    // - normally, elements using `:value` bindings will not be hoisted, but if
    //   the bound value is a constant, e.g. `:value="true"` - they do get
    //   hoisted.
    // - in production, hoisted nodes are cloned when subsequent inserts, but
    //   cloneNode() does not copy the custom property we attached.
    // - This may need to account for other custom DOM properties we attach to
    //   elements in addition to `_value` in the future.

    if (`_value` in el) {
      cloned._value = el._value;
    }

    return cloned;
  },

  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    // <parent> before | first ... last | anchor </parent>
    const before = anchor ? anchor.previousSibling : parent.lastChild; // #5308 can only take cached path if:
    // - has a single root node
    // - nextSibling info is still available

    if (start && (start === end || start.nextSibling)) {
      // cached
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling)) break;
      }
    } else {
      // fresh insert
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;

      if (isSVG) {
        // remove outer svg wrapper
        const wrapper = template.firstChild;

        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }

        template.removeChild(wrapper);
      }

      parent.insertBefore(template, anchor);
    }

    return [// first
    before ? before.nextSibling : parent.firstChild, // last
    anchor ? anchor.previousSibling : parent.lastChild];
  }

}; // compiler should normalize class + :class bindings on the same element
// into a single binding ['staticClass', dynamic]

function patchClass(el, value, isSVG) {
  // directly setting className should be faster than setAttribute in theory
  // if this is an element during a transition, take the temporary transition
  // classes into account.
  const transitionClasses = el._vtc;

  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(' ');
  }

  if (value == null) {
    el.removeAttribute('class');
  } else if (isSVG) {
    el.setAttribute('class', value);
  } else {
    el.className = value;
  }
}

function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(next);

  if (next && !isCssString) {
    for (const key in next) {
      setStyle(style, key, next[key]);
    }

    if (prev && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, '');
        }
      }
    }
  } else {
    const currentDisplay = style.display;

    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute('style');
    } // indicates that the `display` of the element is controlled by `v-show`,
    // so we always keep the current `display` value regardless of the `style`
    // value, thus handing over control to `v-show`.


    if ('_vod' in el) {
      style.display = currentDisplay;
    }
  }
}

const importantRE = /\s*!important$/;

function setStyle(style, name, val) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(val)) {
    val.forEach(v => setStyle(style, name, v));
  } else {
    if (name.startsWith('--')) {
      // custom property definition
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);

      if (importantRE.test(val)) {
        // !important
        style.setProperty((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(prefixed), val.replace(importantRE, ''), 'important');
      } else {
        style[prefixed] = val;
      }
    }
  }
}

const prefixes = ['Webkit', 'Moz', 'ms'];
const prefixCache = {};

function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];

  if (cached) {
    return cached;
  }

  let name = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(rawName);

  if (name !== 'filter' && name in style) {
    return prefixCache[rawName] = name;
  }

  name = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.capitalize)(name);

  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;

    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }

  return rawName;
}

const xlinkNS = 'http://www.w3.org/1999/xlink';

function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith('xlink:')) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    // note we are only checking boolean attributes that don't have a
    // corresponding dom prop of the same name here.
    const isBoolean = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSpecialBooleanAttr)(key);

    if (value == null || isBoolean && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.includeBooleanAttr)(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? '' : value);
    }
  }
} // __UNSAFE__
// functions. The user is responsible for using them with only trusted content.


function patchDOMProp(el, key, value, // the following args are passed only due to potential innerHTML/textContent
// overriding existing VNodes, in which case the old tree must be properly
// unmounted.
prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === 'innerHTML' || key === 'textContent') {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }

    el[key] = value == null ? '' : value;
    return;
  }

  if (key === 'value' && el.tagName !== 'PROGRESS' && // custom elements may use _value internally
  !el.tagName.includes('-')) {
    // store value as _value as well since
    // non-string values will be stringified.
    el._value = value;
    const newValue = value == null ? '' : value;

    if (el.value !== newValue || // #4956: always set for OPTION elements because its value falls back to
    // textContent if no value attribute is present. And setting .value for
    // OPTION has no side effect
    el.tagName === 'OPTION') {
      el.value = newValue;
    }

    if (value == null) {
      el.removeAttribute(key);
    }

    return;
  }

  if (value === '' || value == null) {
    const type = typeof el[key];

    if (type === 'boolean') {
      // e.g. <select multiple> compiles to { multiple: '' }
      el[key] = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.includeBooleanAttr)(value);
      return;
    } else if (value == null && type === 'string') {
      // e.g. <div :id="null">
      el[key] = '';
      el.removeAttribute(key);
      return;
    } else if (type === 'number') {
      // e.g. <img :width="null">
      // the value of some IDL attr must be greater than 0, e.g. input.size = 0 -> error
      try {
        el[key] = 0;
      } catch (_a) {}

      el.removeAttribute(key);
      return;
    }
  } // some properties perform value validation and throw


  try {
    el[key] = value;
  } catch (e) {
    if (true) {
      (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`Failed setting prop "${key}" on <${el.tagName.toLowerCase()}>: ` + `value ${value} is invalid.`, e);
    }
  }
} // Async edge case fix requires storing an event listener's attach timestamp.


let _getNow = Date.now;
let skipTimestampCheck = false;

if (typeof window !== 'undefined') {
  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  if (_getNow() > document.createEvent('Event').timeStamp) {
    // if the low-res timestamp which is bigger than the event timestamp
    // (which is evaluated AFTER) it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listeners as well.
    _getNow = () => performance.now();
  } // #3485: Firefox <= 53 has incorrect Event.timeStamp implementation
  // and does not fire microtasks in between event propagation, so safe to exclude.


  const ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
  skipTimestampCheck = !!(ffMatch && Number(ffMatch[1]) <= 53);
} // To avoid the overhead of repeatedly calling performance.now(), we cache
// and use the same timestamp for all event listeners attached in the same tick.


let cachedNow = 0;
const p = Promise.resolve();

const reset = () => {
  cachedNow = 0;
};

const getNow = () => cachedNow || (p.then(reset), cachedNow = _getNow());

function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}

function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}

function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  // vei = vue event invokers
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];

  if (nextValue && existingInvoker) {
    // patch
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);

    if (nextValue) {
      // add
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      // remove
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = undefined;
    }
  }
}

const optionsModifierRE = /(?:Once|Passive|Capture)$/;

function parseName(name) {
  let options;

  if (optionsModifierRE.test(name)) {
    options = {};
    let m;

    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }

  return [(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(name.slice(2)), options];
}

function createInvoker(initialValue, instance) {
  const invoker = e => {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    const timeStamp = e.timeStamp || _getNow();

    if (skipTimestampCheck || timeStamp >= invoker.attached - 1) {
      (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.callWithAsyncErrorHandling)(patchStopImmediatePropagation(e, invoker.value), instance, 5
      /* NATIVE_EVENT_HANDLER */
      , [e]);
    }
  };

  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}

function patchStopImmediatePropagation(e, value) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(value)) {
    const originalStop = e.stopImmediatePropagation;

    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };

    return value.map(fn => e => !e._stopped && fn && fn(e));
  } else {
    return value;
  }
}

const nativeOnRE = /^on[a-z]/;

const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === 'class') {
    patchClass(el, nextValue, isSVG);
  } else if (key === 'style') {
    patchStyle(el, prevValue, nextValue);
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isOn)(key)) {
    // ignore v-model listeners
    if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isModelListener)(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === '.' ? (key = key.slice(1), true) : key[0] === '^' ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
  } else {
    // special case for <input v-model type="checkbox"> with
    // :true-value & :false-value
    // store value as dom properties since non-string values will be
    // stringified.
    if (key === 'true-value') {
      el._trueValue = nextValue;
    } else if (key === 'false-value') {
      el._falseValue = nextValue;
    }

    patchAttr(el, key, nextValue, isSVG);
  }
};

function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    // most keys must be set as attribute on svg elements to work
    // ...except innerHTML & textContent
    if (key === 'innerHTML' || key === 'textContent') {
      return true;
    } // or native onclick with function values


    if (key in el && nativeOnRE.test(key) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value)) {
      return true;
    }

    return false;
  } // spellcheck and draggable are numerated attrs, however their
  // corresponding DOM properties are actually booleans - this leads to
  // setting it with a string "false" value leading it to be coerced to
  // `true`, so we need to always treat them as attributes.
  // Note that `contentEditable` doesn't have this problem: its DOM
  // property is also enumerated string values.


  if (key === 'spellcheck' || key === 'draggable') {
    return false;
  } // #1787, #2840 form property on form elements is readonly and must be set as
  // attribute.


  if (key === 'form') {
    return false;
  } // #1526 <input list> must be set as attribute


  if (key === 'list' && el.tagName === 'INPUT') {
    return false;
  } // #2766 <textarea type> must be set as attribute


  if (key === 'type' && el.tagName === 'TEXTAREA') {
    return false;
  } // native onclick with string value, must be set as attribute


  if (nativeOnRE.test(key) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(value)) {
    return false;
  }

  return key in el;
}

function defineCustomElement(options, hydate) {
  const Comp = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineComponent)(options);

  class VueCustomElement extends VueElement {
    constructor(initialProps) {
      super(Comp, initialProps, hydate);
    }

  }

  VueCustomElement.def = Comp;
  return VueCustomElement;
}

const defineSSRCustomElement = options => {
  // @ts-ignore
  return defineCustomElement(options, hydrate);
};

const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class VueElement extends BaseClass {
  constructor(_def, _props = {}, hydrate) {
    super();
    this._def = _def;
    this._props = _props;
    /**
     * @internal
     */

    this._instance = null;
    this._connected = false;
    this._resolved = false;
    this._numberProps = null;

    if (this.shadowRoot && hydrate) {
      hydrate(this._createVNode(), this.shadowRoot);
    } else {
      if ( true && this.shadowRoot) {
        (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`Custom element has pre-rendered declarative shadow root but is not ` + `defined as hydratable. Use \`defineSSRCustomElement\`.`);
      }

      this.attachShadow({
        mode: 'open'
      });
    }
  }

  connectedCallback() {
    this._connected = true;

    if (!this._instance) {
      this._resolveDef();
    }
  }

  disconnectedCallback() {
    this._connected = false;
    (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.nextTick)(() => {
      if (!this._connected) {
        render(null, this.shadowRoot);
        this._instance = null;
      }
    });
  }
  /**
   * resolve inner component definition (handle possible async component)
   */


  _resolveDef() {
    if (this._resolved) {
      return;
    }

    this._resolved = true; // set initial attrs

    for (let i = 0; i < this.attributes.length; i++) {
      this._setAttr(this.attributes[i].name);
    } // watch future attr changes


    new MutationObserver(mutations => {
      for (const m of mutations) {
        this._setAttr(m.attributeName);
      }
    }).observe(this, {
      attributes: true
    });

    const resolve = def => {
      const {
        props,
        styles
      } = def;
      const hasOptions = !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(props);
      const rawKeys = props ? hasOptions ? Object.keys(props) : props : []; // cast Number-type props set before resolve

      let numberProps;

      if (hasOptions) {
        for (const key in this._props) {
          const opt = props[key];

          if (opt === Number || opt && opt.type === Number) {
            this._props[key] = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toNumber)(this._props[key]);
            (numberProps || (numberProps = Object.create(null)))[key] = true;
          }
        }
      }

      this._numberProps = numberProps; // check if there are props set pre-upgrade or connect

      for (const key of Object.keys(this)) {
        if (key[0] !== '_') {
          this._setProp(key, this[key], true, false);
        }
      } // defining getter/setters on prototype


      for (const key of rawKeys.map(_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)) {
        Object.defineProperty(this, key, {
          get() {
            return this._getProp(key);
          },

          set(val) {
            this._setProp(key, val);
          }

        });
      } // apply CSS


      this._applyStyles(styles); // initial render


      this._update();
    };

    const asyncDef = this._def.__asyncLoader;

    if (asyncDef) {
      asyncDef().then(resolve);
    } else {
      resolve(this._def);
    }
  }

  _setAttr(key) {
    let value = this.getAttribute(key);

    if (this._numberProps && this._numberProps[key]) {
      value = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toNumber)(value);
    }

    this._setProp((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(key), value, false);
  }
  /**
   * @internal
   */


  _getProp(key) {
    return this._props[key];
  }
  /**
   * @internal
   */


  _setProp(key, val, shouldReflect = true, shouldUpdate = true) {
    if (val !== this._props[key]) {
      this._props[key] = val;

      if (shouldUpdate && this._instance) {
        this._update();
      } // reflect


      if (shouldReflect) {
        if (val === true) {
          this.setAttribute((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(key), '');
        } else if (typeof val === 'string' || typeof val === 'number') {
          this.setAttribute((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(key), val + '');
        } else if (!val) {
          this.removeAttribute((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(key));
        }
      }
    }
  }

  _update() {
    render(this._createVNode(), this.shadowRoot);
  }

  _createVNode() {
    const vnode = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createVNode)(this._def, (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({}, this._props));

    if (!this._instance) {
      vnode.ce = instance => {
        this._instance = instance;
        instance.isCE = true; // HMR

        if (true) {
          instance.ceReload = newStyles => {
            // always reset styles
            if (this._styles) {
              this._styles.forEach(s => this.shadowRoot.removeChild(s));

              this._styles.length = 0;
            }

            this._applyStyles(newStyles); // if this is an async component, ceReload is called from the inner
            // component so no need to reload the async wrapper


            if (!this._def.__asyncLoader) {
              // reload
              this._instance = null;

              this._update();
            }
          };
        } // intercept emit


        instance.emit = (event, ...args) => {
          this.dispatchEvent(new CustomEvent(event, {
            detail: args
          }));
        }; // locate nearest Vue custom element parent for provide/inject


        let parent = this;

        while (parent = parent && (parent.parentNode || parent.host)) {
          if (parent instanceof VueElement) {
            instance.parent = parent._instance;
            break;
          }
        }
      };
    }

    return vnode;
  }

  _applyStyles(styles) {
    if (styles) {
      styles.forEach(css => {
        const s = document.createElement('style');
        s.textContent = css;
        this.shadowRoot.appendChild(s); // record for HMR

        if (true) {
          (this._styles || (this._styles = [])).push(s);
        }
      });
    }
  }

}

function useCssModule(name = '$style') {
  /* istanbul ignore else */
  {
    const instance = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance)();

    if (!instance) {
       true && (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`useCssModule must be called inside setup()`);
      return _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ;
    }

    const modules = instance.type.__cssModules;

    if (!modules) {
       true && (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`Current instance does not have CSS modules injected.`);
      return _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ;
    }

    const mod = modules[name];

    if (!mod) {
       true && (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`Current instance does not have CSS module named "${name}".`);
      return _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ;
    }

    return mod;
  }
}
/**
 * Runtime helper for SFC's CSS variable injection feature.
 * @private
 */


function useCssVars(getter) {
  const instance = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance)();
  /* istanbul ignore next */

  if (!instance) {
     true && (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`useCssVars is called without current active component instance.`);
    return;
  }

  const setVars = () => setVarsOnVNode(instance.subTree, getter(instance.proxy));

  (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.watchPostEffect)(setVars);
  (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onMounted)(() => {
    const ob = new MutationObserver(setVars);
    ob.observe(instance.subTree.el.parentNode, {
      childList: true
    });
    (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(() => ob.disconnect());
  });
}

function setVarsOnVNode(vnode, vars) {
  if (vnode.shapeFlag & 128
  /* SUSPENSE */
  ) {
    const suspense = vnode.suspense;
    vnode = suspense.activeBranch;

    if (suspense.pendingBranch && !suspense.isHydrating) {
      suspense.effects.push(() => {
        setVarsOnVNode(suspense.activeBranch, vars);
      });
    }
  } // drill down HOCs until it's a non-component vnode


  while (vnode.component) {
    vnode = vnode.component.subTree;
  }

  if (vnode.shapeFlag & 1
  /* ELEMENT */
  && vnode.el) {
    setVarsOnNode(vnode.el, vars);
  } else if (vnode.type === _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Fragment) {
    vnode.children.forEach(c => setVarsOnVNode(c, vars));
  } else if (vnode.type === _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Static) {
    let {
      el,
      anchor
    } = vnode;

    while (el) {
      setVarsOnNode(el, vars);
      if (el === anchor) break;
      el = el.nextSibling;
    }
  }
}

function setVarsOnNode(el, vars) {
  if (el.nodeType === 1) {
    const style = el.style;

    for (const key in vars) {
      style.setProperty(`--${key}`, vars[key]);
    }
  }
}

const TRANSITION = 'transition';
const ANIMATION = 'animation'; // DOM Transition is a higher-order-component based on the platform-agnostic
// base Transition component, with DOM-specific logic.

const Transition = (props, {
  slots
}) => (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.h)(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.BaseTransition, resolveTransitionProps(props), slots);

Transition.displayName = 'Transition';
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
const TransitionPropsValidators = Transition.props = /*#__PURE__*/(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({}, _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.BaseTransition.props, DOMTransitionPropsValidators);
/**
 * #3227 Incoming hooks may be merged into arrays when wrapping Transition
 * with custom HOCs.
 */

const callHook = (hook, args = []) => {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(hook)) {
    hook.forEach(h => h(...args));
  } else if (hook) {
    hook(...args);
  }
};
/**
 * Check if a hook expects a callback (2nd arg), which means the user
 * intends to explicitly control the end of the transition.
 */


const hasExplicitCallback = hook => {
  return hook ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(hook) ? hook.some(h => h.length > 1) : hook.length > 1 : false;
};

function resolveTransitionProps(rawProps) {
  const baseProps = {};

  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }

  if (rawProps.css === false) {
    return baseProps;
  }

  const {
    name = 'v',
    type,
    duration,
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    appearFromClass = enterFromClass,
    appearActiveClass = enterActiveClass,
    appearToClass = enterToClass,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`
  } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const {
    onBeforeEnter,
    onEnter,
    onEnterCancelled,
    onLeave,
    onLeaveCancelled,
    onBeforeAppear = onBeforeEnter,
    onAppear = onEnter,
    onAppearCancelled = onEnterCancelled
  } = baseProps;

  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };

  const finishLeave = (el, done) => {
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };

  const makeEnterHook = isAppear => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;

      const resolve = () => finishEnter(el, isAppear, done);

      callHook(hook, [el, resolve]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);

        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve);
        }
      });
    };
  };

  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },

    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },

    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),

    onLeave(el, done) {
      const resolve = () => finishLeave(el, done);

      addTransitionClass(el, leaveFromClass); // force reflow so *-leave-from classes immediately take effect (#2593)

      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);

        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve);
        }
      });
      callHook(onLeave, [el, resolve]);
    },

    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },

    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },

    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }

  });
}

function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}

function NumberOf(val) {
  const res = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toNumber)(val);
  if (true) validateDuration(res);
  return res;
}

function validateDuration(val) {
  if (typeof val !== 'number') {
    (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`<transition> explicit duration is not a valid number - ` + `got ${JSON.stringify(val)}.`);
  } else if (isNaN(val)) {
    (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`<transition> explicit duration is NaN - ` + 'the duration expression might be incorrect.');
  }
}

function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach(c => c && el.classList.add(c));
  (el._vtc || (el._vtc = new Set())).add(cls);
}

function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach(c => c && el.classList.remove(c));
  const {
    _vtc
  } = el;

  if (_vtc) {
    _vtc.delete(cls);

    if (!_vtc.size) {
      el._vtc = undefined;
    }
  }
}

function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}

let endId = 0;

function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
  const id = el._endId = ++endId;

  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve();
    }
  };

  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }

  const {
    type,
    timeout,
    propCount
  } = getTransitionInfo(el, expectedType);

  if (!type) {
    return resolve();
  }

  const endEvent = type + 'end';
  let ended = 0;

  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };

  const onEnd = e => {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };

  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}

function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el); // JSDOM may return undefined for transition properties

  const getStyleProperties = key => (styles[key] || '').split(', ');

  const transitionDelays = getStyleProperties(TRANSITION + 'Delay');
  const transitionDurations = getStyleProperties(TRANSITION + 'Duration');
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(ANIMATION + 'Delay');
  const animationDurations = getStyleProperties(ANIMATION + 'Duration');
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  /* istanbul ignore if */

  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }

  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(styles[TRANSITION + 'Property']);
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}

function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
} // Old versions of Chromium (below 61.0.3163.100) formats floating pointer
// numbers in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down
// (i.e. acting as a floor function) causing unexpected behaviors


function toMs(s) {
  return Number(s.slice(0, -1).replace(',', '.')) * 1000;
} // synchronously force layout to put elements into a certain state


function forceReflow() {
  return document.body.offsetHeight;
}

const positionMap = new WeakMap();
const newPositionMap = new WeakMap();
const TransitionGroupImpl = {
  name: 'TransitionGroup',
  props: /*#__PURE__*/(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({}, TransitionPropsValidators, {
    tag: String,
    moveClass: String
  }),

  setup(props, {
    slots
  }) {
    const instance = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance)();
    const state = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.useTransitionState)();
    let prevChildren;
    let children;
    (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onUpdated)(() => {
      // children is guaranteed to exist after initial render
      if (!prevChildren.length) {
        return;
      }

      const moveClass = props.moveClass || `${props.name || 'v'}-move`;

      if (!hasCSSTransform(prevChildren[0].el, instance.vnode.el, moveClass)) {
        return;
      } // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.


      prevChildren.forEach(callPendingCbs);
      prevChildren.forEach(recordPosition);
      const movedChildren = prevChildren.filter(applyTranslation); // force reflow to put everything in position

      forceReflow();
      movedChildren.forEach(c => {
        const el = c.el;
        const style = el.style;
        addTransitionClass(el, moveClass);
        style.transform = style.webkitTransform = style.transitionDuration = '';

        const cb = el._moveCb = e => {
          if (e && e.target !== el) {
            return;
          }

          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener('transitionend', cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        };

        el.addEventListener('transitionend', cb);
      });
    });
    return () => {
      const rawProps = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_2__.toRaw)(props);
      const cssTransitionProps = resolveTransitionProps(rawProps);
      let tag = rawProps.tag || _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Fragment;
      prevChildren = children;
      children = slots.default ? (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getTransitionRawChildren)(slots.default()) : [];

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child.key != null) {
          (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.setTransitionHooks)(child, (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveTransitionHooks)(child, cssTransitionProps, state, instance));
        } else if (true) {
          (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`<TransitionGroup> children must be keyed.`);
        }
      }

      if (prevChildren) {
        for (let i = 0; i < prevChildren.length; i++) {
          const child = prevChildren[i];
          (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.setTransitionHooks)(child, (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveTransitionHooks)(child, cssTransitionProps, state, instance));
          positionMap.set(child, child.el.getBoundingClientRect());
        }
      }

      return (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createVNode)(tag, null, children);
    };
  }

};
const TransitionGroup = TransitionGroupImpl;

function callPendingCbs(c) {
  const el = c.el;

  if (el._moveCb) {
    el._moveCb();
  }

  if (el._enterCb) {
    el._enterCb();
  }
}

function recordPosition(c) {
  newPositionMap.set(c, c.el.getBoundingClientRect());
}

function applyTranslation(c) {
  const oldPos = positionMap.get(c);
  const newPos = newPositionMap.get(c);
  const dx = oldPos.left - newPos.left;
  const dy = oldPos.top - newPos.top;

  if (dx || dy) {
    const s = c.el.style;
    s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
    s.transitionDuration = '0s';
    return c;
  }
}

function hasCSSTransform(el, root, moveClass) {
  // Detect whether an element with the move class applied has
  // CSS transitions. Since the element may be inside an entering
  // transition at this very moment, we make a clone of it and remove
  // all other transition classes applied to ensure only the move class
  // is applied.
  const clone = el.cloneNode();

  if (el._vtc) {
    el._vtc.forEach(cls => {
      cls.split(/\s+/).forEach(c => c && clone.classList.remove(c));
    });
  }

  moveClass.split(/\s+/).forEach(c => c && clone.classList.add(c));
  clone.style.display = 'none';
  const container = root.nodeType === 1 ? root : root.parentNode;
  container.appendChild(clone);
  const {
    hasTransform
  } = getTransitionInfo(clone);
  container.removeChild(clone);
  return hasTransform;
}

const getModelAssigner = vnode => {
  const fn = vnode.props['onUpdate:modelValue'];
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(fn) ? value => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.invokeArrayFns)(fn, value) : fn;
};

function onCompositionStart(e) {
  e.target.composing = true;
}

function onCompositionEnd(e) {
  const target = e.target;

  if (target.composing) {
    target.composing = false;
    trigger(target, 'input');
  }
}

function trigger(el, type) {
  const e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
} // We are exporting the v-model runtime directly as vnode hooks so that it can
// be tree-shaken in case v-model is never used.


const vModelText = {
  created(el, {
    modifiers: {
      lazy,
      trim,
      number
    }
  }, vnode) {
    el._assign = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === 'number';
    addEventListener(el, lazy ? 'change' : 'input', e => {
      if (e.target.composing) return;
      let domValue = el.value;

      if (trim) {
        domValue = domValue.trim();
      } else if (castToNumber) {
        domValue = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toNumber)(domValue);
      }

      el._assign(domValue);
    });

    if (trim) {
      addEventListener(el, 'change', () => {
        el.value = el.value.trim();
      });
    }

    if (!lazy) {
      addEventListener(el, 'compositionstart', onCompositionStart);
      addEventListener(el, 'compositionend', onCompositionEnd); // Safari < 10.2 & UIWebView doesn't fire compositionend when
      // switching focus before confirming composition choice
      // this also fixes the issue where some browsers e.g. iOS Chrome
      // fires "change" instead of "input" on autocomplete.

      addEventListener(el, 'change', onCompositionEnd);
    }
  },

  // set value on mounted so it's after min/max for type="range"
  mounted(el, {
    value
  }) {
    el.value = value == null ? '' : value;
  },

  beforeUpdate(el, {
    value,
    modifiers: {
      lazy,
      trim,
      number
    }
  }, vnode) {
    el._assign = getModelAssigner(vnode); // avoid clearing unresolved text. #2302

    if (el.composing) return;

    if (document.activeElement === el) {
      if (lazy) {
        return;
      }

      if (trim && el.value.trim() === value) {
        return;
      }

      if ((number || el.type === 'number') && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toNumber)(el.value) === value) {
        return;
      }
    }

    const newValue = value == null ? '' : value;

    if (el.value !== newValue) {
      el.value = newValue;
    }
  }

};
const vModelCheckbox = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,

  created(el, _, vnode) {
    el._assign = getModelAssigner(vnode);
    addEventListener(el, 'change', () => {
      const modelValue = el._modelValue;
      const elementValue = getValue(el);
      const checked = el.checked;
      const assign = el._assign;

      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(modelValue)) {
        const index = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseIndexOf)(modelValue, elementValue);
        const found = index !== -1;

        if (checked && !found) {
          assign(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign(filtered);
        }
      } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSet)(modelValue)) {
        const cloned = new Set(modelValue);

        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }

        assign(cloned);
      } else {
        assign(getCheckboxValue(el, checked));
      }
    });
  },

  // set initial checked on mount to wait for true-value/false-value
  mounted: setChecked,

  beforeUpdate(el, binding, vnode) {
    el._assign = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }

};

function setChecked(el, {
  value,
  oldValue
}, vnode) {
  el._modelValue = value;

  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(value)) {
    el.checked = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseIndexOf)(value, vnode.props.value) > -1;
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSet)(value)) {
    el.checked = value.has(vnode.props.value);
  } else if (value !== oldValue) {
    el.checked = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseEqual)(value, getCheckboxValue(el, true));
  }
}

const vModelRadio = {
  created(el, {
    value
  }, vnode) {
    el.checked = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseEqual)(value, vnode.props.value);
    el._assign = getModelAssigner(vnode);
    addEventListener(el, 'change', () => {
      el._assign(getValue(el));
    });
  },

  beforeUpdate(el, {
    value,
    oldValue
  }, vnode) {
    el._assign = getModelAssigner(vnode);

    if (value !== oldValue) {
      el.checked = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseEqual)(value, vnode.props.value);
    }
  }

};
const vModelSelect = {
  // <select multiple> value need to be deep traversed
  deep: true,

  created(el, {
    value,
    modifiers: {
      number
    }
  }, vnode) {
    const isSetModel = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSet)(value);
    addEventListener(el, 'change', () => {
      const selectedVal = Array.prototype.filter.call(el.options, o => o.selected).map(o => number ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toNumber)(getValue(o)) : getValue(o));

      el._assign(el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]);
    });
    el._assign = getModelAssigner(vnode);
  },

  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(el, {
    value
  }) {
    setSelected(el, value);
  },

  beforeUpdate(el, _binding, vnode) {
    el._assign = getModelAssigner(vnode);
  },

  updated(el, {
    value
  }) {
    setSelected(el, value);
  }

};

function setSelected(el, value) {
  const isMultiple = el.multiple;

  if (isMultiple && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(value) && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSet)(value)) {
     true && (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`<select multiple v-model> expects an Array or Set value for its binding, ` + `but got ${Object.prototype.toString.call(value).slice(8, -1)}.`);
    return;
  }

  for (let i = 0, l = el.options.length; i < l; i++) {
    const option = el.options[i];
    const optionValue = getValue(option);

    if (isMultiple) {
      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(value)) {
        option.selected = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseIndexOf)(value, optionValue) > -1;
      } else {
        option.selected = value.has(optionValue);
      }
    } else {
      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseEqual)(getValue(option), value)) {
        if (el.selectedIndex !== i) el.selectedIndex = i;
        return;
      }
    }
  }

  if (!isMultiple && el.selectedIndex !== -1) {
    el.selectedIndex = -1;
  }
} // retrieve raw value set via :value bindings


function getValue(el) {
  return '_value' in el ? el._value : el.value;
} // retrieve raw value for true-value and false-value set via :true-value or :false-value bindings


function getCheckboxValue(el, checked) {
  const key = checked ? '_trueValue' : '_falseValue';
  return key in el ? el[key] : checked;
}

const vModelDynamic = {
  created(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, 'created');
  },

  mounted(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, 'mounted');
  },

  beforeUpdate(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, 'beforeUpdate');
  },

  updated(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, 'updated');
  }

};

function callModelHook(el, binding, vnode, prevVNode, hook) {
  let modelToUse;

  switch (el.tagName) {
    case 'SELECT':
      modelToUse = vModelSelect;
      break;

    case 'TEXTAREA':
      modelToUse = vModelText;
      break;

    default:
      switch (vnode.props && vnode.props.type) {
        case 'checkbox':
          modelToUse = vModelCheckbox;
          break;

        case 'radio':
          modelToUse = vModelRadio;
          break;

        default:
          modelToUse = vModelText;
      }

  }

  const fn = modelToUse[hook];
  fn && fn(el, binding, vnode, prevVNode);
} // SSR vnode transforms, only used when user includes client-oriented render
// function in SSR


function initVModelForSSR() {
  vModelText.getSSRProps = ({
    value
  }) => ({
    value
  });

  vModelRadio.getSSRProps = ({
    value
  }, vnode) => {
    if (vnode.props && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseEqual)(vnode.props.value, value)) {
      return {
        checked: true
      };
    }
  };

  vModelCheckbox.getSSRProps = ({
    value
  }, vnode) => {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(value)) {
      if (vnode.props && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseIndexOf)(value, vnode.props.value) > -1) {
        return {
          checked: true
        };
      }
    } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSet)(value)) {
      if (vnode.props && value.has(vnode.props.value)) {
        return {
          checked: true
        };
      }
    } else if (value) {
      return {
        checked: true
      };
    }
  };
}

const systemModifiers = ['ctrl', 'shift', 'alt', 'meta'];
const modifierGuards = {
  stop: e => e.stopPropagation(),
  prevent: e => e.preventDefault(),
  self: e => e.target !== e.currentTarget,
  ctrl: e => !e.ctrlKey,
  shift: e => !e.shiftKey,
  alt: e => !e.altKey,
  meta: e => !e.metaKey,
  left: e => 'button' in e && e.button !== 0,
  middle: e => 'button' in e && e.button !== 1,
  right: e => 'button' in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some(m => e[`${m}Key`] && !modifiers.includes(m))
};
/**
 * @private
 */

const withModifiers = (fn, modifiers) => {
  return (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers)) return;
    }

    return fn(event, ...args);
  };
}; // Kept for 2.x compat.
// Note: IE11 compat for `spacebar` and `del` is removed for now.


const keyNames = {
  esc: 'escape',
  space: ' ',
  up: 'arrow-up',
  left: 'arrow-left',
  right: 'arrow-right',
  down: 'arrow-down',
  delete: 'backspace'
};
/**
 * @private
 */

const withKeys = (fn, modifiers) => {
  return event => {
    if (!('key' in event)) {
      return;
    }

    const eventKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(event.key);

    if (modifiers.some(k => k === eventKey || keyNames[k] === eventKey)) {
      return fn(event);
    }
  };
};

const vShow = {
  beforeMount(el, {
    value
  }, {
    transition
  }) {
    el._vod = el.style.display === 'none' ? '' : el.style.display;

    if (transition && value) {
      transition.beforeEnter(el);
    } else {
      setDisplay(el, value);
    }
  },

  mounted(el, {
    value
  }, {
    transition
  }) {
    if (transition && value) {
      transition.enter(el);
    }
  },

  updated(el, {
    value,
    oldValue
  }, {
    transition
  }) {
    if (!value === !oldValue) return;

    if (transition) {
      if (value) {
        transition.beforeEnter(el);
        setDisplay(el, true);
        transition.enter(el);
      } else {
        transition.leave(el, () => {
          setDisplay(el, false);
        });
      }
    } else {
      setDisplay(el, value);
    }
  },

  beforeUnmount(el, {
    value
  }) {
    setDisplay(el, value);
  }

};

function setDisplay(el, value) {
  el.style.display = value ? el._vod : 'none';
} // SSR vnode transforms, only used when user includes client-oriented render
// function in SSR


function initVShowForSSR() {
  vShow.getSSRProps = ({
    value
  }) => {
    if (!value) {
      return {
        style: {
          display: 'none'
        }
      };
    }
  };
}

const rendererOptions = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({
  patchProp
}, nodeOps); // lazy create the renderer - this makes core renderer logic tree-shakable
// in case the user only imports reactivity utilities from Vue.

let renderer;
let enabledHydration = false;

function ensureRenderer() {
  return renderer || (renderer = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createRenderer)(rendererOptions));
}

function ensureHydrationRenderer() {
  renderer = enabledHydration ? renderer : (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createHydrationRenderer)(rendererOptions);
  enabledHydration = true;
  return renderer;
} // use explicit type casts here to avoid import() calls in rolled-up d.ts


const render = (...args) => {
  ensureRenderer().render(...args);
};

const hydrate = (...args) => {
  ensureHydrationRenderer().hydrate(...args);
};

const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);

  if (true) {
    injectNativeTagCheck(app);
    injectCompilerOptionsCheck(app);
  }

  const {
    mount
  } = app;

  app.mount = containerOrSelector => {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const component = app._component;

    if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(component) && !component.render && !component.template) {
      // __UNSAFE__
      // Reason: potential execution of JS expressions in in-DOM template.
      // The user must make sure the in-DOM template is trusted. If it's
      // rendered by the server, the template should not contain any user data.
      component.template = container.innerHTML;
    } // clear content before mounting


    container.innerHTML = '';
    const proxy = mount(container, false, container instanceof SVGElement);

    if (container instanceof Element) {
      container.removeAttribute('v-cloak');
      container.setAttribute('data-v-app', '');
    }

    return proxy;
  };

  return app;
};

const createSSRApp = (...args) => {
  const app = ensureHydrationRenderer().createApp(...args);

  if (true) {
    injectNativeTagCheck(app);
    injectCompilerOptionsCheck(app);
  }

  const {
    mount
  } = app;

  app.mount = containerOrSelector => {
    const container = normalizeContainer(containerOrSelector);

    if (container) {
      return mount(container, true, container instanceof SVGElement);
    }
  };

  return app;
};

function injectNativeTagCheck(app) {
  // Inject `isNativeTag`
  // this is used for component name validation (dev only)
  Object.defineProperty(app.config, 'isNativeTag', {
    value: tag => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isHTMLTag)(tag) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSVGTag)(tag),
    writable: false
  });
} // dev only


function injectCompilerOptionsCheck(app) {
  if ((0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isRuntimeOnly)()) {
    const isCustomElement = app.config.isCustomElement;
    Object.defineProperty(app.config, 'isCustomElement', {
      get() {
        return isCustomElement;
      },

      set() {
        (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`The \`isCustomElement\` config option is deprecated. Use ` + `\`compilerOptions.isCustomElement\` instead.`);
      }

    });
    const compilerOptions = app.config.compilerOptions;
    const msg = `The \`compilerOptions\` config option is only respected when using ` + `a build of Vue.js that includes the runtime compiler (aka "full build"). ` + `Since you are using the runtime-only build, \`compilerOptions\` ` + `must be passed to \`@vue/compiler-dom\` in the build setup instead.\n` + `- For vue-loader: pass it via vue-loader's \`compilerOptions\` loader option.\n` + `- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader\n` + `- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-dom`;
    Object.defineProperty(app.config, 'compilerOptions', {
      get() {
        (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(msg);
        return compilerOptions;
      },

      set() {
        (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(msg);
      }

    });
  }
}

function normalizeContainer(container) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(container)) {
    const res = document.querySelector(container);

    if ( true && !res) {
      (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`Failed to mount app: mount target selector "${container}" returned null.`);
    }

    return res;
  }

  if ( true && window.ShadowRoot && container instanceof window.ShadowRoot && container.mode === 'closed') {
    (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs`);
  }

  return container;
}

let ssrDirectiveInitialized = false;
/**
 * @internal
 */

const initDirectivesForSSR = () => {
  if (!ssrDirectiveInitialized) {
    ssrDirectiveInitialized = true;
    initVModelForSSR();
    initVShowForSSR();
  }
};



/***/ }),

/***/ "./node_modules/@vue/shared/dist/shared.esm-bundler.js":
/*!*************************************************************!*\
  !*** ./node_modules/@vue/shared/dist/shared.esm-bundler.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EMPTY_ARR": function() { return /* binding */ EMPTY_ARR; },
/* harmony export */   "EMPTY_OBJ": function() { return /* binding */ EMPTY_OBJ; },
/* harmony export */   "NO": function() { return /* binding */ NO; },
/* harmony export */   "NOOP": function() { return /* binding */ NOOP; },
/* harmony export */   "PatchFlagNames": function() { return /* binding */ PatchFlagNames; },
/* harmony export */   "camelize": function() { return /* binding */ camelize; },
/* harmony export */   "capitalize": function() { return /* binding */ capitalize; },
/* harmony export */   "def": function() { return /* binding */ def; },
/* harmony export */   "escapeHtml": function() { return /* binding */ escapeHtml; },
/* harmony export */   "escapeHtmlComment": function() { return /* binding */ escapeHtmlComment; },
/* harmony export */   "extend": function() { return /* binding */ extend; },
/* harmony export */   "generateCodeFrame": function() { return /* binding */ generateCodeFrame; },
/* harmony export */   "getGlobalThis": function() { return /* binding */ getGlobalThis; },
/* harmony export */   "hasChanged": function() { return /* binding */ hasChanged; },
/* harmony export */   "hasOwn": function() { return /* binding */ hasOwn; },
/* harmony export */   "hyphenate": function() { return /* binding */ hyphenate; },
/* harmony export */   "includeBooleanAttr": function() { return /* binding */ includeBooleanAttr; },
/* harmony export */   "invokeArrayFns": function() { return /* binding */ invokeArrayFns; },
/* harmony export */   "isArray": function() { return /* binding */ isArray; },
/* harmony export */   "isBooleanAttr": function() { return /* binding */ isBooleanAttr; },
/* harmony export */   "isBuiltInDirective": function() { return /* binding */ isBuiltInDirective; },
/* harmony export */   "isDate": function() { return /* binding */ isDate; },
/* harmony export */   "isFunction": function() { return /* binding */ isFunction; },
/* harmony export */   "isGloballyWhitelisted": function() { return /* binding */ isGloballyWhitelisted; },
/* harmony export */   "isHTMLTag": function() { return /* binding */ isHTMLTag; },
/* harmony export */   "isIntegerKey": function() { return /* binding */ isIntegerKey; },
/* harmony export */   "isKnownHtmlAttr": function() { return /* binding */ isKnownHtmlAttr; },
/* harmony export */   "isKnownSvgAttr": function() { return /* binding */ isKnownSvgAttr; },
/* harmony export */   "isMap": function() { return /* binding */ isMap; },
/* harmony export */   "isModelListener": function() { return /* binding */ isModelListener; },
/* harmony export */   "isNoUnitNumericStyleProp": function() { return /* binding */ isNoUnitNumericStyleProp; },
/* harmony export */   "isObject": function() { return /* binding */ isObject; },
/* harmony export */   "isOn": function() { return /* binding */ isOn; },
/* harmony export */   "isPlainObject": function() { return /* binding */ isPlainObject; },
/* harmony export */   "isPromise": function() { return /* binding */ isPromise; },
/* harmony export */   "isReservedProp": function() { return /* binding */ isReservedProp; },
/* harmony export */   "isSSRSafeAttrName": function() { return /* binding */ isSSRSafeAttrName; },
/* harmony export */   "isSVGTag": function() { return /* binding */ isSVGTag; },
/* harmony export */   "isSet": function() { return /* binding */ isSet; },
/* harmony export */   "isSpecialBooleanAttr": function() { return /* binding */ isSpecialBooleanAttr; },
/* harmony export */   "isString": function() { return /* binding */ isString; },
/* harmony export */   "isSymbol": function() { return /* binding */ isSymbol; },
/* harmony export */   "isVoidTag": function() { return /* binding */ isVoidTag; },
/* harmony export */   "looseEqual": function() { return /* binding */ looseEqual; },
/* harmony export */   "looseIndexOf": function() { return /* binding */ looseIndexOf; },
/* harmony export */   "makeMap": function() { return /* binding */ makeMap; },
/* harmony export */   "normalizeClass": function() { return /* binding */ normalizeClass; },
/* harmony export */   "normalizeProps": function() { return /* binding */ normalizeProps; },
/* harmony export */   "normalizeStyle": function() { return /* binding */ normalizeStyle; },
/* harmony export */   "objectToString": function() { return /* binding */ objectToString; },
/* harmony export */   "parseStringStyle": function() { return /* binding */ parseStringStyle; },
/* harmony export */   "propsToAttrMap": function() { return /* binding */ propsToAttrMap; },
/* harmony export */   "remove": function() { return /* binding */ remove; },
/* harmony export */   "slotFlagsText": function() { return /* binding */ slotFlagsText; },
/* harmony export */   "stringifyStyle": function() { return /* binding */ stringifyStyle; },
/* harmony export */   "toDisplayString": function() { return /* binding */ toDisplayString; },
/* harmony export */   "toHandlerKey": function() { return /* binding */ toHandlerKey; },
/* harmony export */   "toNumber": function() { return /* binding */ toNumber; },
/* harmony export */   "toRawType": function() { return /* binding */ toRawType; },
/* harmony export */   "toTypeString": function() { return /* binding */ toTypeString; }
/* harmony export */ });
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * IMPORTANT: all calls of this function must be prefixed with
 * \/\*#\_\_PURE\_\_\*\/
 * So that rollup can tree-shake them if necessary.
 */
function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(',');

  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }

  return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
}
/**
 * dev only flag -> name mapping
 */


const PatchFlagNames = {
  [1
  /* TEXT */
  ]: `TEXT`,
  [2
  /* CLASS */
  ]: `CLASS`,
  [4
  /* STYLE */
  ]: `STYLE`,
  [8
  /* PROPS */
  ]: `PROPS`,
  [16
  /* FULL_PROPS */
  ]: `FULL_PROPS`,
  [32
  /* HYDRATE_EVENTS */
  ]: `HYDRATE_EVENTS`,
  [64
  /* STABLE_FRAGMENT */
  ]: `STABLE_FRAGMENT`,
  [128
  /* KEYED_FRAGMENT */
  ]: `KEYED_FRAGMENT`,
  [256
  /* UNKEYED_FRAGMENT */
  ]: `UNKEYED_FRAGMENT`,
  [512
  /* NEED_PATCH */
  ]: `NEED_PATCH`,
  [1024
  /* DYNAMIC_SLOTS */
  ]: `DYNAMIC_SLOTS`,
  [2048
  /* DEV_ROOT_FRAGMENT */
  ]: `DEV_ROOT_FRAGMENT`,
  [-1
  /* HOISTED */
  ]: `HOISTED`,
  [-2
  /* BAIL */
  ]: `BAIL`
};
/**
 * Dev only
 */

const slotFlagsText = {
  [1
  /* STABLE */
  ]: 'STABLE',
  [2
  /* DYNAMIC */
  ]: 'DYNAMIC',
  [3
  /* FORWARDED */
  ]: 'FORWARDED'
};
const GLOBALS_WHITE_LISTED = 'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' + 'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' + 'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt';
const isGloballyWhitelisted = /*#__PURE__*/makeMap(GLOBALS_WHITE_LISTED);
const range = 2;

function generateCodeFrame(source, start = 0, end = source.length) {
  // Split the content into individual lines but capture the newline sequence
  // that separated each line. This is important because the actual sequence is
  // needed to properly take into account the full line length for offset
  // comparison
  let lines = source.split(/(\r?\n)/); // Separate the lines and newline sequences into separate arrays for easier referencing

  const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
  lines = lines.filter((_, idx) => idx % 2 === 0);
  let count = 0;
  const res = [];

  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);

    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) continue;
        const line = j + 1;
        res.push(`${line}${' '.repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
        const lineLength = lines[j].length;
        const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;

        if (j === i) {
          // push underline
          const pad = start - (count - (lineLength + newLineSeqLength));
          const length = Math.max(1, end > count ? lineLength - pad : end - start);
          res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + '^'.repeat(length));
          }

          count += lineLength + newLineSeqLength;
        }
      }

      break;
    }
  }

  return res.join('\n');
}
/**
 * On the client we only need to offer special cases for boolean attributes that
 * have different names from their corresponding dom properties:
 * - itemscope -> N/A
 * - allowfullscreen -> allowFullscreen
 * - formnovalidate -> formNoValidate
 * - ismap -> isMap
 * - nomodule -> noModule
 * - novalidate -> noValidate
 * - readonly -> readOnly
 */


const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /*#__PURE__*/makeMap(specialBooleanAttrs);
/**
 * The full list is needed during SSR to produce the correct initial markup.
 */

const isBooleanAttr = /*#__PURE__*/makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,` + `loop,open,required,reversed,scoped,seamless,` + `checked,muted,multiple,selected`);
/**
 * Boolean attributes should be included if the value is truthy or ''.
 * e.g. `<select multiple>` compiles to `{ multiple: '' }`
 */

function includeBooleanAttr(value) {
  return !!value || value === '';
}

const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};

function isSSRSafeAttrName(name) {
  if (attrValidationCache.hasOwnProperty(name)) {
    return attrValidationCache[name];
  }

  const isUnsafe = unsafeAttrCharRE.test(name);

  if (isUnsafe) {
    console.error(`unsafe attribute name: ${name}`);
  }

  return attrValidationCache[name] = !isUnsafe;
}

const propsToAttrMap = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv'
};
/**
 * CSS properties that accept plain numbers
 */

const isNoUnitNumericStyleProp = /*#__PURE__*/makeMap(`animation-iteration-count,border-image-outset,border-image-slice,` + `border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,` + `columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,` + `grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,` + `grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,` + `line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,` + // SVG
`fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,` + `stroke-miterlimit,stroke-opacity,stroke-width`);
/**
 * Known attributes, this is used for stringification of runtime static nodes
 * so that we don't stringify bindings that cannot be set from HTML.
 * Don't also forget to allow `data-*` and `aria-*`!
 * Generated from https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
 */

const isKnownHtmlAttr = /*#__PURE__*/makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,` + `autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,` + `border,buffered,capture,challenge,charset,checked,cite,class,code,` + `codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,` + `coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,` + `disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,` + `formaction,formenctype,formmethod,formnovalidate,formtarget,headers,` + `height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,` + `ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,` + `manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,` + `open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,` + `referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,` + `selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,` + `start,step,style,summary,tabindex,target,title,translate,type,usemap,` + `value,width,wrap`);
/**
 * Generated from https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */

const isKnownSvgAttr = /*#__PURE__*/makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,` + `arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,` + `baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,` + `clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,` + `color-interpolation-filters,color-profile,color-rendering,` + `contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,` + `descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,` + `dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,` + `fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,` + `font-family,font-size,font-size-adjust,font-stretch,font-style,` + `font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,` + `glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,` + `gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,` + `horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,` + `k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,` + `lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,` + `marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,` + `mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,` + `name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,` + `overflow,overline-position,overline-thickness,panose-1,paint-order,path,` + `pathLength,patternContentUnits,patternTransform,patternUnits,ping,` + `pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,` + `preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,` + `rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,` + `restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,` + `specularConstant,specularExponent,speed,spreadMethod,startOffset,` + `stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,` + `strikethrough-position,strikethrough-thickness,string,stroke,` + `stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,` + `stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,` + `systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,` + `text-decoration,text-rendering,textLength,to,transform,transform-origin,` + `type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,` + `unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,` + `v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,` + `vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,` + `writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,` + `xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,` + `xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);

function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};

    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);

      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }

    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}

const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;

function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach(item => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}

function stringifyStyle(styles) {
  let ret = '';

  if (!styles || isString(styles)) {
    return ret;
  }

  for (const key in styles) {
    const value = styles[key];
    const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);

    if (isString(value) || typeof value === 'number' && isNoUnitNumericStyleProp(normalizedKey)) {
      // only render valid values
      ret += `${normalizedKey}:${value};`;
    }
  }

  return ret;
}

function normalizeClass(value) {
  let res = '';

  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);

      if (normalized) {
        res += normalized + ' ';
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + ' ';
      }
    }
  }

  return res.trim();
}

function normalizeProps(props) {
  if (!props) return null;
  let {
    class: klass,
    style
  } = props;

  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass);
  }

  if (style) {
    props.style = normalizeStyle(style);
  }

  return props;
} // These tag configs are shared between compiler-dom and runtime-dom, so they
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element


const HTML_TAGS = 'html,body,base,head,link,meta,style,title,address,article,aside,footer,' + 'header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,' + 'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' + 'data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,' + 'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' + 'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' + 'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' + 'option,output,progress,select,textarea,details,dialog,menu,' + 'summary,template,blockquote,iframe,tfoot'; // https://developer.mozilla.org/en-US/docs/Web/SVG/Element

const SVG_TAGS = 'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,' + 'defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,' + 'feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,' + 'feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,' + 'feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,' + 'fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,' + 'foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,' + 'mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,' + 'polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,' + 'text,textPath,title,tspan,unknown,use,view';
const VOID_TAGS = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';
/**
 * Compiler only.
 * Do NOT use in runtime code paths unless behind `(process.env.NODE_ENV !== 'production')` flag.
 */

const isHTMLTag = /*#__PURE__*/makeMap(HTML_TAGS);
/**
 * Compiler only.
 * Do NOT use in runtime code paths unless behind `(process.env.NODE_ENV !== 'production')` flag.
 */

const isSVGTag = /*#__PURE__*/makeMap(SVG_TAGS);
/**
 * Compiler only.
 * Do NOT use in runtime code paths unless behind `(process.env.NODE_ENV !== 'production')` flag.
 */

const isVoidTag = /*#__PURE__*/makeMap(VOID_TAGS);
const escapeRE = /["'&<>]/;

function escapeHtml(string) {
  const str = '' + string;
  const match = escapeRE.exec(str);

  if (!match) {
    return str;
  }

  let html = '';
  let escaped;
  let index;
  let lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        // "
        escaped = '&quot;';
        break;

      case 38:
        // &
        escaped = '&amp;';
        break;

      case 39:
        // '
        escaped = '&#39;';
        break;

      case 60:
        // <
        escaped = '&lt;';
        break;

      case 62:
        // >
        escaped = '&gt;';
        break;

      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.slice(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escaped;
  }

  return lastIndex !== index ? html + str.slice(lastIndex, index) : html;
} // https://www.w3.org/TR/html52/syntax.html#comments


const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;

function escapeHtmlComment(src) {
  return src.replace(commentStripRE, '');
}

function looseCompareArrays(a, b) {
  if (a.length !== b.length) return false;
  let equal = true;

  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }

  return equal;
}

function looseEqual(a, b) {
  if (a === b) return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);

  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }

  aValidType = isArray(a);
  bValidType = isArray(b);

  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }

  aValidType = isObject(a);
  bValidType = isObject(b);

  if (aValidType || bValidType) {
    /* istanbul ignore if: this if will probably never be called */
    if (!aValidType || !bValidType) {
      return false;
    }

    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;

    if (aKeysCount !== bKeysCount) {
      return false;
    }

    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);

      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }

  return String(a) === String(b);
}

function looseIndexOf(arr, val) {
  return arr.findIndex(item => looseEqual(item, val));
}
/**
 * For converting {{ interpolation }} values to displayed strings.
 * @private
 */


const toDisplayString = val => {
  return isString(val) ? val : val == null ? '' : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};

const replacer = (_key, val) => {
  // can't use isRef here since @vue/shared has no deps
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val]) => {
        entries[`${key} =>`] = val;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }

  return val;
};

const EMPTY_OBJ =  true ? Object.freeze({}) : 0;
const EMPTY_ARR =  true ? Object.freeze([]) : 0;

const NOOP = () => {};
/**
 * Always return false.
 */


const NO = () => false;

const onRE = /^on[^a-z]/;

const isOn = key => onRE.test(key);

const isModelListener = key => key.startsWith('onUpdate:');

const extend = Object.assign;

const remove = (arr, el) => {
  const i = arr.indexOf(el);

  if (i > -1) {
    arr.splice(i, 1);
  }
};

const hasOwnProperty = Object.prototype.hasOwnProperty;

const hasOwn = (val, key) => hasOwnProperty.call(val, key);

const isArray = Array.isArray;

const isMap = val => toTypeString(val) === '[object Map]';

const isSet = val => toTypeString(val) === '[object Set]';

const isDate = val => val instanceof Date;

const isFunction = val => typeof val === 'function';

const isString = val => typeof val === 'string';

const isSymbol = val => typeof val === 'symbol';

const isObject = val => val !== null && typeof val === 'object';

const isPromise = val => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};

const objectToString = Object.prototype.toString;

const toTypeString = value => objectToString.call(value);

const toRawType = value => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1);
};

const isPlainObject = val => toTypeString(val) === '[object Object]';

const isIntegerKey = key => isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key;

const isReservedProp = /*#__PURE__*/makeMap( // the leading comma is intentional so empty string "" is also included
',key,ref,ref_for,ref_key,' + 'onVnodeBeforeMount,onVnodeMounted,' + 'onVnodeBeforeUpdate,onVnodeUpdated,' + 'onVnodeBeforeUnmount,onVnodeUnmounted');
const isBuiltInDirective = /*#__PURE__*/makeMap('bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo');

const cacheStringFunction = fn => {
  const cache = Object.create(null);
  return str => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};

const camelizeRE = /-(\w)/g;
/**
 * @private
 */

const camelize = cacheStringFunction(str => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
});
const hyphenateRE = /\B([A-Z])/g;
/**
 * @private
 */

const hyphenate = cacheStringFunction(str => str.replace(hyphenateRE, '-$1').toLowerCase());
/**
 * @private
 */

const capitalize = cacheStringFunction(str => str.charAt(0).toUpperCase() + str.slice(1));
/**
 * @private
 */

const toHandlerKey = cacheStringFunction(str => str ? `on${capitalize(str)}` : ``); // compare whether a value has changed, accounting for NaN.

const hasChanged = (value, oldValue) => !Object.is(value, oldValue);

const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};

const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};

const toNumber = val => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};

let _globalThis;

const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : {});
};



/***/ }),

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/web.dom-exception.stack.js */ "./node_modules/core-js/modules/web.dom-exception.stack.js");

var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");

var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");

var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");

var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");

var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");

var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest(); // HTTP basic authentication

    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true); // Set the request timeout in MS

    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      } // Prepare the response


      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' || responseType === 'json' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };
      settle(resolve, reject, response); // Clean up request

      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        } // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request


        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        } // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'


        setTimeout(onloadend);
      };
    } // Handle browser request cancellation (as opposed to a manual cancellation)


    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request)); // Clean up request

      request = null;
    }; // Handle low level network errors


    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request)); // Clean up request

      request = null;
    }; // Handle timeout


    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';

      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }

      reject(createError(timeoutErrorMessage, config, config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED', request)); // Clean up request

      request = null;
    }; // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.


    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    } // Add headers to the request


    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    } // Add withCredentials to request if needed


    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    } // Add responseType to request if needed


    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    } // Handle progress if needed


    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    } // Not all browsers support upload events


    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel); // Clean up request

        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    } // Send the request


    request.send(requestData);
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");

var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");

var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */


function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context); // Copy axios.prototype to instance

  utils.extend(instance, Axios.prototype, context); // Copy context to instance

  utils.extend(instance, context);
  return instance;
} // Create the default instance to be exported


var axios = createInstance(defaults); // Expose Axios class to allow class inheritance

axios.Axios = Axios; // Factory for creating new instances

axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
}; // Expose Cancel & CancelToken


axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js"); // Expose all/spread

axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js"); // Expose isAxiosError

axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");
module.exports = axios; // Allow use of default import syntax in TypeScript

module.exports["default"] = axios;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ (function(module) {

"use strict";

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */

function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;
module.exports = Cancel;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.error.cause.js */ "./node_modules/core-js/modules/es.error.cause.js");

var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */


function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });
  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}
/**
 * Throws a `Cancel` if cancellation has been requested.
 */


CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};
/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */


CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ (function(module) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");

var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");

var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");

var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */

function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */


Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config); // Set config.method

  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  } // filter out skipped interceptors


  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });
  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];
    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);
    promise = Promise.resolve(config);

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }

  var newConfig = config;

  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();

    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
}; // Provide aliases for supported request methods


utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});
module.exports = Axios;

/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}
/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */


InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};
/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */


InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */


InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");

var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");
/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */


module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }

  return requestedURL;
};

/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.error.cause.js */ "./node_modules/core-js/modules/es.error.cause.js");

var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");
/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */


module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");

var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
/**
 * Throws a `Cancel` if cancellation has been requested.
 */


function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}
/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */


module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config); // Ensure headers exist

  config.headers = config.headers || {}; // Transform request data

  config.data = transformData.call(config, config.data, config.headers, config.transformRequest); // Flatten headers

  config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
  utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
    delete config.headers[method];
  });
  var adapter = config.adapter || defaults.adapter;
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config); // Transform response data

    response.data = transformData.call(config, response.data, response.headers, config.transformResponse);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config); // Transform response data

      if (reason && reason.response) {
        reason.response.data = transformData.call(config, reason.response.data, reason.response.headers, config.transformResponse);
      }
    }

    return Promise.reject(reason);
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ (function(module) {

"use strict";

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */

module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;

  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };

  return error;
};

/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");
/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */


module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};
  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = ['baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer', 'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName', 'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress', 'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent', 'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }

    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });
  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);
  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });
  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });
  var axiosKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys).concat(directMergeKeys);
  var otherKeys = Object.keys(config1).concat(Object.keys(config2)).filter(function filterAxiosKeys(key) {
    return axiosKeys.indexOf(key) === -1;
  });
  utils.forEach(otherKeys, mergeDeepProperties);
  return config;
};

/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");
/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */


module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;

  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
  }
};

/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");
/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */


module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/

  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });
  return data;
};

/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");

var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;

  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }

  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {
  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },
  adapter: getDefaultAdapter(),
  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
      return data;
    }

    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }

    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    if (utils.isObject(data) || headers && headers['Content-Type'] === 'application/json') {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }

    return data;
  }],
  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || forcedJSONParsing && utils.isString(data) && data.length) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }

          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};
defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});
module.exports = defaults;

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ (function(module) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    return fn.apply(thisArg, args);
  };
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}
/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */


module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];
    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }

        parts.push(encode(key) + '=' + encode(v));
      });
    });
    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ (function(module) {

"use strict";

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */

module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = utils.isStandardBrowserEnv() ? // Standard browser envs support document.cookie
function standardBrowserEnv() {
  return {
    write: function write(name, value, expires, path, domain, secure) {
      var cookie = [];
      cookie.push(name + '=' + encodeURIComponent(value));

      if (utils.isNumber(expires)) {
        cookie.push('expires=' + new Date(expires).toGMTString());
      }

      if (utils.isString(path)) {
        cookie.push('path=' + path);
      }

      if (utils.isString(domain)) {
        cookie.push('domain=' + domain);
      }

      if (secure === true) {
        cookie.push('secure');
      }

      document.cookie = cookie.join('; ');
    },
    read: function read(name) {
      var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove: function remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  };
}() : // Non standard browser env (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return {
    write: function write() {},
    read: function read() {
      return null;
    },
    remove: function remove() {}
  };
}();

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ (function(module) {

"use strict";

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */

module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ (function(module) {

"use strict";

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */

module.exports = function isAxiosError(payload) {
  return typeof payload === 'object' && payload.isAxiosError === true;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = utils.isStandardBrowserEnv() ? // Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
function standardBrowserEnv() {
  var msie = /(msie|trident)/i.test(navigator.userAgent);
  var urlParsingNode = document.createElement('a');
  var originURL;
  /**
  * Parse a URL to discover it's components
  *
  * @param {String} url The URL to be parsed
  * @returns {Object}
  */

  function resolveURL(url) {
    var href = url;

    if (msie) {
      // IE needs attribute set twice to normalize properties
      urlParsingNode.setAttribute('href', href);
      href = urlParsingNode.href;
    }

    urlParsingNode.setAttribute('href', href); // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils

    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
  }

  originURL = resolveURL(window.location.href);
  /**
  * Determine if a URL shares the same origin as the current location
  *
  * @param {String} requestURL The URL to test
  * @returns {boolean} True if URL shares the same origin, otherwise false
  */

  return function isURLSameOrigin(requestURL) {
    var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
  };
}() : // Non standard browser envs (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return function isURLSameOrigin() {
    return true;
  };
}();

/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js"); // Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers


var ignoreDuplicateOf = ['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent'];
/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */

module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) {
    return parsed;
  }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }

      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });
  return parsed;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ (function(module) {

"use strict";

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */

module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.error.cause.js */ "./node_modules/core-js/modules/es.error.cause.js");

var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");

var validators = {}; // eslint-disable-next-line func-names

['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function (type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});
var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');
/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */

function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');

  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }

  return false;
}
/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */


validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  } // eslint-disable-next-line func-names


  return function (value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true; // eslint-disable-next-line no-console

      console.warn(formatMessage(opt, ' has been deprecated since v' + version + ' and will be removed in the near future'));
    }

    return validator ? validator(value, opt, opts) : true;
  };
};
/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */


function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }

  var keys = Object.keys(options);
  var i = keys.length;

  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];

    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);

      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }

      continue;
    }

    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};

/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js"); // utils is a library of generic helper functions non-specific to axios


var toString = Object.prototype.toString;
/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */

function isArray(val) {
  return toString.call(val) === '[object Array]';
}
/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */


function isUndefined(val) {
  return typeof val === 'undefined';
}
/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */


function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}
/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */


function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}
/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */


function isFormData(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData;
}
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */


function isArrayBufferView(val) {
  var result;

  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
  }

  return result;
}
/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */


function isString(val) {
  return typeof val === 'string';
}
/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */


function isNumber(val) {
  return typeof val === 'number';
}
/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */


function isObject(val) {
  return val !== null && typeof val === 'object';
}
/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */


function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}
/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */


function isDate(val) {
  return toString.call(val) === '[object Date]';
}
/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */


function isFile(val) {
  return toString.call(val) === '[object File]';
}
/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */


function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}
/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */


function isFunction(val) {
  return toString.call(val) === '[object Function]';
}
/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */


function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}
/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */


function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}
/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */


function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}
/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */


function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' || navigator.product === 'NativeScript' || navigator.product === 'NS')) {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */


function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  } // Force an array if not already something iterable


  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */


function
  /* obj1, obj2, obj3, ... */
merge() {
  var result = {};

  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }

  return result;
}
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */


function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */


function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }

  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

/***/ }),

/***/ "./node_modules/vue-loader/dist/exportHelper.js":
/*!******************************************************!*\
  !*** ./node_modules/vue-loader/dist/exportHelper.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
})); // runtime helper for setting properties on components
// in a tree-shakable way

exports["default"] = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;

  for (const [key, val] of props) {
    target[key] = val;
  }

  return target;
};

/***/ }),

/***/ "./node_modules/vue-router/dist/vue-router.esm-bundler.js":
/*!****************************************************************!*\
  !*** ./node_modules/vue-router/dist/vue-router.esm-bundler.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NavigationFailureType": function() { return /* binding */ NavigationFailureType; },
/* harmony export */   "RouterLink": function() { return /* binding */ RouterLink; },
/* harmony export */   "RouterView": function() { return /* binding */ RouterView; },
/* harmony export */   "START_LOCATION": function() { return /* binding */ START_LOCATION_NORMALIZED; },
/* harmony export */   "createMemoryHistory": function() { return /* binding */ createMemoryHistory; },
/* harmony export */   "createRouter": function() { return /* binding */ createRouter; },
/* harmony export */   "createRouterMatcher": function() { return /* binding */ createRouterMatcher; },
/* harmony export */   "createWebHashHistory": function() { return /* binding */ createWebHashHistory; },
/* harmony export */   "createWebHistory": function() { return /* binding */ createWebHistory; },
/* harmony export */   "isNavigationFailure": function() { return /* binding */ isNavigationFailure; },
/* harmony export */   "matchedRouteKey": function() { return /* binding */ matchedRouteKey; },
/* harmony export */   "onBeforeRouteLeave": function() { return /* binding */ onBeforeRouteLeave; },
/* harmony export */   "onBeforeRouteUpdate": function() { return /* binding */ onBeforeRouteUpdate; },
/* harmony export */   "parseQuery": function() { return /* binding */ parseQuery; },
/* harmony export */   "routeLocationKey": function() { return /* binding */ routeLocationKey; },
/* harmony export */   "routerKey": function() { return /* binding */ routerKey; },
/* harmony export */   "routerViewLocationKey": function() { return /* binding */ routerViewLocationKey; },
/* harmony export */   "stringifyQuery": function() { return /* binding */ stringifyQuery; },
/* harmony export */   "useLink": function() { return /* binding */ useLink; },
/* harmony export */   "useRoute": function() { return /* binding */ useRoute; },
/* harmony export */   "useRouter": function() { return /* binding */ useRouter; },
/* harmony export */   "viewDepthKey": function() { return /* binding */ viewDepthKey; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.error.cause.js */ "./node_modules/core-js/modules/es.error.cause.js");
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");
/* harmony import */ var _vue_devtools_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vue/devtools-api */ "./node_modules/@vue/devtools-api/lib/esm/index.js");


/*!
  * vue-router v4.0.14
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */


const hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

const PolySymbol = name => // vr = vue router
hasSymbol ? Symbol( true ? '[vue-router]: ' + name : 0) : ( true ? '[vue-router]: ' : 0) + name; // rvlm = Router View Location Matched

/**
 * RouteRecord being rendered by the closest ancestor Router View. Used for
 * `onBeforeRouteUpdate` and `onBeforeRouteLeave`. rvlm stands for Router View
 * Location Matched
 *
 * @internal
 */


const matchedRouteKey = /*#__PURE__*/PolySymbol( true ? 'router view location matched' : 0);
/**
 * Allows overriding the router view depth to control which component in
 * `matched` is rendered. rvd stands for Router View Depth
 *
 * @internal
 */

const viewDepthKey = /*#__PURE__*/PolySymbol( true ? 'router view depth' : 0);
/**
 * Allows overriding the router instance returned by `useRouter` in tests. r
 * stands for router
 *
 * @internal
 */

const routerKey = /*#__PURE__*/PolySymbol( true ? 'router' : 0);
/**
 * Allows overriding the current route returned by `useRoute` in tests. rl
 * stands for route location
 *
 * @internal
 */

const routeLocationKey = /*#__PURE__*/PolySymbol( true ? 'route location' : 0);
/**
 * Allows overriding the current route used by router-view. Internally this is
 * used when the `route` prop is passed.
 *
 * @internal
 */

const routerViewLocationKey = /*#__PURE__*/PolySymbol( true ? 'router view location' : 0);
const isBrowser = typeof window !== 'undefined';

function isESModule(obj) {
  return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === 'Module';
}

const assign = Object.assign;

function applyToParams(fn, params) {
  const newParams = {};

  for (const key in params) {
    const value = params[key];
    newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value);
  }

  return newParams;
}

const noop = () => {};

function warn(msg) {
  // avoid using ...args as it breaks in older Edge builds
  const args = Array.from(arguments).slice(1);
  console.warn.apply(console, ['[Vue Router warn]: ' + msg].concat(args));
}

const TRAILING_SLASH_RE = /\/$/;

const removeTrailingSlash = path => path.replace(TRAILING_SLASH_RE, '');
/**
 * Transforms an URI into a normalized history location
 *
 * @param parseQuery
 * @param location - URI to normalize
 * @param currentLocation - current absolute location. Allows resolving relative
 * paths. Must start with `/`. Defaults to `/`
 * @returns a normalized history location
 */


function parseURL(parseQuery, location, currentLocation = '/') {
  let path,
      query = {},
      searchString = '',
      hash = ''; // Could use URL and URLSearchParams but IE 11 doesn't support it

  const searchPos = location.indexOf('?');
  const hashPos = location.indexOf('#', searchPos > -1 ? searchPos : 0);

  if (searchPos > -1) {
    path = location.slice(0, searchPos);
    searchString = location.slice(searchPos + 1, hashPos > -1 ? hashPos : location.length);
    query = parseQuery(searchString);
  }

  if (hashPos > -1) {
    path = path || location.slice(0, hashPos); // keep the # character

    hash = location.slice(hashPos, location.length);
  } // no search and no query


  path = resolveRelativePath(path != null ? path : location, currentLocation); // empty path means a relative query or hash `?foo=f`, `#thing`

  return {
    fullPath: path + (searchString && '?') + searchString + hash,
    path,
    query,
    hash
  };
}
/**
 * Stringifies a URL object
 *
 * @param stringifyQuery
 * @param location
 */


function stringifyURL(stringifyQuery, location) {
  const query = location.query ? stringifyQuery(location.query) : '';
  return location.path + (query && '?') + query + (location.hash || '');
}
/**
 * Strips off the base from the beginning of a location.pathname in a non
 * case-sensitive way.
 *
 * @param pathname - location.pathname
 * @param base - base to strip off
 */


function stripBase(pathname, base) {
  // no base or base is not found at the beginning
  if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase())) return pathname;
  return pathname.slice(base.length) || '/';
}
/**
 * Checks if two RouteLocation are equal. This means that both locations are
 * pointing towards the same {@link RouteRecord} and that all `params`, `query`
 * parameters and `hash` are the same
 *
 * @param a - first {@link RouteLocation}
 * @param b - second {@link RouteLocation}
 */


function isSameRouteLocation(stringifyQuery, a, b) {
  const aLastIndex = a.matched.length - 1;
  const bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery(a.query) === stringifyQuery(b.query) && a.hash === b.hash;
}
/**
 * Check if two `RouteRecords` are equal. Takes into account aliases: they are
 * considered equal to the `RouteRecord` they are aliasing.
 *
 * @param a - first {@link RouteRecord}
 * @param b - second {@link RouteRecord}
 */


function isSameRouteRecord(a, b) {
  // since the original record has an undefined value for aliasOf
  // but all aliases point to the original record, this will always compare
  // the original record
  return (a.aliasOf || a) === (b.aliasOf || b);
}

function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length) return false;

  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key])) return false;
  }

  return true;
}

function isSameRouteLocationParamsValue(a, b) {
  return Array.isArray(a) ? isEquivalentArray(a, b) : Array.isArray(b) ? isEquivalentArray(b, a) : a === b;
}
/**
 * Check if two arrays are the same or if an array with one single entry is the
 * same as another primitive value. Used to check query and parameters
 *
 * @param a - array of values
 * @param b - array of values or a single value
 */


function isEquivalentArray(a, b) {
  return Array.isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
/**
 * Resolves a relative path that starts with `.`.
 *
 * @param to - path location we are resolving
 * @param from - currentLocation.path, should start with `/`
 */


function resolveRelativePath(to, from) {
  if (to.startsWith('/')) return to;

  if ( true && !from.startsWith('/')) {
    warn(`Cannot resolve a relative location without an absolute path. Trying to resolve "${to}" from "${from}". It should look like "/${from}".`);
    return to;
  }

  if (!to) return from;
  const fromSegments = from.split('/');
  const toSegments = to.split('/');
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;

  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition]; // can't go below zero

    if (position === 1 || segment === '.') continue;
    if (segment === '..') position--; // found something that is not relative path
    else break;
  }

  return fromSegments.slice(0, position).join('/') + '/' + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join('/');
}

var NavigationType;

(function (NavigationType) {
  NavigationType["pop"] = "pop";
  NavigationType["push"] = "push";
})(NavigationType || (NavigationType = {}));

var NavigationDirection;

(function (NavigationDirection) {
  NavigationDirection["back"] = "back";
  NavigationDirection["forward"] = "forward";
  NavigationDirection["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
/**
 * Starting location for Histories
 */


const START = ''; // Generic utils

/**
 * Normalizes a base by removing any trailing slash and reading the base tag if
 * present.
 *
 * @param base - base to normalize
 */

function normalizeBase(base) {
  if (!base) {
    if (isBrowser) {
      // respect <base> tag
      const baseEl = document.querySelector('base');
      base = baseEl && baseEl.getAttribute('href') || '/'; // strip full URL origin

      base = base.replace(/^\w+:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  } // ensure leading slash when it was removed by the regex above avoid leading
  // slash with hash because the file could be read from the disk like file://
  // and the leading slash would cause problems


  if (base[0] !== '/' && base[0] !== '#') base = '/' + base; // remove the trailing slash so all other method can just do `base + fullPath`
  // to build an href

  return removeTrailingSlash(base);
} // remove any character before the hash


const BEFORE_HASH_RE = /^[^#]+#/;

function createHref(base, location) {
  return base.replace(BEFORE_HASH_RE, '#') + location;
}

function getElementPosition(el, offset) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    behavior: offset.behavior,
    left: elRect.left - docRect.left - (offset.left || 0),
    top: elRect.top - docRect.top - (offset.top || 0)
  };
}

const computeScrollPosition = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});

function scrollToPosition(position) {
  let scrollToOptions;

  if ('el' in position) {
    const positionEl = position.el;
    const isIdSelector = typeof positionEl === 'string' && positionEl.startsWith('#');
    /**
     * `id`s can accept pretty much any characters, including CSS combinators
     * like `>` or `~`. It's still possible to retrieve elements using
     * `document.getElementById('~')` but it needs to be escaped when using
     * `document.querySelector('#\\~')` for it to be valid. The only
     * requirements for `id`s are them to be unique on the page and to not be
     * empty (`id=""`). Because of that, when passing an id selector, it should
     * be properly escaped for it to work with `querySelector`. We could check
     * for the id selector to be simple (no CSS combinators `+ >~`) but that
     * would make things inconsistent since they are valid characters for an
     * `id` but would need to be escaped when using `querySelector`, breaking
     * their usage and ending up in no selector returned. Selectors need to be
     * escaped:
     *
     * - `#1-thing` becomes `#\31 -thing`
     * - `#with~symbols` becomes `#with\\~symbols`
     *
     * - More information about  the topic can be found at
     *   https://mathiasbynens.be/notes/html5-id-class.
     * - Practical example: https://mathiasbynens.be/demo/html5-id
     */

    if ( true && typeof position.el === 'string') {
      if (!isIdSelector || !document.getElementById(position.el.slice(1))) {
        try {
          const foundEl = document.querySelector(position.el);

          if (isIdSelector && foundEl) {
            warn(`The selector "${position.el}" should be passed as "el: document.querySelector('${position.el}')" because it starts with "#".`); // return to avoid other warnings

            return;
          }
        } catch (err) {
          warn(`The selector "${position.el}" is invalid. If you are using an id selector, make sure to escape it. You can find more information about escaping characters in selectors at https://mathiasbynens.be/notes/css-escapes or use CSS.escape (https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape).`); // return to avoid other warnings

          return;
        }
      }
    }

    const el = typeof positionEl === 'string' ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;

    if (!el) {
       true && warn(`Couldn't find element using selector "${position.el}" returned by scrollBehavior.`);
      return;
    }

    scrollToOptions = getElementPosition(el, position);
  } else {
    scrollToOptions = position;
  }

  if ('scrollBehavior' in document.documentElement.style) window.scrollTo(scrollToOptions);else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.pageXOffset, scrollToOptions.top != null ? scrollToOptions.top : window.pageYOffset);
  }
}

function getScrollKey(path, delta) {
  const position = history.state ? history.state.position - delta : -1;
  return position + path;
}

const scrollPositions = new Map();

function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}

function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key); // consume it so it's not used again

  scrollPositions.delete(key);
  return scroll;
} // TODO: RFC about how to save scroll position

/**
 * ScrollBehavior instance used by the router to compute and restore the scroll
 * position when navigating.
 */
// export interface ScrollHandler<ScrollPositionEntry extends HistoryStateValue, ScrollPosition extends ScrollPositionEntry> {
//   // returns a scroll position that can be saved in history
//   compute(): ScrollPositionEntry
//   // can take an extended ScrollPositionEntry
//   scroll(position: ScrollPosition): void
// }
// export const scrollHandler: ScrollHandler<ScrollPosition> = {
//   compute: computeScroll,
//   scroll: scrollToPosition,
// }


let createBaseLocation = () => location.protocol + '//' + location.host;
/**
 * Creates a normalized history location from a window.location object
 * @param location -
 */


function createCurrentLocation(base, location) {
  const {
    pathname,
    search,
    hash
  } = location; // allows hash bases like #, /#, #/, #!, #!/, /#!/, or even /folder#end

  const hashPos = base.indexOf('#');

  if (hashPos > -1) {
    let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
    let pathFromHash = hash.slice(slicePos); // prepend the starting slash to hash so the url starts with /#

    if (pathFromHash[0] !== '/') pathFromHash = '/' + pathFromHash;
    return stripBase(pathFromHash, '');
  }

  const path = stripBase(pathname, base);
  return path + search + hash;
}

function useHistoryListeners(base, historyState, currentLocation, replace) {
  let listeners = [];
  let teardowns = []; // TODO: should it be a stack? a Dict. Check if the popstate listener
  // can trigger twice

  let pauseState = null;

  const popStateHandler = ({
    state
  }) => {
    const to = createCurrentLocation(base, location);
    const from = currentLocation.value;
    const fromState = historyState.value;
    let delta = 0;

    if (state) {
      currentLocation.value = to;
      historyState.value = state; // ignore the popstate and reset the pauseState

      if (pauseState && pauseState === from) {
        pauseState = null;
        return;
      }

      delta = fromState ? state.position - fromState.position : 0;
    } else {
      replace(to);
    } // console.log({ deltaFromCurrent })
    // Here we could also revert the navigation by calling history.go(-delta)
    // this listener will have to be adapted to not trigger again and to wait for the url
    // to be updated before triggering the listeners. Some kind of validation function would also
    // need to be passed to the listeners so the navigation can be accepted
    // call all listeners


    listeners.forEach(listener => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
      });
    });
  };

  function pauseListeners() {
    pauseState = currentLocation.value;
  }

  function listen(callback) {
    // setup the listener and prepare teardown callbacks
    listeners.push(callback);

    const teardown = () => {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    };

    teardowns.push(teardown);
    return teardown;
  }

  function beforeUnloadListener() {
    const {
      history
    } = window;
    if (!history.state) return;
    history.replaceState(assign({}, history.state, {
      scroll: computeScrollPosition()
    }), '');
  }

  function destroy() {
    for (const teardown of teardowns) teardown();

    teardowns = [];
    window.removeEventListener('popstate', popStateHandler);
    window.removeEventListener('beforeunload', beforeUnloadListener);
  } // setup the listeners and prepare teardown callbacks


  window.addEventListener('popstate', popStateHandler);
  window.addEventListener('beforeunload', beforeUnloadListener);
  return {
    pauseListeners,
    listen,
    destroy
  };
}
/**
 * Creates a state object
 */


function buildState(back, current, forward, replaced = false, computeScroll = false) {
  return {
    back,
    current,
    forward,
    replaced,
    position: window.history.length,
    scroll: computeScroll ? computeScrollPosition() : null
  };
}

function useHistoryStateNavigation(base) {
  const {
    history,
    location
  } = window; // private variables

  const currentLocation = {
    value: createCurrentLocation(base, location)
  };
  const historyState = {
    value: history.state
  }; // build current history entry as this is a fresh navigation

  if (!historyState.value) {
    changeLocation(currentLocation.value, {
      back: null,
      current: currentLocation.value,
      forward: null,
      // the length is off by one, we need to decrease it
      position: history.length - 1,
      replaced: true,
      // don't add a scroll as the user may have an anchor and we want
      // scrollBehavior to be triggered without a saved position
      scroll: null
    }, true);
  }

  function changeLocation(to, state, replace) {
    /**
     * if a base tag is provided and we are on a normal domain, we have to
     * respect the provided `base` attribute because pushState() will use it and
     * potentially erase anything before the `#` like at
     * https://github.com/vuejs/router/issues/685 where a base of
     * `/folder/#` but a base of `/` would erase the `/folder/` section. If
     * there is no host, the `<base>` tag makes no sense and if there isn't a
     * base tag we can just use everything after the `#`.
     */
    const hashIndex = base.indexOf('#');
    const url = hashIndex > -1 ? (location.host && document.querySelector('base') ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;

    try {
      // BROWSER QUIRK
      // NOTE: Safari throws a SecurityError when calling this function 100 times in 30 seconds
      history[replace ? 'replaceState' : 'pushState'](state, '', url);
      historyState.value = state;
    } catch (err) {
      if (true) {
        warn('Error with push/replace State', err);
      } else {} // Force the navigation, this also resets the call count


      location[replace ? 'replace' : 'assign'](url);
    }
  }

  function replace(to, data) {
    const state = assign({}, history.state, buildState(historyState.value.back, // keep back and forward entries but override current position
    to, historyState.value.forward, true), data, {
      position: historyState.value.position
    });
    changeLocation(to, state, true);
    currentLocation.value = to;
  }

  function push(to, data) {
    // Add to current entry the information of where we are going
    // as well as saving the current position
    const currentState = assign({}, // use current history state to gracefully handle a wrong call to
    // history.replaceState
    // https://github.com/vuejs/router/issues/366
    historyState.value, history.state, {
      forward: to,
      scroll: computeScrollPosition()
    });

    if ( true && !history.state) {
      warn(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:\n\n` + `history.replaceState(history.state, '', url)\n\n` + `You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`);
    }

    changeLocation(currentState.current, currentState, true);
    const state = assign({}, buildState(currentLocation.value, to, null), {
      position: currentState.position + 1
    }, data);
    changeLocation(to, state, false);
    currentLocation.value = to;
  }

  return {
    location: currentLocation,
    state: historyState,
    push,
    replace
  };
}
/**
 * Creates an HTML5 history. Most common history for single page applications.
 *
 * @param base -
 */


function createWebHistory(base) {
  base = normalizeBase(base);
  const historyNavigation = useHistoryStateNavigation(base);
  const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);

  function go(delta, triggerListeners = true) {
    if (!triggerListeners) historyListeners.pauseListeners();
    history.go(delta);
  }

  const routerHistory = assign({
    // it's overridden right after
    location: '',
    base,
    go,
    createHref: createHref.bind(null, base)
  }, historyNavigation, historyListeners);
  Object.defineProperty(routerHistory, 'location', {
    enumerable: true,
    get: () => historyNavigation.location.value
  });
  Object.defineProperty(routerHistory, 'state', {
    enumerable: true,
    get: () => historyNavigation.state.value
  });
  return routerHistory;
}
/**
 * Creates a in-memory based history. The main purpose of this history is to handle SSR. It starts in a special location that is nowhere.
 * It's up to the user to replace that location with the starter location by either calling `router.push` or `router.replace`.
 *
 * @param base - Base applied to all urls, defaults to '/'
 * @returns a history object that can be passed to the router constructor
 */


function createMemoryHistory(base = '') {
  let listeners = [];
  let queue = [START];
  let position = 0;
  base = normalizeBase(base);

  function setLocation(location) {
    position++;

    if (position === queue.length) {
      // we are at the end, we can simply append a new entry
      queue.push(location);
    } else {
      // we are in the middle, we remove everything from here in the queue
      queue.splice(position);
      queue.push(location);
    }
  }

  function triggerListeners(to, from, {
    direction,
    delta
  }) {
    const info = {
      direction,
      delta,
      type: NavigationType.pop
    };

    for (const callback of listeners) {
      callback(to, from, info);
    }
  }

  const routerHistory = {
    // rewritten by Object.defineProperty
    location: START,
    // TODO: should be kept in queue
    state: {},
    base,
    createHref: createHref.bind(null, base),

    replace(to) {
      // remove current entry and decrement position
      queue.splice(position--, 1);
      setLocation(to);
    },

    push(to, data) {
      setLocation(to);
    },

    listen(callback) {
      listeners.push(callback);
      return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
      };
    },

    destroy() {
      listeners = [];
      queue = [START];
      position = 0;
    },

    go(delta, shouldTrigger = true) {
      const from = this.location;
      const direction = // we are considering delta === 0 going forward, but in abstract mode
      // using 0 for the delta doesn't make sense like it does in html5 where
      // it reloads the page
      delta < 0 ? NavigationDirection.back : NavigationDirection.forward;
      position = Math.max(0, Math.min(position + delta, queue.length - 1));

      if (shouldTrigger) {
        triggerListeners(this.location, from, {
          direction,
          delta
        });
      }
    }

  };
  Object.defineProperty(routerHistory, 'location', {
    enumerable: true,
    get: () => queue[position]
  });
  return routerHistory;
}
/**
 * Creates a hash history. Useful for web applications with no host (e.g.
 * `file://`) or when configuring a server to handle any URL is not possible.
 *
 * @param base - optional base to provide. Defaults to `location.pathname +
 * location.search` If there is a `<base>` tag in the `head`, its value will be
 * ignored in favor of this parameter **but note it affects all the
 * history.pushState() calls**, meaning that if you use a `<base>` tag, it's
 * `href` value **has to match this parameter** (ignoring anything after the
 * `#`).
 *
 * @example
 * ```js
 * // at https://example.com/folder
 * createWebHashHistory() // gives a url of `https://example.com/folder#`
 * createWebHashHistory('/folder/') // gives a url of `https://example.com/folder/#`
 * // if the `#` is provided in the base, it won't be added by `createWebHashHistory`
 * createWebHashHistory('/folder/#/app/') // gives a url of `https://example.com/folder/#/app/`
 * // you should avoid doing this because it changes the original url and breaks copying urls
 * createWebHashHistory('/other-folder/') // gives a url of `https://example.com/other-folder/#`
 *
 * // at file:///usr/etc/folder/index.html
 * // for locations with no `host`, the base is ignored
 * createWebHashHistory('/iAmIgnored') // gives a url of `file:///usr/etc/folder/index.html#`
 * ```
 */


function createWebHashHistory(base) {
  // Make sure this implementation is fine in terms of encoding, specially for IE11
  // for `file://`, directly use the pathname and ignore the base
  // location.pathname contains an initial `/` even at the root: `https://example.com`
  base = location.host ? base || location.pathname + location.search : ''; // allow the user to provide a `#` in the middle: `/base/#/app`

  if (!base.includes('#')) base += '#';

  if ( true && !base.endsWith('#/') && !base.endsWith('#')) {
    warn(`A hash base must end with a "#":\n"${base}" should be "${base.replace(/#.*$/, '#')}".`);
  }

  return createWebHistory(base);
}

function isRouteLocation(route) {
  return typeof route === 'string' || route && typeof route === 'object';
}

function isRouteName(name) {
  return typeof name === 'string' || typeof name === 'symbol';
}
/**
 * Initial route location where the router is. Can be used in navigation guards
 * to differentiate the initial navigation.
 *
 * @example
 * ```js
 * import { START_LOCATION } from 'vue-router'
 *
 * router.beforeEach((to, from) => {
 *   if (from === START_LOCATION) {
 *     // initial navigation
 *   }
 * })
 * ```
 */


const START_LOCATION_NORMALIZED = {
  path: '/',
  name: undefined,
  params: {},
  query: {},
  hash: '',
  fullPath: '/',
  matched: [],
  meta: {},
  redirectedFrom: undefined
};
const NavigationFailureSymbol = /*#__PURE__*/PolySymbol( true ? 'navigation failure' : 0);
/**
 * Enumeration with all possible types for navigation failures. Can be passed to
 * {@link isNavigationFailure} to check for specific failures.
 */

var NavigationFailureType;

(function (NavigationFailureType) {
  /**
   * An aborted navigation is a navigation that failed because a navigation
   * guard returned `false` or called `next(false)`
   */
  NavigationFailureType[NavigationFailureType["aborted"] = 4] = "aborted";
  /**
   * A cancelled navigation is a navigation that failed because a more recent
   * navigation finished started (not necessarily finished).
   */

  NavigationFailureType[NavigationFailureType["cancelled"] = 8] = "cancelled";
  /**
   * A duplicated navigation is a navigation that failed because it was
   * initiated while already being at the exact same location.
   */

  NavigationFailureType[NavigationFailureType["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {})); // DEV only debug messages


const ErrorTypeMessages = {
  [1
  /* MATCHER_NOT_FOUND */
  ]({
    location,
    currentLocation
  }) {
    return `No match for\n ${JSON.stringify(location)}${currentLocation ? '\nwhile being at\n' + JSON.stringify(currentLocation) : ''}`;
  },

  [2
  /* NAVIGATION_GUARD_REDIRECT */
  ]({
    from,
    to
  }) {
    return `Redirected from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`;
  },

  [4
  /* NAVIGATION_ABORTED */
  ]({
    from,
    to
  }) {
    return `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`;
  },

  [8
  /* NAVIGATION_CANCELLED */
  ]({
    from,
    to
  }) {
    return `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`;
  },

  [16
  /* NAVIGATION_DUPLICATED */
  ]({
    from,
    to
  }) {
    return `Avoided redundant navigation to current location: "${from.fullPath}".`;
  }

};

function createRouterError(type, params) {
  // keep full error messages in cjs versions
  if (true) {
    return assign(new Error(ErrorTypeMessages[type](params)), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  } else {}
}

function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}

const propertiesToLog = ['params', 'query', 'hash'];

function stringifyRoute(to) {
  if (typeof to === 'string') return to;
  if ('path' in to) return to.path;
  const location = {};

  for (const key of propertiesToLog) {
    if (key in to) location[key] = to[key];
  }

  return JSON.stringify(location, null, 2);
} // default pattern for a param: non greedy everything but /


const BASE_PARAM_PATTERN = '[^/]+?';
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
}; // Special Regex characters that must be escaped in static tokens

const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
/**
 * Creates a path parser from an array of Segments (a segment is an array of Tokens)
 *
 * @param segments - array of segments returned by tokenizePath
 * @param extraOptions - optional options for the regexp
 * @returns a PathParser
 */

function tokensToParser(segments, extraOptions) {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions); // the amount of scores is the same as the length of segments except for the root segment "/"

  const score = []; // the regexp as a string

  let pattern = options.start ? '^' : ''; // extracted keys

  const keys = [];

  for (const segment of segments) {
    // the root segment needs special treatment
    const segmentScores = segment.length ? [] : [90
    /* Root */
    ]; // allow trailing slash

    if (options.strict && !segment.length) pattern += '/';

    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex]; // resets the score if we are inside a sub segment /:a-other-:b

      let subSegmentScore = 40
      /* Segment */
      + (options.sensitive ? 0.25
      /* BonusCaseSensitive */
      : 0);

      if (token.type === 0
      /* Static */
      ) {
        // prepend the slash if we are starting a new segment
        if (!tokenIndex) pattern += '/';
        pattern += token.value.replace(REGEX_CHARS_RE, '\\$&');
        subSegmentScore += 40
        /* Static */
        ;
      } else if (token.type === 1
      /* Param */
      ) {
        const {
          value,
          repeatable,
          optional,
          regexp
        } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re = regexp ? regexp : BASE_PARAM_PATTERN; // the user provided a custom regexp /:id(\\d+)

        if (re !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10
          /* BonusCustomRegExp */
          ; // make sure the regexp is valid before using it

          try {
            new RegExp(`(${re})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re}): ` + err.message);
          }
        } // when we repeat we must take care of the repeating leading slash


        let subPattern = repeatable ? `((?:${re})(?:/(?:${re}))*)` : `(${re})`; // prepend the slash if we are starting a new segment

        if (!tokenIndex) subPattern = // avoid an optional / if there are more segments e.g. /:p?-static
        // or /:p?-:p2
        optional && segment.length < 2 ? `(?:/${subPattern})` : '/' + subPattern;
        if (optional) subPattern += '?';
        pattern += subPattern;
        subSegmentScore += 20
        /* Dynamic */
        ;
        if (optional) subSegmentScore += -8
        /* BonusOptional */
        ;
        if (repeatable) subSegmentScore += -20
        /* BonusRepeatable */
        ;
        if (re === '.*') subSegmentScore += -50
        /* BonusWildcard */
        ;
      }

      segmentScores.push(subSegmentScore);
    } // an empty array like /home/ -> [[{home}], []]
    // if (!segment.length) pattern += '/'


    score.push(segmentScores);
  } // only apply the strict bonus to the last score


  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001
    /* BonusStrict */
    ;
  } // TODO: dev only warn double trailing slash


  if (!options.strict) pattern += '/?';
  if (options.end) pattern += '$'; // allow paths like /dynamic to only match dynamic or dynamic/... but not dynamic_something_else
  else if (options.strict) pattern += '(?:/|$)';
  const re = new RegExp(pattern, options.sensitive ? '' : 'i');

  function parse(path) {
    const match = path.match(re);
    const params = {};
    if (!match) return null;

    for (let i = 1; i < match.length; i++) {
      const value = match[i] || '';
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split('/') : value;
    }

    return params;
  }

  function stringify(params) {
    let path = ''; // for optional parameters to allow to be empty

    let avoidDuplicatedSlash = false;

    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith('/')) path += '/';
      avoidDuplicatedSlash = false;

      for (const token of segment) {
        if (token.type === 0
        /* Static */
        ) {
          path += token.value;
        } else if (token.type === 1
        /* Param */
        ) {
          const {
            value,
            repeatable,
            optional
          } = token;
          const param = value in params ? params[value] : '';
          if (Array.isArray(param) && !repeatable) throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          const text = Array.isArray(param) ? param.join('/') : param;

          if (!text) {
            if (optional) {
              // if we have more than one optional param like /:a?-static we
              // don't need to care about the optional param
              if (segment.length < 2) {
                // remove the last slash as we could be at the end
                if (path.endsWith('/')) path = path.slice(0, -1); // do not append a slash on the next iteration
                else avoidDuplicatedSlash = true;
              }
            } else throw new Error(`Missing required param "${value}"`);
          }

          path += text;
        }
      }
    }

    return path;
  }

  return {
    re,
    score,
    keys,
    parse,
    stringify
  };
}
/**
 * Compares an array of numbers as used in PathParser.score and returns a
 * number. This function can be used to `sort` an array
 *
 * @param a - first array of numbers
 * @param b - second array of numbers
 * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
 * should be sorted first
 */


function compareScoreArray(a, b) {
  let i = 0;

  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i]; // only keep going if diff === 0

    if (diff) return diff;
    i++;
  } // if the last subsegment was Static, the shorter segments should be sorted first
  // otherwise sort the longest segment first


  if (a.length < b.length) {
    return a.length === 1 && a[0] === 40
    /* Static */
    + 40
    /* Segment */
    ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === 40
    /* Static */
    + 40
    /* Segment */
    ? 1 : -1;
  }

  return 0;
}
/**
 * Compare function that can be used with `sort` to sort an array of PathParser
 *
 * @param a - first PathParser
 * @param b - second PathParser
 * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
 */


function comparePathParserScore(a, b) {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;

  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]); // do not return if both are equal

    if (comp) return comp;
    i++;
  } // if a and b share the same score entries but b has more, sort b first


  return bScore.length - aScore.length; // this is the ternary version
  // return aScore.length < bScore.length
  //   ? 1
  //   : aScore.length > bScore.length
  //   ? -1
  //   : 0
}

const ROOT_TOKEN = {
  type: 0
  /* Static */
  ,
  value: ''
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/; // After some profiling, the cache seems to be unnecessary because tokenizePath
// (the slowest part of adding a route) is very fast
// const tokenCache = new Map<string, Token[][]>()

function tokenizePath(path) {
  if (!path) return [[]];
  if (path === '/') return [[ROOT_TOKEN]];

  if (!path.startsWith('/')) {
    throw new Error( true ? `Route paths should start with a "/": "${path}" should be "/${path}".` : 0);
  } // if (tokenCache.has(path)) return tokenCache.get(path)!


  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }

  let state = 0
  /* Static */
  ;
  let previousState = state;
  const tokens = []; // the segment will always be valid because we get into the initial state
  // with the leading /

  let segment;

  function finalizeSegment() {
    if (segment) tokens.push(segment);
    segment = [];
  } // index on the path


  let i = 0; // char at index

  let char; // buffer of the value read

  let buffer = ''; // custom regexp for a param

  let customRe = '';

  function consumeBuffer() {
    if (!buffer) return;

    if (state === 0
    /* Static */
    ) {
      segment.push({
        type: 0
        /* Static */
        ,
        value: buffer
      });
    } else if (state === 1
    /* Param */
    || state === 2
    /* ParamRegExp */
    || state === 3
    /* ParamRegExpEnd */
    ) {
      if (segment.length > 1 && (char === '*' || char === '+')) crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1
        /* Param */
        ,
        value: buffer,
        regexp: customRe,
        repeatable: char === '*' || char === '+',
        optional: char === '*' || char === '?'
      });
    } else {
      crash('Invalid state to consume buffer');
    }

    buffer = '';
  }

  function addCharToBuffer() {
    buffer += char;
  }

  while (i < path.length) {
    char = path[i++];

    if (char === '\\' && state !== 2
    /* ParamRegExp */
    ) {
      previousState = state;
      state = 4
      /* EscapeNext */
      ;
      continue;
    }

    switch (state) {
      case 0
      /* Static */
      :
        if (char === '/') {
          if (buffer) {
            consumeBuffer();
          }

          finalizeSegment();
        } else if (char === ':') {
          consumeBuffer();
          state = 1
          /* Param */
          ;
        } else {
          addCharToBuffer();
        }

        break;

      case 4
      /* EscapeNext */
      :
        addCharToBuffer();
        state = previousState;
        break;

      case 1
      /* Param */
      :
        if (char === '(') {
          state = 2
          /* ParamRegExp */
          ;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0
          /* Static */
          ; // go back one character if we were not modifying

          if (char !== '*' && char !== '?' && char !== '+') i--;
        }

        break;

      case 2
      /* ParamRegExp */
      :
        // TODO: is it worth handling nested regexp? like :p(?:prefix_([^/]+)_suffix)
        // it already works by escaping the closing )
        // https://paths.esm.dev/?p=AAMeJbiAwQEcDKbAoAAkP60PG2R6QAvgNaA6AFACM2ABuQBB#
        // is this really something people need since you can also write
        // /prefix_:p()_suffix
        if (char === ')') {
          // handle the escaped )
          if (customRe[customRe.length - 1] == '\\') customRe = customRe.slice(0, -1) + char;else state = 3
          /* ParamRegExpEnd */
          ;
        } else {
          customRe += char;
        }

        break;

      case 3
      /* ParamRegExpEnd */
      :
        // same as finalizing a param
        consumeBuffer();
        state = 0
        /* Static */
        ; // go back one character if we were not modifying

        if (char !== '*' && char !== '?' && char !== '+') i--;
        customRe = '';
        break;

      default:
        crash('Unknown state');
        break;
    }
  }

  if (state === 2
  /* ParamRegExp */
  ) crash(`Unfinished custom RegExp for param "${buffer}"`);
  consumeBuffer();
  finalizeSegment(); // tokenCache.set(path, tokens)

  return tokens;
}

function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options); // warn against params with the same name

  if (true) {
    const existingKeys = new Set();

    for (const key of parser.keys) {
      if (existingKeys.has(key.name)) warn(`Found duplicated params with name "${key.name}" for path "${record.path}". Only the last one will be available on "$route.params".`);
      existingKeys.add(key.name);
    }
  }

  const matcher = assign(parser, {
    record,
    parent,
    // these needs to be populated by the parent
    children: [],
    alias: []
  });

  if (parent) {
    // both are aliases or both are not aliases
    // we don't want to mix them because the order is used when
    // passing originalRecord in Matcher.addRoute
    if (!matcher.record.aliasOf === !parent.record.aliasOf) parent.children.push(matcher);
  }

  return matcher;
}
/**
 * Creates a Router Matcher.
 *
 * @internal
 * @param routes - array of initial routes
 * @param globalOptions - global route options
 */


function createRouterMatcher(routes, globalOptions) {
  // normalized ordered array of matchers
  const matchers = [];
  const matcherMap = new Map();
  globalOptions = mergeOptions({
    strict: false,
    end: true,
    sensitive: false
  }, globalOptions);

  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }

  function addRoute(record, parent, originalRecord) {
    // used later on to remove by name
    const isRootAdd = !originalRecord;
    const mainNormalizedRecord = normalizeRouteRecord(record); // we might be the child of an alias

    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record); // generate an array of records to correctly handle aliases

    const normalizedRecords = [mainNormalizedRecord];

    if ('alias' in record) {
      const aliases = typeof record.alias === 'string' ? [record.alias] : record.alias;

      for (const alias of aliases) {
        normalizedRecords.push(assign({}, mainNormalizedRecord, {
          // this allows us to hold a copy of the `components` option
          // so that async components cache is hold on the original record
          components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
          path: alias,
          // we might be the child of an alias
          aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord // the aliases are always of the same kind as the original since they
          // are defined on the same record

        }));
      }
    }

    let matcher;
    let originalMatcher;

    for (const normalizedRecord of normalizedRecords) {
      const {
        path
      } = normalizedRecord; // Build up the path for nested routes if the child isn't an absolute
      // route. Only add the / delimiter if the child path isn't empty and if the
      // parent path doesn't have a trailing slash

      if (parent && path[0] !== '/') {
        const parentPath = parent.record.path;
        const connectingSlash = parentPath[parentPath.length - 1] === '/' ? '' : '/';
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }

      if ( true && normalizedRecord.path === '*') {
        throw new Error('Catch all routes ("*") must now be defined using a param with a custom regexp.\n' + 'See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.');
      } // create the object before hand so it can be passed to children


      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if ( true && parent && path[0] === '/') checkMissingParamsInAbsolutePath(matcher, parent); // if we are an alias we must tell the original record that we exist
      // so we can be removed

      if (originalRecord) {
        originalRecord.alias.push(matcher);

        if (true) {
          checkSameParams(originalRecord, matcher);
        }
      } else {
        // otherwise, the first record is the original and others are aliases
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher) originalMatcher.alias.push(matcher); // remove the route if named and only for the top record (avoid in nested calls)
        // this works because the original record is the first one

        if (isRootAdd && record.name && !isAliasRecord(matcher)) removeRoute(record.name);
      }

      if ('children' in mainNormalizedRecord) {
        const children = mainNormalizedRecord.children;

        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
        }
      } // if there was no original record, then the first one was not an alias and all
      // other alias (if any) need to reference this record when adding children


      originalRecord = originalRecord || matcher; // TODO: add normalized records for more flexibility
      // if (parent && isAliasRecord(originalRecord)) {
      //   parent.children.push(originalRecord)
      // }

      insertMatcher(matcher);
    }

    return originalMatcher ? () => {
      // since other matchers are aliases, they should be removed by the original matcher
      removeRoute(originalMatcher);
    } : noop;
  }

  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);

      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      const index = matchers.indexOf(matcherRef);

      if (index > -1) {
        matchers.splice(index, 1);
        if (matcherRef.record.name) matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }

  function getRoutes() {
    return matchers;
  }

  function insertMatcher(matcher) {
    let i = 0;

    while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0 && ( // Adding children with empty path should still appear before the parent
    // https://github.com/vuejs/router/issues/1124
    matcher.record.path !== matchers[i].record.path || !isRecordChildOf(matcher, matchers[i]))) i++;

    matchers.splice(i, 0, matcher); // only add the original record to the name map

    if (matcher.record.name && !isAliasRecord(matcher)) matcherMap.set(matcher.record.name, matcher);
  }

  function resolve(location, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name;

    if ('name' in location && location.name) {
      matcher = matcherMap.get(location.name);
      if (!matcher) throw createRouterError(1
      /* MATCHER_NOT_FOUND */
      , {
        location
      });
      name = matcher.record.name;
      params = assign( // paramsFromLocation is a new object
      paramsFromLocation(currentLocation.params, // only keep params that exist in the resolved location
      // TODO: only keep optional params coming from a parent record
      matcher.keys.filter(k => !k.optional).map(k => k.name)), location.params); // throws if cannot be stringified

      path = matcher.stringify(params);
    } else if ('path' in location) {
      // no need to resolve the path with the matcher as it was provided
      // this also allows the user to control the encoding
      path = location.path;

      if ( true && !path.startsWith('/')) {
        warn(`The Matcher cannot resolve relative paths but received "${path}". Unless you directly called \`matcher.resolve("${path}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`);
      }

      matcher = matchers.find(m => m.re.test(path)); // matcher should have a value after the loop

      if (matcher) {
        // TODO: dev warning of unused params if provided
        // we know the matcher works because we tested the regexp
        params = matcher.parse(path);
        name = matcher.record.name;
      } // location is a relative path

    } else {
      // match by name or path of current route
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find(m => m.re.test(currentLocation.path));
      if (!matcher) throw createRouterError(1
      /* MATCHER_NOT_FOUND */
      , {
        location,
        currentLocation
      });
      name = matcher.record.name; // since we are navigating to the same location, we don't need to pick the
      // params like when `name` is provided

      params = assign({}, currentLocation.params, location.params);
      path = matcher.stringify(params);
    }

    const matched = [];
    let parentMatcher = matcher;

    while (parentMatcher) {
      // reversed order so parents are at the beginning
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }

    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  } // add initial routes


  routes.forEach(route => addRoute(route));
  return {
    addRoute,
    resolve,
    removeRoute,
    getRoutes,
    getRecordMatcher
  };
}

function paramsFromLocation(params, keys) {
  const newParams = {};

  for (const key of keys) {
    if (key in params) newParams[key] = params[key];
  }

  return newParams;
}
/**
 * Normalizes a RouteRecordRaw. Creates a copy
 *
 * @param record
 * @returns the normalized version
 */


function normalizeRouteRecord(record) {
  return {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: undefined,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: new Set(),
    updateGuards: new Set(),
    enterCallbacks: {},
    components: 'components' in record ? record.components || {} : {
      default: record.component
    }
  };
}
/**
 * Normalize the optional `props` in a record to always be an object similar to
 * components. Also accept a boolean for components.
 * @param record
 */


function normalizeRecordProps(record) {
  const propsObject = {}; // props does not exist on redirect records but we can set false directly

  const props = record.props || false;

  if ('component' in record) {
    propsObject.default = props;
  } else {
    // NOTE: we could also allow a function to be applied to every component.
    // Would need user feedback for use cases
    for (const name in record.components) propsObject[name] = typeof props === 'boolean' ? props : props[name];
  }

  return propsObject;
}
/**
 * Checks if a record or any of its parent is an alias
 * @param record
 */


function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf) return true;
    record = record.parent;
  }

  return false;
}
/**
 * Merge meta fields of an array of records
 *
 * @param matched - array of matched records
 */


function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign(meta, record.meta), {});
}

function mergeOptions(defaults, partialOptions) {
  const options = {};

  for (const key in defaults) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
  }

  return options;
}

function isSameParam(a, b) {
  return a.name === b.name && a.optional === b.optional && a.repeatable === b.repeatable;
}
/**
 * Check if a path and its alias have the same required params
 *
 * @param a - original record
 * @param b - alias record
 */


function checkSameParams(a, b) {
  for (const key of a.keys) {
    if (!key.optional && !b.keys.find(isSameParam.bind(null, key))) return warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" should have the exact same param named "${key.name}"`);
  }

  for (const key of b.keys) {
    if (!key.optional && !a.keys.find(isSameParam.bind(null, key))) return warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" should have the exact same param named "${key.name}"`);
  }
}

function checkMissingParamsInAbsolutePath(record, parent) {
  for (const key of parent.keys) {
    if (!record.keys.find(isSameParam.bind(null, key))) return warn(`Absolute path "${record.record.path}" should have the exact same param named "${key.name}" as its parent "${parent.record.path}".`);
  }
}

function isRecordChildOf(record, parent) {
  return parent.children.some(child => child === record || isRecordChildOf(record, child));
}
/**
 * Encoding Rules ␣ = Space Path: ␣ " < > # ? { } Query: ␣ " < > # & = Hash: ␣ "
 * < > `
 *
 * On top of that, the RFC3986 (https://tools.ietf.org/html/rfc3986#section-2.2)
 * defines some extra characters to be encoded. Most browsers do not encode them
 * in encodeURI https://github.com/whatwg/url/issues/369, so it may be safer to
 * also encode `!'()*`. Leaving unencoded only ASCII alphanumeric(`a-zA-Z0-9`)
 * plus `-._~`. This extra safety should be applied to query by patching the
 * string returned by encodeURIComponent encodeURI also encodes `[\]^`. `\`
 * should be encoded to avoid ambiguity. Browsers (IE, FF, C) transform a `\`
 * into a `/` if directly typed in. The _backtick_ (`````) should also be
 * encoded everywhere because some browsers like FF encode it when directly
 * written while others don't. Safari and IE don't encode ``"<>{}``` in hash.
 */
// const EXTRA_RESERVED_RE = /[!'()*]/g
// const encodeReservedReplacer = (c: string) => '%' + c.charCodeAt(0).toString(16)


const HASH_RE = /#/g; // %23

const AMPERSAND_RE = /&/g; // %26

const SLASH_RE = /\//g; // %2F

const EQUAL_RE = /=/g; // %3D

const IM_RE = /\?/g; // %3F

const PLUS_RE = /\+/g; // %2B

/**
 * NOTE: It's not clear to me if we should encode the + symbol in queries, it
 * seems to be less flexible than not doing so and I can't find out the legacy
 * systems requiring this for regular requests like text/html. In the standard,
 * the encoding of the plus character is only mentioned for
 * application/x-www-form-urlencoded
 * (https://url.spec.whatwg.org/#urlencoded-parsing) and most browsers seems lo
 * leave the plus character as is in queries. To be more flexible, we allow the
 * plus character on the query but it can also be manually encoded by the user.
 *
 * Resources:
 * - https://url.spec.whatwg.org/#urlencoded-parsing
 * - https://stackoverflow.com/questions/1634271/url-encoding-the-space-character-or-20
 */

const ENC_BRACKET_OPEN_RE = /%5B/g; // [

const ENC_BRACKET_CLOSE_RE = /%5D/g; // ]

const ENC_CARET_RE = /%5E/g; // ^

const ENC_BACKTICK_RE = /%60/g; // `

const ENC_CURLY_OPEN_RE = /%7B/g; // {

const ENC_PIPE_RE = /%7C/g; // |

const ENC_CURLY_CLOSE_RE = /%7D/g; // }

const ENC_SPACE_RE = /%20/g; // }

/**
 * Encode characters that need to be encoded on the path, search and hash
 * sections of the URL.
 *
 * @internal
 * @param text - string to encode
 * @returns encoded string
 */

function commonEncode(text) {
  return encodeURI('' + text).replace(ENC_PIPE_RE, '|').replace(ENC_BRACKET_OPEN_RE, '[').replace(ENC_BRACKET_CLOSE_RE, ']');
}
/**
 * Encode characters that need to be encoded on the hash section of the URL.
 *
 * @param text - string to encode
 * @returns encoded string
 */


function encodeHash(text) {
  return commonEncode(text).replace(ENC_CURLY_OPEN_RE, '{').replace(ENC_CURLY_CLOSE_RE, '}').replace(ENC_CARET_RE, '^');
}
/**
 * Encode characters that need to be encoded query values on the query
 * section of the URL.
 *
 * @param text - string to encode
 * @returns encoded string
 */


function encodeQueryValue(text) {
  return commonEncode(text) // Encode the space as +, encode the + to differentiate it from the space
  .replace(PLUS_RE, '%2B').replace(ENC_SPACE_RE, '+').replace(HASH_RE, '%23').replace(AMPERSAND_RE, '%26').replace(ENC_BACKTICK_RE, '`').replace(ENC_CURLY_OPEN_RE, '{').replace(ENC_CURLY_CLOSE_RE, '}').replace(ENC_CARET_RE, '^');
}
/**
 * Like `encodeQueryValue` but also encodes the `=` character.
 *
 * @param text - string to encode
 */


function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, '%3D');
}
/**
 * Encode characters that need to be encoded on the path section of the URL.
 *
 * @param text - string to encode
 * @returns encoded string
 */


function encodePath(text) {
  return commonEncode(text).replace(HASH_RE, '%23').replace(IM_RE, '%3F');
}
/**
 * Encode characters that need to be encoded on the path section of the URL as a
 * param. This function encodes everything {@link encodePath} does plus the
 * slash (`/`) character. If `text` is `null` or `undefined`, returns an empty
 * string instead.
 *
 * @param text - string to encode
 * @returns encoded string
 */


function encodeParam(text) {
  return text == null ? '' : encodePath(text).replace(SLASH_RE, '%2F');
}
/**
 * Decode text using `decodeURIComponent`. Returns the original text if it
 * fails.
 *
 * @param text - string to decode
 * @returns decoded string
 */


function decode(text) {
  try {
    return decodeURIComponent('' + text);
  } catch (err) {
     true && warn(`Error decoding "${text}". Using original value`);
  }

  return '' + text;
}
/**
 * Transforms a queryString into a {@link LocationQuery} object. Accept both, a
 * version with the leading `?` and without Should work as URLSearchParams

 * @internal
 *
 * @param search - search string to parse
 * @returns a query object
 */


function parseQuery(search) {
  const query = {}; // avoid creating an object with an empty key and empty value
  // because of split('&')

  if (search === '' || search === '?') return query;
  const hasLeadingIM = search[0] === '?';
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split('&');

  for (let i = 0; i < searchParams.length; ++i) {
    // pre decode the + into space
    const searchParam = searchParams[i].replace(PLUS_RE, ' '); // allow the = character

    const eqPos = searchParam.indexOf('=');
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));

    if (key in query) {
      // an extra variable for ts types
      let currentValue = query[key];

      if (!Array.isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }

      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }

  return query;
}
/**
 * Stringifies a {@link LocationQueryRaw} object. Like `URLSearchParams`, it
 * doesn't prepend a `?`
 *
 * @internal
 *
 * @param query - query object to stringify
 * @returns string version of the query without the leading `?`
 */


function stringifyQuery(query) {
  let search = '';

  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);

    if (value == null) {
      // only null adds the value
      if (value !== undefined) {
        search += (search.length ? '&' : '') + key;
      }

      continue;
    } // keep null values


    const values = Array.isArray(value) ? value.map(v => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach(value => {
      // skip undefined values in arrays as if they were not present
      // smaller code than using filter
      if (value !== undefined) {
        // only append & with non-empty search
        search += (search.length ? '&' : '') + key;
        if (value != null) search += '=' + value;
      }
    });
  }

  return search;
}
/**
 * Transforms a {@link LocationQueryRaw} into a {@link LocationQuery} by casting
 * numbers into strings, removing keys with an undefined value and replacing
 * undefined with null in arrays
 *
 * @param query - query object to normalize
 * @returns a normalized query object
 */


function normalizeQuery(query) {
  const normalizedQuery = {};

  for (const key in query) {
    const value = query[key];

    if (value !== undefined) {
      normalizedQuery[key] = Array.isArray(value) ? value.map(v => v == null ? null : '' + v) : value == null ? value : '' + value;
    }
  }

  return normalizedQuery;
}
/**
 * Create a list of callbacks that can be reset. Used to create before and after navigation guards list
 */


function useCallbacks() {
  let handlers = [];

  function add(handler) {
    handlers.push(handler);
    return () => {
      const i = handlers.indexOf(handler);
      if (i > -1) handlers.splice(i, 1);
    };
  }

  function reset() {
    handlers = [];
  }

  return {
    add,
    list: () => handlers,
    reset
  };
}

function registerGuard(record, name, guard) {
  const removeFromList = () => {
    record[name].delete(guard);
  };

  (0,vue__WEBPACK_IMPORTED_MODULE_1__.onUnmounted)(removeFromList);
  (0,vue__WEBPACK_IMPORTED_MODULE_1__.onDeactivated)(removeFromList);
  (0,vue__WEBPACK_IMPORTED_MODULE_1__.onActivated)(() => {
    record[name].add(guard);
  });
  record[name].add(guard);
}
/**
 * Add a navigation guard that triggers whenever the component for the current
 * location is about to be left. Similar to {@link beforeRouteLeave} but can be
 * used in any component. The guard is removed when the component is unmounted.
 *
 * @param leaveGuard - {@link NavigationGuard}
 */


function onBeforeRouteLeave(leaveGuard) {
  if ( true && !(0,vue__WEBPACK_IMPORTED_MODULE_1__.getCurrentInstance)()) {
    warn('getCurrentInstance() returned null. onBeforeRouteLeave() must be called at the top of a setup function');
    return;
  }

  const activeRecord = (0,vue__WEBPACK_IMPORTED_MODULE_1__.inject)(matchedRouteKey, // to avoid warning
  {}).value;

  if (!activeRecord) {
     true && warn('No active route record was found when calling `onBeforeRouteLeave()`. Make sure you call this function inside of a component child of <router-view>. Maybe you called it inside of App.vue?');
    return;
  }

  registerGuard(activeRecord, 'leaveGuards', leaveGuard);
}
/**
 * Add a navigation guard that triggers whenever the current location is about
 * to be updated. Similar to {@link beforeRouteUpdate} but can be used in any
 * component. The guard is removed when the component is unmounted.
 *
 * @param updateGuard - {@link NavigationGuard}
 */


function onBeforeRouteUpdate(updateGuard) {
  if ( true && !(0,vue__WEBPACK_IMPORTED_MODULE_1__.getCurrentInstance)()) {
    warn('getCurrentInstance() returned null. onBeforeRouteUpdate() must be called at the top of a setup function');
    return;
  }

  const activeRecord = (0,vue__WEBPACK_IMPORTED_MODULE_1__.inject)(matchedRouteKey, // to avoid warning
  {}).value;

  if (!activeRecord) {
     true && warn('No active route record was found when calling `onBeforeRouteUpdate()`. Make sure you call this function inside of a component child of <router-view>. Maybe you called it inside of App.vue?');
    return;
  }

  registerGuard(activeRecord, 'updateGuards', updateGuard);
}

function guardToPromiseFn(guard, to, from, record, name) {
  // keep a reference to the enterCallbackArray to prevent pushing callbacks if a new navigation took place
  const enterCallbackArray = record && ( // name is defined if record is because of the function overload
  record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve, reject) => {
    const next = valid => {
      if (valid === false) reject(createRouterError(4
      /* NAVIGATION_ABORTED */
      , {
        from,
        to
      }));else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2
        /* NAVIGATION_GUARD_REDIRECT */
        , {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && // since enterCallbackArray is truthy, both record and name also are
        record.enterCallbacks[name] === enterCallbackArray && typeof valid === 'function') enterCallbackArray.push(valid);
        resolve();
      }
    }; // wrapping with Promise.resolve allows it to work with both async and sync guards


    const guardReturn = guard.call(record && record.instances[name], to, from,  true ? canOnlyBeCalledOnce(next, to, from) : 0);
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3) guardCall = guardCall.then(next);

    if ( true && guard.length > 2) {
      const message = `The "next" callback was never called inside of ${guard.name ? '"' + guard.name + '"' : ''}:\n${guard.toString()}\n. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;

      if (typeof guardReturn === 'object' && 'then' in guardReturn) {
        guardCall = guardCall.then(resolvedValue => {
          // @ts-expect-error: _called is added at canOnlyBeCalledOnce
          if (!next._called) {
            warn(message);
            return Promise.reject(new Error('Invalid navigation guard'));
          }

          return resolvedValue;
        }); // TODO: test me!
      } else if (guardReturn !== undefined) {
        // @ts-expect-error: _called is added at canOnlyBeCalledOnce
        if (!next._called) {
          warn(message);
          reject(new Error('Invalid navigation guard'));
          return;
        }
      }
    }

    guardCall.catch(err => reject(err));
  });
}

function canOnlyBeCalledOnce(next, to, from) {
  let called = 0;
  return function () {
    if (called++ === 1) warn(`The "next" callback was called more than once in one navigation guard when going from "${from.fullPath}" to "${to.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`); // @ts-expect-error: we put it in the original one because it's easier to check

    next._called = true;
    if (called === 1) next.apply(null, arguments);
  };
}

function extractComponentsGuards(matched, guardType, to, from) {
  const guards = [];

  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];

      if (true) {
        if (!rawComponent || typeof rawComponent !== 'object' && typeof rawComponent !== 'function') {
          warn(`Component "${name}" in record with path "${record.path}" is not` + ` a valid component. Received "${String(rawComponent)}".`); // throw to ensure we stop here but warn to ensure the message isn't
          // missed by the user

          throw new Error('Invalid route component');
        } else if ('then' in rawComponent) {
          // warn if user wrote import('/component.vue') instead of () =>
          // import('./component.vue')
          warn(`Component "${name}" in record with path "${record.path}" is a ` + `Promise instead of a function that returns a Promise. Did you ` + `write "import('./MyPage.vue')" instead of ` + `"() => import('./MyPage.vue')" ? This will break in ` + `production if not fixed.`);
          const promise = rawComponent;

          rawComponent = () => promise;
        } else if (rawComponent.__asyncLoader && // warn only once per component
        !rawComponent.__warnedDefineAsync) {
          rawComponent.__warnedDefineAsync = true;
          warn(`Component "${name}" in record with path "${record.path}" is defined ` + `using "defineAsyncComponent()". ` + `Write "() => import('./MyPage.vue')" instead of ` + `"defineAsyncComponent(() => import('./MyPage.vue'))".`);
        }
      } // skip update and leave guards if the route component is not mounted


      if (guardType !== 'beforeRouteEnter' && !record.instances[name]) continue;

      if (isRouteComponent(rawComponent)) {
        // __vccOpts is added by vue-class-component and contain the regular options
        const options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
      } else {
        // start requesting the chunk already
        let componentPromise = rawComponent();

        if ( true && !('catch' in componentPromise)) {
          warn(`Component "${name}" in record with path "${record.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`);
          componentPromise = Promise.resolve(componentPromise);
        }

        guards.push(() => componentPromise.then(resolved => {
          if (!resolved) return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved; // replace the function with the resolved component

          record.components[name] = resolvedComponent; // __vccOpts is added by vue-class-component and contain the regular options

          const options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name)();
        }));
      }
    }
  }

  return guards;
}
/**
 * Allows differentiating lazy components from functional components and vue-class-component
 *
 * @param component
 */


function isRouteComponent(component) {
  return typeof component === 'object' || 'displayName' in component || 'props' in component || '__vccOpts' in component;
} // TODO: we could allow currentRoute as a prop to expose `isActive` and
// `isExactActive` behavior should go through an RFC


function useLink(props) {
  const router = (0,vue__WEBPACK_IMPORTED_MODULE_1__.inject)(routerKey);
  const currentRoute = (0,vue__WEBPACK_IMPORTED_MODULE_1__.inject)(routeLocationKey);
  const route = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => router.resolve((0,vue__WEBPACK_IMPORTED_MODULE_1__.unref)(props.to)));
  const activeRecordIndex = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => {
    const {
      matched
    } = route.value;
    const {
      length
    } = matched;
    const routeMatched = matched[length - 1];
    const currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length) return -1;
    const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index > -1) return index; // possible parent record

    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return (// we are dealing with nested routes
      length > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      getOriginalPath(routeMatched) === parentRecordPath && // avoid comparing the child with its parent
      currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index
    );
  });
  const isActive = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));

  function navigate(e = {}) {
    if (guardEvent(e)) {
      return router[(0,vue__WEBPACK_IMPORTED_MODULE_1__.unref)(props.replace) ? 'replace' : 'push']((0,vue__WEBPACK_IMPORTED_MODULE_1__.unref)(props.to) // avoid uncaught errors are they are logged anyway
      ).catch(noop);
    }

    return Promise.resolve();
  } // devtools only


  if (( true) && isBrowser) {
    const instance = (0,vue__WEBPACK_IMPORTED_MODULE_1__.getCurrentInstance)();

    if (instance) {
      const linkContextDevtools = {
        route: route.value,
        isActive: isActive.value,
        isExactActive: isExactActive.value
      }; // @ts-expect-error: this is internal

      instance.__vrl_devtools = instance.__vrl_devtools || []; // @ts-expect-error: this is internal

      instance.__vrl_devtools.push(linkContextDevtools);

      (0,vue__WEBPACK_IMPORTED_MODULE_1__.watchEffect)(() => {
        linkContextDevtools.route = route.value;
        linkContextDevtools.isActive = isActive.value;
        linkContextDevtools.isExactActive = isExactActive.value;
      }, {
        flush: 'post'
      });
    }
  }

  return {
    route,
    href: (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}

const RouterLinkImpl = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_1__.defineComponent)({
  name: 'RouterLink',
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    // inactiveClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: 'page'
    }
  },
  useLink,

  setup(props, {
    slots
  }) {
    const link = (0,vue__WEBPACK_IMPORTED_MODULE_1__.reactive)(useLink(props));
    const {
      options
    } = (0,vue__WEBPACK_IMPORTED_MODULE_1__.inject)(routerKey);
    const elClass = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, 'router-link-active')]: link.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, 'router-link-exact-active')]: link.isExactActive
    }));
    return () => {
      const children = slots.default && slots.default(link);
      return props.custom ? children : (0,vue__WEBPACK_IMPORTED_MODULE_1__.h)('a', {
        'aria-current': link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        // this would override user added attrs but Vue will still add
        // the listener so we end up triggering both
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }

}); // export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files

/**
 * Component to render a link that triggers a navigation on click.
 */

const RouterLink = RouterLinkImpl;

function guardEvent(e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return; // don't redirect when preventDefault called

  if (e.defaultPrevented) return; // don't redirect on right click

  if (e.button !== undefined && e.button !== 0) return; // don't redirect if `target="_blank"`
  // @ts-expect-error getAttribute does exist

  if (e.currentTarget && e.currentTarget.getAttribute) {
    // @ts-expect-error getAttribute exists
    const target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) return;
  } // this may be a Weex event which doesn't have this method


  if (e.preventDefault) e.preventDefault();
  return true;
}

function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key];
    const outerValue = outer[key];

    if (typeof innerValue === 'string') {
      if (innerValue !== outerValue) return false;
    } else {
      if (!Array.isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i])) return false;
    }
  }

  return true;
}
/**
 * Get the original path value of a record by following its aliasOf
 * @param record
 */


function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : '';
}
/**
 * Utility class to get the active class based on defaults.
 * @param propClass
 * @param globalClass
 * @param defaultClass
 */


const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;

const RouterViewImpl = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_1__.defineComponent)({
  name: 'RouterView',
  // #674 we manually inherit them
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: 'default'
    },
    route: Object
  },

  setup(props, {
    attrs,
    slots
  }) {
     true && warnDeprecatedUsage();
    const injectedRoute = (0,vue__WEBPACK_IMPORTED_MODULE_1__.inject)(routerViewLocationKey);
    const routeToDisplay = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => props.route || injectedRoute.value);
    const depth = (0,vue__WEBPACK_IMPORTED_MODULE_1__.inject)(viewDepthKey, 0);
    const matchedRouteRef = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => routeToDisplay.value.matched[depth]);
    (0,vue__WEBPACK_IMPORTED_MODULE_1__.provide)(viewDepthKey, depth + 1);
    (0,vue__WEBPACK_IMPORTED_MODULE_1__.provide)(matchedRouteKey, matchedRouteRef);
    (0,vue__WEBPACK_IMPORTED_MODULE_1__.provide)(routerViewLocationKey, routeToDisplay);
    const viewRef = (0,vue__WEBPACK_IMPORTED_MODULE_1__.ref)(); // watch at the same time the component instance, the route record we are
    // rendering, and the name

    (0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      // copy reused instances
      if (to) {
        // this will update the instance for new instances as well as reused
        // instances when navigating to a new route
        to.instances[name] = instance; // the component instance is reused for a different route or name so
        // we copy any saved update or leave guards. With async setup, the
        // mounting component will mount before the matchedRoute changes,
        // making instance === oldInstance, so we check if guards have been
        // added before. This works because we remove guards when
        // unmounting/deactivating components

        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }

          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      } // trigger beforeRouteEnter next callbacks


      if (instance && to && ( // if there is no instance but to and from are the same this might be
      // the first visit
      !from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach(callback => callback(instance));
      }
    }, {
      flush: 'post'
    });
    return () => {
      const route = routeToDisplay.value;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[props.name]; // we need the value at the time we render because when we unmount, we
      // navigated to a different location so the value is different

      const currentName = props.name;

      if (!ViewComponent) {
        return normalizeSlot(slots.default, {
          Component: ViewComponent,
          route
        });
      } // props from route configuration


      const routePropsOption = matchedRoute.props[props.name];
      const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === 'function' ? routePropsOption(route) : routePropsOption : null;

      const onVnodeUnmounted = vnode => {
        // remove the instance reference to prevent leak
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };

      const component = (0,vue__WEBPACK_IMPORTED_MODULE_1__.h)(ViewComponent, assign({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));

      if (( true) && isBrowser && component.ref) {
        // TODO: can display if it's an alias, its props
        const info = {
          depth,
          name: matchedRoute.name,
          path: matchedRoute.path,
          meta: matchedRoute.meta
        };
        const internalInstances = Array.isArray(component.ref) ? component.ref.map(r => r.i) : [component.ref.i];
        internalInstances.forEach(instance => {
          // @ts-expect-error
          instance.__vrv_devtools = info;
        });
      }

      return (// pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        normalizeSlot(slots.default, {
          Component: component,
          route
        }) || component
      );
    };
  }

});

function normalizeSlot(slot, data) {
  if (!slot) return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
} // export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files

/**
 * Component to display the current route the user is at.
 */


const RouterView = RouterViewImpl; // warn against deprecated usage with <transition> & <keep-alive>
// due to functional component being no longer eager in Vue 3

function warnDeprecatedUsage() {
  const instance = (0,vue__WEBPACK_IMPORTED_MODULE_1__.getCurrentInstance)();
  const parentName = instance.parent && instance.parent.type.name;

  if (parentName && (parentName === 'KeepAlive' || parentName.includes('Transition'))) {
    const comp = parentName === 'KeepAlive' ? 'keep-alive' : 'transition';
    warn(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.\n` + `Use slot props instead:\n\n` + `<router-view v-slot="{ Component }">\n` + `  <${comp}>\n` + `    <component :is="Component" />\n` + `  </${comp}>\n` + `</router-view>`);
  }
}

function formatRouteLocation(routeLocation, tooltip) {
  const copy = assign({}, routeLocation, {
    // remove variables that can contain vue instances
    matched: routeLocation.matched.map(matched => omit(matched, ['instances', 'children', 'aliasOf']))
  });
  return {
    _custom: {
      type: null,
      readOnly: true,
      display: routeLocation.fullPath,
      tooltip,
      value: copy
    }
  };
}

function formatDisplay(display) {
  return {
    _custom: {
      display
    }
  };
} // to support multiple router instances


let routerId = 0;

function addDevtools(app, router, matcher) {
  // Take over router.beforeEach and afterEach
  // make sure we are not registering the devtool twice
  if (router.__hasDevtools) return;
  router.__hasDevtools = true; // increment to support multiple router instances

  const id = routerId++;
  (0,_vue_devtools_api__WEBPACK_IMPORTED_MODULE_2__.setupDevtoolsPlugin)({
    id: 'org.vuejs.router' + (id ? '.' + id : ''),
    label: 'Vue Router',
    packageName: 'vue-router',
    homepage: 'https://router.vuejs.org',
    logo: 'https://router.vuejs.org/logo.png',
    componentStateTypes: ['Routing'],
    app
  }, api => {
    // display state added by the router
    api.on.inspectComponent((payload, ctx) => {
      if (payload.instanceData) {
        payload.instanceData.state.push({
          type: 'Routing',
          key: '$route',
          editable: false,
          value: formatRouteLocation(router.currentRoute.value, 'Current Route')
        });
      }
    }); // mark router-link as active and display tags on router views

    api.on.visitComponentTree(({
      treeNode: node,
      componentInstance
    }) => {
      if (componentInstance.__vrv_devtools) {
        const info = componentInstance.__vrv_devtools;
        node.tags.push({
          label: (info.name ? `${info.name.toString()}: ` : '') + info.path,
          textColor: 0,
          tooltip: 'This component is rendered by &lt;router-view&gt;',
          backgroundColor: PINK_500
        });
      } // if multiple useLink are used


      if (Array.isArray(componentInstance.__vrl_devtools)) {
        componentInstance.__devtoolsApi = api;

        componentInstance.__vrl_devtools.forEach(devtoolsData => {
          let backgroundColor = ORANGE_400;
          let tooltip = '';

          if (devtoolsData.isExactActive) {
            backgroundColor = LIME_500;
            tooltip = 'This is exactly active';
          } else if (devtoolsData.isActive) {
            backgroundColor = BLUE_600;
            tooltip = 'This link is active';
          }

          node.tags.push({
            label: devtoolsData.route.path,
            textColor: 0,
            tooltip,
            backgroundColor
          });
        });
      }
    });
    (0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(router.currentRoute, () => {
      // refresh active state
      refreshRoutesView();
      api.notifyComponentUpdate();
      api.sendInspectorTree(routerInspectorId);
      api.sendInspectorState(routerInspectorId);
    });
    const navigationsLayerId = 'router:navigations:' + id;
    api.addTimelineLayer({
      id: navigationsLayerId,
      label: `Router${id ? ' ' + id : ''} Navigations`,
      color: 0x40a8c4
    }); // const errorsLayerId = 'router:errors'
    // api.addTimelineLayer({
    //   id: errorsLayerId,
    //   label: 'Router Errors',
    //   color: 0xea5455,
    // })

    router.onError((error, to) => {
      api.addTimelineEvent({
        layerId: navigationsLayerId,
        event: {
          title: 'Error during Navigation',
          subtitle: to.fullPath,
          logType: 'error',
          time: api.now(),
          data: {
            error
          },
          groupId: to.meta.__navigationId
        }
      });
    }); // attached to `meta` and used to group events

    let navigationId = 0;
    router.beforeEach((to, from) => {
      const data = {
        guard: formatDisplay('beforeEach'),
        from: formatRouteLocation(from, 'Current Location during this navigation'),
        to: formatRouteLocation(to, 'Target location')
      }; // Used to group navigations together, hide from devtools

      Object.defineProperty(to.meta, '__navigationId', {
        value: navigationId++
      });
      api.addTimelineEvent({
        layerId: navigationsLayerId,
        event: {
          time: api.now(),
          title: 'Start of navigation',
          subtitle: to.fullPath,
          data,
          groupId: to.meta.__navigationId
        }
      });
    });
    router.afterEach((to, from, failure) => {
      const data = {
        guard: formatDisplay('afterEach')
      };

      if (failure) {
        data.failure = {
          _custom: {
            type: Error,
            readOnly: true,
            display: failure ? failure.message : '',
            tooltip: 'Navigation Failure',
            value: failure
          }
        };
        data.status = formatDisplay('❌');
      } else {
        data.status = formatDisplay('✅');
      } // we set here to have the right order


      data.from = formatRouteLocation(from, 'Current Location during this navigation');
      data.to = formatRouteLocation(to, 'Target location');
      api.addTimelineEvent({
        layerId: navigationsLayerId,
        event: {
          title: 'End of navigation',
          subtitle: to.fullPath,
          time: api.now(),
          data,
          logType: failure ? 'warning' : 'default',
          groupId: to.meta.__navigationId
        }
      });
    });
    /**
     * Inspector of Existing routes
     */

    const routerInspectorId = 'router-inspector:' + id;
    api.addInspector({
      id: routerInspectorId,
      label: 'Routes' + (id ? ' ' + id : ''),
      icon: 'book',
      treeFilterPlaceholder: 'Search routes'
    });

    function refreshRoutesView() {
      // the routes view isn't active
      if (!activeRoutesPayload) return;
      const payload = activeRoutesPayload; // children routes will appear as nested

      let routes = matcher.getRoutes().filter(route => !route.parent); // reset match state to false

      routes.forEach(resetMatchStateOnRouteRecord); // apply a match state if there is a payload

      if (payload.filter) {
        routes = routes.filter(route => // save matches state based on the payload
        isRouteMatching(route, payload.filter.toLowerCase()));
      } // mark active routes


      routes.forEach(route => markRouteRecordActive(route, router.currentRoute.value));
      payload.rootNodes = routes.map(formatRouteRecordForInspector);
    }

    let activeRoutesPayload;
    api.on.getInspectorTree(payload => {
      activeRoutesPayload = payload;

      if (payload.app === app && payload.inspectorId === routerInspectorId) {
        refreshRoutesView();
      }
    });
    /**
     * Display information about the currently selected route record
     */

    api.on.getInspectorState(payload => {
      if (payload.app === app && payload.inspectorId === routerInspectorId) {
        const routes = matcher.getRoutes();
        const route = routes.find(route => route.record.__vd_id === payload.nodeId);

        if (route) {
          payload.state = {
            options: formatRouteRecordMatcherForStateInspector(route)
          };
        }
      }
    });
    api.sendInspectorTree(routerInspectorId);
    api.sendInspectorState(routerInspectorId);
  });
}

function modifierForKey(key) {
  if (key.optional) {
    return key.repeatable ? '*' : '?';
  } else {
    return key.repeatable ? '+' : '';
  }
}

function formatRouteRecordMatcherForStateInspector(route) {
  const {
    record
  } = route;
  const fields = [{
    editable: false,
    key: 'path',
    value: record.path
  }];

  if (record.name != null) {
    fields.push({
      editable: false,
      key: 'name',
      value: record.name
    });
  }

  fields.push({
    editable: false,
    key: 'regexp',
    value: route.re
  });

  if (route.keys.length) {
    fields.push({
      editable: false,
      key: 'keys',
      value: {
        _custom: {
          type: null,
          readOnly: true,
          display: route.keys.map(key => `${key.name}${modifierForKey(key)}`).join(' '),
          tooltip: 'Param keys',
          value: route.keys
        }
      }
    });
  }

  if (record.redirect != null) {
    fields.push({
      editable: false,
      key: 'redirect',
      value: record.redirect
    });
  }

  if (route.alias.length) {
    fields.push({
      editable: false,
      key: 'aliases',
      value: route.alias.map(alias => alias.record.path)
    });
  }

  fields.push({
    key: 'score',
    editable: false,
    value: {
      _custom: {
        type: null,
        readOnly: true,
        display: route.score.map(score => score.join(', ')).join(' | '),
        tooltip: 'Score used to sort routes',
        value: route.score
      }
    }
  });
  return fields;
}
/**
 * Extracted from tailwind palette
 */


const PINK_500 = 0xec4899;
const BLUE_600 = 0x2563eb;
const LIME_500 = 0x84cc16;
const CYAN_400 = 0x22d3ee;
const ORANGE_400 = 0xfb923c; // const GRAY_100 = 0xf4f4f5

const DARK = 0x666666;

function formatRouteRecordForInspector(route) {
  const tags = [];
  const {
    record
  } = route;

  if (record.name != null) {
    tags.push({
      label: String(record.name),
      textColor: 0,
      backgroundColor: CYAN_400
    });
  }

  if (record.aliasOf) {
    tags.push({
      label: 'alias',
      textColor: 0,
      backgroundColor: ORANGE_400
    });
  }

  if (route.__vd_match) {
    tags.push({
      label: 'matches',
      textColor: 0,
      backgroundColor: PINK_500
    });
  }

  if (route.__vd_exactActive) {
    tags.push({
      label: 'exact',
      textColor: 0,
      backgroundColor: LIME_500
    });
  }

  if (route.__vd_active) {
    tags.push({
      label: 'active',
      textColor: 0,
      backgroundColor: BLUE_600
    });
  }

  if (record.redirect) {
    tags.push({
      label: 'redirect: ' + (typeof record.redirect === 'string' ? record.redirect : 'Object'),
      textColor: 0xffffff,
      backgroundColor: DARK
    });
  } // add an id to be able to select it. Using the `path` is not possible because
  // empty path children would collide with their parents


  let id = record.__vd_id;

  if (id == null) {
    id = String(routeRecordId++);
    record.__vd_id = id;
  }

  return {
    id,
    label: record.path,
    tags,
    children: route.children.map(formatRouteRecordForInspector)
  };
} //  incremental id for route records and inspector state


let routeRecordId = 0;
const EXTRACT_REGEXP_RE = /^\/(.*)\/([a-z]*)$/;

function markRouteRecordActive(route, currentRoute) {
  // no route will be active if matched is empty
  // reset the matching state
  const isExactActive = currentRoute.matched.length && isSameRouteRecord(currentRoute.matched[currentRoute.matched.length - 1], route.record);
  route.__vd_exactActive = route.__vd_active = isExactActive;

  if (!isExactActive) {
    route.__vd_active = currentRoute.matched.some(match => isSameRouteRecord(match, route.record));
  }

  route.children.forEach(childRoute => markRouteRecordActive(childRoute, currentRoute));
}

function resetMatchStateOnRouteRecord(route) {
  route.__vd_match = false;
  route.children.forEach(resetMatchStateOnRouteRecord);
}

function isRouteMatching(route, filter) {
  const found = String(route.re).match(EXTRACT_REGEXP_RE);
  route.__vd_match = false;

  if (!found || found.length < 3) {
    return false;
  } // use a regexp without $ at the end to match nested routes better


  const nonEndingRE = new RegExp(found[1].replace(/\$$/, ''), found[2]);

  if (nonEndingRE.test(filter)) {
    // mark children as matches
    route.children.forEach(child => isRouteMatching(child, filter)); // exception case: `/`

    if (route.record.path !== '/' || filter === '/') {
      route.__vd_match = route.re.test(filter);
      return true;
    } // hide the / route


    return false;
  }

  const path = route.record.path.toLowerCase();
  const decodedPath = decode(path); // also allow partial matching on the path

  if (!filter.startsWith('/') && (decodedPath.includes(filter) || path.includes(filter))) return true;
  if (decodedPath.startsWith(filter) || path.startsWith(filter)) return true;
  if (route.record.name && String(route.record.name).includes(filter)) return true;
  return route.children.some(child => isRouteMatching(child, filter));
}

function omit(obj, keys) {
  const ret = {};

  for (const key in obj) {
    if (!keys.includes(key)) {
      // @ts-expect-error
      ret[key] = obj[key];
    }
  }

  return ret;
}
/**
 * Creates a Router instance that can be used by a Vue app.
 *
 * @param options - {@link RouterOptions}
 */


function createRouter(options) {
  const matcher = createRouterMatcher(options.routes, options);
  const parseQuery$1 = options.parseQuery || parseQuery;
  const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  const routerHistory = options.history;
  if ( true && !routerHistory) throw new Error('Provide the "history" option when calling "createRouter()":' + ' https://next.router.vuejs.org/api/#history.');
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = (0,vue__WEBPACK_IMPORTED_MODULE_1__.shallowRef)(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED; // leave the scrollRestoration if no scrollBehavior is provided

  if (isBrowser && options.scrollBehavior && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const normalizeParams = applyToParams.bind(null, paramValue => '' + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = // @ts-expect-error: intentionally avoid the type check
  applyToParams.bind(null, decode);

  function addRoute(parentOrRoute, route) {
    let parent;
    let record;

    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route;
    } else {
      record = parentOrRoute;
    }

    return matcher.addRoute(record, parent);
  }

  function removeRoute(name) {
    const recordMatcher = matcher.getRecordMatcher(name);

    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    } else if (true) {
      warn(`Cannot remove non-existent route "${String(name)}"`);
    }
  }

  function getRoutes() {
    return matcher.getRoutes().map(routeMatcher => routeMatcher.record);
  }

  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }

  function resolve(rawLocation, currentLocation) {
    // const objectLocation = routerLocationAsObject(rawLocation)
    // we create a copy to modify it later
    currentLocation = assign({}, currentLocation || currentRoute.value);

    if (typeof rawLocation === 'string') {
      const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      const matchedRoute = matcher.resolve({
        path: locationNormalized.path
      }, currentLocation);
      const href = routerHistory.createHref(locationNormalized.fullPath);

      if (true) {
        if (href.startsWith('//')) warn(`Location "${rawLocation}" resolved to "${href}". A resolved location cannot start with multiple slashes.`);else if (!matchedRoute.matched.length) {
          warn(`No match found for location with path "${rawLocation}"`);
        }
      } // locationNormalized is always a new object


      return assign(locationNormalized, matchedRoute, {
        params: decodeParams(matchedRoute.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: undefined,
        href
      });
    }

    let matcherLocation; // path could be relative in object as well

    if ('path' in rawLocation) {
      if ( true && 'params' in rawLocation && !('name' in rawLocation) && // @ts-expect-error: the type is never
      Object.keys(rawLocation.params).length) {
        warn(`Path "${// @ts-expect-error: the type is never
        rawLocation.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`);
      }

      matcherLocation = assign({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      // remove any nullish param
      const targetParams = assign({}, rawLocation.params);

      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      } // pass encoded values to the matcher so it can produce encoded path and fullPath


      matcherLocation = assign({}, rawLocation, {
        params: encodeParams(rawLocation.params)
      }); // current location params are decoded, we need to encode them in case the
      // matcher merges the params

      currentLocation.params = encodeParams(currentLocation.params);
    }

    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || '';

    if ( true && hash && !hash.startsWith('#')) {
      warn(`A \`hash\` should always start with the character "#". Replace "${hash}" with "#${hash}".`);
    } // decoding them) the matcher might have merged current location params so
    // we need to run the decoding again


    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    const href = routerHistory.createHref(fullPath);

    if (true) {
      if (href.startsWith('//')) {
        warn(`Location "${rawLocation}" resolved to "${href}". A resolved location cannot start with multiple slashes.`);
      } else if (!matchedRoute.matched.length) {
        warn(`No match found for location with path "${'path' in rawLocation ? rawLocation.path : rawLocation}"`);
      }
    }

    return assign({
      fullPath,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash,
      query: // if the user is using a custom query lib like qs, we might have
      // nested objects, so we keep the query as is, meaning it can contain
      // numbers at `$route.query`, but at the point, the user will have to
      // use their own type anyway.
      // https://github.com/vuejs/router/issues/328#issuecomment-649481567
      stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
    }, matchedRoute, {
      redirectedFrom: undefined,
      href
    });
  }

  function locationAsObject(to) {
    return typeof to === 'string' ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
  }

  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8
      /* NAVIGATION_CANCELLED */
      , {
        from,
        to
      });
    }
  }

  function push(to) {
    return pushWithRedirect(to);
  }

  function replace(to) {
    return push(assign(locationAsObject(to), {
      replace: true
    }));
  }

  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];

    if (lastMatched && lastMatched.redirect) {
      const {
        redirect
      } = lastMatched;
      let newTargetLocation = typeof redirect === 'function' ? redirect(to) : redirect;

      if (typeof newTargetLocation === 'string') {
        newTargetLocation = newTargetLocation.includes('?') || newTargetLocation.includes('#') ? newTargetLocation = locationAsObject(newTargetLocation) : // force empty params
        {
          path: newTargetLocation
        }; // @ts-expect-error: force empty params when a string is passed to let
        // the router parse them again

        newTargetLocation.params = {};
      }

      if ( true && !('path' in newTargetLocation) && !('name' in newTargetLocation)) {
        warn(`Invalid redirect found:\n${JSON.stringify(newTargetLocation, null, 2)}\n when navigating to "${to.fullPath}". A redirect must contain a name or path. This will break in production.`);
        throw new Error('Invalid redirect');
      }

      return assign({
        query: to.query,
        hash: to.hash,
        params: to.params
      }, newTargetLocation);
    }
  }

  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve(to);
    const from = currentRoute.value;
    const data = to.state;
    const force = to.force; // to could be a string where `replace` is a function

    const replace = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect) return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
      state: data,
      force,
      replace
    }), // keep original redirectedFrom if it exists
    redirectedFrom || targetLocation); // if it was a redirect we already called `pushWithRedirect` above

    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;

    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16
      /* NAVIGATION_DUPLICATED */
      , {
        to: toLocation,
        from
      }); // trigger scroll to allow scrolling to the same anchor

      handleScroll(from, from, // this is a push, the only way for it to be triggered from a
      // history.listen is with a redirect, which makes it become a push
      true, // This cannot be the first navigation because the initial location
      // cannot be manually navigated to
      false);
    }

    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch(error => isNavigationFailure(error) ? // navigation redirects still mark the router as ready
    isNavigationFailure(error, 2
    /* NAVIGATION_GUARD_REDIRECT */
    ) ? error : markAsReady(error) // also returns the error
    : // reject any unknown error
    triggerError(error, toLocation, from)).then(failure => {
      if (failure) {
        if (isNavigationFailure(failure, 2
        /* NAVIGATION_GUARD_REDIRECT */
        )) {
          if ( true && // we are redirecting to the same location we were already at
          isSameRouteLocation(stringifyQuery$1, resolve(failure.to), toLocation) && // and we have done it a couple of times
          redirectedFrom && // @ts-expect-error: added only in dev
          (redirectedFrom._count = redirectedFrom._count ? // @ts-expect-error
          redirectedFrom._count + 1 : 1) > 10) {
            warn(`Detected an infinite redirection in a navigation guard when going from "${from.fullPath}" to "${toLocation.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`);
            return Promise.reject(new Error('Infinite redirect in navigation guard'));
          }

          return pushWithRedirect( // keep options
          assign(locationAsObject(failure.to), {
            state: data,
            force,
            replace
          }), // preserve the original redirectedFrom if any
          redirectedFrom || toLocation);
        }
      } else {
        // if we fail we don't finalize the navigation
        failure = finalizeNavigation(toLocation, from, true, replace, data);
      }

      triggerAfterEach(toLocation, from, failure);
      return failure;
    });
  }
  /**
   * Helper to reject and skip all navigation guards if a new navigation happened
   * @param to
   * @param from
   */


  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  } // TODO: refactor the whole before guards by internally using router.beforeEach


  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from); // all components here have been resolved once because we are leaving

    guards = extractComponentsGuards(leavingRecords.reverse(), 'beforeRouteLeave', to, from); // leavingRecords is already reversed

    for (const record of leavingRecords) {
      record.leaveGuards.forEach(guard => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }

    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck); // run the queue of per route beforeRouteLeave guards

    return runGuardQueue(guards).then(() => {
      // check global guards beforeEach
      guards = [];

      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }

      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      // check in components beforeRouteUpdate
      guards = extractComponentsGuards(updatingRecords, 'beforeRouteUpdate', to, from);

      for (const record of updatingRecords) {
        record.updateGuards.forEach(guard => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }

      guards.push(canceledNavigationCheck); // run the queue of per route beforeEnter guards

      return runGuardQueue(guards);
    }).then(() => {
      // check the route beforeEnter
      guards = [];

      for (const record of to.matched) {
        // do not trigger beforeEnter on reused views
        if (record.beforeEnter && !from.matched.includes(record)) {
          if (Array.isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter) guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }

      guards.push(canceledNavigationCheck); // run the queue of per route beforeEnter guards

      return runGuardQueue(guards);
    }).then(() => {
      // NOTE: at this point to.matched is normalized and does not contain any () => Promise<Component>
      // clear existing enterCallbacks, these are added by extractComponentsGuards
      to.matched.forEach(record => record.enterCallbacks = {}); // check in-component beforeRouteEnter

      guards = extractComponentsGuards(enteringRecords, 'beforeRouteEnter', to, from);
      guards.push(canceledNavigationCheck); // run the queue of per route beforeEnter guards

      return runGuardQueue(guards);
    }).then(() => {
      // check global guards beforeResolve
      guards = [];

      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }

      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }) // catch any navigation canceled
    .catch(err => isNavigationFailure(err, 8
    /* NAVIGATION_CANCELLED */
    ) ? err : Promise.reject(err));
  }

  function triggerAfterEach(to, from, failure) {
    // navigation is confirmed, call afterGuards
    // TODO: wrap with error handlers
    for (const guard of afterGuards.list()) guard(to, from, failure);
  }
  /**
   * - Cleans up any navigation guards
   * - Changes the url if necessary
   * - Calls the scrollBehavior
   */


  function finalizeNavigation(toLocation, from, isPush, replace, data) {
    // a more recent navigation took place
    const error = checkCanceledNavigation(toLocation, from);
    if (error) return error; // only consider as push if it's not the first navigation

    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state; // change URL only if the user did a push/replace and if it's not the initial navigation because
    // it's just reflecting the url

    if (isPush) {
      // on the initial navigation, we want to reuse the scroll position from
      // history state if it exists
      if (replace || isFirstNavigation) routerHistory.replace(toLocation.fullPath, assign({
        scroll: isFirstNavigation && state && state.scroll
      }, data));else routerHistory.push(toLocation.fullPath, data);
    } // accept current navigation


    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }

  let removeHistoryListener; // attach listener to history to trigger navigations

  function setupListeners() {
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      // cannot be a redirect route because it was in history
      const toLocation = resolve(to); // due to dynamic routing, and to hash history with manual navigation
      // (manually changing the url or calling history.hash = '#/somewhere'),
      // there could be a redirect record in history

      const shouldRedirect = handleRedirectRecord(toLocation);

      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, {
          replace: true
        }), toLocation).catch(noop);
        return;
      }

      pendingLocation = toLocation;
      const from = currentRoute.value; // TODO: should be moved to web history?

      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }

      navigate(toLocation, from).catch(error => {
        if (isNavigationFailure(error, 4
        /* NAVIGATION_ABORTED */
        | 8
        /* NAVIGATION_CANCELLED */
        )) {
          return error;
        }

        if (isNavigationFailure(error, 2
        /* NAVIGATION_GUARD_REDIRECT */
        )) {
          // Here we could call if (info.delta) routerHistory.go(-info.delta,
          // false) but this is bug prone as we have no way to wait the
          // navigation to be finished before calling pushWithRedirect. Using
          // a setTimeout of 16ms seems to work but there is not guarantee for
          // it to work on every browser. So Instead we do not restore the
          // history entry and trigger a new navigation as requested by the
          // navigation guard.
          // the error is already handled by router.push we just want to avoid
          // logging the error
          pushWithRedirect(error.to, toLocation // avoid an uncaught rejection, let push call triggerError
          ).then(failure => {
            // manual change in hash history #916 ending up in the URL not
            // changing but it was changed by the manual url change, so we
            // need to manually change it ourselves
            if (isNavigationFailure(failure, 4
            /* NAVIGATION_ABORTED */
            | 16
            /* NAVIGATION_DUPLICATED */
            ) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop); // avoid the then branch

          return Promise.reject();
        } // do not restore history on unknown direction


        if (info.delta) routerHistory.go(-info.delta, false); // unrecognized error, transfer to the global handler

        return triggerError(error, toLocation, from);
      }).then(failure => {
        failure = failure || finalizeNavigation( // after navigation, all matched components are resolved
        toLocation, from, false); // revert the navigation

        if (failure) {
          if (info.delta) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4
          /* NAVIGATION_ABORTED */
          | 16
          /* NAVIGATION_DUPLICATED */
          )) {
            // manual change in hash history #916
            // it's like a push but lacks the information of the direction
            routerHistory.go(-1, false);
          }
        }

        triggerAfterEach(toLocation, from, failure);
      }).catch(noop);
    });
  } // Initialization and Errors


  let readyHandlers = useCallbacks();
  let errorHandlers = useCallbacks();
  let ready;
  /**
   * Trigger errorHandlers added via onError and throws the error as well
   *
   * @param error - error to throw
   * @param to - location we were navigating to when the error happened
   * @param from - location we were navigating from when the error happened
   * @returns the error as a rejected promise
   */

  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorHandlers.list();

    if (list.length) {
      list.forEach(handler => handler(error, to, from));
    } else {
      if (true) {
        warn('uncaught error during route navigation:');
      }

      console.error(error);
    }

    return Promise.reject(error);
  }

  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED) return Promise.resolve();
    return new Promise((resolve, reject) => {
      readyHandlers.add([resolve, reject]);
    });
  }

  function markAsReady(err) {
    if (!ready) {
      // still not ready if an error happened
      ready = !err;
      setupListeners();
      readyHandlers.list().forEach(([resolve, reject]) => err ? reject(err) : resolve());
      readyHandlers.reset();
    }

    return err;
  } // Scroll behavior


  function handleScroll(to, from, isPush, isFirstNavigation) {
    const {
      scrollBehavior
    } = options;
    if (!isBrowser || !scrollBehavior) return Promise.resolve();
    const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return (0,vue__WEBPACK_IMPORTED_MODULE_1__.nextTick)().then(() => scrollBehavior(to, from, scrollPosition)).then(position => position && scrollToPosition(position)).catch(err => triggerError(err, to, from));
  }

  const go = delta => routerHistory.go(delta);

  let started;
  const installedApps = new Set();
  const router = {
    currentRoute,
    addRoute,
    removeRoute,
    hasRoute,
    getRoutes,
    resolve,
    options,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorHandlers.add,
    isReady,

    install(app) {
      const router = this;
      app.component('RouterLink', RouterLink);
      app.component('RouterView', RouterView);
      app.config.globalProperties.$router = router;
      Object.defineProperty(app.config.globalProperties, '$route', {
        enumerable: true,
        get: () => (0,vue__WEBPACK_IMPORTED_MODULE_1__.unref)(currentRoute)
      }); // this initial navigation is only necessary on client, on server it doesn't
      // make sense because it will create an extra unnecessary navigation and could
      // lead to problems

      if (isBrowser && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        // see above
        started = true;
        push(routerHistory.location).catch(err => {
          if (true) warn('Unexpected error when starting the router:', err);
        });
      }

      const reactiveRoute = {};

      for (const key in START_LOCATION_NORMALIZED) {
        // @ts-expect-error: the key matches
        reactiveRoute[key] = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => currentRoute.value[key]);
      }

      app.provide(routerKey, router);
      app.provide(routeLocationKey, (0,vue__WEBPACK_IMPORTED_MODULE_1__.reactive)(reactiveRoute));
      app.provide(routerViewLocationKey, currentRoute);
      const unmountApp = app.unmount;
      installedApps.add(app);

      app.unmount = function () {
        installedApps.delete(app); // the router is not attached to an app anymore

        if (installedApps.size < 1) {
          // invalidate the current navigation
          pendingLocation = START_LOCATION_NORMALIZED;
          removeHistoryListener && removeHistoryListener();
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready = false;
        }

        unmountApp();
      };

      if (( true) && isBrowser) {
        addDevtools(app, router, matcher);
      }
    }

  };
  return router;
}

function runGuardQueue(guards) {
  return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
}

function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);

  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];

    if (recordFrom) {
      if (to.matched.find(record => isSameRouteRecord(record, recordFrom))) updatingRecords.push(recordFrom);else leavingRecords.push(recordFrom);
    }

    const recordTo = to.matched[i];

    if (recordTo) {
      // the type doesn't matter because we are comparing per reference
      if (!from.matched.find(record => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }

  return [leavingRecords, updatingRecords, enteringRecords];
}
/**
 * Returns the router instance. Equivalent to using `$router` inside
 * templates.
 */


function useRouter() {
  return (0,vue__WEBPACK_IMPORTED_MODULE_1__.inject)(routerKey);
}
/**
 * Returns the current route location. Equivalent to using `$route` inside
 * templates.
 */


function useRoute() {
  return (0,vue__WEBPACK_IMPORTED_MODULE_1__.inject)(routeLocationKey);
}



/***/ }),

/***/ "./node_modules/vue/dist/vue.runtime.esm-bundler.js":
/*!**********************************************************!*\
  !*** ./node_modules/vue/dist/vue.runtime.esm-bundler.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseTransition": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.BaseTransition; },
/* harmony export */   "Comment": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Comment; },
/* harmony export */   "EffectScope": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.EffectScope; },
/* harmony export */   "Fragment": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Fragment; },
/* harmony export */   "KeepAlive": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.KeepAlive; },
/* harmony export */   "ReactiveEffect": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.ReactiveEffect; },
/* harmony export */   "Static": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Static; },
/* harmony export */   "Suspense": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Suspense; },
/* harmony export */   "Teleport": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Teleport; },
/* harmony export */   "Text": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Text; },
/* harmony export */   "Transition": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Transition; },
/* harmony export */   "TransitionGroup": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.TransitionGroup; },
/* harmony export */   "VueElement": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.VueElement; },
/* harmony export */   "callWithAsyncErrorHandling": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.callWithAsyncErrorHandling; },
/* harmony export */   "callWithErrorHandling": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling; },
/* harmony export */   "camelize": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.camelize; },
/* harmony export */   "capitalize": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.capitalize; },
/* harmony export */   "cloneVNode": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.cloneVNode; },
/* harmony export */   "compatUtils": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.compatUtils; },
/* harmony export */   "compile": function() { return /* binding */ compile; },
/* harmony export */   "computed": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.computed; },
/* harmony export */   "createApp": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createApp; },
/* harmony export */   "createBlock": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createBlock; },
/* harmony export */   "createCommentVNode": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode; },
/* harmony export */   "createElementBlock": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createElementBlock; },
/* harmony export */   "createElementVNode": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createElementVNode; },
/* harmony export */   "createHydrationRenderer": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createHydrationRenderer; },
/* harmony export */   "createPropsRestProxy": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createPropsRestProxy; },
/* harmony export */   "createRenderer": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createRenderer; },
/* harmony export */   "createSSRApp": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createSSRApp; },
/* harmony export */   "createSlots": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createSlots; },
/* harmony export */   "createStaticVNode": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createStaticVNode; },
/* harmony export */   "createTextVNode": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createTextVNode; },
/* harmony export */   "createVNode": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createVNode; },
/* harmony export */   "customRef": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.customRef; },
/* harmony export */   "defineAsyncComponent": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineAsyncComponent; },
/* harmony export */   "defineComponent": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineComponent; },
/* harmony export */   "defineCustomElement": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineCustomElement; },
/* harmony export */   "defineEmits": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineEmits; },
/* harmony export */   "defineExpose": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineExpose; },
/* harmony export */   "defineProps": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineProps; },
/* harmony export */   "defineSSRCustomElement": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineSSRCustomElement; },
/* harmony export */   "devtools": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.devtools; },
/* harmony export */   "effect": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.effect; },
/* harmony export */   "effectScope": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.effectScope; },
/* harmony export */   "getCurrentInstance": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance; },
/* harmony export */   "getCurrentScope": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.getCurrentScope; },
/* harmony export */   "getTransitionRawChildren": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.getTransitionRawChildren; },
/* harmony export */   "guardReactiveProps": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.guardReactiveProps; },
/* harmony export */   "h": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.h; },
/* harmony export */   "handleError": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.handleError; },
/* harmony export */   "hydrate": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.hydrate; },
/* harmony export */   "initCustomFormatter": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.initCustomFormatter; },
/* harmony export */   "initDirectivesForSSR": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.initDirectivesForSSR; },
/* harmony export */   "inject": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.inject; },
/* harmony export */   "isMemoSame": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isMemoSame; },
/* harmony export */   "isProxy": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isProxy; },
/* harmony export */   "isReactive": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isReactive; },
/* harmony export */   "isReadonly": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isReadonly; },
/* harmony export */   "isRef": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isRef; },
/* harmony export */   "isRuntimeOnly": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isRuntimeOnly; },
/* harmony export */   "isShallow": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isShallow; },
/* harmony export */   "isVNode": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isVNode; },
/* harmony export */   "markRaw": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.markRaw; },
/* harmony export */   "mergeDefaults": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.mergeDefaults; },
/* harmony export */   "mergeProps": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.mergeProps; },
/* harmony export */   "nextTick": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.nextTick; },
/* harmony export */   "normalizeClass": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.normalizeClass; },
/* harmony export */   "normalizeProps": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.normalizeProps; },
/* harmony export */   "normalizeStyle": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.normalizeStyle; },
/* harmony export */   "onActivated": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onActivated; },
/* harmony export */   "onBeforeMount": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onBeforeMount; },
/* harmony export */   "onBeforeUnmount": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onBeforeUnmount; },
/* harmony export */   "onBeforeUpdate": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onBeforeUpdate; },
/* harmony export */   "onDeactivated": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onDeactivated; },
/* harmony export */   "onErrorCaptured": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onErrorCaptured; },
/* harmony export */   "onMounted": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onMounted; },
/* harmony export */   "onRenderTracked": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onRenderTracked; },
/* harmony export */   "onRenderTriggered": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onRenderTriggered; },
/* harmony export */   "onScopeDispose": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onScopeDispose; },
/* harmony export */   "onServerPrefetch": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onServerPrefetch; },
/* harmony export */   "onUnmounted": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onUnmounted; },
/* harmony export */   "onUpdated": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onUpdated; },
/* harmony export */   "openBlock": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.openBlock; },
/* harmony export */   "popScopeId": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.popScopeId; },
/* harmony export */   "provide": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.provide; },
/* harmony export */   "proxyRefs": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.proxyRefs; },
/* harmony export */   "pushScopeId": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.pushScopeId; },
/* harmony export */   "queuePostFlushCb": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.queuePostFlushCb; },
/* harmony export */   "reactive": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.reactive; },
/* harmony export */   "readonly": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.readonly; },
/* harmony export */   "ref": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.ref; },
/* harmony export */   "registerRuntimeCompiler": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.registerRuntimeCompiler; },
/* harmony export */   "render": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.render; },
/* harmony export */   "renderList": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.renderList; },
/* harmony export */   "renderSlot": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.renderSlot; },
/* harmony export */   "resolveComponent": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.resolveComponent; },
/* harmony export */   "resolveDirective": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.resolveDirective; },
/* harmony export */   "resolveDynamicComponent": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.resolveDynamicComponent; },
/* harmony export */   "resolveFilter": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.resolveFilter; },
/* harmony export */   "resolveTransitionHooks": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.resolveTransitionHooks; },
/* harmony export */   "setBlockTracking": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.setBlockTracking; },
/* harmony export */   "setDevtoolsHook": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.setDevtoolsHook; },
/* harmony export */   "setTransitionHooks": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.setTransitionHooks; },
/* harmony export */   "shallowReactive": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.shallowReactive; },
/* harmony export */   "shallowReadonly": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly; },
/* harmony export */   "shallowRef": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.shallowRef; },
/* harmony export */   "ssrContextKey": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.ssrContextKey; },
/* harmony export */   "ssrUtils": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.ssrUtils; },
/* harmony export */   "stop": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.stop; },
/* harmony export */   "toDisplayString": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.toDisplayString; },
/* harmony export */   "toHandlerKey": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.toHandlerKey; },
/* harmony export */   "toHandlers": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.toHandlers; },
/* harmony export */   "toRaw": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.toRaw; },
/* harmony export */   "toRef": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.toRef; },
/* harmony export */   "toRefs": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.toRefs; },
/* harmony export */   "transformVNodeArgs": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.transformVNodeArgs; },
/* harmony export */   "triggerRef": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.triggerRef; },
/* harmony export */   "unref": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.unref; },
/* harmony export */   "useAttrs": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.useAttrs; },
/* harmony export */   "useCssModule": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.useCssModule; },
/* harmony export */   "useCssVars": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.useCssVars; },
/* harmony export */   "useSSRContext": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.useSSRContext; },
/* harmony export */   "useSlots": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.useSlots; },
/* harmony export */   "useTransitionState": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.useTransitionState; },
/* harmony export */   "vModelCheckbox": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.vModelCheckbox; },
/* harmony export */   "vModelDynamic": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.vModelDynamic; },
/* harmony export */   "vModelRadio": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.vModelRadio; },
/* harmony export */   "vModelSelect": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.vModelSelect; },
/* harmony export */   "vModelText": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.vModelText; },
/* harmony export */   "vShow": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.vShow; },
/* harmony export */   "version": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.version; },
/* harmony export */   "warn": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.warn; },
/* harmony export */   "watch": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.watch; },
/* harmony export */   "watchEffect": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.watchEffect; },
/* harmony export */   "watchPostEffect": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.watchPostEffect; },
/* harmony export */   "watchSyncEffect": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.watchSyncEffect; },
/* harmony export */   "withAsyncContext": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withAsyncContext; },
/* harmony export */   "withCtx": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withCtx; },
/* harmony export */   "withDefaults": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withDefaults; },
/* harmony export */   "withDirectives": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withDirectives; },
/* harmony export */   "withKeys": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withKeys; },
/* harmony export */   "withMemo": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withMemo; },
/* harmony export */   "withModifiers": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withModifiers; },
/* harmony export */   "withScopeId": function() { return /* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withScopeId; }
/* harmony export */ });
/* harmony import */ var _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vue/runtime-dom */ "./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js");
/* harmony import */ var _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/runtime-dom */ "./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js");



function initDev() {
  {
    (0,_vue_runtime_dom__WEBPACK_IMPORTED_MODULE_1__.initCustomFormatter)();
  }
} // This entry exports the runtime only, and is built as


if (true) {
  initDev();
}

const compile = () => {
  if (true) {
    (0,_vue_runtime_dom__WEBPACK_IMPORTED_MODULE_1__.warn)(`Runtime compilation is not supported in this build of Vue.` + ` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
    /* should not happen */
    );
  }
};



/***/ }),

/***/ "./node_modules/core-js/internals/a-callable.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-callable.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");

var TypeError = global.TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ "./node_modules/core-js/internals/a-possible-prototype.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/a-possible-prototype.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var String = global.String;
var TypeError = global.TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw TypeError("Can't set " + String(argument) + ' as a prototype');
};


/***/ }),

/***/ "./node_modules/core-js/internals/an-instance.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/an-instance.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");

var TypeError = global.TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw TypeError('Incorrect invocation');
};


/***/ }),

/***/ "./node_modules/core-js/internals/an-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/an-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var String = global.String;
var TypeError = global.TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw TypeError(String(argument) + ' is not an object');
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-includes.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-includes.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof-raw.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/classof-raw.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/classof.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var Object = global.Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/clear-error-stack.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/clear-error-stack.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String(Error(arg).stack); })('zxcasd');
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string') {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


/***/ }),

/***/ "./node_modules/core-js/internals/copy-constructor-properties.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/copy-constructor-properties.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var ownKeys = __webpack_require__(/*! ../internals/own-keys */ "./node_modules/core-js/internals/own-keys.js");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-non-enumerable-property.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/create-non-enumerable-property.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-property-descriptor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-property-descriptor.js ***!
  \**********************************************************************/
/***/ (function(module) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/descriptors.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/descriptors.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/document-create-element.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/document-create-element.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js/internals/dom-exception-constants.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/dom-exception-constants.js ***!
  \*******************************************************************/
/***/ (function(module) {

module.exports = {
  IndexSizeError: { s: 'INDEX_SIZE_ERR', c: 1, m: 1 },
  DOMStringSizeError: { s: 'DOMSTRING_SIZE_ERR', c: 2, m: 0 },
  HierarchyRequestError: { s: 'HIERARCHY_REQUEST_ERR', c: 3, m: 1 },
  WrongDocumentError: { s: 'WRONG_DOCUMENT_ERR', c: 4, m: 1 },
  InvalidCharacterError: { s: 'INVALID_CHARACTER_ERR', c: 5, m: 1 },
  NoDataAllowedError: { s: 'NO_DATA_ALLOWED_ERR', c: 6, m: 0 },
  NoModificationAllowedError: { s: 'NO_MODIFICATION_ALLOWED_ERR', c: 7, m: 1 },
  NotFoundError: { s: 'NOT_FOUND_ERR', c: 8, m: 1 },
  NotSupportedError: { s: 'NOT_SUPPORTED_ERR', c: 9, m: 1 },
  InUseAttributeError: { s: 'INUSE_ATTRIBUTE_ERR', c: 10, m: 1 },
  InvalidStateError: { s: 'INVALID_STATE_ERR', c: 11, m: 1 },
  SyntaxError: { s: 'SYNTAX_ERR', c: 12, m: 1 },
  InvalidModificationError: { s: 'INVALID_MODIFICATION_ERR', c: 13, m: 1 },
  NamespaceError: { s: 'NAMESPACE_ERR', c: 14, m: 1 },
  InvalidAccessError: { s: 'INVALID_ACCESS_ERR', c: 15, m: 1 },
  ValidationError: { s: 'VALIDATION_ERR', c: 16, m: 0 },
  TypeMismatchError: { s: 'TYPE_MISMATCH_ERR', c: 17, m: 1 },
  SecurityError: { s: 'SECURITY_ERR', c: 18, m: 1 },
  NetworkError: { s: 'NETWORK_ERR', c: 19, m: 1 },
  AbortError: { s: 'ABORT_ERR', c: 20, m: 1 },
  URLMismatchError: { s: 'URL_MISMATCH_ERR', c: 21, m: 1 },
  QuotaExceededError: { s: 'QUOTA_EXCEEDED_ERR', c: 22, m: 1 },
  TimeoutError: { s: 'TIMEOUT_ERR', c: 23, m: 1 },
  InvalidNodeTypeError: { s: 'INVALID_NODE_TYPE_ERR', c: 24, m: 1 },
  DataCloneError: { s: 'DATA_CLONE_ERR', c: 25, m: 1 }
};


/***/ }),

/***/ "./node_modules/core-js/internals/engine-user-agent.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-user-agent.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ "./node_modules/core-js/internals/engine-v8-version.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-v8-version.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ "./node_modules/core-js/internals/enum-bug-keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/enum-bug-keys.js ***!
  \*********************************************************/
/***/ (function(module) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "./node_modules/core-js/internals/error-stack-installable.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/error-stack-installable.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = !fails(function () {
  var error = Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/export.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/export.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js").f);
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");
var setGlobal = __webpack_require__(/*! ../internals/set-global */ "./node_modules/core-js/internals/set-global.js");
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js/internals/copy-constructor-properties.js");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js/internals/is-forced.js");

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
  options.name        - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/fails.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/fails.js ***!
  \*************************************************/
/***/ (function(module) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-apply.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/function-apply.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-native.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-native.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ "./node_modules/core-js/internals/function-call.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-call.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-name.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-name.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var bind = FunctionPrototype.bind;
var call = FunctionPrototype.call;
var uncurryThis = NATIVE_BIND && bind.bind(call, call);

module.exports = NATIVE_BIND ? function (fn) {
  return fn && uncurryThis(fn);
} : function (fn) {
  return fn && function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-built-in.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-built-in.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-method.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/get-method.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};


/***/ }),

/***/ "./node_modules/core-js/internals/global.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/global.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ "./node_modules/core-js/internals/has-own-property.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/has-own-property.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ "./node_modules/core-js/internals/hidden-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/hidden-keys.js ***!
  \*******************************************************/
/***/ (function(module) {

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/internals/ie8-dom-define.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/ie8-dom-define.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/indexed-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/indexed-object.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

var Object = global.Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : Object(it);
} : Object;


/***/ }),

/***/ "./node_modules/core-js/internals/inherit-if-required.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/inherit-if-required.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ "./node_modules/core-js/internals/inspect-source.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/inspect-source.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "./node_modules/core-js/internals/install-error-cause.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/install-error-cause.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/internal-state.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/internal-state.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/native-weak-map */ "./node_modules/core-js/internals/native-weak-map.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var shared = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = uncurryThis(store.get);
  var wmhas = uncurryThis(store.has);
  var wmset = uncurryThis(store.set);
  set = function (it, metadata) {
    if (wmhas(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget(store, it) || {};
  };
  has = function (it) {
    return wmhas(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-callable.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/is-callable.js ***!
  \*******************************************************/
/***/ (function(module) {

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-forced.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-forced.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "./node_modules/core-js/internals/is-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-pure.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/is-pure.js ***!
  \***************************************************/
/***/ (function(module) {

module.exports = false;


/***/ }),

/***/ "./node_modules/core-js/internals/is-symbol.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-symbol.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var Object = global.Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, Object(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/length-of-array-like.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/length-of-array-like.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/native-symbol.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/native-symbol.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ "./node_modules/core-js/internals/native-weak-map.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/native-weak-map.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));


/***/ }),

/***/ "./node_modules/core-js/internals/normalize-string-argument.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/normalize-string-argument.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-property.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");

var TypeError = global.TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-descriptor.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-descriptor.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-names.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-symbols.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-symbols.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "./node_modules/core-js/internals/object-is-prototype-of.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-prototype-of.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ "./node_modules/core-js/internals/object-keys-internal.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys-internal.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var indexOf = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").indexOf);
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-property-is-enumerable.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-property-is-enumerable.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ "./node_modules/core-js/internals/object-set-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-set-prototype-of.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable no-proto -- safe */
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var aPossiblePrototype = __webpack_require__(/*! ../internals/a-possible-prototype */ "./node_modules/core-js/internals/a-possible-prototype.js");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = uncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "./node_modules/core-js/internals/ordinary-to-primitive.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/ordinary-to-primitive.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var TypeError = global.TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js/internals/own-keys.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/own-keys.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "./node_modules/core-js/internals/redefine.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/redefine.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var setGlobal = __webpack_require__(/*! ../internals/set-global */ "./node_modules/core-js/internals/set-global.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js").CONFIGURABLE);

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var name = options && options.name !== undefined ? options.name : key;
  var state;
  if (isCallable(value)) {
    if (String(name).slice(0, 7) === 'Symbol(') {
      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
    }
    if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
      createNonEnumerableProperty(value, 'name', name);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
    }
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
});


/***/ }),

/***/ "./node_modules/core-js/internals/require-object-coercible.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/require-object-coercible.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var TypeError = global.TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-global.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/set-global.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-key.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/shared-key.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-store.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/shared-store.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var setGlobal = __webpack_require__(/*! ../internals/set-global */ "./node_modules/core-js/internals/set-global.js");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),

/***/ "./node_modules/core-js/internals/shared.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/shared.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.21.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.21.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ "./node_modules/core-js/internals/to-absolute-index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-absolute-index.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-indexed-object.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-indexed-object.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-integer-or-infinity.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/to-integer-or-infinity.js ***!
  \******************************************************************/
/***/ (function(module) {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- safe
  return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-length.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-length.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

var Object = global.Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-primitive.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/to-primitive.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ "./node_modules/core-js/internals/ordinary-to-primitive.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TypeError = global.TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-property-key.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/to-property-key.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-string-tag-support.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/to-string-tag-support.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "./node_modules/core-js/internals/to-string.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-string.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");

var String = global.String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return String(argument);
};


/***/ }),

/***/ "./node_modules/core-js/internals/try-to-string.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/try-to-string.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var String = global.String;

module.exports = function (argument) {
  try {
    return String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/uid.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/internals/uid.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ "./node_modules/core-js/internals/use-symbol-as-uid.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/use-symbol-as-uid.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/native-symbol */ "./node_modules/core-js/internals/native-symbol.js");

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ "./node_modules/core-js/internals/v8-prototype-define-bug.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/v8-prototype-define-bug.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/native-symbol */ "./node_modules/core-js/internals/native-symbol.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ "./node_modules/core-js/internals/wrap-error-constructor-with-cause.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js/internals/wrap-error-constructor-with-cause.js ***!
  \*****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js/internals/copy-constructor-properties.js");
var inheritIfRequired = __webpack_require__(/*! ../internals/inherit-if-required */ "./node_modules/core-js/internals/inherit-if-required.js");
var normalizeStringArgument = __webpack_require__(/*! ../internals/normalize-string-argument */ "./node_modules/core-js/internals/normalize-string-argument.js");
var installErrorCause = __webpack_require__(/*! ../internals/install-error-cause */ "./node_modules/core-js/internals/install-error-cause.js");
var clearErrorStack = __webpack_require__(/*! ../internals/clear-error-stack */ "./node_modules/core-js/internals/clear-error-stack.js");
var ERROR_STACK_INSTALLABLE = __webpack_require__(/*! ../internals/error-stack-installable */ "./node_modules/core-js/internals/error-stack-installable.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

module.exports = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
  var path = FULL_NAME.split('.');
  var ERROR_NAME = path[path.length - 1];
  var OriginalError = getBuiltIn.apply(null, path);

  if (!OriginalError) return;

  var OriginalErrorPrototype = OriginalError.prototype;

  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
  if (!IS_PURE && hasOwn(OriginalErrorPrototype, 'cause')) delete OriginalErrorPrototype.cause;

  if (!FORCED) return OriginalError;

  var BaseError = getBuiltIn('Error');

  var WrappedError = wrapper(function (a, b) {
    var message = normalizeStringArgument(IS_AGGREGATE_ERROR ? b : a, undefined);
    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
    if (message !== undefined) createNonEnumerableProperty(result, 'message', message);
    if (ERROR_STACK_INSTALLABLE) createNonEnumerableProperty(result, 'stack', clearErrorStack(result.stack, 2));
    if (this && isPrototypeOf(OriginalErrorPrototype, this)) inheritIfRequired(result, this, WrappedError);
    if (arguments.length > OPTIONS_POSITION) installErrorCause(result, arguments[OPTIONS_POSITION]);
    return result;
  });

  WrappedError.prototype = OriginalErrorPrototype;

  if (ERROR_NAME !== 'Error') {
    if (setPrototypeOf) setPrototypeOf(WrappedError, BaseError);
    else copyConstructorProperties(WrappedError, BaseError, { name: true });
  }

  copyConstructorProperties(WrappedError, OriginalError);

  if (!IS_PURE) try {
    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
    if (OriginalErrorPrototype.name !== ERROR_NAME) {
      createNonEnumerableProperty(OriginalErrorPrototype, 'name', ERROR_NAME);
    }
    OriginalErrorPrototype.constructor = WrappedError;
  } catch (error) { /* empty */ }

  return WrappedError;
};


/***/ }),

/***/ "./node_modules/core-js/modules/es.error.cause.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es.error.cause.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable no-unused-vars -- required for functions `.length` */
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js/internals/function-apply.js");
var wrapErrorConstructorWithCause = __webpack_require__(/*! ../internals/wrap-error-constructor-with-cause */ "./node_modules/core-js/internals/wrap-error-constructor-with-cause.js");

var WEB_ASSEMBLY = 'WebAssembly';
var WebAssembly = global[WEB_ASSEMBLY];

var FORCED = Error('e', { cause: 7 }).cause !== 7;

var exportGlobalErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  var O = {};
  O[ERROR_NAME] = wrapErrorConstructorWithCause(ERROR_NAME, wrapper, FORCED);
  $({ global: true, forced: FORCED }, O);
};

var exportWebAssemblyErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  if (WebAssembly && WebAssembly[ERROR_NAME]) {
    var O = {};
    O[ERROR_NAME] = wrapErrorConstructorWithCause(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED);
    $({ target: WEB_ASSEMBLY, stat: true, forced: FORCED }, O);
  }
};

// https://github.com/tc39/proposal-error-cause
exportGlobalErrorCauseWrapper('Error', function (init) {
  return function Error(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('EvalError', function (init) {
  return function EvalError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('RangeError', function (init) {
  return function RangeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
  return function ReferenceError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
  return function SyntaxError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('TypeError', function (init) {
  return function TypeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('URIError', function (init) {
  return function URIError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
  return function CompileError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
  return function LinkError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
  return function RuntimeError(message) { return apply(init, this, arguments); };
});


/***/ }),

/***/ "./node_modules/core-js/modules/web.dom-exception.stack.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom-exception.stack.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var inheritIfRequired = __webpack_require__(/*! ../internals/inherit-if-required */ "./node_modules/core-js/internals/inherit-if-required.js");
var normalizeStringArgument = __webpack_require__(/*! ../internals/normalize-string-argument */ "./node_modules/core-js/internals/normalize-string-argument.js");
var DOMExceptionConstants = __webpack_require__(/*! ../internals/dom-exception-constants */ "./node_modules/core-js/internals/dom-exception-constants.js");
var clearErrorStack = __webpack_require__(/*! ../internals/clear-error-stack */ "./node_modules/core-js/internals/clear-error-stack.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var DOM_EXCEPTION = 'DOMException';
var Error = getBuiltIn('Error');
var NativeDOMException = getBuiltIn(DOM_EXCEPTION);

var $DOMException = function DOMException() {
  anInstance(this, DOMExceptionPrototype);
  var argumentsLength = arguments.length;
  var message = normalizeStringArgument(argumentsLength < 1 ? undefined : arguments[0]);
  var name = normalizeStringArgument(argumentsLength < 2 ? undefined : arguments[1], 'Error');
  var that = new NativeDOMException(message, name);
  var error = Error(message);
  error.name = DOM_EXCEPTION;
  defineProperty(that, 'stack', createPropertyDescriptor(1, clearErrorStack(error.stack, 1)));
  inheritIfRequired(that, this, $DOMException);
  return that;
};

var DOMExceptionPrototype = $DOMException.prototype = NativeDOMException.prototype;

var ERROR_HAS_STACK = 'stack' in Error(DOM_EXCEPTION);
var DOM_EXCEPTION_HAS_STACK = 'stack' in new NativeDOMException(1, 2);
var FORCED_CONSTRUCTOR = ERROR_HAS_STACK && !DOM_EXCEPTION_HAS_STACK;

// `DOMException` constructor patch for `.stack` where it's required
// https://webidl.spec.whatwg.org/#es-DOMException-specialness
$({ global: true, forced: IS_PURE || FORCED_CONSTRUCTOR }, { // TODO: fix export logic
  DOMException: FORCED_CONSTRUCTOR ? $DOMException : NativeDOMException
});

var PolyfilledDOMException = getBuiltIn(DOM_EXCEPTION);
var PolyfilledDOMExceptionPrototype = PolyfilledDOMException.prototype;

if (PolyfilledDOMExceptionPrototype.constructor !== PolyfilledDOMException) {
  if (!IS_PURE) {
    defineProperty(PolyfilledDOMExceptionPrototype, 'constructor', createPropertyDescriptor(1, PolyfilledDOMException));
  }

  for (var key in DOMExceptionConstants) if (hasOwn(DOMExceptionConstants, key)) {
    var constant = DOMExceptionConstants[key];
    var constantName = constant.s;
    if (!hasOwn(PolyfilledDOMException, constantName)) {
      defineProperty(PolyfilledDOMException, constantName, createPropertyDescriptor(6, constant.c));
    }
  }
}


/***/ }),

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

/***/ })

}]);
//# sourceMappingURL=chunk-vendors.js.map