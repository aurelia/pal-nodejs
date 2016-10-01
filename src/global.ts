export interface IGlobal extends Window {
  Element?: any;
  SVGElement?: any;
  XMLHttpRequest?: any;
  CustomEvent?: { new (eventType: string, options: Object): CustomEvent };
}
