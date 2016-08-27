import {initialize} from '../src/index'
import {jsdom} from 'jsdom';
import {MutationObserver} from '../src/nodejs-mutation-observer';

initialize();

describe("Mutation Observer", () => {
  let observer, dom, document;
  const noop = () => {};

  beforeEach(() => {
    dom = jsdom(undefined, {}).defaultView;
    document = dom.document;
    observer = new MutationObserver(dom, noop).mutationObserver;
  });

  afterEach(() => {
    observer.disconnect();
  });

  it('should be defined', () => {
    expect(observer).toBeDefined();
  });

  it('should not detect no changes', () => {
    const target = document.createElement('div');

    target.setAttribute('attribute', 'attribute');

    observer.observe(target, {
      attributes: true,
      attributeOldValue: true
    });

    let records = observer.takeRecords();

    expect(records.length).toBe(0);

    target.setAttribute('attribute', 'attribute');

    records = observer.takeRecords();

    expect(records.length).toBe(0);
  });

  it('should detect changes for a single element', () => {
    const target = document.createElement('div');

    target.setAttribute('class', 100);

    observer.observe(target, {
      attributes: true,
      attributeOldValue: true
    });

    target.removeAttribute('class');

    const records = observer.takeRecords();

    expect(records.length).toBe(1);
    expect(records[0].oldValue).toBe('100');
  });

  it('should detect changes for a parents elements', () => {
    const target = document.createElement('div');
    const child = document.createElement('div');

    target.setAttribute('id', 'parent');
    child.setAttribute('id', 'child');
    target.appendChild(child);

    observer.observe(target, {
      attributes: true,
      childList: true
    });

    target.removeAttribute('id');

    const records = observer.takeRecords();

    expect(records.length).toBe(1);
    expect(records[0].oldValue).toBe('parent');
  });

  it('should detect removing child nodes', () => {
    const target = document.createElement('div');
    const child = document.createTextNode(`I'm a text node`);

    target.setAttribute('id', 'parent');
    target.appendChild(child);

    observer.observe(target, {
      attributes: true,
      childList: true
    });

    target.removeChild(child);

    const records = observer.takeRecords();

    expect(records.length).toBe(1);
    expect(records[0].removedNodes).toBeDefined();
  });

  it('should detect both parent and child changes', () => {
    const target = document.createElement('div');
    const child = document.createElement('div');

    target.setAttribute('id', 'parent');
    child.setAttribute('id', 'child');

    target.appendChild(child);

    observer.observe(target, {
      attributes: true,
      childList: true,
      attributeOldValue: true
    });

    target.setAttribute('id', 'changedParent');
    child.setAttribute('id', 'changedChild');

    const records = observer.takeRecords();

    expect(records.length).toBe(2);
    expect(records[0].oldValue).toBe('parent');
    expect(records[1].oldValue).toBe('child');
  });

  xit('should detect changes for a single text node', () => {
    const textNode = document.createTextNode(`I'm a text node`);
    console.dir(textNode);

    observer.observe(textNode, {
      attributes: true,
      attributeOldValue: true
    });

    textNode.innerText = 'class';

    const records = observer.takeRecords();

    expect(records.length).toBe(1);
    expect(records[0].oldValue).toBe('100');
  });
});
