import {UUID} from "../../../Helpers/UUID.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {Coordinates3D} from "../../Coordinates3D.js";
import {Rotation} from "../../Rotation.js";
import {AspectRatioHelper} from "../../../Helpers/AspectRatioHelper.js";
import {EntityHook} from "../Ui/EntityHook.js";
import {Size3D} from "../../Size3D.js";

export class Entity {
    constructor(name, size = new Size3D(), position = new Coordinates3D(), rotation = new Rotation(), scale = 1, state = {}) {
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
    }

    updatePosition() {
        const newX = this.position.x + this.position.dX;
        const newY = this.position.y + this.position.dY;
        const newZ = this.position.z + this.position.dZ;
        this.position.setX(newX);
        this.position.setY(newY);
        this.position.setZ(newZ);
        if (this.constraints.length > 0) {
            for (const constraint of this.constraints) {
                const success = constraint.success(this);
                if (!success.x) {
                    this.position.setX(newX - this.position.dX);
                }
                if (!success.y) {
                    this.position.setY(newY - this.position.dY);
                }
            }
        }
        if ((this.position.dX !== 0 || this.position.dY !== 0 || this.position.dX !== 0) && this.hook.onMove) {
            this.hook.onMove(this);
        }
    }

    addConstraint(constraint) {
        this.constraints.push(constraint);
    }
}