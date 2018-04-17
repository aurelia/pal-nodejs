"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* Represents the core APIs of the DOM.
*/
class NodeJsDom {
    constructor(global) {
        this.global = global;
        this.boundary = 'aurelia-dom-boundary';
        this.title = "";
        this.activeElement = null;
        this.Element = global.Element;
        this.NodeList = global.NodeList;
        this.SVGElement = global.SVGElement || class SVGElement extends global.Element {
        };
    }
    addEventListener(eventName, callback, capture) {
        return this.global.document.addEventListener(eventName, callback, capture);
    }
    removeEventListener(eventName, callback, capture) {
        return this.global.document.removeEventListener(eventName, callback, capture);
    }
    createElement(tagName) {
        return this.global.document.createElement(tagName);
    }
    createAttribute(name) {
        return this.global.document.createAttribute(name);
    }
    createTextNode(text) {
        return this.global.document.createTextNode(text);
    }
    createComment(text) {
        return this.global.document.createComment(text);
    }
    createDocumentFragment() {
        return this.global.document.createDocumentFragment();
    }
    createTemplateElement() {
        return this.global.document.createElement('template');
    }
    createMutationObserver(callback) {
        return new (this.global.window.MutationObserver)(callback);
    }
    createCustomEvent(eventType, options) {
        return new this.global.CustomEvent(eventType, options);
    }
    dispatchEvent(evt) {
        this.global.window.dispatchEvent(evt);
    }
    getComputedStyle(element) {
        return this.global.window.getComputedStyle(element);
    }
    getElementById(id) {
        return this.global.document.getElementById(id);
    }
    querySelector(query) {
        return this.global.document.querySelector(query);
    }
    querySelectorAll(query) {
        return this.global.document.querySelectorAll(query);
    }
    nextElementSibling(element) {
        return element.nextElementSibling;
    }
    createTemplateFromMarkup(markup) {
        let parser = this.global.document.createElement('div');
        parser.innerHTML = markup;
        let temp = parser.firstElementChild;
        if (!temp || temp.nodeName !== 'TEMPLATE') {
            throw new Error('Template markup must be wrapped in a <template> element e.g. <template> <!-- markup here --> </template>');
        }
        return temp;
    }
    injectStyles(styles, destination, prepend) {
        let node = this.global.document.createElement('style');
        node.innerHTML = styles;
        node.type = 'text/css';
        destination = destination || this.global.document.head;
        if (prepend && destination.childNodes.length > 0) {
            destination.insertBefore(node, destination.childNodes[0]);
        }
        else {
            destination.appendChild(node);
        }
        return node;
    }
    adoptNode(node) {
        return this.global.document.adoptNode(node);
    }
    appendNode(newNode, parentNode) {
        (parentNode || this.global.document.body).appendChild(newNode);
    }
    replaceNode(newNode, node, parentNode) {
        if (node.parentNode) {
            node.parentNode.replaceChild(newNode, node);
        }
        else {
            parentNode.replaceChild(newNode, node);
        }
    }
    removeNode(node, parentNode) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        else {
            parentNode.removeChild(node);
        }
    }
}
exports.NodeJsDom = NodeJsDom;

//# sourceMappingURL=nodejs-dom.js.map
