import {TypeValidator} from "../../../Meta/TypeValidator.js";

export class Texture {
    constructor(color = "#000", image = null, borderColor = "transparent") {
        if (image !== null) {
            TypeValidator.validateType(image, Image);
        }
        this.color = color;
        this.image = image;
        this.borderColor = borderColor;
    }
}