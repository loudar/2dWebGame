import {TypeValidator} from "../Meta/TypeValidator.js";

export class Coordinates3D {
    constructor(x = 0, y = 0, z = 0) {
        TypeValidator.validateType(x, Number);
        TypeValidator.validateType(y, Number);
        TypeValidator.validateType(z, Number);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setZ(z) {
        this.z = z;
    }
}