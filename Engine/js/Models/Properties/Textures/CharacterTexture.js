import {Texture} from "./Texture.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";

export class CharacterTexture extends Texture {
    constructor(color = "#0ff", image = null, borderColor = "transparent") {
        super(color, image, borderColor);
    }

    addAssets(idleTextures = [], movingTextures = [], jumpingTextures = [], fallingTextures = [], deadTextures = []) {
        TypeValidator.validateType(idleTextures, Array);
        TypeValidator.validateType(movingTextures, Array);
        TypeValidator.validateType(jumpingTextures, Array);
        TypeValidator.validateType(fallingTextures, Array);
        TypeValidator.validateType(deadTextures, Array);
        this.idleTextures = idleTextures;
        this.movingTextures = movingTextures;
        this.jumpingTextures = jumpingTextures;
        this.fallingTextures = fallingTextures;
        this.deadTextures = deadTextures;
    }
}