import {TypeValidator} from "../../Meta/TypeValidator.js";

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
        TypeValidator.validateType(x, Number);
        this.x = x;
    }

    setY(y) {
        TypeValidator.validateType(y, Number);
        this.y = y;
    }

    setZ(z) {
        TypeValidator.validateType(z, Number);
        this.z = z;
    }

    setDX(dX) {
        TypeValidator.validateType(dX, Number);
        this.dX = dX;
    }

    setDY(dY) {
        TypeValidator.validateType(dY, Number);
        this.dY = dY;
    }

    setDZ(dZ) {
        TypeValidator.validateType(dZ, Number);
        this.dZ = dZ;
    }
}