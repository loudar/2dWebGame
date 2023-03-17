import {Layer} from "./Layer.js";
import {LayerTypes} from "../Enums/LayerTypes.js";

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
}