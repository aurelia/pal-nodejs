"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodejs_platform_1 = require("./nodejs-platform");
const nodejs_feature_1 = require("./nodejs-feature");
const nodejs_dom_1 = require("./nodejs-dom");
const jsdom_1 = require("jsdom");
const mutation_observer_1 = require("./polyfills/mutation-observer");
const mutation_observer_2 = require("./polyfills/mutation-observer");
let _patchedjsdom = false;
function buildPal() {
    var jsdom = new jsdom_1.JSDOM(undefined, {});
    var global = jsdom.window;
    if (!_patchedjsdom) {
        patchNotifyChange(global);
        _patchedjsdom = true;
    }
    ensurePerformance(global.window);
    ensureMutationObserver(global.window);
    var platform = new nodejs_platform_1.NodeJsPlatform(global, jsdom);
    var dom = new nodejs_dom_1.NodeJsDom(global);
    var feature = new nodejs_feature_1.NodeJsFeature(global);
    return {
        global: global,
        platform: platform,
        dom: dom,
        feature: feature
    };
}
exports.buildPal = buildPal;
let intersectSetter = function (proto, propertyName, intersect) {
    let old = Object.getOwnPropertyDescriptor(proto, propertyName);
    let oldSet = old.set;
    let newSet = function set(V) {
        oldSet.call(this, V);
        intersect(this);
    };
    Object.defineProperty(proto, propertyName, {
        set: newSet,
        get: old.get,
        configurable: old.configurable,
        enumerable: old.enumerable
    });
};
let intersectMethod = function (proto, methodName, intersect) {
    let orig = proto[methodName];
    proto[methodName] = function (...args) {
        var ret = orig.apply(this, args);
        intersect(this);
        return ret;
    };
};
function patchNotifyChange(window) {
    let notifyInstance = mutation_observer_2.MutationNotifier.getInstance();
    let notify = function (node) { notifyInstance.notifyChanged(node); };
    let node_proto = window._core.Node.prototype;
    intersectMethod(node_proto, "appendChild", notify);
    intersectMethod(node_proto, "insertBefore", notify);
    intersectMethod(node_proto, "removeChild", notify);
    intersectMethod(node_proto, "replaceChild", notify);
    intersectSetter(node_proto, "nodeValue", notify);
    intersectSetter(node_proto, "textContent", notify);
    let element_proto = window._core.Element.prototype;
    intersectMethod(element_proto, "setAttribute", notify);
    intersectMethod(element_proto, "removeAttribute", notify);
    intersectMethod(element_proto, "removeAttributeNode", notify);
    intersectMethod(element_proto, "removeAttributeNS", notify);
}
function ensurePerformance(window) {
    if (window.performance === undefined) {
        window.performance = {};
    }
    if (window.performance.now === undefined) {
        let nowOffset = Date.now();
        //if (performance.timing && performance.timing.navigationStart) {
        //  nowOffset = performance.timing.navigationStart;
        //}
        window.performance.now = function now() {
            return Date.now() - nowOffset;
        };
    }
}
function ensureMutationObserver(window) {
    if (!window.MutationObserver) {
        window.MutationObserver = mutation_observer_1.MutationObserver;
    }
}

//# sourceMappingURL=nodejs-pal-builder.js.map
