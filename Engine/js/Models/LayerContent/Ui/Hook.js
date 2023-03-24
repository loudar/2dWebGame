import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {DataManager} from "../../../static/DataManager.js";

export class Hook {
    constructor(type, id) {
        TypeValidator.validateType(type, String);
        TypeValidator.validateType(id, String);
        this.type = type;
        this.id = id;
        DataManager.addToArrayKey("hooks", this);
    }
}