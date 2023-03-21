import {UUID} from "../../../Helpers/UUID.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {Coordinates3D} from "../../Coordinates3D.js";
import {Rotation} from "../../Rotation.js";
import {AspectRatioHelper} from "../../../Helpers/AspectRatioHelper.js";
import {EntityHook} from "../Ui/EntityHook.js";
import {Size3D} from "../../Size3D.js";

export class Entity {
    constructor(name, size = new Size3D(), position = new Coordinates3D(), rotation = new Rotation(), scale = 1, state = {speed: 1}) {
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
        this.constraints = [];
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

    updatePosition() {
        const newX = this.position.x + this.position.dX * this.state.speed;
        const newY = this.position.y + this.position.dY * this.state.speed;
        const newZ = this.position.z + this.position.dZ * this.state.speed;
        this.position.setX(newX);
        this.position.setY(newY);
        this.position.setZ(newZ);
        if (this.constraints.length > 0) {
            for (const constraint of this.constraints) {
                let success;
                do {
                    success = constraint.success(this);
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
                } while (!success.all);
            }
        }
        if ((this.position.dX !== 0 || this.position.dY !== 0 || this.position.dX !== 0) && this.hook.onMove) {
            this.hook.onMove(this);
        }
    }

    addConstraint(constraint) {
        this.constraints.push(constraint);
    }

    addConstraints() {
        for (let constraint of arguments) {
            this.addConstraint(constraint);
        }
    }
}