import {DataManager} from "../static/DataManager.js";
import {DataEntries} from "../Enums/DataEntries.js";

export class AspectRatioHelper {
    static getAspectRatio(width, height) {
        return width / height;
    }

    static getAspectRatioFromImage(image) {
        return image.width / image.height;
    }

    static async getAspectRatioFromImageSource(source) {
        const res = await fetch(source);
        if (res.ok) {
            const blob = await res.blob();
            const image = await this.getImageFromBlob(blob);
            return this.getAspectRatioFromImage(image);
        } else {
            throw new Error("Could not fetch image");
        }
    }

    static getHeightFromWidth(width, aspectRatio) {
        return width / aspectRatio;
    }

    static getWidthFromHeight(height, aspectRatio) {
        return height * aspectRatio;
    }

    static getWidthFromHeightOrWidthAsMin(width, height, aspectRatio) {
        const widthFromHeight = this.getWidthFromHeight(height, aspectRatio);
        return widthFromHeight < width ? widthFromHeight : width;
    }

    static getHeightFromWidthOrHeightAsMin(width, height, aspectRatio) {
        const heightFromWidth = this.getHeightFromWidth(width, aspectRatio);
        return heightFromWidth < height ? heightFromWidth : height;
    }

    static async getImageFromBlob(blob) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                resolve(image);
            };
            image.onerror = () => {
                reject();
            };
            image.src = URL.createObjectURL(blob);
        });
    }

    static getWindowScale() {
        if (DataManager.getKey(DataEntries.ASPECT_RATIO) === undefined) {
            const smallestSide = Math.min(window.innerWidth, window.innerHeight);
            return {
                x: smallestSide / 100,
                y: smallestSide / 100
            }
        } else {
            const aspectRatio = DataManager.getKey(DataEntries.ASPECT_RATIO);
            return {
                x: this.getWidthFromHeightOrWidthAsMin(window.innerWidth, window.innerHeight, aspectRatio) / 100,
                y: this.getHeightFromWidthOrHeightAsMin(window.innerWidth, window.innerHeight, aspectRatio) / 100,
                ar: aspectRatio
            }
        }
    }
}