import {Coordinates3D} from "../Properties/Coordinates3D.js";

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
            return { border: "x", distance: xDist + 0.1 };
        } else if (minDist === yDist) {
            return { border: "y", distance: yDist + 0.1 };
        } else if (minDist === zDist) {
            return { border: "z", distance: zDist + 0.1 };
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

    getCoordinatesForCorner(corner) {
        switch (corner) {
            case "topLeftFront":
                return new Coordinates3D(this.xMin, this.yMax, this.zMax);
            case "topLeftBack":
                return new Coordinates3D(this.xMin, this.yMax, this.zMin);
            case "topRightFront":
                return new Coordinates3D(this.xMax, this.yMax, this.zMax);
            case "topRightBack":
                return new Coordinates3D(this.xMax, this.yMax, this.zMin);
            case "bottomLeftFront":
                return new Coordinates3D(this.xMin, this.yMin, this.zMax);
            case "bottomLeftBack":
                return new Coordinates3D(this.xMin, this.yMin, this.zMin);
            case "bottomRightFront":
                return new Coordinates3D(this.xMax, this.yMin, this.zMax);
            case "bottomRightBack":
                return new Coordinates3D(this.xMax, this.yMin, this.zMin);
        }
    }

    getCoordinatesForCorner2D(corner) {
        switch (corner) {
            case "topLeft":
                return new Coordinates3D(this.xMin, this.yMax, 0);
            case "topRight":
                return new Coordinates3D(this.xMax, this.yMax, 0);
            case "bottomLeft":
                return new Coordinates3D(this.xMin, this.yMin, 0);
            case "bottomRight":
                return new Coordinates3D(this.xMax, this.yMin, 0);
        }
    }

    getCornerCoordinates() {
        return {
            topLeftFront: this.getCoordinatesForCorner("topLeftFront"),
            topLeftBack: this.getCoordinatesForCorner("topLeftBack"),
            topRightFront: this.getCoordinatesForCorner("topRightFront"),
            topRightBack: this.getCoordinatesForCorner("topRightBack"),
            bottomLeftFront: this.getCoordinatesForCorner("bottomLeftFront"),
            bottomLeftBack: this.getCoordinatesForCorner("bottomLeftBack"),
            bottomRightFront: this.getCoordinatesForCorner("bottomRightFront"),
            bottomRightBack: this.getCoordinatesForCorner("bottomRightBack"),
        }
    }

    getCornerCoordinates2D() {
        return {
            topLeft: this.getCoordinatesForCorner2D("topLeft"),
            topRight: this.getCoordinatesForCorner2D("topRight"),
            bottomLeft: this.getCoordinatesForCorner2D("bottomLeft"),
            bottomRight: this.getCoordinatesForCorner2D("bottomRight"),
        }
    }
}