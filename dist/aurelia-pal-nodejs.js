import {initializePAL} from 'aurelia-pal';
import {jsdom} from 'jsdom';
import {EventEmitter} from 'events';

export interface IDisposable {
  ():void
}

/**
* Represents the core APIs of the DOM.
*/
export interface IDom {
  /**
  * The global DOM Element type.
  */
  Element: { new (): Element };

  /**
  * The global DOM SVGElement type.
  */
  SVGElement: { new (): SVGElement };
  /**
  * A key representing a DOM boundary.
  */
  boundary: string;
  /**
  * The document title.
  */
  title: string;
  /**
  * The document's active/focused element.
  */
  activeElement: Element;
  /**
  * Add an event listener to the document.
  * @param eventName A string representing the event type to listen for.
  * @param callback The function that receives a notification when an event of the specified type occurs.
  * @param capture If true, useCapture indicates that the user wishes to initiate capture.
  */
  addEventListener(eventName: string, callback: EventListener, capture: boolean): void;
  /**
  * Remove an event listener from the document.
  * @param eventName A string representing the event type to listen for.
  * @param callback The function to remove from the event.
  * @param capture Specifies whether the listener to be removed was registered as a capturing listener or not.
  */
  removeEventListener(eventName: string, callback: EventListener, capture: boolean): void;
  /**
  * Adopts a node from an external document.
  * @param node The node to be adopted.
  * @return The adopted node able to be used in the document.
  */
  adoptNode(node: Node): Node;
  /**
  * Creates the specified HTML element or an HTMLUnknownElement if the given element name isn't a known one.
  * @param tagName A string that specifies the type of element to be created.
  * @return The created element.
  */
  createElement(tagName: string): Element;
  /**
  * Creates a new Text node.
  * @param text A string to populate the new Text node.
  * @return A Text node.
  */
  createTextNode(text: string): Text;
  /**
  * Creates a new Comment node.
  * @param text A string to populate the new Comment node.
  * @return A Comment node.
  */
  createComment(text: string): Comment;
  /**
  * Creates a new DocumentFragment.
  * @return A DocumentFragment.
  */
  createDocumentFragment(): DocumentFragment;
  /**
  * Creates a new MutationObserver.
  * @param callback A callback that will recieve the change records with the mutations.
  * @return A MutationObservere.
  */
  createMutationObserver(callback:(changes:MutationRecord[], instance:MutationObserver)=>void): MutationObserver;
  /**
  * Creates a new CustomEvent.
  * @param eventType A string representing the event type.
  * @param options An options object specifying bubbles:boolean, cancelable:boolean and/or detail:Object information.
  * @return A CustomEvent.
  */
  createCustomEvent(eventType: string, options: Object): CustomEvent;
  /**
  * Dispatches an event on the document.
  * @param evt The event to dispatch.
  */
  dispatchEvent(evt: Event): void;
  /**
  * Gives the values of all the CSS properties of an element after applying the active stylesheets and resolving any basic computation those values may contain.
  * @param element The Element for which to get the computed style.
  * @return The computed styles.
  */
  getComputedStyle(element: Element): CSSStyleDeclaration;
  /**
  * Locates an element in the document according to its id.
  * @param id The id to search the document for.
  * @return The found element.
  */
  getElementById(id: string): Element;
  /**
  * Performs a query selector on the document and returns all located matches.
  * @param query The query to use in searching the document.
  * @return A list of all matched elements in the document.
  */
  querySelectorAll(query: string): NodeList;
  /**
  * Gets the element that is the next sibling of the provided element.
  * @param element The element whose next sibling is being located.
  * @return The next sibling Element of the provided Element.
  */
  nextElementSibling(element: Node): Element;
  /**
  * Creates an HTMLTemplateElement using the markup provided.
  * @param markup A string containing the markup to turn into a template. Note: This string must contain the template element as well.
  * @return The instance of HTMLTemplateElement that was created from the provided markup.
  */
  createTemplateFromMarkup(markup: string): Element;
  /**
  * Appends a node to the parent, if provided, or the document.body otherwise.
  * @param newNode The node to append.
  * @param parentNode The node to append to, otherwise the document.body.
  */
  appendNode(newNode: Node, parentNode?:Node): void;
  /**
  * Replaces a node in the parent with a new node.
  * @param newNode The node to replace the old node with.
  * @param node The node that is being replaced.
  * @param parentNode The node that the current node is parented to.
  */
  replaceNode(newNode: Node, node: Node, parentNode?: Node): void;
  /**
  * Removes the specified node from the parent node.
  * @param node The node to remove.
  * @param parentNode The parent node from which the node will be removed.
  */
  removeNode(node: Node, parentNode?: Node): void;
  /**
  * Injects styles into the destination element, or the document.head if no destination is provided.
  * @param styles The css text to injext.
  * @param destination The destination element to inject the css text into. If not specified it will default to the document.head.
  * @param prepend Indicates whether or not the styles should be prepended to the destination. By default they are appended.
  * @return The Style node that was created.
  */
  injectStyles(styles: string, destination?: Element, prepend?:boolean): Node;
}

/**
* Enables discovery of what features the runtime environment supports.
*/
export interface IFeature {
  /**
  * Does the runtime environment support ShadowDOM?
  */
  shadowDOM: boolean;
  /**
  * Does the runtime environment support the css scoped attribute?
  */
  scopedCSS: boolean;
  /**
  * Does the runtime environment support native HTMLTemplateElement?
  */
  htmlTemplateElement: boolean;

  /**
  * Does the runtime environment support native DOM mutation observers?
  */
  mutationObserver: boolean;
}

export interface IGlobal extends Window
{
    Element?:any;
    SVGElement?:any;
    XMLHttpRequest?:any;
    CustomEvent?:{new(eventType: string, options: Object ):CustomEvent };
}

let isInitialized = false;
/**
* Initializes the PAL with the Browser-targeted implementation.
*/
export function initialize(): void {
  if (isInitialized) {
    return;
  }

  isInitialized = true;

  let _global: IGlobal = jsdom(undefined, {}).defaultView;

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

    (function(global) {
      global.console = global.console || {};
      let con = global.console;
      let prop;
      let method;
      let empty = {};
      let dummy = function() { };
      let properties = 'memory'.split(',');
      let methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
        'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
        'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
      while (prop = properties.pop()) if (!con[prop]) con[prop] = empty;
      while (method = methods.pop()) if (!con[method]) con[method] = dummy;
    })(platform.global);

    if (platform.global.console && typeof console.log === 'object') {
      ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'].forEach(function(method) {
        console[method] = this.bind(console[method], console);
      }, Function.prototype.call);
    }

    Object.defineProperty(dom, 'title', {
      get: function() {
        return _global.document.title;
      },
      set: function(value) {
        _global.document.title = value;
      }
    });

    Object.defineProperty(dom, 'activeElement', {
      get: function() {
        return _global.document.activeElement;
      }
    });

    Object.defineProperty(platform, 'XMLHttpRequest', {
      get: function() {
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

/**
* Represents the core APIs of the DOM.
*/
export class NodeJsDom implements IDom {
  mutationEmulator: NodeJsMutationEmulator;

  constructor(global: IGlobal) {
    this.Element = global.Element;
    this.SVGElement = global.SVGElement;
    this.mutationEmulator = new NodeJsMutationEmulator();
  }

  Element: { new (): Element };
  SVGElement: { new (): SVGElement };
  boundary: string = 'aurelia-dom-boundary';
  title: string = '';
  activeElement: Element = null;

  addEventListener(eventName: string, callback: EventListener, capture: boolean): void {
    return this.global.document.addEventListener(eventName, callback, capture);
  }
  removeEventListener(eventName: string, callback: EventListener, capture: boolean): void {
    return this.global.document.removeEventListener(eventName, callback, capture);
  }
  createElement(tagName: string): Element {
    return this.global.document.createElement(tagName);
  }
  createTextNode(text: string): Text {
    return this.global.document.createTextNode(text);
  }
  createComment(text: string): Comment {
    return this.global.document.createComment(text);
  }
  createDocumentFragment(): DocumentFragment {
    return this.global.document.createDocumentFragment();
  }
  createMutationObserver(callback: (changes: MutationRecord[], instance: MutationObserver) => void): MutationObserver {
    return (this.global.window).MutationObserver || (!this.mutationEmulator) ? new NodeJsMutationObserver(this.mutationEmulator, callback) : null;
  }
  createCustomEvent(eventType: string, options: Object): CustomEvent {
    return new this.global.CustomEvent(eventType, options);
  }
  dispatchEvent(evt: Event): void {
    this.global.window.dispatchEvent(evt);
  }
  getComputedStyle(element: Element): CSSStyleDeclaration {
    return this.global.window.getComputedStyle(element);
  }
  getElementById(id: string): Element {
    return this.global.document.getElementById(id);
  }
  querySelectorAll(query: string): NodeList {
    return this.global.document.querySelectorAll(query);
  }
  nextElementSibling(element: Element): Element {
    return element.nextElementSibling;
  }
  createTemplateFromMarkup(markup: string): Element {
    let parser = this.global.document.createElement('div');
    parser.innerHTML = markup;

    let temp = parser.firstElementChild;
    if (!temp || temp.nodeName !== 'TEMPLATE') {
      throw new Error('Template markup must be wrapped in a <template> element e.g. <template> <!-- markup here --> </template>');
    }
    return temp;
  }

  injectStyles(styles: string, destination?: Element, prepend?: boolean): Node {
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

  adoptNode(node: Node): Node {
    return this.global.document.adoptNode(node);
  }

  appendNode(newNode: Node, parentNode?: Node): void {
    (parentNode || this.global.document.body).appendChild(newNode);
  }

  replaceNode(newNode: Node, node: Node, parentNode?: Node): void {
    if (node.parentNode) {
      node.parentNode.replaceChild(newNode, node);
    } else {
      parentNode.replaceChild(newNode, node);
    }
  }

  removeNode(node: Node, parentNode?: Node): void {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    } else {
      parentNode.removeChild(node);
    }
  }
}

export class NodeJsFeature implements IFeature {
  constructor(global: IGlobal) {
    this.shadowDOM = (this.global.window).HTMLElement.prototype.attachShadow !== undefined;
    this.scopedCSS = 'scoped' in this.global.document.createElement('style');
    this.htmlTemplateElement = true;
    this.mutationObserver = true; // partial
  }

  shadowDOM: boolean;
  scopedCSS: boolean;
  htmlTemplateElement: boolean;
  mutationObserver: boolean;
}

export class NodeJsMutationEmulator {
  cycleMutations: MutationRecord[];
  cycleTimerId: NodeJS.Timer;
  targets: { target: Node, last: Node }[];
  observers: IObserver[];
  interval:number;

  constructor(interval?: number) {
    this.interval = (interval === undefined) ? 100 : interval;

    this.targets = [];
    this.cycleMutations = [];
    this.observers = [];
  }

  start(){
     if (this.interval > 0)
      this.cycleTimerId = setInterval(() => this.cycle(), this.interval);
  }

  stop(){
    clearInterval(this.cycleTimerId);
  }

  registerMutation(mutation: MutationRecord) {
    this.cycleMutations.push(mutation);
  }

  registerObserver(observer: IObserver): IDisposable {
    this.observers.push(observer);

    var target = observer.target;
    var entry = this.targets.find(x => x.target == target);

    if (!entry) {
      entry = {
        target: target,
        last: target.cloneNode(true),
      }
      this.targets.push(entry);
    }

    return () => {
      var index = this.observers.indexOf(observer);
      if (index != -1)
        this.observers.splice(index, 1);
    }
  }

  cycle() {
    this._cycleDirtyCheck();
    this._cycleReport();
    this._cycleTidy();
  }

  _cycleTidy() {
    //remove targets no longer having any observer;
  }

  _cycleReport() {
    let mutations = this.cycleMutations;
    this.cycleMutations = [];

    let count = mutations.length;

    this.observers.forEach(observer => {
      let observerMutations: MutationRecord[] = [];

      for (let i = 0; i < count; i++) {
        let mutation = mutations[i];
        if (observer.target == mutation.target)
          observerMutations.push(mutation);
      }
      if (observerMutations.length > 0)
        observer.callback(observerMutations);
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

  _cycleDirtyCheckAttributes(target: Node, previous: Node) {
    if(!target.attributes)
        return;

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
          attributeNamespace: attr.namespaceURI,
        }
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
          attributeNamespace: old.namespaceURI,
        }

        this.registerMutation(mutation);
      }
    }
  }

  _cycleDirtyCheckNodeValue(target: Node, previous:Node ) {
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
          attributeNamespace: null,
        }

        this.registerMutation(mutation);
    }
  }

  _cycleDirtyCheckChildList(target: Node, previous:Node ) {
    if(!target.nodeValue)
        return;
  }

  _findAttr(attrs: NamedNodeMap, name: string): Attr {
    var count = attrs.length;

    for (let i = 0; i < count; i++) {
      var attr = attrs.item(i);
      if (attr.name == name)
        return attr;
    }
    return null;
  }
}
//https://developer.mozilla.org/en/docs/Web/API/MutationObserver

export class NodeJsMutationObserver implements MutationObserver {
  disposable: () => void;

  constructor(
    source:NodeJsMutationEmulator,
    callback:(changes:MutationRecord[], instance:MutationObserver) => void ) {
  }

  disconnect(): void {
    if (this.disposable) {
      this.disposable();
    }

    this.disposable = null;
  }

  observe(target: Node, options: MutationObserverInit): void {
    this.disposable = this.source.registerObserver({
      target: target,
      options: options,
      callback: (changes:MutationRecord[]) => this.callback(changes, this)
    });
  }

  takeRecords(): MutationRecord[] {
    throw new Error('NotImplementedException');
  }
}

export class NodeJsPlatform implements IPlatform {

  constructor(global: IGlobal) {
    this.performance = this.global.performance;
    this.location = this.global.location;
    this.history = this.global.history;
    this.XMLHttpRequest = this.global.XMLHttpRequest;
  }

  /**
  * A function wich does nothing.
  */
  noop: Function = ()=>{};
  /**
  * The runtime's location API.
  */
  location: Object;
  /**
  * The runtime's history API.
  */
  history: Object;
  /**
  * The runtime's performance API
  */
  performance: IPerformance;
  /**
  * Registers a function to call when the system is ready to update (repaint) the display.
  * @param callback The function to call.
  * @return A long integer value, the request id, that uniquely identifies the entry in the callback list.
  */
  requestAnimationFrame(callback: (animationFrameStart: number) => void): number {
    return this.global.requestAnimationFrame(callback);
  }

  /**
  * Iterate all modules loaded by the script loader.
  * @param callback A callback that will receive each module id along with the module object. Return true to end enumeration.
  */
  eachModule(callback: (key: string, value: Object) => boolean): void {
    //TODO: What is this?
  }
  /**
  * Add a global event listener.
  * @param eventName A string representing the event type to listen for.
  * @param callback The function that receives a notification when an event of the specified type occurs.
  * @param capture If true, useCapture indicates that the user wishes to initiate capture.
  */
  addEventListener(eventName: string, callback: Function, capture?: boolean): void {
    this.global.addEventListener(eventName, callback, capture);
  }
  /**
  * Remove a global event listener.
  * @param eventName A string representing the event type to listen for.
  * @param callback The function to remove from the event.
  * @param capture Specifies whether the listener to be removed was registered as a capturing listener or not.
  */
  removeEventListener(eventName: string, callback: Function, capture?: boolean): void {
    this.global.removeEventListener(eventName, callback, capture);
  }

  /**
  * The runtime's XMLHttpRequest API.
  */
  XMLHttpRequest: XMLHttpRequest;
}

export interface IObserver {
  target: Node,
  options?: MutationObserverInit,
  callback: (mutations: MutationRecord[]) => void;
}

/**
* The runtime's performance API.
*/
export interface IPerformance {
  /**
  * Gets a DOMHighResTimeStamp.
  * @return The timestamp, measured in milliseconds, accurate to one thousandth of a millisecond.
  */
  now(): number;
}


/**
* Represents the core APIs of the runtime environment.
*/
export interface IPlatform {
  /**
  * The runtime environment's global.
  */
  global: any,
  /**
  * A function wich does nothing.
  */
  noop: Function;
  /**
  * The runtime's location API.
  */
  location: Object;
  /**
  * The runtime's history API.
  */
  history: Object;
  /**
  * The runtime's performance API
  */
  performance: IPerformance;
  /**
  * Registers a function to call when the system is ready to update (repaint) the display.
  * @param callback The function to call.
  * @return A long integer value, the request id, that uniquely identifies the entry in the callback list.
  */
  requestAnimationFrame(callback: (animationFrameStart: number) => void): number;
  /**
  * Iterate all modules loaded by the script loader.
  * @param callback A callback that will receive each module id along with the module object. Return true to end enumeration.
  */
  eachModule(callback: (key: string, value: Object) => boolean): void;
  /**
  * Add a global event listener.
  * @param eventName A string representing the event type to listen for.
  * @param callback The function that receives a notification when an event of the specified type occurs.
  * @param capture If true, useCapture indicates that the user wishes to initiate capture.
  */
  addEventListener(eventName: string, callback: Function, capture?: boolean): void;
  /**
  * Remove a global event listener.
  * @param eventName A string representing the event type to listen for.
  * @param callback The function to remove from the event.
  * @param capture Specifies whether the listener to be removed was registered as a capturing listener or not.
  */
  removeEventListener(eventName: string, callback: Function, capture?: boolean): void;
  /**
  * The runtime's XMLHttpRequest API.
  */
  XMLHttpRequest: XMLHttpRequest;
}
