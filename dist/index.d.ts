/// <reference path="nodejs-global.d.ts" />
export { ensurePerformance } from './nodejs-pal-builder';
/**
* Initializes the PAL with the NodeJS-targeted implementation.
*/
export declare function initialize(): void;
/**
 * @description initializes and makes variables like 'window' into NodeJS globals
 */
export declare function globalize(): NodeJS.Global;
export declare function reset(window?: Window): void;
