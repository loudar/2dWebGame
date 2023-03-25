import {LayerManager} from "../Engine/js/static/LayerManager.js";
import {IntervalManager} from "../Engine/js/static/IntervalManager.js";
import {Setup} from "./Setup.js";

export class Game {
    static async start() {
        await Setup.setup();
    }

    static async reset() {
        LayerManager.reset();
        IntervalManager.reset();
        await this.start();
    }
}