import {Layer} from "./Layer.js";
import {LayerTypes} from "../../Enums/LayerTypes.js";
import {LayerManager} from "../../static/LayerManager.js";

export class EntityLayer extends Layer {
    constructor(name) {
        super(LayerTypes.entity, name);
        this.entities = [];
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    updateEntity(entity) {
        this.entities = this.entities.map(e => e.id === entity.id ? entity : e);
    }

    removeEntity(entity) {
        this.entities = this.entities.filter(e => e !== entity);
        try {
            document.getElementById(entity.id).remove();
        } catch (e) {}
        const layers = LayerManager.getLayersByType(LayerTypes.entity);
        layers.forEach(layer => {
            layer.getEntities().forEach(e => {
                e.removeCollisionWithEntity(entity);
            });
        });
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

    getEntityById(id) {
        return this.entities.find(e => e.id === id);
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
        this.entities.forEach(entity => {
            if (!entity.changed && !entity.updateOnTicks) {
                return;
            }
            const entityNode = document.getElementById(entity.id);
            if (entityNode) {
                entity.update(entityNode);
            } else {
                //console.warn("Entity ", entity, " does not have a corresponding element. (Constructor: ", entity.constructor, ")");
            }
        });
    }

    addEntities() {
        for (let entity of arguments) {
            this.addEntity(entity);
        }
    }
}