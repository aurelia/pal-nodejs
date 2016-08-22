var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };



import { initializePAL } from 'aurelia-pal';
import { jsdom } from 'jsdom';
import { EventEmitter } from 'events';

var isInitialized = false;

export function initialize() {
  if (isInitialized) {
    return;
  }

  isInitialized = true;

  var _global = jsdom(undefined, {}).defaultView;

  ensurePerformance(_global.window);

  var _platform = new NodeJsPlatform(_global);
  var _dom = new NodeJsDom(_global);
  var _feature = new NodeJsFeature(_global);

  initializePAL(function (platform, feature, dom) {
    Object.assign(platform, _platform);
    Object.setPrototypeOf(platform, _platform.constructor.prototype);

    Object.assign(dom, _dom);
    Object.setPrototypeOf(dom, _dom.constructor.prototype);

    Object.assign(feature, _feature);
    Object.setPrototypeOf(feature, _feature.constructor.prototype);

    (function (global) {
      global.console = global.console || {};
      var con = global.console;
      var prop = void 0;
      var method = void 0;
      var empty = {};
      var dummy = function dummy() {};
      var properties = 'memory'.split(',');
      var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' + 'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' + 'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
      while (prop = properties.pop()) {
        if (!con[prop]) con[prop] = empty;
      }while (method = methods.pop()) {
        if (!con[method]) con[method] = dummy;
      }
    })(platform.global);

    if (platform.global.console && _typeof(console.log) === 'object') {
      ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'].forEach(function (method) {
        console[method] = this.bind(console[method], console);
      }, Function.prototype.call);
    }

    Object.defineProperty(dom, 'title', {
      get: function get() {
        return _global.document.title;
      },
      set: function set(value) {
        _global.document.title = value;
      }
    });

    Object.defineProperty(dom, 'activeElement', {
      get: function get() {
        return _global.document.activeElement;
      }
    });

    Object.defineProperty(platform, 'XMLHttpRequest', {
      get: function get() {
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
    (function () {
      var nowOffset = Date.now();

      window.performance.now = function now() {
        return Date.now() - nowOffset;
      };
    })();
  }
}

export var NodeJsDom = function () {
  function NodeJsDom(global) {
    

    this.boundary = 'aurelia-dom-boundary';
    this.title = '';
    this.activeElement = null;

    this.Element = global.Element;
    this.SVGElement = global.SVGElement;
    this.mutationEmulator = new NodeJsMutationEmulator();
  }

  NodeJsDom.prototype.addEventListener = function addEventListener(eventName, callback, capture) {
    return this.global.document.addEventListener(eventName, callback, capture);
  };

  NodeJsDom.prototype.removeEventListener = function removeEventListener(eventName, callback, capture) {
    return this.global.document.removeEventListener(eventName, callback, capture);
  };

  NodeJsDom.prototype.createElement = function createElement(tagName) {
    return this.global.document.createElement(tagName);
  };

  NodeJsDom.prototype.createTextNode = function createTextNode(text) {
    return this.global.document.createTextNode(text);
  };

  NodeJsDom.prototype.createComment = function createComment(text) {
    return this.global.document.createComment(text);
  };

  NodeJsDom.prototype.createDocumentFragment = function createDocumentFragment() {
    return this.global.document.createDocumentFragment();
  };

  NodeJsDom.prototype.createMutationObserver = function createMutationObserver(callback) {
    return this.global.window.MutationObserver || !this.mutationEmulator ? new NodeJsMutationObserver(this.mutationEmulator, callback) : null;
  };

  NodeJsDom.prototype.createCustomEvent = function createCustomEvent(eventType, options) {
    return new this.global.CustomEvent(eventType, options);
  };

  NodeJsDom.prototype.dispatchEvent = function dispatchEvent(evt) {
    this.global.window.dispatchEvent(evt);
  };

  NodeJsDom.prototype.getComputedStyle = function getComputedStyle(element) {
    return this.global.window.getComputedStyle(element);
  };

  NodeJsDom.prototype.getElementById = function getElementById(id) {
    return this.global.document.getElementById(id);
  };

  NodeJsDom.prototype.querySelectorAll = function querySelectorAll(query) {
    return this.global.document.querySelectorAll(query);
  };

  NodeJsDom.prototype.nextElementSibling = function nextElementSibling(element) {
    return element.nextElementSibling;
  };

  NodeJsDom.prototype.createTemplateFromMarkup = function createTemplateFromMarkup(markup) {
    var parser = this.global.document.createElement('div');
    parser.innerHTML = markup;

    var temp = parser.firstElementChild;
    if (!temp || temp.nodeName !== 'TEMPLATE') {
      throw new Error('Template markup must be wrapped in a <template> element e.g. <template> <!-- markup here --> </template>');
    }
    return temp;
  };

  NodeJsDom.prototype.injectStyles = function injectStyles(styles, destination, prepend) {
    var node = this.global.document.createElement('style');
    node.innerHTML = styles;
    node.type = 'text/css';

    destination = destination || this.global.document.head;

    if (prepend && destination.childNodes.length > 0) {
      destination.insertBefore(node, destination.childNodes[0]);
    } else {
      destination.appendChild(node);
    }
    return node;
  };

  NodeJsDom.prototype.adoptNode = function adoptNode(node) {
    return this.global.document.adoptNode(node);
  };

  NodeJsDom.prototype.appendNode = function appendNode(newNode, parentNode) {
    (parentNode || this.global.document.body).appendChild(newNode);
  };

  NodeJsDom.prototype.replaceNode = function replaceNode(newNode, node, parentNode) {
    if (node.parentNode) {
      node.parentNode.replaceChild(newNode, node);
    } else {
      parentNode.replaceChild(newNode, node);
    }
  };

  NodeJsDom.prototype.removeNode = function removeNode(node, parentNode) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    } else {
      parentNode.removeChild(node);
    }
  };

  return NodeJsDom;
}();

export var NodeJsFeature = function NodeJsFeature(global) {
  

  this.shadowDOM = this.global.window.HTMLElement.prototype.attachShadow !== undefined;
  this.scopedCSS = 'scoped' in this.global.document.createElement('style');
  this.htmlTemplateElement = true;
  this.mutationObserver = true;
};

export var NodeJsMutationEmulator = function () {
  function NodeJsMutationEmulator(interval) {
    

    this.interval = interval === undefined ? 100 : interval;

    this.targets = [];
    this.cycleMutations = [];
    this.observers = [];
  }

  NodeJsMutationEmulator.prototype.start = function start() {
    var _this = this;

    if (this.interval > 0) this.cycleTimerId = setInterval(function () {
      return _this.cycle();
    }, this.interval);
  };

  NodeJsMutationEmulator.prototype.stop = function stop() {
    clearInterval(this.cycleTimerId);
  };

  NodeJsMutationEmulator.prototype.registerMutation = function registerMutation(mutation) {
    this.cycleMutations.push(mutation);
  };

  NodeJsMutationEmulator.prototype.registerObserver = function registerObserver(observer) {
    var _this2 = this;

    this.observers.push(observer);

    var target = observer.target;
    var entry = this.targets.find(function (x) {
      return x.target == target;
    });

    if (!entry) {
      entry = {
        target: target,
        last: target.cloneNode(true)
      };
      this.targets.push(entry);
    }

    return function () {
      var index = _this2.observers.indexOf(observer);
      if (index != -1) _this2.observers.splice(index, 1);
    };
  };

  NodeJsMutationEmulator.prototype.cycle = function cycle() {
    this._cycleDirtyCheck();
    this._cycleReport();
    this._cycleTidy();
  };

  NodeJsMutationEmulator.prototype._cycleTidy = function _cycleTidy() {};

  NodeJsMutationEmulator.prototype._cycleReport = function _cycleReport() {
    var mutations = this.cycleMutations;
    this.cycleMutations = [];

    var count = mutations.length;

    this.observers.forEach(function (observer) {
      var observerMutations = [];

      for (var i = 0; i < count; i++) {
        var mutation = mutations[i];
        if (observer.target == mutation.target) observerMutations.push(mutation);
      }
      if (observerMutations.length > 0) observer.callback(observerMutations);
    });
  };

  NodeJsMutationEmulator.prototype._cycleDirtyCheck = function _cycleDirtyCheck() {
    var targets = this.targets;
    var targetsCount = targets.length;

    for (var i = 0; i < targetsCount; i++) {
      var _target = targets[i];
      var targetNode = _target.target;
      var previous = _target.last;

      this._cycleDirtyCheckAttributes(targetNode, previous);
      this._cycleDirtyCheckNodeValue(targetNode, previous);
      this._cycleDirtyCheckChildList(targetNode, previous);

      _target.last = targetNode.cloneNode(true);
    }
  };

  NodeJsMutationEmulator.prototype._cycleDirtyCheckAttributes = function _cycleDirtyCheckAttributes(target, previous) {
    if (!target.attributes) return;

    var attrNew = target.attributes;
    var attrOld = previous.attributes;
    var countNew = attrNew.length;

    for (var i = 0; i < countNew; i++) {
      var attr = attrNew.item(i);
      var old = this._findAttr(attrOld, attr.name);

      var mutated = false;

      if (!old || old.value != attr.value) {
        var mutation = {
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

    var countOld = attrOld.length;

    for (var _i = 0; _i < countOld; _i++) {

      var _old = attrOld.item(_i);

      if (!this.findAttr(attrNew, _old.name)) {
        var _mutation = {
          target: target,
          type: "attributes",
          addedNodes: {},
          removedNodes: {},
          previousSibling: null,
          nextSibling: null,
          oldValue: _old.value,
          attributeName: _old.name,
          attributeNamespace: _old.namespaceURI
        };

        this.registerMutation(_mutation);
      }
    }
  };

  NodeJsMutationEmulator.prototype._cycleDirtyCheckNodeValue = function _cycleDirtyCheckNodeValue(target, previous) {
    if (target.nodeValue != previous.nodeValue) {
      var mutation = {
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
  };

  NodeJsMutationEmulator.prototype._cycleDirtyCheckChildList = function _cycleDirtyCheckChildList(target, previous) {
    if (!target.nodeValue) return;
  };

  NodeJsMutationEmulator.prototype._findAttr = function _findAttr(attrs, name) {
    var count = attrs.length;

    for (var i = 0; i < count; i++) {
      var attr = attrs.item(i);
      if (attr.name == name) return attr;
    }
    return null;
  };

  return NodeJsMutationEmulator;
}();


export var NodeJsMutationObserver = function () {
  function NodeJsMutationObserver(source, callback) {
    
  }

  NodeJsMutationObserver.prototype.disconnect = function disconnect() {
    if (this.disposable) {
      this.disposable();
    }

    this.disposable = null;
  };

  NodeJsMutationObserver.prototype.observe = function observe(target, options) {
    var _this3 = this;

    this.disposable = this.source.registerObserver({
      target: target,
      options: options,
      callback: function callback(changes) {
        return _this3.callback(changes, _this3);
      }
    });
  };

  NodeJsMutationObserver.prototype.takeRecords = function takeRecords() {
    throw new Error('NotImplementedException');
  };

  return NodeJsMutationObserver;
}();

export var NodeJsPlatform = function () {
  function NodeJsPlatform(global) {
    

    this.noop = function () {};

    this.performance = this.global.performance;
    this.location = this.global.location;
    this.history = this.global.history;
    this.XMLHttpRequest = this.global.XMLHttpRequest;
  }

  NodeJsPlatform.prototype.requestAnimationFrame = function requestAnimationFrame(callback) {
    return this.global.requestAnimationFrame(callback);
  };

  NodeJsPlatform.prototype.eachModule = function eachModule(callback) {};

  NodeJsPlatform.prototype.addEventListener = function addEventListener(eventName, callback, capture) {
    this.global.addEventListener(eventName, callback, capture);
  };

  NodeJsPlatform.prototype.removeEventListener = function removeEventListener(eventName, callback, capture) {
    this.global.removeEventListener(eventName, callback, capture);
  };

  return NodeJsPlatform;
}();