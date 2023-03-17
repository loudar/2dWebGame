export class SharedElements {
    static layer = {
        tag: "div", classes: [d => d.type + "layer", d => d.visible], attributes: { "data-layer-name": d => d.name },
    };
}