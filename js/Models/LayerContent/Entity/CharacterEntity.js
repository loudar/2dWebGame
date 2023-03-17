import {Entity} from "./Entity.js";
import {Size3D} from "../../Size3D.js";
import {CharacterTexture} from "../../CharacterTexture.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {ElementApi} from "../../../static/ElementFactory.js";
import {EntityLayerElements} from "../../../JensElements/LayerContentElements/EntityLayerElements.js";
import {UpdateManager} from "../../../static/UpdateManager.js";

export class CharacterEntity extends Entity {
    constructor(name, size = new Size3D(), texture = new CharacterTexture(), position, rotation, scale, state) {
        super(name, position, rotation, scale, state);
        TypeValidator.validateType(size, Size3D);
        TypeValidator.validateType(texture, CharacterTexture);
        this.size = size;
        this.texture = texture;
    }

    render() {
        return ElementApi.create(EntityLayerElements.characterEntity, this);
    }

    setAsPlayer() {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "w":
                    this.position.setY(this.position.y - 1);
                    UpdateManager.updateLayerList();
                    break;
                case "a":
                    this.position.setX(this.position.x - 1);
                    UpdateManager.updateLayerList();
                    break;
                case "s":
                    this.position.setY(this.position.y + 1);
                    UpdateManager.updateLayerList();
                    break;
                case "d":
                    this.position.setX(this.position.x + 1);
                    UpdateManager.updateLayerList();
                    break;
            }
        });
    }
}