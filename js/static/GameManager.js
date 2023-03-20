import {StyleManager} from "./StyleManager.js";
import {GameOptions} from "../Models/Options/GameOptions.js";
import {DataManager} from "./DataManager.js";
import {DataEntries} from "../Enums/DataEntries.js";

export class GameManager {
    static create() {
        StyleManager.initialize();
        const gameOptions = GameOptions.create();
        gameOptions.configure("gridSize", 1000);

        const appDom = document.getElementById("app");
        DataManager.addOrUpdateKey(DataEntries.APP_DOM, appDom);
    }
}