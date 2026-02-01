import { Abstract, Canvas, Media } from "../imports";

export class Shadow extends Abstract.Trait {
    private size : number = 0;
    
    constructor(size: number) {
        super('shadow');
        this.size = size;
    }

    render(entity: Abstract.Entity) {
        if (this.size > 0 && entity.IsVisible()) {
            Canvas.context.save();
            Canvas.context.globalAlpha = 0.25;
            Media.draw("shadow", 0, 0, 120, 49, this.x(entity), this.y(entity) , this.width(), this.height());
            Canvas.context.restore();
        } 
    }

    private x(entity: Abstract.Entity) : number {
        return entity.Position.x - (this.size / 2);
    }

    private y(entity: Abstract.Entity) : number {
        return entity.Position.y - Math.floor(this.height() / 2);
    }

    private width(): number {
        return this.size;
    }

    private height(): number {
        return Math.floor((this.size / 12) * 5);
    }
}