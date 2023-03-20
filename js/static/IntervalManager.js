import {DataManager} from "./DataManager.js";

export class IntervalManager {
    static startInterval(callback, interval) {
        const intervalObj = setInterval(callback, interval);
        DataManager.addToArrayKey("intervals", intervalObj);
        return intervalObj;
    }

    static stopAllIntervals() {
        const intervals = DataManager.getArrayKey("intervals");
        intervals.forEach(interval => {
            clearInterval(interval);
        });
        DataManager.removeKey("intervals");
    }

    static stopInterval(interval) {
        const intervals = DataManager.getArrayKey("intervals");
        const index = intervals.indexOf(interval);
        if (index !== -1) {
            clearInterval(interval);
            intervals.splice(index, 1);
        }
    }
}