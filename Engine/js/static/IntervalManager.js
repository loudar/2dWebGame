import {DataManager} from "./DataManager.js";
import {DataEntries} from "../Enums/DataEntries.js";

export class IntervalManager {
    static startInterval(callback, interval) {
        const intervalId = setInterval(callback, interval);
        DataManager.addToArrayKey("intervals", intervalId);
        return intervalId;
    }

    static stopAllIntervals() {
        const intervals = DataManager.getArrayKey(DataEntries.INTERVALS);
        intervals.forEach(interval => {
            clearInterval(interval);
        });
        DataManager.removeKey("intervals");
    }

    static stopInterval(interval) {
        const intervals = DataManager.getArrayKey(DataEntries.INTERVALS);
        const index = intervals.indexOf(interval);
        if (index !== -1) {
            clearInterval(interval);
            intervals.splice(index, 1);
        }
    }

    static reset() {
        this.stopAllIntervals();
        DataManager.removeKey(DataEntries.INTERVALS);
    }
}