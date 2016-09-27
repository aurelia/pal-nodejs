import {IObserver} from './observer';
import {IDisposable} from './disposable';

export class NodeJsMutationEmulator {
  cycleMutations: MutationRecord[];
  cycleTimerId: NodeJS.Timer;
  targets: { target: Node, last: Node }[];
  observers: IObserver[];
  interval:number;

  constructor(interval?: number) {
    this.interval = (interval === undefined) ? 100 : interval;

    this.targets = [];
    this.cycleMutations = [];
    this.observers = [];
  }

  start() {
    if (this.interval > 0) {
      this.cycleTimerId = setInterval(() => this.cycle(), this.interval);
    }
  }

  stop() {
    clearInterval(this.cycleTimerId);
  }

  registerMutation(mutation: MutationRecord) {
    this.cycleMutations.push(mutation);
  }

  registerObserver(observer: IObserver): IDisposable {
    this.observers.push(observer);

    let target = observer.target;
    let entry = this.targets.find(x => x.target === target);

    if (!entry) {
      entry = {
        target: target,
        last: target.cloneNode(true)
      };
      this.targets.push(entry);
    }

    return () => {
      let index = this.observers.indexOf(observer);
      if (index !== -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  cycle() {
    this._cycleDirtyCheck();
    this._cycleReport();
    this._cycleTidy();
  }

  _cycleTidy() {
    //remove targets no longer having any observer;
  }

  _cycleReport() {
    let mutations = this.cycleMutations;
    this.cycleMutations = [];

    let count = mutations.length;

    this.observers.forEach(observer => {
      let observerMutations: MutationRecord[] = [];

      for (let i = 0; i < count; i++) {
        let mutation = mutations[i];
        if (observer.target === mutation.target) {
          observerMutations.push(mutation);
        }
      }
      if (observerMutations.length > 0) {
        observer.callback(observerMutations);
      }
    });
  }

  _cycleDirtyCheck() {
    let targets = this.targets;
    let targetsCount = targets.length;

    for (let i = 0; i < targetsCount; i++) {
      let target = targets[i];
      let targetNode = target.target;
      let previous = target.last;

      this._cycleDirtyCheckAttributes(targetNode, previous);
      this._cycleDirtyCheckNodeValue(targetNode, previous);
      this._cycleDirtyCheckChildList(targetNode, previous);

      target.last = targetNode.cloneNode(true);
    }
  }

  _cycleDirtyCheckAttributes(target: Node, previous: Node) {
    if (!target.attributes) {
      return;
    }

    let attrNew = target.attributes;
    let attrOld = previous.attributes;
    let countNew = attrNew.length;

    for (let i = 0; i < countNew; i++) {
      let attr = attrNew.item(i);
      let old = this._findAttr(attrOld, attr.name);

      if (!old || old.value !== attr.value) {
        let mutation = {
          target: target,
          type: 'attributes',
          addedNodes: {},
          removedNodes: {},
          previousSibling: null,
          nextSibling: null,
          oldValue: old.value,
          attributeName: attr.name,
          attributeNamespace: attr.namespaceURI
        };
        this.registerMutation(mutation);
      }
    }

    let countOld = attrOld.length;

    for (let i = 0; i < countOld; i++) {
      let old = attrOld.item(i);

      if (!this._findAttr(attrNew, old.name)) {
        let mutation = {
          target: target,
          type: 'attributes',
          addedNodes: {},
          removedNodes: {},
          previousSibling: null,
          nextSibling: null,
          oldValue: old.value,
          attributeName: old.name,
          attributeNamespace: old.namespaceURI
        };

        this.registerMutation(mutation);
      }
    }
  }

  _cycleDirtyCheckNodeValue(target: Node, previous:Node ) {
    if (target.nodeValue !== previous.nodeValue) {
      let mutation = {
        target: target,
        type: 'characterData',
        addedNodes: {},
        removedNodes: {},
        previousSibling: null,
        nextSibling: null,
        oldValue: previous.nodeValue,
        attributeName: null,
        attributeNamespace: null
      };

      this.registerMutation(mutation);
    }
  }

  _cycleDirtyCheckChildList(target: Node, previous:Node ) {
    if (!target.nodeValue) {
      return;
    }
  }

  _findAttr(attrs: NamedNodeMap, name: string): Attr {
    let count = attrs.length;

    for (let i = 0; i < count; i++) {
      let attr = attrs.item(i);
      if (attr.name === name) {
        return attr;
      }
    }
    return null;
  }
}
