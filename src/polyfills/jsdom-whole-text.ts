/// <reference path="./jsdom.d.ts" />

import {implementation as TextImpl} from 'jsdom/lib/jsdom/living/nodes/Text-impl';
import * as NODE_TYPE from 'jsdom/lib/jsdom/living/node-type';
import {domSymbolTree} from 'jsdom/lib/jsdom/living/helpers/internal-constants';

export function polyfillWholeText() {
  if (TextImpl.prototype.wholeText) return;
  Object.defineProperty(TextImpl.prototype, 'wholeText', {
    get: function() {
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
    },
    enumerable: true,
    configurable: true
  })
}