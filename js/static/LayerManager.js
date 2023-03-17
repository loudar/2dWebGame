import {DataManager} from "./DataManager.js";
import {DataEntries} from "../Enums/DataEntries.js";

export class LayerManager {
    static addLayer(layer) {
        DataManager.addToArrayKey(DataEntries.LAYERS, layer);
    }
}