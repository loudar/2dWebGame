import {Hook} from "./Hook.js";
import {HookTypes} from "../../../Enums/HookTypes.js";
import {TypeValidator} from "../../../Meta/TypeValidator.js";

export class EntityHook extends Hook {
    constructor(id) {
        TypeValidator.validateType(id, String);
        super(HookTypes.entity, id);
    }

    setOnTick(onTick) {
        this.onTick = onTick;
    }

    setOnRender(onRender) {
        this.onRender = onRender;
    }

    setOnUpdate(onUpdate) {
        this.onUpdate = onUpdate;
    }

    setOnResize(onResize) {
        this.onResize = onResize;
    }

    setOnMove(onMove) {
        this.onMove = onMove;
    }

    setOnRotate(onRotate) {
        this.onRotate = onRotate;
    }

    setOnScale(onScale) {
        this.onScale = onScale;
    }

    setOnStateChange(onStateChange) {
        this.onStateChange = onStateChange;
    }

    setOnCollide(onCollide) {
        this.onCollide = onCollide;
    }

    setOnAction(actionType, onAction) {
        if (!this.actionHooks) {
            this.actionHooks = {};
        }
        this.actionHooks[actionType] = onAction;
    }
}