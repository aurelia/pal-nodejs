import { IPerformance } from './performance';
/**
* Represents the core APIs of the runtime environment.
*/
export interface IPlatform {
    /**
    * The runtime environment's global.
    */
    global: any;
    /**
    * A function wich does nothing.
    */
    noop: Function;
    /**
    * The runtime's location API.
    */
    location: Object;
    /**
    * The runtime's history API.
    */
    history: Object;
    /**
    * The runtime's performance API
    */
    performance: IPerformance;
    /**
    * Registers a function to call when the system is ready to update (repaint) the display.
    * @param callback The function to call.
    * @return A long integer value, the request id, that uniquely identifies the entry in the callback list.
    */
    requestAnimationFrame(callback: (animationFrameStart: number) => void): number;
    /**
    * Iterate all modules loaded by the script loader.
    * @param callback A callback that will receive each module id along with the module object. Return true to end enumeration.
    */
    eachModule(callback: (key: string, value: Object) => boolean): void;
    /**
    * Add a global event listener.
    * @param eventName A string representing the event type to listen for.
    * @param callback The function that receives a notification when an event of the specified type occurs.
    * @param capture If true, useCapture indicates that the user wishes to initiate capture.
    */
    addEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture?: boolean): void;
    /**
    * Remove a global event listener.
    * @param eventName A string representing the event type to listen for.
    * @param callback The function to remove from the event.
    * @param capture Specifies whether the listener to be removed was registered as a capturing listener or not.
    */
    removeEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture?: boolean): void;
    /**
    * The runtime's XMLHttpRequest API.
    */
    XMLHttpRequest: typeof XMLHttpRequest;
}
