import {EntityTypes} from "../../../Enums/EntityTypes.js";
import {Texture} from "../../Properties/Textures/Texture.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {Entity} from "./Entity.js";
import {ElementFactory} from "../../../static/ElementFactory.js";
import {EntityLayerElements} from "../../../JensElements/LayerContentElements/EntityLayerElements.js";
import {Rotation} from "../../Properties/Rotation.js";
import {DefaultsHelper} from "../../../Helpers/DefaultsHelper.js";

export class BulletEntity extends Entity {
    constructor(name, targetPosition, texture = new Texture(), size, position, rotation, scale, state) {
        state = DefaultsHelper.overWriteKeys({ speed: .7, following: false }, state);
        super(EntityTypes.bullet, name, size, position, rotation, scale, state);
        TypeValidator.validateType(texture, Texture);
        this.texture = texture;
        this.initialTargetPosition = targetPosition;
        if (!this.state.following) {
            this.initialDelta = this.getLinearDirectionToTarget(this.initialTargetPosition, this.position);
        }
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
        if (!this.state.following) {
            this.setDirection(this.initialDelta);
        } else {
            this.setDirection(this.getLinearDirectionToTarget(this.initialTargetPosition, this.position));
        }
        this.rotation = this.getRotationFromDirection({x: this.position.dX, y: this.position.dY});
        super.update(node);
        node.style.backgroundColor = this.texture.image !== null ? "transparent" : this.texture.color;
        node.style.borderColor = this.texture.borderColor;
    }

    getRotationFromDirection(direction) {
        const angle = Math.atan2(direction.y, direction.x);
        return new Rotation(angle * 180 / Math.PI, 0, 0);
    }
}