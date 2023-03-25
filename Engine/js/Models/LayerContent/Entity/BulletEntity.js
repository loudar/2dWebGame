import {EntityTypes} from "../../../Enums/EntityTypes.js";
import {Texture} from "../../Properties/Textures/Texture.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {Entity} from "./Entity.js";
import {ElementFactory} from "../../../static/ElementFactory.js";
import {EntityLayerElements} from "../../../JensElements/LayerContentElements/EntityLayerElements.js";
import {Rotation} from "../../Properties/Rotation.js";

export class BulletEntity extends Entity {
    constructor(name, target, texture = new Texture(), size, position, rotation, scale, state = { speed: .7 }) {
        super(EntityTypes.bullet, name, size, position, rotation, scale, state);
        TypeValidator.validateType(texture, Texture);
        this.texture = texture;
        this.initialTargetPosition = JSON.parse(JSON.stringify(target.position));
        this.updateOnTicks = true;
    }

    render() {
        super.render();
        const existingElement = document.getElementById(this.id);
        if (existingElement) {
            this.update(existingElement);
            return existingElement;
        }
        const newElement = ElementFactory.create(EntityLayerElements.bulletEntity, this);
        this.update(newElement);
        return newElement;
    }

    update(node) {
        super.update(node);
        this.setDirection(this.getLinearDirectionToTarget(this.initialTargetPosition, this.position));
        this.rotation = this.getRotationFromDirection({x: this.position.dX, y: this.position.dY});
        super.update(node);
        node.style.backgroundColor = this.texture.color;
        node.style.backgroundImage = this.texture.image ? `url(${this.texture.image})` : "none";
        node.style.borderColor = this.texture.borderColor;
    }

    getRotationFromDirection(direction) {
        const angle = Math.atan2(direction.y, direction.x);
        return new Rotation(angle * 180 / Math.PI, 0, 0);
    }
}