import {LayerManager} from "../../Engine/js/static/LayerManager";
import {LayerTypes} from "../../Engine/js/Enums/LayerTypes";
import {EntityTypes} from "../../Engine/js/Enums/EntityTypes";
import {EnemyState} from "../Models/States/EnemyState";

export class WorldFunctions {
    static damageInRadiusFromCoordinates3d(coordinates3d, radius, damage, entityExclusionType = EntityTypes.character) {
        const entities = WorldFunctions.getEntitiesInRadius(coordinates3d, radius);
        for (const entity of entities) {
            if (entity.type !== entityExclusionType) {
                if (entity.state.constructor === EnemyState) {
                    const oldHealth = entity.state.getHealth();
                    entity.state.setHealth(oldHealth - damage);
                    if (oldHealth === entity.state.getHealth()) {
                        return;
                    }
                    entity.state.setDamageLock();
                }
            }
        }
    }

    static getEntitiesInRadius(coordinates3d, radius) {
        const entities = [];
        const entityLayers = LayerManager.getLayersByType(LayerTypes.entity);
        for (const layer of entityLayers) {
            for (const entity of layer.elements) {
                entities.push(entity);
            }
        }
        const returnEntities = [];
        for (const entity of entities) {
            if (entity.position.distanceTo(coordinates3d) <= radius) {
                returnEntities.push(entity);
            }
        }
        return returnEntities;
    }
}