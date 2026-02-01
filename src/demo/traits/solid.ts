import { Abstract, Box, Canvas, Game, Polygon, Vector } from "../imports";

export class Solid extends Abstract.Trait {
    private x: number = 0;
    private y: number = 0;
    private height: number = 26;
    private width: number = 26;
    private offsetX: number = 0;
    private offsetY: number = 0;
    
    constructor(height?: number, width?: number, offsetX?: number, offsetY?: number) {
        super('hitbox');

        this.height = height || 26;
        this.width = width || 26;
        this.offsetX = offsetX || 0;
        this.offsetY = offsetY || 0;
    }

    get hitbox(): Polygon {
        return new Box(new Vector(this.x + this.offsetX, this.y + this.offsetY), this.height, this.width).toPolygon();
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
            Canvas.context.rect(entity.Position.x + this.offsetX, entity.Position.y + this.offsetY, this.width, this.height);
            Canvas.context.closePath();
            Canvas.context.stroke();
            Canvas.context.restore();
        } 
    }
}