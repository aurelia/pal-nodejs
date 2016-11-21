/// <reference path="./jsdom.d.ts" />

import {implementation as TextImpl} from 'jsdom/lib/jsdom/living/nodes/Text-impl';
import {interface as Text} from 'jsdom/lib/jsdom/living/generated/Text';
import * as NODE_TYPE from 'jsdom/lib/jsdom/living/node-type';
import {domSymbolTree} from 'jsdom/lib/jsdom/living/helpers/internal-constants';

export function polyfillWholeText() {
  function wholeText() {
    let wholeText = this.textContent;
    let next;
    let current = this;
    while ((next = domSymbolTree.previousSibling(current)) && next.nodeType === NODE_TYPE.TEXT_NODE) {
      wholeText = next.textContent + wholeText;
      current = next;
    }
    current = this;
    while ((next = domSymbolTree.nextSibling(current)) && next.nodeType === NODE_TYPE.TEXT_NODE) {
      wholeText += next.textContent;
      current = next;
    }
    return wholeText;
  };
  const implementationsToPolyfill = [TextImpl.prototype, Text.prototype];
  implementationsToPolyfill.forEach(implementation => {
    const definedProperties = Object.getOwnPropertyNames(implementation);
    if (definedProperties.indexOf('wholeText') >= 0) return;
    Object.defineProperty(implementation, 'wholeText', {
      get: wholeText,
      enumerable: true,
      configurable: true
    });
  })
}