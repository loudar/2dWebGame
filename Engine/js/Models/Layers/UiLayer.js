import {Layer} from "./Layer.js";
import {LayerTypes} from "../../Enums/LayerTypes.js";
import {ElementFactory} from "../../static/ElementFactory.js";
import {UpdateManager} from "../../static/UpdateManager.js";
import {AspectRatioHelper} from "../../Helpers/AspectRatioHelper.js";

export class UiLayer extends Layer {
    constructor(name, isAlignedToGame) {
        super(LayerTypes.ui, name);
        this.templates = [];
        this.isAlignedToGame = isAlignedToGame;
    }

    addTemplate(name, id, template, initialData, alignedPosition = null, centered = true) {
        this.templates.push({
            name: name,
            id: id,
            template: template,
            initialData: initialData,
            alignedPosition: alignedPosition,
            centered: centered
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
            data.isAlignedToGame = this.isAlignedToGame;
            const templateElement = ElementFactory.create(t.template, data);
            if (t.alignedPosition && this.isAlignedToGame) {
                this.setAlignedPosition(templateElement, t);
            }
            if (templateElement) {
                layerItem.appendChild(templateElement);
            } else {
                console.warn("Template ", t," does not render to an element. (Constructor: ", t.constructor, ")");
            }
        });
    }

    setAlignedPosition(templateElement, template) {
        templateElement.style.position = "absolute";
        templateElement.style.left = "50%";
        templateElement.style.top = "50%";
        const windowScale = AspectRatioHelper.getWindowScale();
        const x = template.alignedPosition.x * windowScale.x;
        const y = template.alignedPosition.y * windowScale.y * windowScale.ar;
        if (template.centered) {
            templateElement.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        } else {
            templateElement.style.transform = `translate(${x}px, ${y}px)`;
        }
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
            data.isAlignedToGame = this.isAlignedToGame;
            const newNode = ElementFactory.create(t.template, data);
            if (t.alignedPosition && this.isAlignedToGame) {
                this.setAlignedPosition(newNode, t);
            }
            renderNode.replaceChild(newNode, oldNode);
        } else {
            console.warn("Template ", t, " does not have a corresponding element. (Constructor: ", t.constructor, ")");
        }
    }

    updateElementByName(templateName, data) {
        const t = this.templates.find(t => t.name === templateName);
        if (!t) {
            console.warn("Template with name ", templateName, " was not added yet.");
            return;
        }
        this.updateElement(t.id, data);
    }
}