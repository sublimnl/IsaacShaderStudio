import { Abstract, Animation, calcEndPosition, Circle, Entity, Enum, Game, Media, Trait, Vector } from "../imports";

export class Tear extends Abstract.EntityTear {
    private start: Vector;
    private distance: number = 160;
    private current: number = 0;
    //private tear: Animation | null;
    //private poof: Animation;
    private height: number = -20;
    public speed: number = 7.5;
    private CollisionRadius: number = 5;

    private Burst: boolean = false;

    constructor(position: Vector, velocity: Vector, direction: Enum.Direction, parent: Abstract.Entity, target?: Abstract.Entity) {
        super(position);

        this.parent = parent;
        this.start = position;

        switch (direction) {
            case Enum.Direction.UP:
                this.Velocity = velocity.clone().add(new Vector(0, -10));
                break;
            case Enum.Direction.DOWN:
                this.height = 0;
                this.Velocity = velocity.clone().add(new Vector(0, 10));
                break;
            case Enum.Direction.LEFT:
                this.Velocity = velocity.clone().add(new Vector(-10, 0));
                break;
            case Enum.Direction.RIGHT:
                this.Velocity = velocity.clone().add(new Vector(10, 0));
                break;
            default:
               this.Velocity = this.TargetDirection(target.Position);
        }

        if (parent instanceof Entity.Player) {
            this.SetAnimation(Media.getAnimation("Tear"));
        } else {
            this.SetAnimation(Media.getAnimation("BloodTear"));
        }

        this.SetHitbox(new Circle(this.Position, this.CollisionRadius));
        this.SetBaseMass(100)

        this.addTrait(new Trait.Shadow(8));
    }

    Collision(target: Abstract.Entity): void {
        if (target === this.parent) return;

        if (target instanceof Abstract.GridEntity) {
            if (
                (target as Abstract.GridEntity).GetCollisionClass() !== Enum.GridCollisionClass.NONE &&
                (target as Abstract.GridEntity).GetCollisionClass() !== Enum.GridCollisionClass.PIT
            ) {
                //this.tear = null;
                this.Explode();
            }
            return;
        }

        if (target instanceof Entity.Player) {
            target.Hurt(10);
        }

        if (target instanceof Tear) return;

        this.Explode();
    }

    private Explode(): void {
        this.Burst = true;
        this.SetAnimation(Media.getAnimation("Poof"));
        this.GetAnimation().Enter();
        this.GetAnimation().Play("Poof", true)
        this.SetHitbox(null);
    }

    Update(delta: number) {
        const animation = this.GetAnimation();

        if (!this.Burst) {
            this.current += this.speed;
            this.height += 0.75;

            const newPosition = calcEndPosition(this.current, this.start, this.Velocity);
            animation.yOffset = this.height;
            this.Position = newPosition;
            this.Hitbox.pos = newPosition;
            //this.tear?.Update();

            if (this.current >= this.distance) {
                this.Explode();
            }
        }

        animation.Update((done) => {
            if (done && animation.GetAnimationName() == "Poof") {
                this.remove()
            }
        });
    }

    IsVisible(): boolean {
        if (!this.Burst) {
            return true;
        } else {
            return false;
        }
    }
    
    public GetRenderOrder(): number {
        return 10000;
    }
}
