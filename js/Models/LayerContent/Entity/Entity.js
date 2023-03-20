import {UUID} from "../../../Helpers/UUID.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {Coordinates3D} from "../../Coordinates3D.js";
import {Rotation} from "../../Rotation.js";
import {AspectRatioHelper} from "../../../Helpers/AspectRatioHelper.js";

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
    }

    render() {
    }

    update(node) {
        this.updatePosition();
        const scale = AspectRatioHelper.getWindowScale();
        const x = this.position.x * scale.x;
        const y = this.position.y * scale.y;
        node.style.transform = `translate(${x}px, ${y}px) scale(${this.scale}) rotate(${this.rotation.zDegrees}deg) translate(-50%, -50%)`;
    }

    updatePosition() {
        this.position.setX(this.position.x + this.position.dX);
        this.position.setY(this.position.y + this.position.dY);
        this.position.setZ(this.position.z + this.position.dZ);
    }
}