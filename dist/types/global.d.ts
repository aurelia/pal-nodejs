import { DOMWindow, JSDOM } from 'jsdom';
export interface IGlobal extends DOMWindow {
    MutationObserver: typeof MutationObserver;
    Element: typeof Element;
    NodeList: typeof NodeList;
    jsdom: typeof JSDOM;
    SVGElement: typeof SVGElement;
    XMLHttpRequest: typeof XMLHttpRequest;
    CustomEvent: typeof CustomEvent;
}
