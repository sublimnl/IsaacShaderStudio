import { Abstract, Animation } from "../imports";

export class Animated extends Abstract.Trait {
    public animation : Animation;
    
    constructor(animation: Animation) {
        super('animated');

        this.animation = animation;
    }

    ReplaceSpritesheet(levelId: number, source: string) {
        this.animation.ReplaceSpritesheet(levelId, source);
        return this;
    }

    Enter(entity: Abstract.Entity) {
        this.animation.Enter();
    }

    update(entity: Abstract.Entity, delta: number) {
        this.animation.Update();
    }

    render(entity: Abstract.Entity) {
        this.animation.Render(entity.Position);
    }

    play(name: string) {
        this.animation.Play(name);
    }
}