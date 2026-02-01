import { Enum } from "../imports";

export type DoorConfig = {
    Destination?: number;
    Type?: Enum.RoomType;
    State?: Enum.DoorState;
}

export type RoomConfig = {
	BackdropMediaName?: string;
    Doors?: { [DoorSlot: number]: DoorConfig };
    ID: number;
    LayoutID?: string;
    Seen?: boolean;
    Type: Enum.RoomType;
    Visited?: boolean;
}

export type RoomLayout = {
    LayoutID?: string;
    Grid: any[];
    BlocksLeft?: boolean;
    BlocksRight?: boolean;
    BlocksUp?: boolean;
    BlocksDown?: boolean;
}
