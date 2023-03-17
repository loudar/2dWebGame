export class ImageLayerElements {
    static image = {
        tag: "img", classes: ["image", d => d.filetype], src: d => d.source, css: {
            width: d => d.style.width ? d.style.width.toString() + "px" : "auto",
            height: d => d.style.height ? d.style.height.toString() + "px" : "auto",
        },
    }
}