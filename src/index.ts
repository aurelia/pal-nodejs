/// <reference path="./nodejs-global.ts" />

import { initializePAL, DOM, PLATFORM, FEATURE, isInitialized } from 'aurelia-pal';
import { buildPal } from './nodejs-pal-builder';
export { ensurePerformance } from './nodejs-pal-builder';

/**
* Initializes the PAL with the NodeJS-targeted implementation.
*/
export function initialize(): void {
  if (isInitialized) {
    return;
  }

  let pal = buildPal();

  initializePAL((platform, feature, dom) => {
    Object.assign(platform, pal.platform);
    Object.setPrototypeOf(platform, pal.platform.constructor.prototype);

    Object.assign(dom, pal.dom);
    Object.setPrototypeOf(dom, pal.dom.constructor.prototype);

    Object.assign(feature, pal.feature);
    Object.setPrototypeOf(feature, pal.feature.constructor.prototype);

    (function (global) {
      global.console = global.console || {};
      let con = global.console;
      let prop;
      let method;
      let empty = {};
      let dummy = function () { };
      let properties = 'memory'.split(',');
      let methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
        'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
        'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
      while (prop = properties.pop()) if (!con[prop]) con[prop] = empty;
      while (method = methods.pop()) if (!con[method]) con[method] = dummy;
    })(platform.global);

    if (platform.global.console && typeof console.log === 'object') {
      if (typeof console['debug'] === 'undefined') {
        console['debug'] = this.bind(console['log'], console);
      }
      ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'].forEach(function (method) {
        console[method] = this.bind(console[method], console);
      }, Function.prototype.call);
    }

    Object.defineProperty(dom, 'title', {
      get: function () {
        return pal.global.document.title;
      },
      set: function (value) {
        pal.global.document.title = value;
      }
    });

    Object.defineProperty(dom, 'activeElement', {
      get: function () {
        return pal.global.document.activeElement;
      }
    });

    Object.defineProperty(platform, 'XMLHttpRequest', {
      get: function () {
        return pal.global.XMLHttpRequest;
      }
    });
  });
}

// snippet copied from https://github.com/lukechilds/browser-env
function createBrowserGlobals() {
  Object.getOwnPropertyNames(PLATFORM.global)
    // avoid conflict with nodejs globals
    .filter(prop => typeof global[prop] === 'undefined')
    .forEach(prop => global[prop] = PLATFORM.global[prop]);
}

/**
 * @description initializes and makes variables like 'window' into NodeJS globals
 */
export function globalize() {
  initialize();
  createBrowserGlobals();
  global.System = {
    import(moduleId: string) {
      try {
        return Promise.resolve(require(moduleId));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
  global.PAL = {
    DOM, PLATFORM, FEATURE
  };
  return global;
}

export function reset(window?: Window) {
  if (window) {
    window.close();
  }
}
