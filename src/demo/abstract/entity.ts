import { Abstract, Animation, Canvas, Circle, DistanceTo, Game, Polygon, Response, TargetDirection, Vector } from "../imports";
import { v4 as uuidv4 } from 'uuid';

declare type Modifiers = {
    Elasticity: number;
    Friction: number;
    Mass: number;
    Speed: number;
}

export abstract class Entity {
    private Animation: Animation;

    protected traits: { [name: string]: Abstract.Trait } = {};
    protected parent: Entity;
    protected Hitbox: undefined | Circle | Polygon;

    protected Acceleration: Vector = new Vector(0, 0);
    private _elasticity: number = 0;
    private _friction: number = 0.35;
    private _mass: number = 0;
    public Position: Vector = new Vector(0, 0);
    private _speed: number = 1;
    private _uuid: string = uuidv4();
    protected Velocity: Vector = new Vector(0, 0);

    private Modifiers: Modifiers = {
        Elasticity: 0,
        Friction: 0,
        Mass: 0,
        Speed: 0,
    }

    constructor(position?: Vector) {
        this.Position = position || new Vector(Canvas.width / 2, Canvas.height / 2);
    }

    get Elasticity(): number {
        return this._elasticity + this.Modifiers.Elasticity;
    }

    public SetBaseElasticity(value: number): Entity {
        this._elasticity = value;

        return this;
    }

    public IncreaseElasticity(value: number): Entity {
        this.Modifiers.Elasticity += value;

        return this;
    }

    public DecreaseElasticity(value: number): Entity {
        this.Modifiers.Elasticity -= value;

        return this;
    }

    get Friction(): number {
        return this._friction + this.Modifiers.Friction;
    }

    public SetBaseFriction(value: number): Entity {
        this._friction = value;

        return this;
    }

    public SetFrictionModifier(value: number): Entity {
        this.Modifiers.Friction = value;

        return this;
    }

    public IncreaseFriction(value: number): Entity {
        this.Modifiers.Friction += value;

        return this;
    }

    public DecreaseFriction(value: number): Entity {
        this.Modifiers.Friction -= value;

        return this;
    }

    get Mass(): number {
        return this._mass + this.Modifiers.Mass;
    }

    get InvertedMass(): number {
        if (this.Mass === 0) {
            return 0;
        } else {
            return 1 / this.Mass;
        }
    }

    public SetBaseMass(value: number): Entity {
        this._mass = value;

        return this;
    }

    public IncreaseMass(value: number): Entity {
        this.Modifiers.Mass += value;

        return this;
    }

    public DecreaseMass(value: number): Entity {
        this.Modifiers.Mass -= value;

        return this;
    }

    get Speed(): number {
        return this._speed + this.Modifiers.Speed;
    }

    public SetBaseSpeed(value: number): Entity {
        this._speed = value;

        return this;
    }

    public IncreaseSpeed(value: number): Entity {
        this.Modifiers.Speed += value;

        return this;
    }

    public DecreaseSpeed(value: number): Entity {
        this.Modifiers.Speed -= value;

        return this;
    }

    get UUID(): string {
        return this._uuid;
    }

    Enter() {
        Object.values(this.traits).forEach((trait) => {
            trait.Enter(this);
        })

        if (this.Animation) this.Animation.Enter();
    }

    addTrait(trait: Abstract.Trait) {
        this.traits[trait.name] = trait;
    }

    getTrait(name: string): Abstract.Trait {
        return name in this.traits ? this.traits[name] : undefined;
    }

    hasTrait(name: string): boolean {
        return name in this.traits;
    }

    removeTrait(name: string): void {
        if (this.hasTrait(name)) {
            delete this.traits[name];
        }
    }

    renderTrait(name: string) {
        this.traits[name]?.render(this, true);
    }

    finalize() {
        Object.values(this.traits).forEach((trait) => {
            trait.finalize();
        })
    }

    IsVisible(): boolean {
        return true;
    }

    Collision(target: Entity, response?: Response) {
        Object.values(this.traits).forEach((trait) => {
            trait.collides(this, target);
        })

        if (response) {
            // Change the target entities position to be outside of the grid entities hitbox
            target.Position.sub(response.overlapV.clone().scale(target.InvertedMass));

            // Change the grid entities position depending on the collision mass of the two entities.
            this.Position.sub(response.overlapV.clone().scale(-this.InvertedMass));
        }

    }

    OnEnterCollision(target: Entity, response?: Response) {
    }

    OnExitCollision(target: Entity, response?: Response) {
    }

    OnAnimate(done: boolean) { }
    OnRoomEnter() { }
    OnRoomExit() { }

    collides(target: Entity) {
        Object.values(this.traits).forEach((trait) => {
            trait.collides(this, target);
        })
        /*
        this.traits.forEach(trait => {
            trait.collides(this, target)
        })
        */
    }

    obstruct(direction: number, entity: Entity) {
        Object.values(this.traits).forEach((trait) => {
            trait.obstruct(this, direction, entity);
        })
        /*
        this.traits.forEach(trait => {
            trait.obstruct(this, direction, entity);
        })
        */
    }

    Update(delta: number) {
        this.SetFrictionModifier(0.0);

        Object.values(this.traits).forEach((trait) => {
            trait.update(this, delta);
        })

        if (this.Animation) this.Animation.Update((done) => {
            this.OnAnimate(done);
        });

        /*
        this.traits.forEach(trait => {
            trait.update(this, delta);
        })
        */
    }

    Render() {
        Object.values(this.traits).forEach((trait) => {
            trait.render(this);
        })

        if (this.Animation) this.Animation.Render(this.Position);


        if (this.Hitbox && Game.GetDebugSettings().Hitspheres) {
            Canvas.context.save();
            Canvas.context.strokeStyle = '#ff0000';
            Canvas.context.beginPath();
            if (this.Hitbox instanceof Circle) {
                const hitbox = this.Hitbox as Circle;
                Canvas.context.arc(hitbox.pos.x, hitbox.pos.y, hitbox.r, 0, Math.PI * 2, true);
            } else if (this.Hitbox instanceof Polygon) {
                const hitbox = this.Hitbox as Polygon;
                if (hitbox.calcPoints.length === 4) {
                    Canvas.context.rect(hitbox.pos.x, hitbox.pos.y, hitbox.calcPoints[2].x, hitbox.calcPoints[2].y);
                } else {
                    Canvas.context.moveTo(hitbox.calcPoints[0].x, hitbox.calcPoints[0].y)
                    for (let i = 1; i < hitbox.calcPoints.length; i++) {
                        Canvas.context.lineTo(hitbox.calcPoints[i].x, hitbox.calcPoints[i].y)
                    }
                    Canvas.context.lineTo(hitbox.calcPoints[0].x, hitbox.calcPoints[0].y)

                }
            }
            Canvas.context.closePath();
            Canvas.context.stroke();
            Canvas.context.restore();
        }
    }

    remove() {
        const entities: Entity[] = [];
        Game.GetLevel().GetRoom().GetNonGridEntities().forEach((entity: Abstract.Entity) => {
            if (entity !== this) {
                entities.push(entity)
            }
        })
        Game.GetLevel().GetRoom().SetNonGridEntities(entities)
        //for (let i in (SceneManager.scene as Level).room?.entities) {
        //    if ((SceneManager.scene as Level).room?.entities[i] !== this) {
        //        entities.push((SceneManager.scene as Level).room?.entities[i]);
        //    }
        //}
        //        Game.GetRoom().GetEntities() = entities;
    }


    get Parent(): Entity | null {
        return this.parent;
    }


    public DistanceTo(target: Vector): number {
        return DistanceTo(this.Position, target); //   Math.sqrt((this.Position.x - target.x) ** 2 + (this.Position.y - target.y) ** 2);
    }

    public TargetDirection(target: Vector): Vector {
        /*
        let distance = this.DistanceTo(target);
        let velocityX = 8 / distance * (target.x - this.Position.x);
        let velocityY = 8 / distance * (target.y - this.Position.y);

        return new Vector(velocityX, velocityY).;
        */
        return TargetDirection(this.Position, target);
    }

    /**
     * Get the animation of the entity.
     * 
     * @returns {Animation} The animation of the entity.
    */
    public GetAnimation(): Animation {
        return this.Animation;
    }

    public SetAnimation(animation: Animation): Entity {
        this.Animation = animation;

        return this;
    }
    public GetHitbox(): undefined | Circle | Polygon {
        return this.Hitbox;
    }

    /**
     * Set the type of Grid Entity.
     * 
     * @param {Enum.GridEntityType} type
     * 
     * @returns GridEntity
     */
    public SetHitbox(hitbox: undefined | Circle | Polygon): Entity {
        this.Hitbox = hitbox;

        return this;
    }

    public GetRenderOrder(): number {
        if (this.Hitbox) {
            return this.Position.y;
        } else {
            return -1;
        }
    }
}