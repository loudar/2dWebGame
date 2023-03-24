import {LayerTypes} from "../Enums/LayerTypes.js";
import {LayerManager} from "./LayerManager.js";

export class EntityManager {
    static update() {
        const layers = LayerManager.getLayersByType(LayerTypes.entity);
        for (const layer of layers) {
            layer.update();
        }
    }
}