import { IDom } from './dom';
import { IGlobal } from './global';
/**
* Represents the core APIs of the DOM.
*/
export declare class NodeJsDom implements IDom {
    global: IGlobal;
    constructor(global: IGlobal);
    Element: typeof Element;
    SVGElement: typeof SVGElement | any;
    boundary: string;
    title: string;
    activeElement: Element;
    addEventListener(eventName: string, callback: EventListener, capture: boolean): void;
    removeEventListener(eventName: string, callback: EventListener, capture: boolean): void;
    createElement(tagName: string): Element;
    createTextNode(text: string): Text;
    createComment(text: string): Comment;
    createDocumentFragment(): DocumentFragment;
    createMutationObserver(callback: (changes: MutationRecord[], instance: MutationObserver) => void): MutationObserver;
    createCustomEvent(eventType: string, options: Object): CustomEvent;
    dispatchEvent(evt: Event): void;
    getComputedStyle(element: Element): CSSStyleDeclaration;
    getElementById(id: string): Element;
    querySelectorAll(query: string): NodeList;
    nextElementSibling(element: Element): Element;
    createTemplateFromMarkup(markup: string): Element;
    injectStyles(styles: string, destination?: Element, prepend?: boolean): Node;
    adoptNode(node: Node): Node;
    appendNode(newNode: Node, parentNode?: Node): void;
    replaceNode(newNode: Node, node: Node, parentNode?: Node): void;
    removeNode(node: Node, parentNode?: Node): void;
}
