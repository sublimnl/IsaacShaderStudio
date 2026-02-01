import { Entity } from "../abstract/entity";
import { Trait } from "../abstract/trait";

export class HP extends Trait {
    public hp: number;

    constructor(hp: number) {
        super('hp');

        this.hp = hp;
    }

    collides(source: Entity, target: Entity): void {
        //console.log(source, target)
    }
}