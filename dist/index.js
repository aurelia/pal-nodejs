"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = exports.globalize = exports.initialize = exports.ensurePerformance = void 0;
const aurelia_pal_1 = require("aurelia-pal");
const nodejs_pal_builder_1 = require("./nodejs-pal-builder");
var nodejs_pal_builder_2 = require("./nodejs-pal-builder");
Object.defineProperty(exports, "ensurePerformance", { enumerable: true, get: function () { return nodejs_pal_builder_2.ensurePerformance; } });
function initialize() {
    if (aurelia_pal_1.isInitialized) {
        return;
    }
    let pal = (0, nodejs_pal_builder_1.buildPal)();
    (0, aurelia_pal_1.initializePAL)((platform, feature, dom) => {
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
function createBrowserGlobals() {
    Object.getOwnPropertyNames(aurelia_pal_1.PLATFORM.global)
        .filter(prop => typeof global[prop] === 'undefined')
        .forEach(prop => global[prop] = aurelia_pal_1.PLATFORM.global[prop]);
}
function globalize() {
    initialize();
    createBrowserGlobals();
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
}
exports.reset = reset;
