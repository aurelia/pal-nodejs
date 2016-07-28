import {initializePAL} from 'aurelia-pal';
import {IPlatform} from './platform';
import {IGlobal} from './global';
import {NodeJsMutationObserver} from './nodejs-mutation-observer';
import {NodeJsPlatform} from './nodejs-platform';
import {NodeJsFeature} from './nodejs-feature';
import {NodeJsDom} from './nodejs-dom';
import {jsdom} from 'jsdom';

let isInitialized = false;
/**
* Initializes the PAL with the Browser-targeted implementation.
*/
export function initialize(): void {
  if (isInitialized) {
    return;
  }

  isInitialized = true;

  var _global: IGlobal = jsdom(undefined, {}).defaultView;

  ensurePerformance(_global.window);

  var _platform = new NodeJsPlatform(_global);
  var _dom = new NodeJsDom(_global);
  var _feature = new NodeJsFeature(_global);

  initializePAL((platform, feature, dom) => {
    Object.assign(platform, _platform);
    Object.setPrototypeOf(platform, _platform.constructor.prototype);

    Object.assign(dom, _dom);
    Object.setPrototypeOf(dom, _dom.constructor.prototype);

    Object.assign(feature, _feature);
    Object.setPrototypeOf(feature, _feature.constructor.prototype);

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
        return _global.document.title;
      },
      set: function (value) {
        _global.document.title = value;
      }
    });

    Object.defineProperty(dom, 'activeElement', {
      get: function () {
        return _global.document.activeElement;
      }
    });

    Object.defineProperty(platform, 'XMLHttpRequest', {
      get: function () {
        return _global.XMLHttpRequest;
      }
    });
  });
}

function ensurePerformance(window) {

  if (window.performance === undefined) {
    window.performance = {};
  }
  
  if (window.performance.now === undefined) {
    let nowOffset = Date.now();

    //if (performance.timing && performance.timing.navigationStart) {
    //  nowOffset = performance.timing.navigationStart;
    //}

    window.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }
}