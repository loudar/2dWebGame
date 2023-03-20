import {UUID} from "../../../Helpers/UUID.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {Coordinates3D} from "../../Coordinates3D.js";
import {Rotation} from "../../Rotation.js";
import {AspectRatioHelper} from "../../../Helpers/AspectRatioHelper.js";
import {EntityHook} from "../Ui/EntityHook.js";

export class Entity {
    constructor(name, position = new Coordinates3D(), rotation = new Rotation(), scale = 1, state = {}) {
        TypeValidator.validateType(name, String);
        TypeValidator.validateType(position, Coordinates3D);
        TypeValidator.validateType(rotation, Rotation);
        TypeValidator.validateType(scale, Number);
        TypeValidator.validateType(state, Object);
        this.id = UUID.new.generate();
        this.name = name;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.state = state;
        this.changed = false;
        this.hook = new EntityHook(this.id);
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
        const scale = AspectRatioHelper.getWindowScale();
        const x = this.position.x * scale.x;
        const y = this.position.y * scale.y * scale.ar;
        node.style.transform = `translate(${x}px, ${y}px) scale(${this.scale}) rotate(${this.rotation.zDegrees}deg) translate(-50%, -50%)`;
    }

    updatePosition() {
        if (this.position.x + this.position.dX !== this.position.x
            || this.position.y + this.position.dY !== this.position.y
            || this.position.z + this.position.dZ !== this.position.z
        && this.hook.onMove) {
            this.hook.onMove(this);
        }
        this.position.setX(this.position.x + this.position.dX);
        this.position.setY(this.position.y + this.position.dY);
        this.position.setZ(this.position.z + this.position.dZ);
    }
}