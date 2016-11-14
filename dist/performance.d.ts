/**
* The runtime's performance API.
*/
export interface IPerformance {
    /**
    * Gets a DOMHighResTimeStamp.
    * @return The timestamp, measured in milliseconds, accurate to one thousandth of a millisecond.
    */
    now(): number;
}
