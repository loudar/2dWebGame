import {DataManager} from "./DataManager.js";
import {ElementApi} from "./ElementFactory.js";
import {SharedElements} from "../JensElements/SharedElements.js";
import {DataEntries} from "../Enums/DataEntries.js";

export class UpdateManager {
    static updateLayerList() {
        const appDom = DataManager.getKey(DataEntries.APP_DOM);
        appDom.innerHTML = "";
        DataManager.getArrayKey("layers").forEach(layer => {
            const layerItem = ElementApi.create(SharedElements.layer, layer);
            appDom.appendChild(layerItem);

            UpdateManager.updateLayer(layer);
        });
    }

    static getBy(selector) {
        return document.querySelector(selector);
    }

    static getAllBy(selector) {
        return document.querySelectorAll(selector);
    }

    static updateLayer(layer) {
        const layerItem = UpdateManager.getBy(`[data-layer-name="${layer.name}"]`);
        if (!layerItem) {
            console.warn(`Could not find DOM Node for layer ${layer.name}`);
            return;
        }
        layerItem.classList.toggle("visible", layer.state.visible);
        layerItem.classList.toggle("locked", layer.state.locked);
        layerItem.style.opacity = layer.state.opacity;

        layer.renderContent(layerItem);
    }
}