import {Layer} from "./Layer.js";
import {LayerTypes} from "../../Enums/LayerTypes.js";
import {ElementFactory} from "../../static/ElementFactory.js";
import {UpdateManager} from "../../static/UpdateManager.js";

export class UiLayer extends Layer {
    constructor(name) {
        super(LayerTypes.ui, name);
        this.templates = [];
    }

    addTemplate(id, template, initialData) {
        this.templates.push({
            id: id,
            template: template,
            initialData: initialData
        });
    }

    removeTemplate(template) {
        this.templates = this.templates.filter(e => e.template !== template);
    }

    getTemplates() {
        return this.templates;
    }

    getTemplateCount() {
        return this.templates.length;
    }

    getTemplate(index) {
        return this.templates[index];
    }

    renderContent(layerItem) {
        layerItem.innerHTML = "";
        this.templates.forEach(t => {
            const data = t.initialData;
            data.id = t.id;
            const templateElement = ElementFactory.create(t.template, data);
            if (templateElement) {
                layerItem.appendChild(templateElement);
            } else {
                console.warn("Template ", t," does not render to an element. (Constructor: ", t.constructor, ")");
            }
        });
    }

    updateElement(templateId, data) {
        const t = this.templates.find(t => t.id === templateId);
        if (!t) {
            console.warn("Template with id ", templateId, " was not added yet.");
            return;
        }
        const renderNode = UpdateManager.getBy(`[data-layer-name="${this.name}"] .layercontent`);
        const oldNode = document.getElementById(t.id);
        if (oldNode) {
            data.id = t.id;
            const newNode = ElementFactory.create(t.template, data);
            renderNode.replaceChild(newNode, oldNode);
        } else {
            console.warn("Template ", t, " does not have a corresponding element. (Constructor: ", t.constructor, ")");
        }
    }
}