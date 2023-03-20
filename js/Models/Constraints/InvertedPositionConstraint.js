export class InvertedPositionConstraint {
    constructor(xMin, xMax, yMin, yMax, zMin, zMax) {
        this.xMin = xMin || 0;
        this.xMax = xMax || 0;
        this.yMin = yMin || 0;
        this.yMax = yMax || 0;
        this.zMin = zMin || 0;
        this.zMax = zMax || 0;
    }

    success(entity) {
        const x = entity.position.x;
        const y = entity.position.y;
        const z = entity.position.z;
        const xSuccess = x + (entity.size.width) <= this.xMin || x - (entity.size.width) >= this.xMax;
        const ySuccess = y + (entity.size.height) <= this.yMin || y - (entity.size.height) >= this.yMax;
        const zSuccess = z + (entity.size.depth) <= this.zMin || z - (entity.size.depth) >= this.zMax;
        return {
            x: xSuccess !== ySuccess || xSuccess,
            y: ySuccess !== xSuccess || ySuccess,
            z: zSuccess,
        }
    }
}