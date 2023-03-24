import {UUID} from "../../../Helpers/UUID.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {Coordinates3D} from "../../Properties/Coordinates3D.js";
import {Rotation} from "../../Properties/Rotation.js";
import {AspectRatioHelper} from "../../../Helpers/AspectRatioHelper.js";
import {EntityHook} from "../Ui/EntityHook.js";
import {Size3D} from "../../Properties/Size3D.js";
import {InvertedPositionCollision} from "../../Collisions/InvertedPositionCollision.js";
import {LayerManager} from "../../../static/LayerManager.js";
import {LayerTypes} from "../../../Enums/LayerTypes.js";

export class Entity {
    constructor(type, name, size = new Size3D(), position = new Coordinates3D(), rotation = new Rotation(), scale = 1, state = {speed: 1}) {
        TypeValidator.validateType(type, String);
        this.type = type;
        TypeValidator.validateType(name, String);
        TypeValidator.validateType(size, Size3D);
        TypeValidator.validateType(position, Coordinates3D);
        TypeValidator.validateType(rotation, Rotation);
        TypeValidator.validateType(scale, Number);
        TypeValidator.validateType(state, Object);
        this.id = UUID.new.generate();
        this.name = name;
        this.size = size;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.state = state;
        this.changed = false;
        this.hook = new EntityHook(this.id);
        this.collisions = [];
    }

    getCollision(oldCollision = null) {
        const collision = new InvertedPositionCollision(
            this.position.x - this.size.width / 2,
            this.position.x + this.size.width / 2,
            this.position.y - this.size.height / 2,
            this.position.y + this.size.height / 2,
            this.position.z - this.size.depth / 2,
            this.position.z + this.size.depth / 2
        );
        if (oldCollision) {
            collision.priority = oldCollision.priority;
            collision.nonPhysical = oldCollision.nonPhysical;
            collision.onlyXY = oldCollision.onlyXY;
        }
        collision.linkEntity(this);
        return collision;
    }

    render() {
        if (this.hook.onRender) {
            this.hook.onRender(this);
        }
    }

    /**
     * Updates the node with the current values.
     * @param node {HTMLElement} The node to update.
     */
    update(node) {
        if (this.hook.onUpdate) {
            this.hook.onUpdate(this);
        }
        this.updatePosition();
        const windowScale = AspectRatioHelper.getWindowScale();
        const x = this.position.x * windowScale.x;
        const y = this.position.y * windowScale.y * windowScale.ar;
        node.style.transform = `translate(${x}px, ${y}px) scale(${this.scale}) rotate(${this.rotation.zDegrees}deg) translate(-50%, -50%)`;
        node.style.width = windowScale.x * this.size.width + "px";
        node.style.height = windowScale.y * windowScale.ar * this.size.height + "px";
    }

    setSpeed(speed) {
        this.state.speed = speed;
    }

    sortCollisions() {
        this.collisions.sort((a, b) => b.priority - a.priority);
    }

    updatePosition() {
        const newX = this.position.x + this.position.dX * this.state.speed;
        const newY = this.position.y + this.position.dY * this.state.speed;
        const newZ = this.position.z + this.position.dZ * this.state.speed;
        this.position.setX(newX);
        this.position.setY(newY);
        this.position.setZ(newZ);
        if (this.collisions.length > 0) {
            this.checkCollisions();
        }
        if ((this.position.dX !== 0 || this.position.dY !== 0 || this.position.dX !== 0) && this.hook.onMove) {
            this.hook.onMove(this);
            this.updateCollisionsForOtherEntities();
        }
    }

    /**
     * Checks if the entity collides with other entities and calls the onCollide hook if defined.
     */
    checkCollisions() {
        this.sortCollisions();
        for (let collision of this.collisions) {
            if (collision.entity !== null) {
                collision = collision.entity.getCollision(collision);
            }
            let success, runs = 0;
            do {
                runs++;
                success = collision.success(this);
                if (!collision.nonPhysical) {
                    this.tryToReverseMovement(success);
                }
                if (!success.all && collision.entity !== this && this.hook.onCollide) {
                    this.hook.onCollide(this, collision.entity, collision, success);
                }
                if (runs > 10) {
                    this.position.dX = 0;
                    this.position.dY = 0;
                    this.position.dZ = 0;
                    break;
                }
            } while (!success.all && !collision.nonPhysical);
        }
    }

    /**
     * Tries to reverse the movement of the entity by the distance to the closest border of the colliding entity.
     * @param success {Object} The success object of the collision.
     * @param success.closestBordersDistance {Object} The closest borders distance object.
     * @param success.closestBordersDistance.border {String} The border that is closest to the entity.
     * @param success.closestBordersDistance.distance {Number} The distance to the closest border.
     * @param success.x {Boolean} Whether the x border is colliding.
     * @param success.y {Boolean} Whether the y border is colliding.
     * @param success.z {Boolean} Whether the z border is colliding.
     * @param success.all {Boolean} Whether the collision counts as hit.
     */
    tryToReverseMovement(success) {
        switch (success.closestBordersDistance.border) {
            case "x":
                if (!success.x && !success.all) {
                    this.position.setX(this.position.x - (success.closestBordersDistance.distance * Math.sign(this.position.dX)));
                }
                break;
            case "y":
                if (!success.y && !success.all) {
                    this.position.setY(this.position.y - (success.closestBordersDistance.distance * Math.sign(this.position.dY)));
                }
                break;
            case "z":
                if (!success.z && !success.all) {
                    this.position.setZ(this.position.z - (success.closestBordersDistance.distance * Math.sign(this.position.dZ)));
                }
        }
    }

    updateCollisionsForOtherEntities() {
        for (let layer of LayerManager.getLayersByType(LayerTypes.entity)) {
            const entities = layer.getEntities();
            for (const entity of entities) {
                if (entity.collisions.length > 0) {
                    for (let collision of entity.collisions) {
                        if (collision.entity === this) {
                            collision = this.getCollision(collision);
                        }
                    }
                }
            }
        }
    }

    addCollision(collision) {
        this.collisions.push(collision);
    }

    addCollisions() {
        for (let collision of arguments) {
            this.addCollision(collision);
        }
    }

    removeCollision(collision) {
        const index = this.collisions.indexOf(collision);
        if (index > -1) {
            this.collisions.splice(index, 1);
        }
    }

    removeCollisions() {
        for (let collision of arguments) {
            this.removeCollision(collision);
        }
    }

    removeAllCollisions() {
        for (let collision of this.collisions) {
            this.removeCollision(collision);
        }
    }
}