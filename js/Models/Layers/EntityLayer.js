import {Layer} from "./Layer.js";
import {LayerTypes} from "../../Enums/LayerTypes.js";

export class EntityLayer extends Layer {
    constructor(name) {
        super(LayerTypes.entity, name);
        this.entities = [];
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    removeEntity(entity) {
        this.entities = this.entities.filter(e => e !== entity);
    }

    getEntities() {
        return this.entities;
    }

    getEntityCount() {
        return this.entities.length;
    }

    getEntity(index) {
        return this.entities[index];
    }

    getEntityByName(name) {
        return this.entities.find(e => e.name === name);
    }

    getEntitiesByType(type) {
        return this.entities.filter(e => e.type === type);
    }

    renderContent(layerItem) {
        layerItem.innerHTML = "";
        this.entities.forEach(entity => {
            const entityElement = entity.render();
            if (entityElement) {
                layerItem.appendChild(entityElement);
            } else {
                console.warn("Entity ", entity," does not render to an element. (Constructor: ", entity.constructor, ")");
            }
        });
    }

    update() {
        this.entities.forEach(entity => entity.update());
    }
}