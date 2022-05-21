"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeJsPlatform = void 0;
class NodeJsPlatform {
    constructor(global, jsdom) {
        this.global = global;
        this.jsdom = jsdom;
        this.noop = () => { };
        this.performance = this.global.performance;
        this.location = this.global.location;
        this.history = this.global.history;
        this.XMLHttpRequest = this.global.XMLHttpRequest;
    }
    requestAnimationFrame(callback) {
        return setImmediate(() => callback(Date.now()));
    }
    eachModule(callback) {
    }
    addEventListener(eventName, callback, capture) {
        this.global.addEventListener(eventName, callback, capture);
    }
    removeEventListener(eventName, callback, capture) {
        this.global.removeEventListener(eventName, callback, capture);
    }
}
exports.NodeJsPlatform = NodeJsPlatform;
