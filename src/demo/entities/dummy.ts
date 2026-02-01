import { Vector } from "collider2d";
import { Entity } from "../abstract/entity";
import { Font } from "../font";
import { Media } from "../media";
import { Animated } from "../traits/animated";
import { HitBox } from "../traits/hitbox";
import { HP } from "../traits/hp";
import { Tear } from "./tear";

export class Dummy extends Entity {
    private variation: number = 0;
    private damage: number = 0.0;

    constructor(position: Vector, variation?: number) {
        position = new Vector(position.x, position.y)
        super(position);

        this.variation = variation || Math.floor(Math.random() * (3));

        const animatedTrait: Animated = new Animated(Media.getAnimation("Dummy"));
        animatedTrait.render = (entity: Entity) => {
            animatedTrait.animation.Render(entity.Position);
        }

        this.addTrait(animatedTrait)
        this.addTrait(new HitBox(16))
        this.addTrait(new HP(1000))
    }

    update(delta: number): void {
        super.Update(delta);
    }

    collides(target: Entity): void {
        if (target instanceof Tear) {
            this.damage += 3.5
        }
    }

    render(): void {
        super.Render();

        Font.write(this.damage.toFixed(2), Font.White, this.position.x - 22, this.position.y - 10)

    }
}