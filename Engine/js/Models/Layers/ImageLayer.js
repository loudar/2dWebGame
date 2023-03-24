import {Layer} from "./Layer.js";
import {ElementFactory} from "../../static/ElementFactory.js";
import {ImageLayerElements} from "../../JensElements/LayerContentElements/ImageLayerElements.js";
import {TypeValidator} from "../../Meta/TypeValidator.js";
import {LayerTypes} from "../../Enums/LayerTypes.js";
import {Image} from "../LayerContent/Image/Image.js";

export class ImageLayer extends Layer {
    constructor(name, image) {
        TypeValidator.validateType(image, Image);
        super(LayerTypes.image, name);
        this.image = image;
    }

    setBackgroundColor(color) {
        this.image.style.backgroundColor = color;
    }

    getImage() {
        return this.image;
    }

    setImage(image) {
        this.image = image;
    }

    renderContent(layerItem) {
        layerItem.innerHTML = "";
        const image = ElementFactory.create(ImageLayerElements.image, this.image);
        layerItem.appendChild(image);
    }
}