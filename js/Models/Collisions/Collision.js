export class Collision {
    constructor() {
        this.entity = null;
        this.priority = 1;
        this.nonPhysical = false;
    }

    lowPriority() {
        this.priority = 0;
        return this;
    }

    getClosestBordersDistance(entity, xSuccess, ySuccess, zSuccess) {
        let xDist, yDist, zDist;
        if (!xSuccess) {
            xDist = Math.min(Math.abs(entity.position.x + entity.size.width - this.xMin), Math.abs(entity.position.x - entity.size.width - this.xMax));
        } else {
            xDist = Infinity;
        }
        if (!ySuccess) {
            yDist = Math.min(Math.abs(entity.position.y + entity.size.height - this.yMin), Math.abs(entity.position.y - entity.size.height - this.yMax));
        } else {
            yDist = Infinity;
        }
        if (!zSuccess) {
            zDist = Math.min(Math.abs(entity.position.z + entity.size.depth - this.zMin), Math.abs(entity.position.z - entity.size.depth - this.zMax));
        } else {
            zDist = Infinity;
        }
        const minDist = Math.min(xDist, yDist, zDist);
        if (minDist === xDist) {
            return { border: "x", distance: xDist + (entity.size.width / 2) };
        } else if (minDist === yDist) {
            return { border: "y", distance: yDist + (entity.size.height / 2) };
        } else if (minDist === zDist) {
            return { border: "z", distance: zDist + (entity.size.depth / 2) };
        } else {
            return { border: "none", distance: 0 };
        }
    }

    linkEntity(entity) {
        this.entity = entity;
    }

    isNonPhysical() {
        this.nonPhysical = true;
        return this;
    }
}