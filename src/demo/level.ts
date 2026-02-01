import { Abstract, Enum, Room, Type } from "./imports";

export class Level {
    private room: Abstract.Room;

    constructor() {
        const roomConfig: Type.RoomConfig = {
            BackdropMediaName: "LevelBackdrop",
            Type: Enum.RoomType.DEFAULT,
            Doors: {},
            ID: 84,
        };
        this.room = new Room.StartRoom(roomConfig);
    }

    public GetRoom(): Abstract.Room {
        return this.room;
    }
}