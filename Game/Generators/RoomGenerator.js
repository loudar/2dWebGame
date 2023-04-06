import {GeneratorPattern} from "./GeneratorPattern.js";

export class RoomGenerator {
    /**
     * Generates a room
     * @param type {String} The type of room to generate
     * @param options {Object} The options for the room
     * @returns {Array|Object} The generated room
     */
    static generateRoom(type = "tiles", options = {}) {
        const room = {
            type: "tiles",
            options
        };
        switch (type) {
            case "tiles":
                room.tiles = this.generateTiles(options);
                break;
            default:
                room.tiles = this.generateTiles(options);
        }
        return room;
    }

    /**
     * Generates a room with tiles
     * @param options {Object} The options for the room
     * @returns {Array} The generated tiles
     */
    static generateTiles(options = {
        roomSize: {
            x: 10,
            y: 10
        },
        rooms: []
    }) {
        const tiles = [];
        for (let x = 0; x < options.roomSize.x; x++) {
            for (let y = 0; y < options.roomSize.y; y++) {
                const patternGenerator = new GeneratorPattern();
                const generatedTiles = patternGenerator.generate("tiles", {x: 1, y: 1}, {xOffset: x, yOffset: y});
                tiles.push(...generatedTiles);
            }
        }
        return tiles;
    }
}