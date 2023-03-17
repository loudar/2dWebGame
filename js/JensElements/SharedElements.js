export class SharedElements {
    static layer = {
        tag: "div", classes: [d => (d.type + "layer"), "layer", d => d.state.visible], attributes: { "data-layer-name": d => d.name }, children: [
            { tag: "div", classes: ["layercontent"] }
        ]
    };
}