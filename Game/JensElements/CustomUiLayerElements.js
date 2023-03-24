export class CustomUiLayerElements {
    static imageArray = {
        templateList: "uiImage",
        tag: "div", classes: ["image-array", "abs-lef", "margin-normal", "padding-normal"], id: d => d.id,
        data: "ref:images",
    }
    static damageText = {
        tag: "span", classes: ["damage-text", "abs-lef", "margin-normal", "padding-normal"], id: d => d.id, text: d => d.text
    }
}