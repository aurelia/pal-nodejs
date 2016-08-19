import {NodeJsMutationEmulator} from './nodejs-mutation-emulator';

//https://developer.mozilla.org/en/docs/Web/API/MutationObserver

export class NodeJsMutationObserver implements MutationObserver
{
    disposable:()=>void;

    constructor(
        source:NodeJsMutationEmulator,
        callback:(changes:MutationRecord[], instance:MutationObserver)=>void )
    {
    }

    disconnect(): void {
        if(this.disposable)
        this.disposable();
        this.disposable = null;
    }

    observe(target: Node, options: MutationObserverInit): void
    {
        this.disposable = this.source.registerObserver({
            target:target,
            options:options,
            callback:(changes:MutationRecord[])=>this.callback(changes, this)});
    }

    takeRecords(): MutationRecord[]{
        throw new Error("NotImplementedException");
    }
}
