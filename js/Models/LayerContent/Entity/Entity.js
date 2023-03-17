import {UUID} from "../../../Helpers/UUID.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {Coordinates3D} from "../../Coordinates3D.js";
import {Rotation} from "../../Rotation.js";

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
    }

    render() {
    }
}