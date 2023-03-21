import {Entity} from "./Entity.js";
import {CharacterTexture} from "../../CharacterTexture";
import {TypeValidator} from "../../../Meta/TypeValidator";
import {CharacterKeys} from "../../Keys/CharacterKeys";
import {ElementFactory} from "../../../static/ElementFactory";
import {EntityLayerElements} from "../../../JensElements/LayerContentElements/EntityLayerElements";
import {EntityManager} from "../../../static/EntityManager.js";

export class EnemyEntity extends Entity {
    constructor(name, texture = new CharacterTexture(), size, position, rotation, scale, state) {
        super(name, size, position, rotation, scale, state);
        TypeValidator.validateType(texture, CharacterTexture);
        this.texture = texture;
        this.keys = new CharacterKeys();
    }

    render() {
        super.render();
        const existingElement = document.getElementById(this.id);
        if (existingElement) {
            this.update(existingElement);
            return existingElement;
        }
        const newElement = ElementFactory.create(EntityLayerElements.enemyEntity, this);
        this.update(newElement);
        return newElement;
    }

    update(node) {
        this.changed = false;
        this.setDirection(EntityManager.getDirectionToPlayer(this));
        super.update(node);
        node.style.backgroundColor = this.texture.color;
        node.style.backgroundImage = this.texture.image ? `url(${this.texture.image})` : "none";
        node.style.borderColor = this.texture.borderColor;
    }

    setDirection(direction) {
        this.position.dX = direction.x;
        this.position.dY = direction.y;
        this.position.dZ = direction.z;
        if (this.position.dX !== 0 || this.position.dY !== 0 || this.position.dZ !== 0) {
            this.changed = true;
        }
    }
}