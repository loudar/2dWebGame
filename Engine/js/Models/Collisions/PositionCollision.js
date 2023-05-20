import {Collision} from "./Collision.js";

export class PositionCollision extends Collision {
    constructor(xMin, xMax, yMin, yMax, zMin, zMax) {
        super();
        this.xMin = xMin || 0;
        this.xMax = xMax || 0;
        this.yMin = yMin || 0;
        this.yMax = yMax || 0;
        this.zMin = zMin || 0;
        this.zMax = zMax || 0;
        this.width = Math.abs(this.xMax - this.xMin);
        this.height = Math.abs(this.yMax - this.yMin);
        this.onlyXY = false;
    }

    ignoreZ() {
        this.onlyXY = true;
        return this;
    }

    success(entity) {
        const x = entity.position.x;
        const y = entity.position.y;
        const z = entity.position.z;
        const xSuccess = x + entity.size.width >= this.xMin && x - entity.size.width <= this.xMax;
        const ySuccess = y + entity.size.height >= this.yMin && y - entity.size.height <= this.yMax;
        const zSuccess = this.onlyXY || (z + entity.size.depth >= this.zMin && z - entity.size.depth <= this.zMax);
        return {
            x: xSuccess,
            y: ySuccess,
            z: zSuccess,
            all: xSuccess && ySuccess && zSuccess,
            closestBordersDistance: super.getClosestBordersDistance(entity, xSuccess, ySuccess, zSuccess)
        }
    }
}