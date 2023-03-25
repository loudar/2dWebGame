import {LayerTypes} from "../Enums/LayerTypes.js";
import {LayerManager} from "./LayerManager.js";
import {EntityTypes} from "../Enums/EntityTypes.js";
import {BulletEntity} from "../Models/LayerContent/Entity/BulletEntity.js";
import {UUID} from "../Helpers/UUID.js";
import {Texture} from "../Models/Properties/Textures/Texture.js";
import {Size3D} from "../Models/Properties/Size3D.js";
import {UpdateManager} from "./UpdateManager.js";

export class EntityManager {
    static update() {
        const layers = LayerManager.getLayersByType(LayerTypes.entity);
        for (const layer of layers) {
            layer.update();
        }
    }

    static getByType(type) {
        const layers = LayerManager.getLayersByType(LayerTypes.entity);
        const entities = [];
        for (const layer of layers) {
            entities.push(...layer.getEntitiesByType(type));
        }
        return entities;
    }

    static addBullet(target, position) {
        const entityLayer = LayerManager.getLayersByType(LayerTypes.entity)[0];
        const bullets = entityLayer.getEntitiesByType(EntityTypes.bullet);
        if (bullets.length > 0) {
            return;
        }
        const targetNew = EntityManager.getByType(EntityTypes.character)[0];
        const bulletEntity = new BulletEntity("bullet" + UUID.new.generate(), targetNew, new Texture("#ff0"), new Size3D(4, 1), position);
        const targetCollision = targetNew.getCollision().ignoreZ().isNonPhysical();
        bulletEntity.addCollision(targetCollision);
        targetNew.changed = true;
        entityLayer.addEntity(bulletEntity);
        UpdateManager.updateLayer(entityLayer);
    }
}