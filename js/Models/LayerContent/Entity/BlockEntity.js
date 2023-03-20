import {Entity} from "./Entity.js";
import {Size3D} from "../../Size3D.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {EntityLayerElements} from "../../../JensElements/LayerContentElements/EntityLayerElements.js";
import {ElementFactory} from "../../../static/ElementFactory.js";
import {Texture} from "../../Texture.js";

export class BlockEntity extends Entity {
    constructor(name, size = new Size3D(), texture = new Texture(), position, rotation, scale, state) {
        super(name, position, rotation, scale, state);
        TypeValidator.validateType(size, Size3D);
        TypeValidator.validateType(texture, Texture);
        this.size = size;
        this.texture = texture;
    }

    render() {
        super.render();
        const existingElement = document.getElementById(this.id);
        if (existingElement) {
            this.update(existingElement);
            return existingElement;
        }
        const newElement = ElementFactory.create(EntityLayerElements.blockEntity, this);
        this.update(newElement);
        return newElement;
    }

    getSize() {
        return this.size;
    }

    setSize(size) {
        TypeValidator.validateType(size, Size3D);
        this.size = size;
    }

    getTexture() {
        return this.texture;
    }

    setTexture(texture) {
        TypeValidator.validateType(texture, Texture);
        this.texture = texture;
    }

    update(node) {
        super.update(node);
    }
}