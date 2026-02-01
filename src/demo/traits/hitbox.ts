import { Abstract, Canvas, Circle, Game, Vector } from "../imports";

export class HitBox extends Abstract.Trait {
    public collisionRadius : number = 0;
    private x: number = 0;
    private y: number = 0;
    
    constructor(collisionRadius: number) {
        super('hitbox');
        this.collisionRadius = collisionRadius;
    }

    get hitbox(): Circle {
        return new Circle(new Vector(this.x, this.y), this.collisionRadius)
    }

    update(entity: Abstract.Entity, delta: number) {
        this.x = entity.Position.x;
        this.y = entity.Position.y;
    }

    render(entity: Abstract.Entity, force?: boolean) {
        if (Game.GetDebugSettings().Hitspheres) {
            Canvas.context.save();
            Canvas.context.strokeStyle = '#ff0000';
            Canvas.context.beginPath();
            Canvas.context.arc(entity.Position.x, entity.Position.y, this.collisionRadius, 0, Math.PI * 2, true);
            Canvas.context.closePath();
            Canvas.context.stroke();
            Canvas.context.restore();
        } 
    }
}