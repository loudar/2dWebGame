import {LayerTypes} from "../Enums/LayerTypes.js";
import {LayerManager} from "./LayerManager.js";
import {EntityTypes} from "../Enums/EntityTypes.js";
import {BulletEntity} from "../Models/LayerContent/Entity/BulletEntity.js";
import {UUID} from "../Helpers/UUID.js";
import {Size3D} from "../Models/Properties/Size3D.js";
import {UpdateManager} from "./UpdateManager.js";
import {Rotation} from "../Models/Properties/Rotation.js";
import {DefaultsHelper} from "../Helpers/DefaultsHelper.js";
import {ColorAssets} from "../../../Game/Assets/ColorAssets.js";

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

    static getById(id) {
        const layers = LayerManager.getLayersByType(LayerTypes.entity);
        for (const layer of layers) {
            const entity = layer.getEntityById(id);
            if (entity) {
                return entity;
            }
        }
        console.warn("Entity with id ", id, " not found.");
        return null;
    }

    static removeEntity(entity) {
        const layers = LayerManager.getLayersByType(LayerTypes.entity);
        for (const layer of layers) {
            layer.removeEntity(entity);
        }
    }

    static addBullet(targetId, position, state, collisions, lifetime = 5000) {
        state = DefaultsHelper.overWriteKeys({ following: false, speed: .7 }, state);
        collisions = DefaultsHelper.overWriteKeys({ world: true, entities: true }, collisions);
        const entityLayer = LayerManager.getLayersByType(LayerTypes.entity)[0];
        const bullets = entityLayer.getEntitiesByType(EntityTypes.bullet);
        if (bullets.length > 0) {
            return;
        }
        const targetNew = EntityManager.getById(targetId);
        let targetPosition;
        if (state.following === true) {
            targetPosition = targetNew.position;
        } else {
            targetPosition = JSON.parse(JSON.stringify(targetNew.position));
        }
        const bulletEntity = new BulletEntity("bullet" + UUID.new.generate(), targetPosition, ColorAssets.Bullet, new Size3D(1, 1), position, new Rotation(), 1, state);
        if (collisions.world) {
            bulletEntity.addCollisionsWithWorld();
        }
        if (collisions.entities) {
            bulletEntity.addCollisionsWithWorldEntities();
        }
        const bulletCollision = bulletEntity.getCollision().ignoreZ().isNonPhysical();
        targetNew.addCollision(bulletCollision);
        entityLayer.updateEntity(targetNew);
        entityLayer.addEntity(bulletEntity);
        UpdateManager.updateLayer(entityLayer);
        setTimeout(() => {
            EntityManager.removeEntity(bulletEntity);
        }, lifetime);
    }
}