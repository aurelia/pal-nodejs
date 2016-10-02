export interface IGlobal extends Window {
  Element: typeof Element;
  SVGElement: typeof SVGElement;
  XMLHttpRequest: typeof XMLHttpRequest;
  CustomEvent: typeof CustomEvent;
}
