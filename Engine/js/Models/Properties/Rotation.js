import {TypeValidator} from "../../Meta/TypeValidator.js";

export class Rotation {
    constructor(zDegrees = 0, yDegrees = 0, xDegrees = 0) {
        TypeValidator.validateType(zDegrees, Number);
        TypeValidator.validateType(yDegrees, Number);
        TypeValidator.validateType(xDegrees, Number);
        this.zDegrees = zDegrees;
        this.yDegrees = yDegrees;
        this.xDegrees = xDegrees;
    }

    setZDegrees(zDegrees) {
        this.zDegrees = zDegrees;
    }

    setYDegrees(yDegrees) {
        this.yDegrees = yDegrees;
    }

    setXDegrees(xDegrees) {
        this.xDegrees = xDegrees;
    }
}