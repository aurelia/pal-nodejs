"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NodeJsPlatform {
    constructor(global, jsdom) {
        this.global = global;
        this.jsdom = jsdom;
        /**
        * A function wich does nothing.
        */
        this.noop = () => { };
        this.performance = this.global.performance;
        this.location = this.global.location;
        this.history = this.global.history;
        this.XMLHttpRequest = this.global.XMLHttpRequest;
    }
    /**
    * Registers a function to call when the system is ready to update (repaint) the display.
    * @param callback The function to call.
    * @return A long integer value, the request id, that uniquely identifies the entry in the callback list.
    */
    requestAnimationFrame(callback) {
        return setImmediate(callback);
    }
    /**
    * Iterate all modules loaded by the script loader.
    * @param callback A callback that will receive each module id along with the module object. Return true to end enumeration.
    */
    eachModule(callback) {
        //TODO: What is this? 
    }
    /**
    * Add a global event listener.
    * @param eventName A string representing the event type to listen for.
    * @param callback The function that receives a notification when an event of the specified type occurs.
    * @param capture If true, useCapture indicates that the user wishes to initiate capture.
    */
    addEventListener(eventName, callback, capture) {
        this.global.addEventListener(eventName, callback, capture);
    }
    /**
    * Remove a global event listener.
    * @param eventName A string representing the event type to listen for.
    * @param callback The function to remove from the event.
    * @param capture Specifies whether the listener to be removed was registered as a capturing listener or not.
    */
    removeEventListener(eventName, callback, capture) {
        this.global.removeEventListener(eventName, callback, capture);
    }
}
exports.NodeJsPlatform = NodeJsPlatform;

//# sourceMappingURL=nodejs-platform.js.map
