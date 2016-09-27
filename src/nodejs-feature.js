import {IFeature} from './feature';
import {IGlobal} from './global';

export class NodeJsFeature implements IFeature {
  constructor(global: IGlobal) {
    this.gloabl = global;
    this.shadowDOM = (global.window).HTMLElement.prototype.attachShadow !== undefined;
    this.scopedCSS = 'scoped' in global.document.createElement('style');
    this.htmlTemplateElement = true;
    this.mutationObserver = true; // partial
  }

  shadowDOM: boolean;
  scopedCSS: boolean;
  htmlTemplateElement: boolean;
  mutationObserver: boolean;
}
