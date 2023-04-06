import {RoomGenerator} from "./RoomGenerator.js";

export class WorldGenerator {
    static generateWorld(type = "rooms") {
        switch (type) {
            case "rooms":
                return this.generateRooms();
            default:
                return this.generateRooms();
        }
    }

    static generateRooms(roomCount = 10, roomSize = {x: 10, y: 10}) {
        const rooms = [];
        for (let i = 0; i < roomCount; i++) {
            const room = RoomGenerator.generateRoom("tiles", {roomSize, rooms});
            rooms.push(room);
        }
        return rooms;
    }
}