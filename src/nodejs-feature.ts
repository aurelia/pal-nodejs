import { IFeature } from './feature';
import { IGlobal } from './global';

export class NodeJsFeature implements IFeature {
  constructor(private global: IGlobal) {
    this.shadowDOM = (<any>this.global.window).HTMLElement.prototype.attachShadow != undefined;
    this.scopedCSS = 'scoped' in this.global.document.createElement('style');
    this.htmlTemplateElement = true;
    this.mutationObserver = true; // partial
  }

  shadowDOM: boolean;
  scopedCSS: boolean;
  htmlTemplateElement: boolean;
  mutationObserver: boolean;
}
