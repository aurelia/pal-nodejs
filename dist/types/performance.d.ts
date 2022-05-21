/**
* The runtime's performance API.
*/
export interface IPerformance {
    /**
    * Gets a DOMHighResTimeStamp.
    * @return The timestamp, measured in milliseconds, accurate to one thousandth of a millisecond.
    */
    now(): number;
    /**
     * Removes the given mark from the browser's performance entry buffer.
     *
     * @param {string} [markName] A DOMString representing the name of the timestamp. If this argument is omitted, all performance entries with an entry type of "mark" will be removed.
     * @memberof IPerformance
     */
    clearMarks(markName?: string): void;
    /**
     * Removes the given measure from the browser's performance entry buffer.
     *
     * @param {string} [measureName] A DOMString representing the name of the timestamp. If this argument is omitted, all performance entries with an entry type of "measure" will be removed.
     * @memberof IPerformance
     */
    clearMeasures(measureName?: string): void;
    /**
     * Returns a list of PerformanceEntry objects based on the given name and entry type.
     *
     * @param {string} name The name of the entry to retrieve
     * @param {string} [entryType] The type of entry to retrieve such as "mark". The valid entry types are listed in PerformanceEntry.entryType.
     * @returns {*}
     * @memberof IPerformance
     */
    getEntriesByName(name: string, entryType?: string): any;
    /**
     * Returns a list of PerformanceEntry objects of the given entry type.
     *
     * @param {string} entryType The type of entry to retrieve such as "mark". The valid entry types are listed in PerformanceEntry.entryType.
     * @returns {*}
     * @memberof IPerformance
     */
    getEntriesByType(entryType: string): any;
    /**
     * Creates a timestamp in the browser's performance entry buffer with the given name.
     *
     * @param {string} markName a DOMString representing the name of the mark
     * @memberof IPerformance
     */
    mark(markName: string): void;
    /**
     * Creates a named timestamp in the browser's performance entry buffer between two specified marks (known as the start mark and end mark, respectively).
     *
     * @param {string} measureName a DOMString representing the name of the measure.
     * @param {string} [startMarkName] A DOMString representing the name of the measure's starting mark. May also be the name of a PerformanceTiming property.
     * @param {string} [endMarkName] A DOMString representing the name of the measure's ending mark. May also be the name of a PerformanceTiming property.
     * @memberof IPerformance
     */
    measure(measureName: string, startMarkName?: string, endMarkName?: string): void;
}
