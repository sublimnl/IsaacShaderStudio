import { Abstract, Box, Enum, Vector } from "../../imports";

export class Wall extends Abstract.GridEntity {
    constructor(position?: Vector) {
        super(position);

        this.SetHitbox(new Box(this.Position, 26, 26).toPolygon());
        this.SetBaseMass(100);
        this.SetGridCollisionClass(Enum.GridCollisionClass.WALL);
    }
}