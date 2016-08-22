import { initializePAL } from 'aurelia-pal';
import { jsdom } from 'jsdom';
import { EventEmitter } from 'events';

let isInitialized = false;

export function initialize() {
  if (isInitialized) {
    return;
  }

  isInitialized = true;

  let _global = jsdom(undefined, {}).defaultView;

  ensurePerformance(_global.window);

  let _platform = new NodeJsPlatform(_global);
  let _dom = new NodeJsDom(_global);
  let _feature = new NodeJsFeature(_global);

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
      let dummy = function () {};
      let properties = 'memory'.split(',');
      let methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' + 'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' + 'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
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

    window.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }
}

export let NodeJsDom = class NodeJsDom {

  constructor(global) {
    this.boundary = 'aurelia-dom-boundary';
    this.title = '';
    this.activeElement = null;

    this.Element = global.Element;
    this.SVGElement = global.SVGElement;
    this.mutationEmulator = new NodeJsMutationEmulator();
  }

  addEventListener(eventName, callback, capture) {
    return this.global.document.addEventListener(eventName, callback, capture);
  }
  removeEventListener(eventName, callback, capture) {
    return this.global.document.removeEventListener(eventName, callback, capture);
  }
  createElement(tagName) {
    return this.global.document.createElement(tagName);
  }
  createTextNode(text) {
    return this.global.document.createTextNode(text);
  }
  createComment(text) {
    return this.global.document.createComment(text);
  }
  createDocumentFragment() {
    return this.global.document.createDocumentFragment();
  }
  createMutationObserver(callback) {
    return this.global.window.MutationObserver || !this.mutationEmulator ? new NodeJsMutationObserver(this.mutationEmulator, callback) : null;
  }
  createCustomEvent(eventType, options) {
    return new this.global.CustomEvent(eventType, options);
  }
  dispatchEvent(evt) {
    this.global.window.dispatchEvent(evt);
  }
  getComputedStyle(element) {
    return this.global.window.getComputedStyle(element);
  }
  getElementById(id) {
    return this.global.document.getElementById(id);
  }
  querySelectorAll(query) {
    return this.global.document.querySelectorAll(query);
  }
  nextElementSibling(element) {
    return element.nextElementSibling;
  }
  createTemplateFromMarkup(markup) {
    let parser = this.global.document.createElement('div');
    parser.innerHTML = markup;

    let temp = parser.firstElementChild;
    if (!temp || temp.nodeName !== 'TEMPLATE') {
      throw new Error('Template markup must be wrapped in a <template> element e.g. <template> <!-- markup here --> </template>');
    }
    return temp;
  }

  injectStyles(styles, destination, prepend) {
    let node = this.global.document.createElement('style');
    node.innerHTML = styles;
    node.type = 'text/css';

    destination = destination || this.global.document.head;

    if (prepend && destination.childNodes.length > 0) {
      destination.insertBefore(node, destination.childNodes[0]);
    } else {
      destination.appendChild(node);
    }
    return node;
  }

  adoptNode(node) {
    return this.global.document.adoptNode(node);
  }

  appendNode(newNode, parentNode) {
    (parentNode || this.global.document.body).appendChild(newNode);
  }

  replaceNode(newNode, node, parentNode) {
    if (node.parentNode) {
      node.parentNode.replaceChild(newNode, node);
    } else {
      parentNode.replaceChild(newNode, node);
    }
  }

  removeNode(node, parentNode) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    } else {
      parentNode.removeChild(node);
    }
  }
};

export let NodeJsFeature = class NodeJsFeature {
  constructor(global) {
    this.shadowDOM = this.global.window.HTMLElement.prototype.attachShadow !== undefined;
    this.scopedCSS = 'scoped' in this.global.document.createElement('style');
    this.htmlTemplateElement = true;
    this.mutationObserver = true;
  }

};

export let NodeJsMutationEmulator = class NodeJsMutationEmulator {

  constructor(interval) {
    this.interval = interval === undefined ? 100 : interval;

    this.targets = [];
    this.cycleMutations = [];
    this.observers = [];
  }

  start() {
    if (this.interval > 0) this.cycleTimerId = setInterval(() => this.cycle(), this.interval);
  }

  stop() {
    clearInterval(this.cycleTimerId);
  }

  registerMutation(mutation) {
    this.cycleMutations.push(mutation);
  }

  registerObserver(observer) {
    this.observers.push(observer);

    var target = observer.target;
    var entry = this.targets.find(x => x.target == target);

    if (!entry) {
      entry = {
        target: target,
        last: target.cloneNode(true)
      };
      this.targets.push(entry);
    }

    return () => {
      var index = this.observers.indexOf(observer);
      if (index != -1) this.observers.splice(index, 1);
    };
  }

  cycle() {
    this._cycleDirtyCheck();
    this._cycleReport();
    this._cycleTidy();
  }

  _cycleTidy() {}

  _cycleReport() {
    let mutations = this.cycleMutations;
    this.cycleMutations = [];

    let count = mutations.length;

    this.observers.forEach(observer => {
      let observerMutations = [];

      for (let i = 0; i < count; i++) {
        let mutation = mutations[i];
        if (observer.target == mutation.target) observerMutations.push(mutation);
      }
      if (observerMutations.length > 0) observer.callback(observerMutations);
    });
  }

  _cycleDirtyCheck() {
    let targets = this.targets;
    let targetsCount = targets.length;

    for (let i = 0; i < targetsCount; i++) {
      let target = targets[i];
      let targetNode = target.target;
      let previous = target.last;

      this._cycleDirtyCheckAttributes(targetNode, previous);
      this._cycleDirtyCheckNodeValue(targetNode, previous);
      this._cycleDirtyCheckChildList(targetNode, previous);

      target.last = targetNode.cloneNode(true);
    }
  }

  _cycleDirtyCheckAttributes(target, previous) {
    if (!target.attributes) return;

    let attrNew = target.attributes;
    let attrOld = previous.attributes;
    let countNew = attrNew.length;

    for (let i = 0; i < countNew; i++) {
      let attr = attrNew.item(i);
      let old = this._findAttr(attrOld, attr.name);

      let mutated = false;

      if (!old || old.value != attr.value) {
        let mutation = {
          target: target,
          type: "attributes",
          addedNodes: {},
          removedNodes: {},
          previousSibling: null,
          nextSibling: null,
          oldValue: old.value,
          attributeName: attr.name,
          attributeNamespace: attr.namespaceURI
        };
        this.registerMutation(mutation);
      }
    }

    let countOld = attrOld.length;

    for (let i = 0; i < countOld; i++) {

      let old = attrOld.item(i);

      if (!this.findAttr(attrNew, old.name)) {
        let mutation = {
          target: target,
          type: "attributes",
          addedNodes: {},
          removedNodes: {},
          previousSibling: null,
          nextSibling: null,
          oldValue: old.value,
          attributeName: old.name,
          attributeNamespace: old.namespaceURI
        };

        this.registerMutation(mutation);
      }
    }
  }

  _cycleDirtyCheckNodeValue(target, previous) {
    if (target.nodeValue != previous.nodeValue) {
      let mutation = {
        target: target,
        type: "characterData",
        addedNodes: {},
        removedNodes: {},
        previousSibling: null,
        nextSibling: null,
        oldValue: previous.nodeValue,
        attributeName: null,
        attributeNamespace: null
      };

      this.registerMutation(mutation);
    }
  }

  _cycleDirtyCheckChildList(target, previous) {
    if (!target.nodeValue) return;
  }

  _findAttr(attrs, name) {
    var count = attrs.length;

    for (let i = 0; i < count; i++) {
      var attr = attrs.item(i);
      if (attr.name == name) return attr;
    }
    return null;
  }
};


export let NodeJsMutationObserver = class NodeJsMutationObserver {

  constructor(source, callback) {}

  disconnect() {
    if (this.disposable) {
      this.disposable();
    }

    this.disposable = null;
  }

  observe(target, options) {
    this.disposable = this.source.registerObserver({
      target: target,
      options: options,
      callback: changes => this.callback(changes, this)
    });
  }

  takeRecords() {
    throw new Error('NotImplementedException');
  }
};

export let NodeJsPlatform = class NodeJsPlatform {

  constructor(global) {
    this.noop = () => {};

    this.performance = this.global.performance;
    this.location = this.global.location;
    this.history = this.global.history;
    this.XMLHttpRequest = this.global.XMLHttpRequest;
  }

  requestAnimationFrame(callback) {
    return this.global.requestAnimationFrame(callback);
  }

  eachModule(callback) {}

  addEventListener(eventName, callback, capture) {
    this.global.addEventListener(eventName, callback, capture);
  }

  removeEventListener(eventName, callback, capture) {
    this.global.removeEventListener(eventName, callback, capture);
  }

};