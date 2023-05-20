import {LayerManager} from "../../Engine/js/static/LayerManager.js";
import {LayerTypes} from "../../Engine/js/Enums/LayerTypes.js";
import {UUID} from "../../Engine/js/Helpers/UUID.js";
import {HealthHelpers} from "../Helpers/Player/HealthHelpers.js";
import {EntityTypes} from "../../Engine/js/Enums/EntityTypes.js";
import {EntityManager} from "../../Engine/js/static/EntityManager.js";
import {Game} from "../Game.js";
import {UiFunctions} from "./UiFunctions.js";

export class PlayerFunctions {
    static async damage(player, collidingEntity) {
        if (collidingEntity.type === EntityTypes.bullet) {
            EntityManager.removeEntity(collidingEntity);
        }
        const oldHealth = player.state.getHealth();
        player.state.setHealth(oldHealth - 1);
        if (oldHealth === player.state.getHealth()) {
            return;
        }
        const uiLayer = LayerManager.getLayersByType(LayerTypes.ui)[0];
        const damageId = UUID.new.generate();
        UiFunctions.addDamageText(player, uiLayer, damageId);
        this.updateHealthDisplay(player);
        player.state.setDamageLock();
        if (player.state.getHealth() === 0) {
            await Game.reset();
        }
    }

    static updateHealthDisplay(c) {
        const uiLayer = LayerManager.getLayersByType(LayerTypes.ui)[0];
        uiLayer.updateElementByName("healthText", {
            text: `health: ${c.state.getHealth()}/${c.state.getBaseHealth()}`
        });
        uiLayer.updateElementByName("healthImages", {images: HealthHelpers.getHealthImages(c.state)});
    }
}