import {UUID} from "../../../Engine/js/Helpers/UUID.js";

export class HealthHelpers {
    static getHealthImages(playerState) {
        const healthImageCount = playerState.getHealth();
        return Array.from({length: healthImageCount}, () => this.getHealthImage());
    }

    static getHealthImage() {
        return {
            id: UUID.new.generate(), source: "https://game.targoninc.com/img/sprites/apple.gif", style: {
                width: "30px",
                height: "30px",
                backgroundColor: "transparent"
            }
        }
    }
}