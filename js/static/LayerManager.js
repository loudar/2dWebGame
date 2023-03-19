import {DataManager} from "./DataManager.js";
import {DataEntries} from "../Enums/DataEntries.js";

export class LayerManager {
    static addLayer(layer) {
        DataManager.addToArrayKey(DataEntries.LAYERS, layer);
    }

    static removeLayer(layer) {
        DataManager.removeFromArrayKey(DataEntries.LAYERS, layer);
    }

    static getLayers() {
        return DataManager.getArrayKey(DataEntries.LAYERS);
    }

    static getLayerByName(name) {
        return DataManager.getArrayKey(DataEntries.LAYERS).find(layer => layer.name === name);
    }

    static getLayersByType(type) {
        return DataManager.getArrayKey(DataEntries.LAYERS).filter(layer => layer.type === type);
    }

    static getLayerCount() {
        return DataManager.getArrayKey(DataEntries.LAYERS).length;
    }

    static getLayer(index) {
        return DataManager.getArrayKey(DataEntries.LAYERS)[index];
    }

    static getLayerIndex(layer) {
        return DataManager.getArrayKey(DataEntries.LAYERS).findIndex(l => l === layer);
    }

    static moveLayer(layer, newIndex) {
        const layers = DataManager.getArrayKey(DataEntries.LAYERS);
        const oldIndex = layers.findIndex(l => l === layer);
        layers.splice(oldIndex, 1);
        layers.splice(newIndex, 0, layer);
    }

    static moveLayerUp(layer) {
        const layers = DataManager.getArrayKey(DataEntries.LAYERS);
        const index = layers.findIndex(l => l === layer);
        if (index > 0) {
            layers.splice(index, 1);
            layers.splice(index - 1, 0, layer);
        }
    }

    static moveLayerDown(layer) {
        const layers = DataManager.getArrayKey(DataEntries.LAYERS);
        const index = layers.findIndex(l => l === layer);
        if (index < layers.length - 1) {
            layers.splice(index, 1);
            layers.splice(index + 1, 0, layer);
        }
    }

    static moveLayerToTop(layer) {
        const layers = DataManager.getArrayKey(DataEntries.LAYERS);
        const index = layers.findIndex(l => l === layer);
        if (index > 0) {
            layers.splice(index, 1);
            layers.push(layer);
        }
    }

    static moveLayerToBottom(layer) {
        const layers = DataManager.getArrayKey(DataEntries.LAYERS);
        const index = layers.findIndex(l => l === layer);
        if (index < layers.length - 1) {
            layers.splice(index, 1);
            layers.unshift(layer);
        }
    }
}