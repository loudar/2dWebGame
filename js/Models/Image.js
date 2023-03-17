import {TypeValidator} from "../Meta/TypeValidator.js";

export class Image {
    constructor(source) {
        TypeValidator.validateType(source, String);
        this.source = source;
        this.filetype = source.split(".").pop().toLowerCase();
        const validFiletypes = ["jpg", "jpeg", "png", "gif", "svg"];
        if (!validFiletypes.includes(this.filetype)) {
            throw new Error(`Invalid filetype: ${this.filetype}`);
        }
    }
}