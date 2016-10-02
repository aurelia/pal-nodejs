import { buildPal } from '../src/nodejs-pal-builder';

describe("MutationObserver", () => {
  let pal, observer, dom, document;
  const noop = () => { };

  beforeEach(() => {
    pal = buildPal();
    dom = pal.dom;
    document = pal.global.window.document;
    observer = dom.createMutationObserver(noop);
  });

  afterEach(() => {
    observer.disconnect();
  });

  it('should be defined', () => {
    expect(observer).toBeDefined();
  });

  it("attribute changes trigger mutation event", function (done) {
    var pal = buildPal();
    var dom = pal.dom;
    var document = pal.global.window.document;
    var div = document.createElement('div');

    div.setAttribute('a', 'A');

    var observer = dom.createMutationObserver((changes) => {
      try {
        expect(changes.length).toBe(1);
        expect(changes[0].attributeName).toBe("a");
        expect(changes[0].oldValue).toBe("A");
      }
      catch (err) {
        fail();
      }
      finally {
        observer.disconnect();
        done();
      }
    });

    observer.observe(div, {
      attributes: true

    });

    div.setAttribute('a', 'B');
  });

  it("text changes trigger mutation event", function (done) {
    var pal = buildPal();
    var dom = pal.dom;
    var document = pal.global.window.document;
    var text = document.createTextNode("A");

    var observer = dom.createMutationObserver((changes) => {
      try {
        expect(changes.length).toBe(1);
        expect(changes[0].oldValue).toBe("A");
      }
      catch (err) {
        fail();
      }
      finally {
        observer.disconnect();
        done();
      }
    });

    observer.observe(text, {
      characterData: true
    });

    text.nodeValue = "B";
  });

  it("child-node changes trigger mutation event", function (done) {
    var pal = buildPal();
    var dom = pal.dom;
    var document = pal.global.window.document;
    var parent = document.createElement("div");
    var child = document.createElement("p");

    parent.appendChild(child);

    var observer = dom.createMutationObserver((changes) => {
      try {
        expect(changes.length).toBe(1);
        expect(changes[0].removedNodes.length).toBe(1);
        expect(changes[0].removedNodes[0]).toBe(child);
      }
      catch (err) {
        fail();
      }
      finally {
        observer.disconnect();
        done();
      }
    });

    observer.observe(parent, {
      childList: true,
    });

    parent.removeChild(child);
  });

  it("subtree child-node changes trigger mutation event", function (done) {
    var pal = buildPal();
    var dom = pal.dom;
    var document = pal.global.window.document;
    var parent = document.createElement("div");
    var child = document.createElement("p");
    var childchild = document.createElement("h");

    parent.appendChild(child);
    child.appendChild(childchild);

    var observer = dom.createMutationObserver((changes) => {
      try {
        expect(changes.length).toBe(1);
        expect(changes[0].removedNodes.length).toBe(1);
        expect(changes[0].target).toBe(child);
        expect(changes[0].removedNodes[0]).toBe(childchild);
      }
      catch (err) {
        fail();
      }
      finally {
        observer.disconnect();
        done();
      }
    });

    observer.observe(parent, {
      childList: true,
      subtree: true,
    });

    child.removeChild(childchild);
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

  it('should detect changes for a single text node', () => {
    const textNode = document.createTextNode(`Foo`);

    observer.observe(textNode, {
      characterData: true
    });

    textNode.nodeValue = 'Bar';

    const records = observer.takeRecords();

    expect(records.length).toBe(1);
    expect(records[0].oldValue).toBe('Foo');
  }); 
});
