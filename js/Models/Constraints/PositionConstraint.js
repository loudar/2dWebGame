export class PositionConstraint {
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
        const xSuccess = x >= this.xMin && x <= this.xMax;
        const ySuccess = y >= this.yMin && y <= this.yMax;
        const zSuccess = z >= this.zMin && z <= this.zMax;
        return {
            x: xSuccess,
            y: ySuccess,
            z: zSuccess,
        }
    }
}