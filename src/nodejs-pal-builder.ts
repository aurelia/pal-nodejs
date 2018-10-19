import { initializePAL } from 'aurelia-pal';
import { IPlatform } from './platform';
import { IGlobal } from './global';
import { IDom } from './dom';
import { IFeature } from './feature';
import { NodeJsPlatform } from './nodejs-platform';
import { NodeJsFeature } from './nodejs-feature';
import { NodeJsDom } from './nodejs-dom';
import { JSDOM } from 'jsdom';
import { MutationObserver } from './polyfills/mutation-observer';
import { MutationNotifier } from './polyfills/mutation-observer';

let _patchedjsdom = false;

export function buildPal(): { global: IGlobal, platform: IPlatform, dom: IDom, feature: IFeature } {
  var jsdom = new JSDOM(undefined, {});
  var global: IGlobal = <IGlobal>jsdom.window;

  if (!_patchedjsdom) {
    patchNotifyChange(global);
    _patchedjsdom = true;
  }

  ensurePerformance(global.window);
  ensureMutationObserver(global.window);

  var platform = new NodeJsPlatform(global, jsdom);
  var dom = new NodeJsDom(global);
  var feature = new NodeJsFeature(global);

  return {
    global: global,
    platform: platform,
    dom: dom,
    feature: feature
  };
}

let intersectSetter = function (proto, propertyName: string, intersect: Function) {
  let old = Object.getOwnPropertyDescriptor(proto, propertyName);
  let oldSet = old.set;
  let newSet = function set(V) {
    oldSet.call(this, V);
    intersect(this);
  };
  Object.defineProperty(proto, propertyName, {
    set: newSet,
    get: old.get,
    configurable: old.configurable,
    enumerable: old.enumerable
  });
};

let intersectMethod = function (proto, methodName: string, intersect: Function) {
  let orig = proto[methodName];
  proto[methodName] = function (...args) {
    var ret = orig.apply(this, args);
    intersect(this);
    return ret;
  };
};

function patchNotifyChange(window: Window) {
  let notifyInstance = MutationNotifier.getInstance();
  let notify = function (node: Node) { notifyInstance.notifyChanged(node); };

  let node_proto = (<any>window)._core.Node.prototype;

  intersectMethod(node_proto, "appendChild", notify);
  intersectMethod(node_proto, "insertBefore", notify);
  intersectMethod(node_proto, "removeChild", notify);
  intersectMethod(node_proto, "replaceChild", notify);
  intersectSetter(node_proto, "nodeValue", notify);
  intersectSetter(node_proto, "textContent", notify);

  let char_proto = (<any>window)._core.CharacterData.prototype;

  intersectSetter(char_proto, "data", notify);

  let element_proto = (<any>window)._core.Element.prototype;

  intersectMethod(element_proto, "setAttribute", notify);
  intersectMethod(element_proto, "removeAttribute", notify);
  intersectMethod(element_proto, "removeAttributeNode", notify);
  intersectMethod(element_proto, "removeAttributeNS", notify);
}


export function ensurePerformance(window) {
  const _entries = [];
  const _marksIndex = {};

  function _filterEntries(key, value) {
    var i = 0, n = _entries.length, result = [];
    for (; i < n; i++) {
      if (_entries[i][key] == value) {
        result.push(_entries[i]);
      }
    }
    return result;
  }

  function _clearEntries(type, name) {
    var i = _entries.length, entry;
    while (i--) {
      entry = _entries[i];
      if (entry.entryType == type && (name === void 0 || entry.name == name)) {
        _entries.splice(i, 1);
      }
    }
  };

  if (window.performance === undefined) {
    window.performance = {};
  }

  if (window.performance.now === undefined) {
    let nowOffset = Date.now();

    window.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }

  if (!window.performance.mark) {
    window.performance.mark = window.performance.webkitMark || function (name) {
      const mark = {
        name,
        entryType: "mark",
        startTime: window.performance.now(),
        duration: 0
      };

      _entries.push(mark);
      _marksIndex[name] = mark;
    };
  }


  if (!window.performance.measure) {
    window.performance.measure = window.performance.webkitMeasure || function (name, startMark, endMark) {
      startMark = _marksIndex[startMark].startTime;
      endMark = _marksIndex[endMark].startTime;

      _entries.push({
        name,
        entryType: "measure",
        startTime: startMark,
        duration: endMark - startMark
      });
    };
  }


  if (!window.performance.getEntriesByType) {
    window.performance.getEntriesByType = window.performance.webkitGetEntriesByType || function (type) {
      return _filterEntries("entryType", type);
    };
  }


  if (!window.performance.getEntriesByName) {
    window.performance.getEntriesByName = window.performance.webkitGetEntriesByName || function (name) {
      return _filterEntries("name", name);
    };
  }


  if (!window.performance.clearMarks) {
    window.performance.clearMarks = window.performance.webkitClearMarks || function (name) {
      _clearEntries("mark", name);
    };
  }


  if (!window.performance.clearMeasures) {
    window.performance.clearMeasures = window.performance.webkitClearMeasures || function (name) {
      _clearEntries("measure", name);
    };
  }
}

function ensureMutationObserver(window) {
  if (!window.MutationObserver) {
    window.MutationObserver = MutationObserver;
  }
}
