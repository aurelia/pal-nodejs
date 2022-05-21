"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeJsFeature = void 0;
class NodeJsFeature {
    constructor(global) {
        this.global = global;
        this.shadowDOM = this.global.window.HTMLElement.prototype.attachShadow != undefined;
        this.scopedCSS = 'scoped' in this.global.document.createElement('style');
        this.htmlTemplateElement = true;
        this.mutationObserver = true;
    }
}
exports.NodeJsFeature = NodeJsFeature;
