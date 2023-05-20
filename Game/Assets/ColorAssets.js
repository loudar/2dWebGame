import {CharacterTexture} from "../../Engine/js/Models/Properties/Textures/CharacterTexture.js";
import {ImageAssets} from "./ImageAssets.js";

export class ColorAssets {
    static get Enemy() {
        return new CharacterTexture("#f0f");
    }

    static get Player() {
        return new CharacterTexture("#0ff", ImageAssets.Character);
    }
}