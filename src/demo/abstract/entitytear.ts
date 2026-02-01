import { Abstract } from "../imports";

export class EntityTear extends Abstract.Entity {
    public Update(delta: number): void {
        super.Update(delta);

        if (this.Hitbox) this.Hitbox.pos = this.Position;
    }
}
