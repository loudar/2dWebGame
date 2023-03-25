import {LayerManager} from "../../Engine/js/static/LayerManager.js";
import {LayerTypes} from "../../Engine/js/Enums/LayerTypes.js";
import {UUID} from "../../Engine/js/Helpers/UUID.js";
import {CustomUiLayerElements} from "../JensElements/CustomUiLayerElements.js";
import {Coordinates3D} from "../../Engine/js/Models/Properties/Coordinates3D.js";
import {HealthHelpers} from "../Helpers/Player/HealthHelpers.js";
import {EntityTypes} from "../../Engine/js/Enums/EntityTypes.js";

export class PlayerFunctions {
    static damage(c, collidingEntity) {
        console.log(collidingEntity.type);
        const oldHealth = c.state.getHealth();
        c.state.setHealth(oldHealth - 1);
        if (oldHealth === c.state.getHealth()) {
            return;
        }
        const uiLayer = LayerManager.getLayersByType(LayerTypes.ui)[0];
        const damageId = UUID.new.generate();
        uiLayer.addTemplate("damageText" + damageId, UUID.new.generate(), CustomUiLayerElements.damageText, {
            text: "-1"
        }, new Coordinates3D(c.position.x, c.position.y), true);
        uiLayer.updateElementByName("damageText" + damageId, {
            text: "-1"
        }, new Coordinates3D(c.position.x, c.position.y), true);
        setTimeout(() => {
            uiLayer.removeElementByName("damageText" + damageId);
        }, 1000);
        uiLayer.updateElementByName("healthText", {
            text: `health: ${c.state.getHealth()}/${c.state.getBaseHealth()}`
        });
        uiLayer.updateElementByName("healthImages", {images: HealthHelpers.getHealthImages(c.state)});
        c.state.setDamageLock();
        if (collidingEntity.type === EntityTypes.bullet) {
            const entityLayer = LayerManager.getLayersByType(LayerTypes.entity)[0];
            entityLayer.removeEntity(collidingEntity);
        } else {
            console.log(collidingEntity);
            console.trace();
        }
    }
}