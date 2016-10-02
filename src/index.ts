import { initializePAL } from 'aurelia-pal';
import { buildPal } from './nodejs-pal-builder';

let isInitialized = false;

/**
* Initializes the PAL with the NodeJS-targeted implementation.
*/
export function initialize(): void {
  if (isInitialized) {
    return;
  }

  isInitialized = true;

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