import {LayerManager} from "../../Engine/js/static/LayerManager.js";
import {LayerTypes} from "../../Engine/js/Enums/LayerTypes.js";
import {EntityTypes} from "../../Engine/js/Enums/EntityTypes.js";
import {EnemyState} from "../Models/States/EnemyState.js";
import {EntityManager} from "../../Engine/js/static/EntityManager.js";
import {UUID} from "../../Engine/js/Helpers/UUID.js";
import {UiFunctions} from "./UiFunctions.js";

export class WorldFunctions {
    static damageInRadiusFromCoordinates3d(coordinates3d, radius, damage, entityExclusionType = EntityTypes.character) {
        const entities = WorldFunctions.getEntitiesInRadius(coordinates3d, radius);
        for (const entity of entities) {
            if (entity.type === entityExclusionType) {
                continue;
            }
            if (entity.state.constructor === EnemyState) {
                const oldHealth = entity.state.getHealth();
                entity.state.setHealth(oldHealth - damage);
                if (oldHealth === entity.state.getHealth()) {
                    return;
                }
                entity.state.setDamageLock();
                //UiFunctions.addDamageIndicator(coordinates3d, radius);
                UiFunctions.addDamageText(entity, LayerManager.getLayersByType(LayerTypes.ui)[0], UUID.new.generate(), "damageTextEnemy");
                if (entity.state.getHealth() === 0) {
                    EntityManager.removeEntity(entity);
                }
            }
        }
    }

    static getEntitiesInRadius(coordinates3d, radius) {
        const entities = [];
        for (const entity of EntityManager.getByType(EntityTypes.enemy)) {
            entities.push(entity);
        }
        const returnEntities = [];
        for (const entity of entities) {
            const distance = entity.position.distanceTo(coordinates3d);
            if (distance <= radius) {
                returnEntities.push(entity);
            } else {
                const tooMuch = distance - radius;
                console.log("entity not in radius: " + distance + " (" + tooMuch + " too much)");
            }
        }
        return returnEntities;
    }
}