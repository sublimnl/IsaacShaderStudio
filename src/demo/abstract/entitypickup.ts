import { Abstract, Animation, Circle, Enum, Polygon, Vector } from "../imports";

export abstract class EntityPickup extends Abstract.Entity {
    constructor(position: Vector) {
        super(position);
    }

}