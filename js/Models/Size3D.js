import {TypeValidator} from "../Meta/TypeValidator.js";

export class Size3D {
    constructor(width = 0, height = 0, depth = 0) {
        TypeValidator.validateType(width, Number);
        TypeValidator.validateType(height, Number);
        TypeValidator.validateType(depth, Number);
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

    setDepth(depth) {
        this.depth = depth;
    }
}