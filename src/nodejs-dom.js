import {IDom} from './dom';
import {IGlobal} from './global';
import {NodeJsMutationEmulator} from './nodejs-mutation-emulator';
import {NodeJsMutationObserver} from './nodejs-mutation-observer';

/**
* Represents the core APIs of the DOM.
*/
export class NodeJsDom implements IDom {
  mutationEmulator: NodeJsMutationEmulator;

  constructor(global: IGlobal) {
    this.global = global;
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
