import { initializePAL } from 'aurelia-pal';
import { IPlatform } from './platform';
import { IGlobal } from './global';
import { IDom } from './dom';
import { IFeature } from './feature';
import { NodeJsPlatform } from './nodejs-platform';
import { NodeJsFeature } from './nodejs-feature';
import { NodeJsDom } from './nodejs-dom';
import { jsdom } from 'jsdom';
import { MutationObserver } from './polyfills/mutation-observer';

export function buildPal(): { global: IGlobal, platform: IPlatform, dom: IDom, feature: IFeature } {
  var _global: IGlobal = <IGlobal>jsdom(undefined, {}).defaultView;

  ensurePerformance(_global.window);
  ensureMutationObserver(_global.window);

  var _platform = new NodeJsPlatform(_global);
  var _dom = new NodeJsDom(_global);
  var _feature = new NodeJsFeature(_global);

  return {
    global: _global,
    platform: _platform,
    dom: _dom,
    feature: _feature
  };
}

function ensurePerformance(window) {
  if (window.performance === undefined) {
    window.performance = {};
  }

  if (window.performance.now === undefined) {
    let nowOffset = Date.now();

    //if (performance.timing && performance.timing.navigationStart) {
    //  nowOffset = performance.timing.navigationStart;
    //}

    window.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }
}

function ensureMutationObserver(window) {
  if (!window.MutationObserver) {
    window.MutationObserver = MutationObserver;
  }
}
