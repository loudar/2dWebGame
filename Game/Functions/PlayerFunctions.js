import {LayerManager} from "../../Engine/js/static/LayerManager.js";
import {LayerTypes} from "../../Engine/js/Enums/LayerTypes.js";
import {UUID} from "../../Engine/js/Helpers/UUID.js";
import {CustomUiLayerElements} from "../JensElements/CustomUiLayerElements.js";
import {Coordinates3D} from "../../Engine/js/Models/Properties/Coordinates3D.js";
import {HealthHelpers} from "../Helpers/Player/HealthHelpers.js";
import {EntityTypes} from "../../Engine/js/Enums/EntityTypes.js";
import {EntityManager} from "../../Engine/js/static/EntityManager.js";
import {Game} from "../Game.js";

export class PlayerFunctions {
    static async damage(c, collidingEntity) {
        if (collidingEntity.type === EntityTypes.bullet) {
            EntityManager.removeEntity(collidingEntity);
        }
        const oldHealth = c.state.getHealth();
        c.state.setHealth(oldHealth - 1);
        if (oldHealth === c.state.getHealth()) {
            return;
        }
        const uiLayer = LayerManager.getLayersByType(LayerTypes.ui)[0];
        const damageId = UUID.new.generate();
        this.addDamageText(c, uiLayer, damageId);
        this.updateHealthDisplay(c);
        c.state.setDamageLock();
        if (c.state.getHealth() === 0) {
            await Game.reset();
        }
    }

    static addDamageText(c, uiLayer, damageId) {
        uiLayer.addTemplate("damageText" + damageId, UUID.new.generate(), CustomUiLayerElements.damageText, {
            text: "-1"
        }, new Coordinates3D(c.position.x, c.position.y), true);
        uiLayer.updateElementByName("damageText" + damageId, {
            text: "-1"
        }, new Coordinates3D(c.position.x, c.position.y), true);
        setTimeout(() => {
            uiLayer.removeElementByName("damageText" + damageId);
        }, 1000);
    }

    static updateHealthDisplay(c) {
        const uiLayer = LayerManager.getLayersByType(LayerTypes.ui)[0];
        uiLayer.updateElementByName("healthText", {
            text: `health: ${c.state.getHealth()}/${c.state.getBaseHealth()}`
        });
        uiLayer.updateElementByName("healthImages", {images: HealthHelpers.getHealthImages(c.state)});
    }
}