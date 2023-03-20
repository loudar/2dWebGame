import {DataManager} from "../../static/DataManager.js";
import {LayerState} from "./LayerState.js";
import {TypeValidator} from "../../Meta/TypeValidator.js";
import {LayerTypes} from "../../Enums/LayerTypes.js";

export class Layer {
    name;

    constructor(type, name) {
        const layerTypes = [
            LayerTypes.image,
            LayerTypes.entity,
            LayerTypes.ui
        ];
        if (!layerTypes.includes(type)) {
            throw new Error(`Invalid layer type ${type}, must be one of ${layerTypes.join(", ")}`);
        }
        TypeValidator.validateType(name, String);
        const layers = DataManager.getArrayKey("layers");
        if (layers.find(layer => layer.name === name)) {
            throw new Error(`Layer with name ${name} already exists`);
        }
        this.type = type;
        this.name = name;
        this.state = new LayerState();
    }

    show() {
        this.state.visible = true;
    }

    hide() {
        this.state.visible = false;
    }

    lock() {
        this.state.locked = true;
    }

    unlock() {
        this.state.locked = false;
    }

    renderContent(layerItem) {
    }

    update() {
    }
}