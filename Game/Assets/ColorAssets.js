import {CharacterTexture} from "../../Engine/js/Models/Properties/Textures/CharacterTexture.js";
import {ImageAssets} from "./ImageAssets.js";
import {Texture} from "../../Engine/js/Models/Properties/Textures/Texture.js";

export class ColorAssets {
    static get Enemy() {
        return new CharacterTexture("#f0f");
    }

    static get Player() {
        return new CharacterTexture("#0ff", ImageAssets.Character);
    }

    static get Bullet() {
        return new Texture("#000");
    }
}