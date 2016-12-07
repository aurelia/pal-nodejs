/// <reference path="./jsdom.d.ts" />
"use strict";
const Text_impl_1 = require("jsdom/lib/jsdom/living/nodes/Text-impl");
const Text_1 = require("jsdom/lib/jsdom/living/generated/Text");
const NODE_TYPE = require("jsdom/lib/jsdom/living/node-type");
const internal_constants_1 = require("jsdom/lib/jsdom/living/helpers/internal-constants");
function polyfillWholeText() {
    function wholeText() {
        let wholeText = this.textContent;
        let next;
        let current = this;
        while ((next = internal_constants_1.domSymbolTree.previousSibling(current)) && next.nodeType === NODE_TYPE.TEXT_NODE) {
            wholeText = next.textContent + wholeText;
            current = next;
        }
        current = this;
        while ((next = internal_constants_1.domSymbolTree.nextSibling(current)) && next.nodeType === NODE_TYPE.TEXT_NODE) {
            wholeText += next.textContent;
            current = next;
        }
        return wholeText;
    }
    ;
    const implementationsToPolyfill = [Text_impl_1.implementation.prototype, Text_1.interface.prototype];
    implementationsToPolyfill.forEach(implementation => {
        if (implementation.hasOwnProperty('wholeText'))
            return;
        Object.defineProperty(implementation, 'wholeText', {
            get: wholeText,
            enumerable: true,
            configurable: true
        });
    });
}
exports.polyfillWholeText = polyfillWholeText;

//# sourceMappingURL=jsdom-whole-text.js.map
