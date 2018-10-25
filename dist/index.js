"use strict";
/// <reference path="./nodejs-global.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const aurelia_pal_1 = require("aurelia-pal");
const nodejs_pal_builder_1 = require("./nodejs-pal-builder");
const mutation_observer_1 = require("./polyfills/mutation-observer");
var nodejs_pal_builder_2 = require("./nodejs-pal-builder");
exports.ensurePerformance = nodejs_pal_builder_2.ensurePerformance;
/**
* Initializes the PAL with the NodeJS-targeted implementation.
*/
function initialize() {
    if (aurelia_pal_1.isInitialized) {
        return;
    }
    let pal = nodejs_pal_builder_1.buildPal();
    aurelia_pal_1.initializePAL((platform, feature, dom) => {
        Object.assign(platform, pal.platform);
        Object.setPrototypeOf(platform, pal.platform.constructor.prototype);
        Object.assign(dom, pal.dom);
        Object.setPrototypeOf(dom, pal.dom.constructor.prototype);
        Object.assign(feature, pal.feature);
        Object.setPrototypeOf(feature, pal.feature.constructor.prototype);
        (function (global) {
            global.console = global.console || {};
            let con = global.console;
            let prop;
            let method;
            let empty = {};
            let dummy = function () { };
            let properties = 'memory'.split(',');
            let methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
                'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
                'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
            while (prop = properties.pop())
                if (!con[prop])
                    con[prop] = empty;
            while (method = methods.pop())
                if (!con[method])
                    con[method] = dummy;
        })(platform.global);
        if (platform.global.console && typeof console.log === 'object') {
            if (typeof console['debug'] === 'undefined') {
                console['debug'] = this.bind(console['log'], console);
            }
            ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'].forEach(function (method) {
                console[method] = this.bind(console[method], console);
            }, Function.prototype.call);
        }
        Object.defineProperty(dom, 'title', {
            get: function () {
                return pal.global.document.title;
            },
            set: function (value) {
                pal.global.document.title = value;
            }
        });
        Object.defineProperty(dom, 'activeElement', {
            get: function () {
                return pal.global.document.activeElement;
            }
        });
        Object.defineProperty(platform, 'XMLHttpRequest', {
            get: function () {
                return pal.global.XMLHttpRequest;
            }
        });
    });
}
exports.initialize = initialize;
/**
 * @description initializes and makes variables like 'window' into NodeJS globals
 */
function globalize() {
    initialize();
    global.window = global.self = aurelia_pal_1.PLATFORM.global;
    global.document = aurelia_pal_1.PLATFORM.global.document;
    global.Element = aurelia_pal_1.DOM.Element;
    global.NodeList = aurelia_pal_1.PLATFORM.global.NodeList;
    global.SVGElement = aurelia_pal_1.DOM.SVGElement;
    global.HTMLElement = aurelia_pal_1.PLATFORM.global.HTMLElement;
    global.requestAnimationFrame = aurelia_pal_1.PLATFORM.global.requestAnimationFrame;
    global.location = aurelia_pal_1.PLATFORM.location;
    global.history = aurelia_pal_1.PLATFORM.history;
    global.System = {
        import(moduleId) {
            try {
                return Promise.resolve(require(moduleId));
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
    };
    global.PAL = {
        DOM: aurelia_pal_1.DOM, PLATFORM: aurelia_pal_1.PLATFORM, FEATURE: aurelia_pal_1.FEATURE
    };
    return global;
}
exports.globalize = globalize;
function reset(window) {
    if (window) {
        window.close();
    }
    mutation_observer_1.MutationNotifier.getInstance().destruct();
}
exports.reset = reset;

//# sourceMappingURL=index.js.map
