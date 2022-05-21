/**
* Enables discovery of what features the runtime environment supports.
*/
export interface IFeature {
    /**
    * Does the runtime environment support ShadowDOM?
    */
    shadowDOM: boolean;
    /**
    * Does the runtime environment support the css scoped attribute?
    */
    scopedCSS: boolean;
    /**
    * Does the runtime environment support native HTMLTemplateElement?
    */
    htmlTemplateElement: boolean;
    /**
    * Does the runtime environment support native DOM mutation observers?
    */
    mutationObserver: boolean;
}
