import {DataManager} from "./DataManager.js";
import {ElementApi} from "./ElementFactory.js";
import {SharedElements} from "../JensElements/SharedElements.js";
import {DataEntries} from "../Enums/DataEntries.js";
import {EntityManager} from "./EntityManager.js";

export class UpdateManager {
    static updateTick() {
        EntityManager.update();
    }

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
        const layerContent = UpdateManager.getBy(`[data-layer-name="${layer.name}"] .layercontent`);
        if (!layerContent) {
            console.warn(`Could not find DOM Node for layer ${layer.name}`);
            return;
        }
        layerContent.classList.toggle("visible", layer.state.visible);
        layerContent.classList.toggle("locked", layer.state.locked);
        layerContent.style.opacity = layer.state.opacity;

        layer.renderContent(layerContent);
    }
}