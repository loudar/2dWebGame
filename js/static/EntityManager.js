import {LayerTypes} from "../Enums/LayerTypes.js";
import {LayerManager} from "./LayerManager.js";

export class EntityManager {
    static update() {
        const layers = LayerManager.getLayersByType(LayerTypes.entity);
        for (const layer of layers) {
            layer.update();
        }
    }

    static getDirectionToPlayer(enemyEntity) {
        const entityLayers = LayerManager.getLayersByType(LayerTypes.entity);
        for (const entityLayer of entityLayers) {
            const player = entityLayer.getEntities().find(entity => entity.isPlayer);
            if (player) {
                return {
                    x: player.position.x - enemyEntity.position.x,
                    y: player.position.y - enemyEntity.position.y,
                    z: player.position.z - enemyEntity.position.z
                };
            }
        }
        console.warn("No player found.");
        return {x: 0, y: 0, z: 0};
    }
}