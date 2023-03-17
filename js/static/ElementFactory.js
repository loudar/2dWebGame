import {DataManager} from "./DataManager.js";
import {Jens} from "https://jensjs.com/latest/jens.js";
import {DataEntries} from "../Enums/DataEntries.js";

export class ElementApi {
    static initialize() {
        const jens = new Jens();
        DataManager.addKey(DataEntries.ELEMENT_FACTORY, jens);
    }

    static create(template, dataObject) {
        let jens = DataManager.getKey(DataEntries.ELEMENT_FACTORY);
        if (jens === undefined || jens === null) {
            this.initialize();
            jens = DataManager.getKey(DataEntries.ELEMENT_FACTORY);
        }
        return jens.createFromTemplate(template, dataObject, true);
    }
}