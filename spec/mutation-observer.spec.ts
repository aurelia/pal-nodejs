import { buildPal } from '../src/nodejs-pal-builder';

describe("mutation-observer", () => {
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
});
