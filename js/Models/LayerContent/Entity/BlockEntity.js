import {Entity} from "./Entity.js";
import {Size3D} from "../../Size3D.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {EntityLayerElements} from "../../../JensElements/LayerContentElements/EntityLayerElements.js";
import {ElementApi} from "../../../static/ElementFactory.js";
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
        return ElementApi.create(EntityLayerElements.blockEntity, this);
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
}