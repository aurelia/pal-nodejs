import {NodeJsMutationEmulator} from '../source/nodejs-mutation-emulator';
import {IObserver} from '../source/observer';
import {jsdom} from 'jsdom';

describe("Mutation Source", function () {
  describe("Attributes", function () {
    it("doesn't raise mutation if attribute not changed", function () {
      var source = new NodeJsMutationEmulator(0);
      var dom = jsdom(undefined);

      let observer = <IObserver>{
      }

      var target = dom.createElement("div");

      target.setAttribute("foo", "moo");

      var callback = (records: MutationRecord[]) => {
        wasCalled = true;
      }

      source.registerObserver(<IObserver>{
        target: target,
        callback: callback
      });

      var wasCalled = false;
      source.cycle();
      expect(wasCalled).toBe(false);
    });

    it("does raise mutation after attribute is changed", function () {
      var source = new NodeJsMutationEmulator(0);
      var dom = jsdom(undefined);
      let observer = <IObserver>{}

      var target = dom.createElement("div");

      target.setAttribute("foo", "moo");

      var wasCalled;

      var callback = (records: MutationRecord[]) => {
        wasCalled = true;
      }

      source.registerObserver(<IObserver>{
        target: target,
        callback: callback
      });

      wasCalled = false;
      source.cycle();
      expect(wasCalled).toBe(false);
      
      wasCalled = false;      
      target.setAttribute("foo", "boo");
      source.cycle();
      expect(wasCalled).toBe(true);    

      wasCalled = false;   
      source.cycle();
      expect(wasCalled).toBe(false);   

      wasCalled = false;      
      target.setAttribute("foo", "choo");
      source.cycle();
      expect(wasCalled).toBe(true);   

    });
  });

  describe("Node Value", function () {
    it("doesn't raise mutation if nodeValue not changed", function () {
      var source = new NodeJsMutationEmulator(0);
      var dom = jsdom(undefined);
      let observer = <IObserver>{}

      var target = dom.createTextNode("foo");

      var callback = (records: MutationRecord[]) => {
        wasCalled = true;
      }

      source.registerObserver(<IObserver>{
        target: target,
        callback: callback
      });

      var wasCalled = false;
      source.cycle();
      expect(wasCalled).toBe(false);
    });

    it("does raise mutation after nodeValue is changed", function () {
      var source = new NodeJsMutationEmulator(0);
      var dom = jsdom(undefined);
      let observer = <IObserver>{}

      var target = dom.createTextNode("foo");

      var wasCalled;
      var callback = (records: MutationRecord[]) => {
        wasCalled = true;
      }

      source.registerObserver(<IObserver>{
        target: target,
        callback: callback
      });

      wasCalled = false;
      source.cycle();
      expect(wasCalled).toBe(false);
      
      wasCalled = false;      
      target.nodeValue = "boo";
      source.cycle();
      expect(wasCalled).toBe(true);    

      wasCalled = false;   
      source.cycle();
      expect(wasCalled).toBe(false);   

      wasCalled = false;      
      target.nodeValue = "choo";
      source.cycle();
      expect(wasCalled).toBe(true);   

    });
  });
});

