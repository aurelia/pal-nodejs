/// <reference types="node" />
export declare class Util {
    static counter: number;
    static expando: string;
    static clone($target: any, config: any): {
        node: any;
        charData: any;
        attr: any;
        kids: any;
    };
    /**
    * indexOf an element in a collection of custom nodes
    *
    * @param {NodeList} set
    * @param {!Object} $node : A custom cloned nodeg333
    * @param {number} idx : index to start the loop
    * @return {number}
    */
    static indexOfCustomNode(set: any, $node: any, idx: any): any;
    /**
    * Attempt to uniquely id an element for hashing. We could optimize this for legacy browsers but it hopefully wont be called enough to be a concern
    *
    * @param {Node} $ele
    * @return {(string|number)}
    */
    static getElementId($ele: any): any;
    /**
    * **map** Apply a mapping function to each item of a set
    * @param {Array|NodeList} set
    * @param {Function} iterator
    */
    static map(set: any, iterator: any): any[];
    /**
    * **Reduce** builds up a single result from a list of values
    * @param {Array|NodeList|NamedNodeMap} set
    * @param {Function} iterator
    * @param {*} [memo] Initial value of the memo.
    */
    static reduce(set: any, iterator: any, memo: any): any;
    /**
    * **indexOf** find index of item in collection.
    * @param {Array|NodeList} set
    * @param {Object} item
    * @param {number} idx
    * @param {string} [prop] Property on set item to compare to item
    */
    static indexOf(set: any, item: any, idx: any, prop?: any): any;
    /**
    * @param {Object} obj
    * @param {(string|number)} prop
    * @return {boolean}
    */
    static has(obj: any, prop: any): boolean;
}
export declare class MutationObserver {
    private _watched;
    private _listener;
    private _period;
    private _timeout;
    private _disposed;
    private _notifyListener;
    constructor(listener: any);
    observe($target: any, config: any): void;
    takeRecords(): any[];
    disconnect(): void;
    private createMutationSearcher($target, config);
    private scheduleMutationCheck(observer);
    private mutationChecker(observer);
    private searchSubtree(mutations, $target, $oldstate, config);
    private findAttributeMutations(mutations, $target, $oldstate, filter);
}
export declare class MutationRecord {
    constructor(data: any);
}
import { EventEmitter } from 'events';
export declare class MutationNotifier extends EventEmitter {
    private static _instance;
    static getInstance(): MutationNotifier;
    constructor();
    destruct(): void;
    notifyChanged(node: Node): void;
}
