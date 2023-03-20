import {Entity} from "./Entity.js";
import {Size3D} from "../../Size3D.js";
import {CharacterTexture} from "../../CharacterTexture.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {ElementApi} from "../../../static/ElementFactory.js";
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
        this.slidePosition = false;
    }

    render() {
        const existingElement = document.getElementById(this.id);
        if (existingElement) {
            this.update(existingElement);
            return existingElement;
        }
        const newElement = ElementApi.create(EntityLayerElements.characterEntity, this);
        this.update(newElement);
        return newElement;
    }

    update(node) {
        super.update(node);
        node.style.width = AspectRatioHelper.getWindowScale().x * this.size.width + "px";
        node.style.height = AspectRatioHelper.getWindowScale().y * this.size.height + "px";
        node.style.backgroundColor = this.texture.color;
        node.style.backgroundImage = this.texture.image ? `url(${this.texture.image})` : "none";
        node.style.borderColor = this.texture.borderColor;
    }

    setAsPlayer(slide = false, playerOptions = new CharacterOptions()) {
        this.slidePosition = slide;
        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "w":
                    if (this.position.dY !== -1) {
                        this.changed = true;
                        this.position.dY = -1;
                    }
                    break;
                case "a":
                    if (this.position.dX !== -1) {
                        this.changed = true;
                        this.position.dX = -1;
                    }
                    break;
                case "s":
                    if (this.position.dY !== 1) {
                        this.changed = true;
                        this.position.dY = 1;
                    }
                    break;
                case "d":
                    if (this.position.dX !== 1) {
                        this.changed = true;
                        this.position.dX = 1;
                    }
                    break;
            }
            if (this.changed && this.onVelocityChange) {
                this.onVelocityChange();
            }
        });
        window.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "w":
                    if (this.position.dY !== 0) {
                        this.changed = true;
                        this.position.dY = 0;
                    }
                    break;
                case "a":
                    if (this.position.dX !== 0) {
                        this.changed = true;
                        this.position.dX = 0;
                    }
                    break;
                case "s":
                    if (this.position.dY !== 0) {
                        this.changed = true;
                        this.position.dY = 0;
                    }
                    break;
                case "d":
                    if (this.position.dX !== 0) {
                        this.changed = true;
                        this.position.dX = 0;
                    }
                    break;
            }
            if (this.changed && this.onVelocityChange) {
                this.onVelocityChange();
            }
        });
    }
}