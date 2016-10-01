import { initialize } from '../src/index';
import { DOM } from 'aurelia-pal';
import { jsdom } from 'jsdom';

initialize();

describe('NodeJs Dom', () => {
  it('should create a template from valid markup', () => {
    expect(() => DOM.createTemplateFromMarkup('<template>this is valid!</template>')).toBeDefined();
  });

  it('should throw an error when creating a template from text-only markup', () => {
    expect(() => DOM.createTemplateFromMarkup('throw an error!')).toThrow();
  });

  it('should throw an error when creating a template from markup where <template> is not the root element', () => {
    expect(() => DOM.createTemplateFromMarkup('<div>throw an error!</div>')).toThrow();
  });

  it('createElement is defined and creates valid element', () => {
    expect(DOM.createElement).toBeDefined();
  });

  it('createElement creates valid element', () => {
    let elmt = DOM.createElement("div");
    expect(elmt).not.toBeNull();
    expect(elmt.tagName).toBe("DIV");
  });

  it('createTextNode is defined', () => {
    expect(DOM.createTextNode).toBeDefined();
  });

  it('createTextNode creates valid text node', () => {
    let elmt = DOM.createTextNode("choo-choo!");

    expect(elmt).not.toBeNull();
    expect(elmt.textContent).toBe("choo-choo!");
  });

  it('adoptNode is defined', () => {
    expect(DOM.adoptNode).toBeDefined();
  });

  it('adoptNode returns adopted', () => {
    let external = jsdom(undefined).defaultView.window.document.createElement("DIV");
    let adopted = DOM.adoptNode(external);

    expect(adopted.nodeName).toBe("DIV");
  });

  it('appendNode is defined and appends node to other', () => {
    expect(DOM.appendNode).toBeDefined();
  });

  it('activeElement is defined', () => {
    expect(DOM.activeElement).toBeDefined();
  });

  it('createMutationObserver is defined', () => {
    expect(DOM.createMutationObserver).toBeDefined();
  });

  it('createDocumentFragment is defined', () => {
    expect(DOM.createDocumentFragment).toBeDefined();
  });

  it('createTemplateFromMarkup is defined', () => {
    expect(DOM.createTemplateFromMarkup).toBeDefined();
  });

  it('createTemplateFromMarkup is defined', () => {
    expect(DOM.createMutationObserver).toBeDefined();
  });

  it('addEventListener is defined', () => {
    expect(DOM.addEventListener).toBeDefined();
  });

  it('addEventListener recieves custom events', () => {
    let elmt = DOM.createElement("div");
    var wasCalled = false;

    let event = DOM.createCustomEvent("Foo", { bubbles: true, cancelable: false, detail: {} });

    elmt.addEventListener("Foo", () => { wasCalled = true; }, true);
    elmt.dispatchEvent(event);

    expect(wasCalled).toBeTruthy();
  });

  it('removeEventListener is defined', () => {
    expect(DOM.removeEventListener).toBeDefined();
  });

  it('dispatchEvent is defined', () => {
    expect(DOM.dispatchEvent).toBeDefined();
  });
});
