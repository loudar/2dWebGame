import {Entity} from "./Entity.js";
import {CharacterTexture} from "../../Properties/Textures/CharacterTexture.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {ElementFactory} from "../../../static/ElementFactory.js";
import {EntityLayerElements} from "../../../JensElements/LayerContentElements/EntityLayerElements.js";
import {EntityTypes} from "../../../Enums/EntityTypes.js";
import {EntityManager} from "../../../static/EntityManager.js";
import {Coordinates3D} from "../../Properties/Coordinates3D.js";
import {DefaultsHelper} from "../../../Helpers/DefaultsHelper.js";

export class EnemyEntity extends Entity {
    constructor(name, texture = new CharacterTexture("#f0f"), size, position, rotation, scale, state) {
        state = DefaultsHelper.overWriteKeys({ speed: .7, shooting: true, shotSpeed: 2000 }, state);
        super(EntityTypes.enemy, name, size, position, rotation, scale, state);
        TypeValidator.validateType(texture, CharacterTexture);
        this.texture = texture;
        this.target = null;
        this.updateOnTicks = true;
    }

    render() {
        super.render();
        const existingElement = document.getElementById(this.id);
        if (existingElement) {
            this.update(existingElement);
            return existingElement;
        }
        const newElement = ElementFactory.create(EntityLayerElements.enemyEntity, this);
        this.update(newElement);
        return newElement;
    }

    update(node) {
        this.changed = false;
        if (this.state.shooting) {
            this.shoot();
        }
        this.setDirection(this.getDirectionToPlayer());
        super.update(node);
        node.style.backgroundColor = this.texture.color;
        node.style.backgroundImage = this.texture.image ? `url(${this.texture.image})` : "none";
        node.style.borderColor = this.texture.borderColor;
    }

    shoot() {
        if (!this.target) {
            return;
        }
        if (this.state.lastBulletShot && Date.now() - this.state.lastBulletShot < this.state.shotSpeed) {
            return;
        }
        EntityManager.addBullet(this.target.id, new Coordinates3D(this.position.x, this.position.y, this.position.z), { following: false, speed: .7 });
        this.state.lastBulletShot = Date.now();
    }

    getDirectionToPlayer() {
        if (this.target) {
            const directionToTarget = this.getLinearDirectionToTarget(this.target.position, this.position);
            return this.avoidCollisions(directionToTarget);
        }
        console.warn("No player entity found. Set one with entity.setAsPlayer() to enable enemy movement towards player and control it.");
        return {x: 0, y: 0, z: 0};
    }

    avoidCollisions(directionToTarget) {
        for (let collision of this.collisions) {
            if (!collision.entity) {
                continue;
            }
            if (collision.entity.type === EntityTypes.block) {
                const collisionCorners = collision.getCornerCoordinates2D();
                let closestCorner = null;
                let closestDistance = null;
                for (let cornerName in collisionCorners) {
                    const corner = collisionCorners[cornerName];
                    const distance = Math.sqrt(Math.pow(corner.x - this.position.x, 2) + Math.pow(corner.y - this.position.y, 2) + Math.pow(corner.z - this.position.z, 2));
                    if (!closestDistance || distance < closestDistance) {
                        closestDistance = distance;
                        closestCorner = corner;
                    }
                }
                const triggerDistance = collision.entity.size.width * 0.75;
                if (closestDistance <= triggerDistance) {
                    /*if (closestDistance >= triggerDistance / 2) {
                        directionToTarget = this.moveTowardsCorner(closestCorner, closestDistance, triggerDistance, directionToTarget);
                    }*/
                    directionToTarget = this.moveAwayFromCenter(collision, closestDistance, triggerDistance, directionToTarget);
                }
            }
        }
        return this.normalizeDirection(directionToTarget);
    }

    moveAwayFromCenter(collision, closestDistance, triggerDistance, directionToTarget) {
        const directionToCenter = this.getLinearDirectionToTarget(collision.entity.position, this.position);
        let avoidanceForce = .8 * (1 - (closestDistance / triggerDistance));
        if (closestDistance <= this.size.width * 2) {
            directionToTarget.x = -directionToCenter.x;
            directionToTarget.y = -directionToCenter.y;
            directionToTarget.z = -directionToCenter.z;
        } else {
            directionToTarget.x -= directionToCenter.x * avoidanceForce;
            directionToTarget.y -= directionToCenter.y * avoidanceForce;
            directionToTarget.z -= directionToCenter.z * avoidanceForce;
        }

        return directionToTarget;
    }

    setTarget(target) {
        this.target = target;
    }

    moveTowardsCorner(closestCorner, closestDistance, triggerDistance, directionToTarget) {
        const directionToCorner = this.getLinearDirectionToTarget(closestCorner, this.position);
        const influence = .2;
        directionToTarget.x += directionToCorner.x * influence;
        directionToTarget.y += directionToCorner.y * influence;
        directionToTarget.z += directionToCorner.z * influence;

        return directionToTarget;
    }
}