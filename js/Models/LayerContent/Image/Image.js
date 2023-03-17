import {TypeValidator} from "../../../Meta/TypeValidator.js";
import {UpdateManager} from "../../../static/UpdateManager.js";

export class Image {
    constructor(source) {
        TypeValidator.validateType(source, String);
        this.source = source;
        this.filetype = source.split(".").pop().toLowerCase();
        const validFiletypes = ["jpg", "jpeg", "png", "pnj", "gif", "svg", "webp"];
        if (!validFiletypes.includes(this.filetype)) {
            console.warn(`Unknown filetype: ${this.filetype}`);
        }
        this.style = {};
    }

    setFixedSize(width, height, resizeHandler = null) {
        TypeValidator.validateType(width, Number);
        TypeValidator.validateType(height, Number);
        this.style.width = width;
        this.style.height = height;
        if (resizeHandler) {
            TypeValidator.validateType(resizeHandler, Function);
            window.removeEventListener("resize", resizeHandler);
            window.addEventListener("resize", resizeHandler);
        }
        UpdateManager.updateLayerList();
    }
}