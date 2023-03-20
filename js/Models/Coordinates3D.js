import {TypeValidator} from "../Meta/TypeValidator.js";

export class Coordinates3D {
    constructor(x = 0, y = 0, z = 0, dX = 0, dY = 0, dZ = 0) {
        TypeValidator.validateType(x, Number);
        TypeValidator.validateType(y, Number);
        TypeValidator.validateType(z, Number);
        TypeValidator.validateType(dX, Number);
        TypeValidator.validateType(dY, Number);
        TypeValidator.validateType(dZ, Number);
        this.x = x;
        this.y = y;
        this.z = z;
        this.dX = 0;
        this.dY = 0;
        this.dZ = 0;
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

    setDX(dX) {
        this.dX = dX;
    }

    setDY(dY) {
        this.dY = dY;
    }

    setDZ(dZ) {
        this.dZ = dZ;
    }
}