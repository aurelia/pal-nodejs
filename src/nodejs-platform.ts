import { IPlatform } from './platform';
import { IPerformance } from './performance';
import { IGlobal } from './global';
import { JSDOM } from 'jsdom';

declare module './global' {
  interface IGlobal {
    performance: any;
    location: any;
    history: any;
    addEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture?: boolean): void;
    removeEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture?: boolean): void;
  }
}

export class NodeJsPlatform implements IPlatform {

  constructor(public global: IGlobal, public jsdom: JSDOM) {
    this.performance = this.global.performance;
    this.location = this.global.location;
    this.history = this.global.history;
    this.XMLHttpRequest = this.global.XMLHttpRequest;
  }

  /**
  * A function wich does nothing.
  */
  noop: Function = () => { };
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
  requestAnimationFrame(callback: (animationFrameStart: number) => void): number {
    return setImmediate(callback) as any;
  }

  /**
  * Iterate all modules loaded by the script loader.
  * @param callback A callback that will receive each module id along with the module object. Return true to end enumeration.
  */
  eachModule(callback: (key: string, value: Object) => boolean): void {
    //TODO: What is this?
  }
  /**
  * Add a global event listener.
  * @param eventName A string representing the event type to listen for.
  * @param callback The function that receives a notification when an event of the specified type occurs.
  * @param capture If true, useCapture indicates that the user wishes to initiate capture.
  */
  addEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture?: boolean): void {
    this.global.addEventListener(eventName, callback, capture);
  }
  /**
  * Remove a global event listener.
  * @param eventName A string representing the event type to listen for.
  * @param callback The function to remove from the event.
  * @param capture Specifies whether the listener to be removed was registered as a capturing listener or not.
  */
  removeEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture?: boolean): void {
    this.global.removeEventListener(eventName, callback, capture);
  }

  /**
  * The runtime's XMLHttpRequest API.
  */
  XMLHttpRequest: typeof XMLHttpRequest;
}
