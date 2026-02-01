import { Abstract, Enum, Polygon, Vector } from "../../imports";

export class WallGroup extends Abstract.GridEntity {
    constructor(position: Vector, hitbox: Polygon) {
        super(position);

        this.SetHitbox(hitbox);
        this.SetBaseMass(100);

        this.SetGridCollisionClass(Enum.GridCollisionClass.WALL);
    }
}