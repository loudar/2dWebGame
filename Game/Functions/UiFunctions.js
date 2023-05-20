import {UUID} from "../../Engine/js/Helpers/UUID.js";
import {CustomUiLayerElements} from "../JensElements/CustomUiLayerElements.js";
import {Coordinates3D} from "../../Engine/js/Models/Properties/Coordinates3D.js";
import {LayerTypes} from "../../Engine/js/Enums/LayerTypes.js";
import {LayerManager} from "../../Engine/js/static/LayerManager.js";
import {AspectRatioHelper} from "../../Engine/js/Helpers/AspectRatioHelper.js";

export class UiFunctions {
    static addDamageText(entity, uiLayer, damageId, extraClass = "_") {
        uiLayer.addTemplate("damageText" + damageId, UUID.new.generate(), CustomUiLayerElements.damageText, {
            text: "-1",
            extraClass: extraClass
        }, new Coordinates3D(entity.position.x, entity.position.y), true);
        uiLayer.updateElementByName("damageText" + damageId, {
            text: "-1",
            extraClass: extraClass
        }, new Coordinates3D(entity.position.x, entity.position.y), true);
        setTimeout(() => {
            uiLayer.removeElementByName("damageText" + damageId);
        }, 1000);
    }

    static addDamageIndicator(coordinates3d, radius, uiLayer = LayerManager.getLayersByType(LayerTypes.ui)[0]) {
        const id = UUID.new.generate();
        radius = radius * 2;
        const windowScale = AspectRatioHelper.getWindowScale();
        radius = radius * windowScale.x;
        uiLayer.addTemplate("damageIndicator" + id, id, CustomUiLayerElements.damageIndicator, {
            width: radius,
            height: radius,
        }, coordinates3d, true);
        uiLayer.updateElementByName("damageIndicator" + id, {
            width: radius,
            height: radius,
        }, coordinates3d, true);
        setTimeout(() => {
            uiLayer.removeElementByName("damageIndicator" + id);
        }, 1000);
    }
}