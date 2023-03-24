import {Entity} from "./Entity.js";
import {CharacterTexture} from "../../Properties/Textures/CharacterTexture.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {ElementFactory} from "../../../static/ElementFactory.js";
import {EntityLayerElements} from "../../../JensElements/LayerContentElements/EntityLayerElements.js";
import {CharacterOptions} from "../../Options/CharacterOptions.js";
import {CharacterKeys} from "../../Keys/CharacterKeys.js";
import {EntityTypes} from "../../../Enums/EntityTypes.js";

export class CharacterEntity extends Entity {
    constructor(name, texture = new CharacterTexture(), size, position, rotation, scale, state) {
        super(EntityTypes.character, name, size, position, rotation, scale, state);
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
        const newElement = ElementFactory.create(EntityLayerElements.characterEntity, this);
        this.update(newElement);
        return newElement;
    }

    update(node) {
        this.changed = false;
        this.updatePositionByKeys();
        super.update(node);
        node.style.backgroundColor = this.texture.color;
        node.style.backgroundImage = this.texture.image ? `url(${this.texture.image})` : "none";
        node.style.borderColor = this.texture.borderColor;
    }

    /**
     * Only call this method once. Otherwise, call removeAsPlayer() first.
     * @param characterOptions {CharacterOptions} Options for the player.
     */
    setAsPlayer(characterOptions = new CharacterOptions()) {
        this.options = characterOptions;
        this.isPlayer = true;
        window.addEventListener("keydown", this.keydownHandler.bind(this));
        window.addEventListener("keyup", this.keyupHandler.bind(this));
    }

    keydownHandler(event) {
        switch (event.key) {
            case "w":
                this.keys.up = true;
                break;
            case "a":
                this.keys.left = true;
                break;
            case "s":
                this.keys.down = true;
                break;
            case "d":
                this.keys.right = true;
                break;
        }
        this.updatePositionByKeys();
    }

    keyupHandler(event) {
        switch (event.key) {
            case "w":
                this.keys.up = false;
                break;
            case "a":
                this.keys.left = false;
                break;
            case "s":
                this.keys.down = false;
                break;
            case "d":
                this.keys.right = false;
                break;
        }
        this.updatePositionByKeys();
    }

    updatePositionByKeys() {
        this.position.dX = this.keys.left ? -1 : this.keys.right ? 1 : 0;
        this.position.dY = this.keys.up ? -1 : this.keys.down ? 1 : 0;
        this.position.dZ = 0;
        if (this.position.dX !== 0 || this.position.dY !== 0 || this.position.dZ !== 0) {
            this.changed = true;
        }
    }

    removeAsPlayer() {
        this.isPlayer = false;
        window.removeEventListener("keydown", this.keydownHandler.bind(this));
        window.removeEventListener("keyup", this.keyupHandler.bind(this));
    }
}