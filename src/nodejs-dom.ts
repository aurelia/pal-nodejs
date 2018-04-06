import { IDom } from './dom';
import { IGlobal } from './global';

declare module './global' {
  interface IGlobal {
    window: any;
    document: any;
  }
}

/**
* Represents the core APIs of the DOM.
*/
export class NodeJsDom implements IDom {

  constructor(public global: IGlobal) {
    this.Element = global.Element;
    this.NodeList = global.NodeList;
    this.SVGElement = global.SVGElement || class SVGElement extends global.Element { };
  }

  Element: typeof Element;
  NodeList: typeof NodeList;
  SVGElement: typeof SVGElement /* until a proper implementation is ready: */ | any;
  boundary: string = 'aurelia-dom-boundary';
  title: string = "";
  activeElement: Element = null;

  addEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture: boolean): void {
    return this.global.document.addEventListener(eventName, callback, capture);
  }
  removeEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture: boolean): void {
    return this.global.document.removeEventListener(eventName, callback, capture);
  }
  createElement<T extends keyof HTMLElementTagNameMap>(tagName: T): HTMLElementTagNameMap[T];
  createElement(tagName: string): Element {
    return this.global.document.createElement(tagName);
  }
  createAttribute(name: string): Attr {
    return this.global.document.createAttribute(name);
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
  createTemplateElement(): HTMLTemplateElement {
    return this.global.document.createElement('template');
  }
  createMutationObserver(callback: (changes: MutationRecord[], instance: MutationObserver) => void): MutationObserver {
    return new ((<any>this.global.window).MutationObserver)(callback);
  }
  createCustomEvent(eventType: string, options?: Object): CustomEvent {
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
  querySelector<E extends Element = Element>(query: string): E | null {
    return this.global.document.querySelector(query);
  }
  querySelectorAll<E extends Element = Element>(query: string): NodeListOf<E> {
    return this.global.document.querySelectorAll(query);
  }
  nextElementSibling(element: Element): Element {
    return element.nextElementSibling;
  }
  createTemplateFromMarkup(markup: string): HTMLTemplateElement {
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
    }
    else {
      parentNode.removeChild(node);
    }
  }
}
