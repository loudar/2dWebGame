import {DataManager} from "../../static/DataManager.js";
import {TypeValidator} from "../../Meta/TypeValidator.js";
import {DataEntries} from "../../Enums/DataEntries.js";

export class GameOptions {
    constructor() {}

    gridSize = 100;

    static create() {
        DataManager.addOrUpdateKey(DataEntries.GAME_OPTIONS, new GameOptions());
        return DataManager.getKey(DataEntries.GAME_OPTIONS);
    }

    static configure(setting, value) {
        TypeValidator.validateType(setting, String);
        const gameOptions = DataManager.getKey(DataEntries.GAME_OPTIONS);
        if (!gameOptions.hasOwnProperty(setting)) {
            throw new Error(`Invalid setting ${setting}`);
        }
        gameOptions[setting] = value;
    }

    configure(setting, value) {
        TypeValidator.validateType(setting, String);
        if (!this.hasOwnProperty(setting)) {
            throw new Error(`Invalid setting ${setting}`);
        }
        this[setting] = value;
        DataManager.addOrUpdateKey(DataEntries.GAME_OPTIONS, this);
    }
}