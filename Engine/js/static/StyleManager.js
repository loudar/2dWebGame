import {LayerTypes} from "../Enums/LayerTypes.js";

export class StyleManager {
    static initialize() {
        this.registerStylesheet("global", "global");
        this.registerLayerTypeStylesheet(LayerTypes.entity);
        this.registerLayerTypeStylesheet(LayerTypes.image);
        this.registerLayerTypeStylesheet(LayerTypes.ui);
    }

    static registerLayerTypeStylesheet(layertype) {
        if (!Object.values(LayerTypes).includes(layertype)) {
            throw new Error("Invalid layertype, must be one of: " + Object.values(LayerTypes).join(", "));
        }
        this.registerStylesheet(layertype, "/layers/" + layertype + "Layer");
    }

    static registerStylesheet(name, stylesheet) {
        stylesheet = "Engine/styles/" + stylesheet + ".css";
        const res = fetch(stylesheet);
        res.then((response) => {
            if (response.ok) {
                response.text().then((text) => {
                    const style = document.createElement("style");
                    style.id = name;
                    style.innerHTML = text;
                    document.head.appendChild(style);
                });
            }
        });
    }
}