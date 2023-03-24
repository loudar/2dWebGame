export class LayerState {
    visible = true;
    locked = false;
    opacity = 1;

    constructor(visible = true, locked = false, opacity = 1) {
        this.visible = visible;
        this.locked = locked;
        this.opacity = opacity;
    }
}