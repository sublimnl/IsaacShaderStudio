import { Abstract } from "../imports";

export class EntityPlayer extends Abstract.Entity {
    public Update(delta: number): void {
        super.Update(delta);

        if (this.Hitbox) this.Hitbox.pos = this.Position;
    }
}
