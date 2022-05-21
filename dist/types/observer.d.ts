export interface IObserver {
    target: Node;
    options?: MutationObserverInit;
    callback: (mutations: MutationRecord[]) => void;
}
