import {EntityLayerElements} from "../../Engine/js/JensElements/LayerContentElements/EntityLayerElements.js";
import {SharedElements} from "../../Engine/js/JensElements/SharedElements.js";
import {CustomUiLayerElements} from "../JensElements/CustomUiLayerElements.js";
import {ImageLayerElements} from "../../Engine/js/JensElements/LayerContentElements/ImageLayerElements.js";
import {UiLayerElements} from "../../Engine/js/JensElements/LayerContentElements/UiLayerElements.js";

export class TemplateHelper {
    static getTemplates() {
        const classesToRegister = [
            ImageLayerElements,
            UiLayerElements,
            EntityLayerElements,
            SharedElements,
            CustomUiLayerElements,
        ];
        const templates = {};
        for (const classToRegister of classesToRegister) {
            for (const [key, value] of Object.entries(classToRegister)) {
                if (templates[key]) {
                    console.warn(`Template ${key} is already registered, overwriting it.`);
                }
                templates[key] = value;
            }
        }
        return templates;
    }
}