import { IPlatform } from './platform';
import { IGlobal } from './global';
import { IDom } from './dom';
import { IFeature } from './feature';
export declare function buildPal(): {
    global: IGlobal;
    platform: IPlatform;
    dom: IDom;
    feature: IFeature;
};
export declare function ensurePerformance(window: any): void;
