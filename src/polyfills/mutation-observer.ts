import { jsdom } from 'jsdom';

export function polyfill(window) {
  if (!window.MutationObserver) {
    window.MutationObserver = MutationObserver;
  }
}

let dom = jsdom(undefined, {}).defaultView;
let document = dom.document;
let counter = 1;
let expando = 'mo_id';

let elmt = <any>document.createElement('i');
elmt.style.top = "0";
let hasAttributeBug = elmt.attributes.style.value !== 'null';
document = null;
dom = null;

// GCC hack see http:// stackoverflow.com/a/23202438/1517919
const JSCompiler_renameProperty = a => a;

const getAttributeWithStyleHack = (el, attr) => {
  // As with getAttributeSimple there is a potential warning for custom attribtues in IE7.
  return attr.name !== 'style' ? attr.value : el.style.cssText;
};

const getAttributeSimple = (el, attr) => attr.value;

const getAttributeValue = hasAttributeBug ? getAttributeSimple : getAttributeWithStyleHack;

export class Util {
  static clone($target, config) {
    let recurse = true; // set true so childList we'll always check the first level
    return (function copy($target) {
      let elestruct = {
        /** @type {Node} */
        node: $target,
        charData: null,
        attr: null,
        kids: null,
      };

      // Store current character data of target text or comment node if the config requests
      // those properties to be observed.
      if (config.charData && ($target.nodeType === 3 || $target.nodeType === 8)) {
        elestruct.charData = $target.nodeValue;
      } else {
        // Add attr only if subtree is specified or top level and avoid if
        // attributes is a document object (#13).
        if (config.attr && recurse && $target.nodeType === 1) {
          /**
          * clone live attribute list to an object structure {name: val}
          * @type {Object.<string, string>}
          */
          elestruct.attr = Util.reduce($target.attributes, (memo, attr) => {
            if (!config.afilter || config.afilter[attr.name]) {
              memo[attr.name] = getAttributeValue($target, attr);
            }
            return memo;
          }, {});
        }

        // whether we should iterate the children of $target node
        if (recurse && ((config.kids || config.charData) || (config.attr && config.descendents))) {
          /** @type {Array.<!Object>} : Array of custom clone */
          elestruct.kids = Util.map($target.childNodes, copy);
        }

        recurse = config.descendents;
      }
      return elestruct;
    })($target);
  }

  /**
  * indexOf an element in a collection of custom nodes
  *
  * @param {NodeList} set
  * @param {!Object} $node : A custom cloned nodeg333
  * @param {number} idx : index to start the loop
  * @return {number}
  */
  static indexOfCustomNode(set, $node, idx) {
    return this.indexOf(set, $node, idx, JSCompiler_renameProperty('node'));
  }

  /**
  * Attempt to uniquely id an element for hashing. We could optimize this for legacy browsers but it hopefully wont be called enough to be a concern
  *
  * @param {Node} $ele
  * @return {(string|number)}
  */
  static getElementId($ele) {
    try {
      return $ele.id || ($ele[expando] = $ele[expando] || counter++);
    } catch (e) { // ie <8 will throw if you set an unknown property on a text node
      try {
        return $ele.nodeValue; // naive
      } catch (shitie) { // when text node is removed: https://gist.github.com/megawac/8355978 :(
        return counter++;
      }
    }
  }

  /**
  * **map** Apply a mapping function to each item of a set
  * @param {Array|NodeList} set
  * @param {Function} iterator
  */
  static map(set, iterator) {
    let results = [];
    for (let index = 0; index < set.length; index++) {
      results[index] = iterator(set[index], index, set);
    }
    return results;
  }

  /**
  * **Reduce** builds up a single result from a list of values
  * @param {Array|NodeList|NamedNodeMap} set
  * @param {Function} iterator
  * @param {*} [memo] Initial value of the memo.
  */
  static reduce(set, iterator, memo) {
    for (let index = 0; index < set.length; index++) {
      memo = iterator(memo, set[index], index, set);
    }
    return memo;
  }

  /**
  * **indexOf** find index of item in collection.
  * @param {Array|NodeList} set
  * @param {Object} item
  * @param {number} idx
  * @param {string} [prop] Property on set item to compare to item
  */
  static indexOf(set, item, idx, prop?) {
    for (/*idx = ~~idx*/; idx < set.length; idx++) {// start idx is always given as this is internal
      if ((prop ? set[idx][prop] : set[idx]) === item) return idx;
    }
    return -1;
  }

  /**
  * @param {Object} obj
  * @param {(string|number)} prop
  * @return {boolean}
  */
  static has(obj, prop) {
    return obj[prop] !== undefined; // will be nicely inlined by gcc
  }
}

export class MutationObserver {
  private _watched = [];
  private _listener = null;
  private _period = 30;
  private _timeout = null;
  private _disposed = false;

  constructor(listener) {
    this._watched = [];
    this._listener = listener;
    this._period = 30;
  }

  observe($target, config) {
    let settings = {
      attr: !!(config.attributes || config.attributeFilter || config.attributeOldValue),

      // some browsers enforce that subtree must be set with childList, attributes or characterData.
      // We don't care as spec doesn't specify this rule.
      kids: !!config.childList,
      descendents: !!config.subtree,
      charData: !!(config.characterData || config.characterDataOldValue),

      afilter: null
    };

    let watched = this._watched;

    // remove already observed target element from pool
    for (let i = 0; i < watched.length; i++) {
      if (watched[i].tar === $target) watched.splice(i, 1);
    }

    if (config.attributeFilter) {
      /**
      * converts to a {key: true} dict for faster lookup
      * @type {Object.<String,Boolean>}
      */
      settings.afilter = Util.reduce(config.attributeFilter, (a, b) => {
        a[b] = true;
        return a;
      }, {});
    }

    watched.push({
      tar: $target,
      fn: this._createMutationSearcher($target, settings)
    });

    // reconnect if not connected
    if (!this._timeout) {
      this._startMutationChecker(this);
    }
  }

  takeRecords() {
    let mutations = [];
    let watched = this._watched;

    for (let i = 0; i < watched.length; i++) {
      watched[i].fn(mutations);
    }

    return mutations;
  }

  disconnect() {
    this._watched = []; // clear the stuff being observed
    this._disposed = true;
    clearTimeout(this._timeout); // ready for garbage collection
    this._timeout = null;
  }

  _createMutationSearcher($target, config) {
    /** type {Elestuct} */
    let $oldstate = Util.clone($target, config); // create the cloned datastructure

    /**
    * consumes array of mutations we can push to
    *
    * @param {Array.<MutationRecord>} mutations
    */
    return (mutations) => {
      let olen = mutations.length;
      let dirty;

      // Alright we check base level changes in attributes... easy
      if (config.attr && $oldstate.attr) {
        this._findAttributeMutations(mutations, $target, $oldstate.attr, config.afilter);
      }

      // check childlist or subtree for mutations
      if (config.kids || config.descendents) {
        dirty = this._searchSubtree(mutations, $target, $oldstate, config);
      }

      // reclone data structure if theres changes
      if (dirty || mutations.length !== olen) {
        /** type {Elestuct} */
        $oldstate = Util.clone($target, config);
      }
    };
  }

  _startMutationChecker(observer) {
    const check = () => {
      let mutations = observer.takeRecords();

      if (mutations.length) { // fire away
        // calling the listener with context is not spec but currently consistent with FF and WebKit
        observer._listener(mutations, observer);
      }
      /** @private */
      if (observer._disposed == false)
        observer._timeout = setTimeout(check, this._period);
    };
    check();
  }

  _searchSubtree(mutations, $target, $oldstate, config) {
    // Track if the tree is dirty and has to be recomputed (#14).
    let dirty;
    /*
    * Helper to identify node rearrangment and stuff...
    * There is no gaurentee that the same node will be identified for both added and removed nodes
    * if the positions have been shuffled.
    * conflicts array will be emptied by end of operation
    */
    const _resolveConflicts = (conflicts, node, $kids, $oldkids, numAddedNodes) => {
      // the distance between the first conflicting node and the last
      let distance = conflicts.length - 1;
      // prevents same conflict being resolved twice consider when two nodes switch places.
      // only one should be given a mutation event (note -~ is used as a math.ceil shorthand)
      let counter = -~((distance - numAddedNodes) / 2);
      let $cur;
      let oldstruct;
      let conflict;
      while ((conflict = conflicts.pop())) {
        $cur = $kids[conflict.i];
        oldstruct = $oldkids[conflict.j];

        // attempt to determine if there was node rearrangement... won't gaurentee all matches
        // also handles case where added/removed nodes cause nodes to be identified as conflicts
        if (config.kids && counter && Math.abs(conflict.i - conflict.j) >= distance) {
          mutations.push(new MutationRecord({
            type: 'childList',
            target: node,
            addedNodes: [$cur],
            removedNodes: [$cur],
            // haha don't rely on this please
            nextSibling: $cur.nextSibling,
            previousSibling: $cur.previousSibling
          }));
          counter--; // found conflict
        }

        // Alright we found the resorted nodes now check for other types of mutations
        if (config.attr && oldstruct.attr) this._findAttributeMutations(mutations, $cur, oldstruct.attr, config.afilter);
        if (config.charData && $cur.nodeType === 3 && $cur.nodeValue !== oldstruct.charData) {
          mutations.push(new MutationRecord({
            type: 'characterData',
            target: $cur
          }));
        }
        // now look @ subtree
        if (config.descendents) _findMutations($cur, oldstruct);
      }
    };

    /**
    * Main worker. Finds and adds mutations if there are any
    * @param {Node} node
    * @param {!Object} old : A cloned data structure using internal clone
    */
    const _findMutations = (node, old) => {
      let $kids = node.childNodes;
      let $oldkids = old.kids;
      let klen = $kids.length;
      // $oldkids will be undefined for text and comment nodes
      let olen = $oldkids ? $oldkids.length : 0;
      // if (!olen && !klen) return; // both empty; clearly no changes

      // we delay the intialization of these for marginal performance in the expected case (actually quite signficant on large subtrees when these would be otherwise unused)
      // map of checked element of ids to prevent registering the same conflict twice
      let map;
      // array of potential conflicts (ie nodes that may have been re arranged)
      let conflicts;
      let id; // element id from getElementId helper
      let idx; // index of a moved or inserted element

      let oldstruct;
      // current and old nodes
      let $cur;
      let $old;
      // track the number of added nodes so we can resolve conflicts more accurately
      let numAddedNodes = 0;

      // iterate over both old and current child nodes at the same time
      let i = 0;
      let j = 0;
      // while there is still anything left in $kids or $oldkids (same as i < $kids.length || j < $oldkids.length;)
      while (i < klen || j < olen) {
        // current and old nodes at the indexs
        $cur = $kids[i];
        oldstruct = $oldkids[j];
        $old = oldstruct && oldstruct.node;

        if ($cur === $old) { // expected case - optimized for this case
          // check attributes as specified by config
          if (config.attr && oldstruct.attr) {/* oldstruct.attr instead of textnode check */
            this._findAttributeMutations(mutations, $cur, oldstruct.attr, config.afilter);
          }
          // check character data if node is a comment or textNode and it's being observed
          if (config.charData && oldstruct.charData !== undefined && $cur.nodeValue !== oldstruct.charData) {
            mutations.push(new MutationRecord({
              type: 'characterData',
              target: $cur
            }));
          }

          // resolve conflicts; it will be undefined if there are no conflicts - otherwise an array
          if (conflicts) _resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes);

          // recurse on next level of children. Avoids the recursive call when there are no children left to iterate
          if (config.descendents && ($cur.childNodes.length || oldstruct.kids && oldstruct.kids.length)) _findMutations($cur, oldstruct);

          i++;
          j++;
        } else { // (uncommon case) lookahead until they are the same again or the end of children
          dirty = true;
          if (!map) { // delayed initalization (big perf benefit)
            map = {};
            conflicts = [];
          }
          if ($cur) {
            // check id is in the location map otherwise do a indexOf search
            if (!(map[id = Util.getElementId($cur)])) { // to prevent double checking
              // mark id as found
              map[id] = true;
              // custom indexOf using comparitor checking oldkids[i].node === $cur
              if ((idx = Util.indexOfCustomNode($oldkids, $cur, j)) === -1) {
                if (config.kids) {
                  mutations.push(new MutationRecord({
                    type: 'childList',
                    target: node,
                    addedNodes: [$cur], // $cur is a new node
                    nextSibling: $cur.nextSibling,
                    previousSibling: $cur.previousSibling
                  }));
                  numAddedNodes++;
                }
              } else {
                conflicts.push({ // add conflict
                  i: i,
                  j: idx
                });
              }
            }
            i++;
          }

          if ($old &&
            // special case: the changes may have been resolved: i and j appear congurent so we can continue using the expected case
            $old !== $kids[i]
          ) {
            if (!(map[id = Util.getElementId($old)])) {
              map[id] = true;
              if ((idx = Util.indexOf($kids, $old, i)) === -1) {
                if (config.kids) {
                  mutations.push(new MutationRecord({
                    type: 'childList',
                    target: old.node,
                    removedNodes: [$old],
                    nextSibling: $oldkids[j + 1], // praise no indexoutofbounds exception
                    previousSibling: $oldkids[j - 1]
                  }));
                  numAddedNodes--;
                }
              } else {
                conflicts.push({
                  i: idx,
                  j: j
                });
              }
            }
            j++;
          }
        }// end uncommon case
      }// end loop

      // resolve any remaining conflicts
      if (conflicts) _resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes);
    };
    _findMutations($target, $oldstate);
    return dirty;
  }

  _findAttributeMutations(mutations, $target, $oldstate, filter) {
    let checked = {};
    let attributes = $target.attributes;
    let attr;
    let name;
    let i = attributes.length;
    while (i--) {
      attr = attributes[i];
      name = attr.name;
      if (!filter || Util.has(filter, name)) {
        if (getAttributeValue($target, attr) !== $oldstate[name]) {
          // The pushing is redundant but gzips very nicely
          mutations.push(new MutationRecord({
            type: 'attributes',
            target: $target,
            attributeName: name,
            oldValue: $oldstate[name],
            attributeNamespace: attr.namespaceURI // in ie<8 it incorrectly will return undefined
          }));
        }
        checked[name] = true;
      }
    }
    for (name in $oldstate) {
      if (!(checked[name])) {
        mutations.push(new MutationRecord({
          target: $target,
          type: 'attributes',
          attributeName: name,
          oldValue: $oldstate[name]
        }));
      }
    }
  }
}

export class MutationRecord {
  constructor(data) {
    let settings = { // technically these should be on proto so hasOwnProperty will return false for non explicitly props
      type: null,
      target: null,
      addedNodes: [],
      removedNodes: [],
      previousSibling: null,
      nextSibling: null,
      attributeName: null,
      attributeNamespace: null,
      oldValue: null
    };
    for (let prop in data) {
      if (Util.has(settings, prop) && data[prop] !== undefined) settings[prop] = data[prop];
    }
    return settings;
  }
}
