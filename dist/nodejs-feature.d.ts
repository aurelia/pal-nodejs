import { IFeature } from './feature';
import { IGlobal } from './global';
export declare class NodeJsFeature implements IFeature {
    private global;
    constructor(global: IGlobal);
    shadowDOM: boolean;
    scopedCSS: boolean;
    htmlTemplateElement: boolean;
    mutationObserver: boolean;
}
