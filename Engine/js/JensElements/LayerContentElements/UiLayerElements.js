export class UiLayerElements {
    static text = {
        tag: "span", classes: ["text", "abs-top-lef", "margin-normal", "padding-normal", "contrast"], id: d => d.id, text: d => d.text
    }
    static uiImage = {
        tag: "img", classes: ["image"], src: d => d.source, css: {
            width: d => d.style.width,
            height: d => d.style.height,
            backgroundColor: d => d.style.backgroundColor,
        }
    }
}