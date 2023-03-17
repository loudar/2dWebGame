export class ImageLayerElements {
    static image = {
        tag: "img", classes: ["image", d => d.filetype], src: d => d.source,
    }
}