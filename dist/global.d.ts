export interface IGlobal extends Window {
    MutationObserver: typeof MutationObserver;
    Element: typeof Element;
    SVGElement: typeof SVGElement;
    XMLHttpRequest: typeof XMLHttpRequest;
    CustomEvent: typeof CustomEvent;
}
