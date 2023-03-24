import {Entity} from "./Entity.js";
import {CharacterTexture} from "../../Properties/Textures/CharacterTexture.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {ElementFactory} from "../../../static/ElementFactory.js";
import {EntityLayerElements} from "../../../JensElements/LayerContentElements/EntityLayerElements.js";
import {EntityTypes} from "../../../Enums/EntityTypes.js";
import {LayerManager} from "../../../static/LayerManager.js";
import {LayerTypes} from "../../../Enums/LayerTypes.js";

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
                const collisionDirection = this.getLinearDirectionToTarget(collision.entity.position, this.position);
                directionToTarget.x -= collisionDirection.x * avoidanceForce;
                directionToTarget.y -= collisionDirection.y * avoidanceForce;
                directionToTarget.z -= collisionDirection.z * avoidanceForce;
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
        return {
            x: direction.x / normalizeFactor,
            y: direction.y / normalizeFactor,
            z: direction.z / normalizeFactor
        };
    }

    setDirection(direction) {
        this.position.dX = direction.x;
        this.position.dY = direction.y;
        this.position.dZ = direction.z;
        if (this.position.dX !== 0 || this.position.dY !== 0 || this.position.dZ !== 0) {
            this.changed = true;
        }
    }

    setTarget(target) {
        this.target = target;
    }
}