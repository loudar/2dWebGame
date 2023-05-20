import {Entity} from "./Entity.js";
import {Size3D} from "../../Properties/Size3D.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {EntityLayerElements} from "../../../JensElements/LayerContentElements/EntityLayerElements.js";
import {ElementFactory} from "../../../static/ElementFactory.js";
import {Texture} from "../../Properties/Textures/Texture.js";
import {EntityTypes} from "../../../Enums/EntityTypes.js";

export class BlockEntity extends Entity {
    constructor(name, texture = new Texture(), size, position, rotation, scale, state) {
        super(EntityTypes.block, name, size, position, rotation, scale, state);
        TypeValidator.validateType(texture, Texture);
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
        node.style.backgroundColor = this.texture.image !== null ? "transparent" : this.texture.color;
        node.style.borderColor = this.texture.borderColor;
    }
}