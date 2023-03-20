import {Entity} from "./Entity.js";
import {Size3D} from "../../Size3D.js";
import {CharacterTexture} from "../../CharacterTexture.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {ElementFactory} from "../../../static/ElementFactory.js";
import {EntityLayerElements} from "../../../JensElements/LayerContentElements/EntityLayerElements.js";
import {AspectRatioHelper} from "../../../Helpers/AspectRatioHelper.js";
import {CharacterOptions} from "../../CharacterOptions.js";

export class CharacterEntity extends Entity {
    constructor(name, size = new Size3D(), texture = new CharacterTexture(), position, rotation, scale, state) {
        super(name, position, rotation, scale, state);
        TypeValidator.validateType(size, Size3D);
        TypeValidator.validateType(texture, CharacterTexture);
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
        const newElement = ElementFactory.create(EntityLayerElements.characterEntity, this);
        this.update(newElement);
        return newElement;
    }

    update(node) {
        super.update(node);
        const windowScale = AspectRatioHelper.getWindowScale();
        node.style.width = windowScale.x * this.size.width + "px";
        node.style.height = windowScale.y * windowScale.ar * this.size.height + "px";
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
        window.addEventListener("keydown", this.keydownHandler.bind(this));
        window.addEventListener("keyup", this.keyupHandler.bind(this));
    }

    keydownHandler(event) {
        switch (event.key) {
            case "w":
                if (this.position.dY >= -1) {
                    this.changed = true;
                    this.position.dY += -1;
                }
                break;
            case "a":
                if (this.position.dX >= -1) {
                    this.changed = true;
                    this.position.dX += -1;
                }
                break;
            case "s":
                if (this.position.dY < 1) {
                    this.changed = true;
                    this.position.dY += 1;
                }
                break;
            case "d":
                if (this.position.dX < 1) {
                    this.changed = true;
                    this.position.dX += 1;
                }
                break;
        }
    }

    keyupHandler(event) {
        switch (event.key) {
            case "w":
                this.changed = true;
                this.position.dY += 1;
                break;
            case "a":
                this.changed = true;
                this.position.dX += 1;
                break;
            case "s":
                this.changed = true;
                this.position.dY += -1;
                break;
            case "d":
                this.changed = true;
                this.position.dX += -1;
                break;
        }
    }

    removeAsPlayer() {
        window.removeEventListener("keydown", this.keydownHandler.bind(this));
        window.removeEventListener("keyup", this.keyupHandler.bind(this));
    }
}