import {DataManager} from "../Engine/js/static/DataManager.js";
import {DataEntries} from "../Engine/js/Enums/DataEntries.js";
import {GameManager} from "../Engine/js/static/GameManager.js";
import {TemplateHelper} from "./Helpers/TemplateHelper.js";
import {Game} from "./Game.js";

DataManager.addOrUpdateKey(DataEntries.TEMPLATES, TemplateHelper.getTemplates());
GameManager.create();
await Game.start();