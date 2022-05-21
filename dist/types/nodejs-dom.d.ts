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
export declare class NodeJsDom implements IDom {
    global: IGlobal;
    constructor(global: IGlobal);
    Element: typeof Element;
    NodeList: typeof NodeList;
    SVGElement: typeof SVGElement | any;
    boundary: string;
    title: string;
    activeElement: Element;
    addEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture: boolean): void;
    removeEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture: boolean): void;
    createElement<T extends keyof HTMLElementTagNameMap>(tagName: T): HTMLElementTagNameMap[T];
    createAttribute(name: string): Attr;
    createTextNode(text: string): Text;
    createComment(text: string): Comment;
    createDocumentFragment(): DocumentFragment;
    createTemplateElement(): HTMLTemplateElement;
    createMutationObserver(callback: (changes: MutationRecord[], instance: MutationObserver) => void): MutationObserver;
    createCustomEvent(eventType: string, options?: Object): CustomEvent;
    dispatchEvent(evt: Event): void;
    getComputedStyle(element: Element): CSSStyleDeclaration;
    getElementById(id: string): Element;
    querySelector<E extends Element = Element>(query: string): E | null;
    querySelectorAll<E extends Element = Element>(query: string): NodeListOf<E>;
    nextElementSibling(element: Element): Element;
    createTemplateFromMarkup(markup: string): HTMLTemplateElement;
    injectStyles(styles: string, destination?: Element, prepend?: boolean): Node;
    adoptNode(node: Node): Node;
    appendNode(newNode: Node, parentNode?: Node): void;
    replaceNode(newNode: Node, node: Node, parentNode?: Node): void;
    removeNode(node: Node, parentNode?: Node): void;
}
