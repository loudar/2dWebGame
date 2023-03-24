import {Entity} from "./Entity.js";
import {CharacterTexture} from "../../Properties/Textures/CharacterTexture.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {ElementFactory} from "../../../static/ElementFactory.js";
import {EntityLayerElements} from "../../../JensElements/LayerContentElements/EntityLayerElements.js";
import {EntityTypes} from "../../../Enums/EntityTypes.js";

export class EnemyEntity extends Entity {
    constructor(name, texture = new CharacterTexture("#f0f"), size, position, rotation, scale, state) {
        super(EntityTypes.enemy, name, size, position, rotation, scale, state);
        TypeValidator.validateType(texture, CharacterTexture);
        this.texture = texture;
        this.target = null;
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
        this.setDirection(this.getDirectionToPlayer());
        super.update(node);
        node.style.backgroundColor = this.texture.color;
        node.style.backgroundImage = this.texture.image ? `url(${this.texture.image})` : "none";
        node.style.borderColor = this.texture.borderColor;
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
        const avoidanceForce = .75;
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
                if (closestDistance <= collision.entity.size.width / 2) {
                    const directionToCenter = this.getLinearDirectionToTarget(collision.entity.position, this.position);
                    directionToTarget.x -= directionToCenter.x * avoidanceForce;
                    directionToTarget.y -= directionToCenter.y * avoidanceForce;
                    directionToTarget.z -= directionToCenter.z * avoidanceForce;
                    if (closestDistance <= this.size.width * 2) {
                        directionToTarget.x -= directionToCenter.x * avoidanceForce;
                        directionToTarget.y -= directionToCenter.y * avoidanceForce;
                        directionToTarget.z -= directionToCenter.z * avoidanceForce;
                    }
                }
            }
        }
        return this.normalizeDirection(directionToTarget);
    }

    getLinearDirectionToTarget(target, position) {
        const direction = {
            x: target.x - position.x,
            y: target.y - position.y,
            z: target.z - position.z
        };
        return this.normalizeDirection(direction);
    }

    normalizeDirection(direction) {
        const normalizeFactor = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);
        const preData = {
            x: direction.x / normalizeFactor,
            y: direction.y / normalizeFactor,
            z: direction.z / normalizeFactor
        };
        return {
            x: isNaN(preData.x) ? 0 : preData.x,
            y: isNaN(preData.y) ? 0 : preData.y,
            z: isNaN(preData.z) ? 0 : preData.z
        };
    }

    setDirection(direction) {
        this.position.setDX(direction.x);
        this.position.setDY(direction.y);
        this.position.setDZ(direction.z);
        if (this.position.dX !== 0 || this.position.dY !== 0 || this.position.dZ !== 0) {
            this.changed = true;
        }
    }

    setTarget(target) {
        this.target = target;
    }
}