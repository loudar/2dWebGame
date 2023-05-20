import {AspectRatioHelper} from "../../Helpers/AspectRatioHelper.js";

export class EntityLayerElements {
    static blockEntity = {
        tag: "div", id: d => d.id, classes: ["block-entity", "entity"], css: {
            width: d => {
                const width = AspectRatioHelper.getWindowScale().x * d.size.width;
                return width + "px";
            },
            height: d => {
                const height = AspectRatioHelper.getWindowScale().y * d.size.height;
                return height + "px";
            },
            backgroundColor: d => d.texture.color,
            backgroundImage: d => d.texture.image ? `url(${d.texture.image})` : "none",
            borderColor: d => d.texture.borderColor,
            transform: d => {
                const scale = AspectRatioHelper.getWindowScale();
                const x = d.position.x * scale.x;
                const y = d.position.y * scale.y;
                return `translate(${x}px, ${y}px) scale(${d.scale}) rotate(${d.rotation.zDegrees}deg) translate(-50%, -50%)`;
            },
        }
    }
    static characterEntity = {
        tag: "div", id: d => d.id, classes: ["character-entity", "entity"], children: [
            {
                condition: d => d.texture.image !== null,
                tag: "img", classes: ["entity-image"], attributes: {
                    src: d => d.texture.image,
                    width: "100%", height: "100%"
                }
            }
        ]
    }
    static enemyEntity = {
        tag: "div", id: d => d.id, classes: ["enemy-entity", "entity"], children: [
            {
                condition: d => d.texture.image !== null,
                tag: "img", classes: ["entity-image"], attributes: {
                    src: d => d.texture.image,
                    width: "100%", height: "100%"
                }
            }
        ]
    }
    static bulletEntity = {
        tag: "div", id: d => d.id, classes: ["bullet-entity", "entity"]
    }
}