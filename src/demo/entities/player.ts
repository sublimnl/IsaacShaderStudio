import { Abstract, Animation, Canvas, Circle, Clamp, Entity, Enum, Game, GridCoordinatesToGridIndex, GridIndexToVector, Input, Media, Response, Scene, SceneManager, Trait, Vector } from "../imports";
import { ANM2AnimationFrame } from "../types";


type EyeOffsets = {
    [eye: number]: {
        [direction: string]: Vector
    };
};

export class Player extends Abstract.EntityPlayer {
    private body: Animation;
    private head: Animation;

    private hearts: number[] = [Enum.Hearts.FULL, Enum.Hearts.FULL, Enum.Hearts.FULL];
    private bombs: number = 1;
    private coins: number = 0;
    private keys: number = 0;

    public moving: boolean = false;
    public speed: number = 4;
    private damage: number = 3.5;

    public crying: boolean = false;
    public tearDelay: number = 0;
    public rightEye: boolean = false;

    private damageCooldown: number = 0;

    public bodyDirection: Enum.Direction;
    public headDirection: Enum.Direction;

    private pickupItem: Animation | null = null;

    private Dead: boolean = false;

    private eyeDots: { [eye: number]: Vector } = {
        [Enum.Eye.RIGHT]: new Vector(0, 0),
        [Enum.Eye.LEFT]: new Vector(0, 0),
    }

    private eyeOffsets: EyeOffsets = {
        [Enum.Eye.RIGHT]: {
            [Enum.Direction.DOWN]: new Vector(1, 0),
            [Enum.Direction.RIGHT]: new Vector(0, 0),
            [Enum.Direction.UP]: new Vector(-0, -4),
            [Enum.Direction.LEFT]: new Vector(0, 0),
        },
        [Enum.Eye.LEFT]: {
            [Enum.Direction.DOWN]: new Vector(-1, 0),
            [Enum.Direction.RIGHT]: new Vector(-1, 0),
            [Enum.Direction.UP]: new Vector(1, -4),
            [Enum.Direction.LEFT]: new Vector(-4, 0),
        },
    }

    private shotSpeed = 1.0;
    private tearRange = 260.0;

    constructor() {
        super(new Vector(Canvas.width / 2, (Canvas.height / 2) + 50));

        this.addTrait(new Trait.Shadow(18));
        this.SetHitbox(new Circle(this.Position, 7));

        this.body = Media.getAnimation("IsaacBody");
        this.head = Media.getAnimation("IsaacHead");

        this.SetBaseMass(1);
        this.SetBaseFriction(0.45);
        this.SetBaseElasticity(0);
    }

    public setPosition(x: number, y: number) {
        if (
            x > 0 &&
            x < Canvas.width &&
            y > 0 &&
            y < Canvas.height
        ) {
            this.Position = new Vector(x, y)
        }
    }

    public Enter() {
        this.body.Enter();
        this.head.Enter();

        this.setPosition(Canvas.width / 2, (Canvas.height / 2) + 50)
    }

    public Collision(target: Abstract.Entity, response?: Response): void {
        if (target.Parent === this) return;
    }

    public Update(delta: number) {
        if (Game.transitioning) return;

        if (this.damageCooldown > 0) this.damageCooldown--;

        this.moving = false;
        this.crying = false;
        this.bodyDirection = Enum.Direction.DOWN;
        this.headDirection = Enum.Direction.DOWN;
        this.Acceleration.x = 0;
        this.Acceleration.y = 0;

        if (!this.Dead) {

            if (Input.IsActionPressed(Enum.Action.WALK_LEFT)) {
                this.moving = true;
                this.bodyDirection = this.headDirection = Enum.Direction.LEFT;
                this.Acceleration.x = -this.speed;
            }
            if (Input.IsActionPressed(Enum.Action.WALK_RIGHT)) {
                this.moving = true;
                this.bodyDirection = this.headDirection = Enum.Direction.RIGHT;
                this.Acceleration.x = this.speed;
            }
            if (Input.IsActionPressed(Enum.Action.WALK_UP)) {
                this.moving = true;
                this.bodyDirection = this.headDirection = Enum.Direction.UP;
                this.Acceleration.y = -this.speed;
            }
            if (Input.IsActionPressed(Enum.Action.WALK_DOWN)) {
                this.moving = true;
                this.bodyDirection = this.headDirection = Enum.Direction.DOWN;
                this.Acceleration.y = this.speed;
            }

            if (Input.IsActionPressed(Enum.Action.SHOOT_LEFT)) {
                this.headDirection = Enum.Direction.LEFT;
                this.crying = true;
            }
            if (Input.IsActionPressed(Enum.Action.SHOOT_UP)) {
                this.headDirection = Enum.Direction.UP;
                this.crying = true;
            }
            if (Input.IsActionPressed(Enum.Action.SHOOT_RIGHT)) {
                this.headDirection = Enum.Direction.RIGHT;
                this.crying = true;
            }
            if (Input.IsActionPressed(Enum.Action.SHOOT_DOWN)) {
                this.headDirection = Enum.Direction.DOWN;
                this.crying = true;
            }

            if (Input.IsKeyPressedOnce("KeyK")) {
                this.head.Play("Hit", true);
            }

            this.Acceleration.normalize().scale(this.speed);
            this.Velocity.add(this.Acceleration);
            this.Velocity.scale(1 - this.Friction);
            this.Position.add(this.Velocity);

            this.Position.x = Clamp(this.Position.x, 20, Canvas.width - 20)
            this.Position.y = Clamp(this.Position.y, 20, Canvas.height - 20)

            if (this.tearDelay > 0) {
                this.tearDelay -= 1;
            }

            if (this.crying) {
                if (this.tearDelay > 0 || !(["HeadUp", "HeadDown", "HeadLeft", "HeadRight"].indexOf(this.head.GetAnimationName()) !== -1)) {
                    this.crying = false;
                } else {
                    this.rightEye = !this.rightEye;
                    this.tearDelay = 13;

                    const offset = this.eyeOffsets[this.rightEye ? 1 : -1][this.headDirection]

                    const tear = new Entity.Tear(this.Position.clone().add(offset), this.Velocity, this.headDirection, this)
                    tear.Enter()
                    Game.GetLevel().GetRoom().AddEntity(tear);
                }
            }

            if (this.moving) {
                if (this.body.GetAnimationName() !== `Walk${this.bodyDirection}` || !this.body.IsPlaying()) {
                    this.body.Play(`Walk${this.bodyDirection}`, true);
                }
            } else {
                this.body.Stop();
                this.body.SetFrame(0, `WalkDown`)
            }

            if (this.crying) {
                this.head.SetFrame(2, `Head${this.headDirection}`);
            } else {
                if (this.tearDelay >= 10) {
                    this.head.SetFrame(2, `Head${this.headDirection}`);
                } else {
                    this.head.SetFrame(0, `Head${this.headDirection}`);

                }
            }
        }

        this.head.Update((done) => {
            if (done && this.head.GetAnimationName() === "Death") {
                //location.reload();
                Game.BeforeEnter();
                SceneManager.Transition(new Scene.LoadScreen());
            } else if (done && this.head.GetAnimationName() === "Pickup") {
                this.pickupItem = null;
            }
        });
        this.body.Update();

        this.head.OnNullItem((id: number, frame: ANM2AnimationFrame) => {
            if (frame) {
                switch (id) {
                    case 0:
                        if (this.pickupItem) {
                            this.pickupItem.xOffset = frame.xPosition;
                            this.pickupItem.yOffset = frame.yPosition;
                        }
                        break;
                }
            }
        })

        super.Update(delta);
    }

    public HasPickupItem(): boolean {
        return !(this.pickupItem === null);
    }

    public GetNullItemPosition(): Vector {
        return this.Position.clone().add(new Vector(this.pickupItem?.xOffset, this.pickupItem?.yOffset + 25))
    }

    public Pickup(item: Animation) {
        this.pickupItem = item;
    }

    public Play(name: string) {
        this.head.Play(name, true);
    }

    public Hurt(amount: number) {
        if (this.damageCooldown !== 0 || this.Dead) return;
        if (this.head.GetAnimationName() !== "Hit") this.head.Play("Hit", true);
        this.damageCooldown = 30;

        let total = this.GetHearts() - 0.5;
        const hearts = [];
        for (let i = 0; i < this.GetMaxHearts(); i++) {
            if (total >= 1) {
                hearts.push(Enum.Hearts.FULL);
                total -= 1;
            } else if (total === 0.5) {
                hearts.push(Enum.Hearts.HALF);
                total -= 0.5;
            } else {
                hearts.push(Enum.Hearts.EMPTY);
            }
        }
        this.hearts = hearts;

        if (this.GetHearts() <= 0) {
            this.Die();
        }
    }

    public Die() {
        this.damageCooldown = 0;
        this.Dead = true;
        this.head.Play("Death", true);
    }

    public Render() {
        super.Render();

        if (this.damageCooldown > 0) {
            Canvas.context.save();
            if (this.damageCooldown % 3 === 0) Canvas.context.filter = "brightness(50%)";
        }

        if (["HeadUp", "HeadDown", "HeadLeft", "HeadRight"].indexOf(this.head.GetAnimationName()) !== -1) this.body.Render(this.Position);
        this.head.Render(this.Position);

        if (this.damageCooldown > 0) {
            Canvas.context.restore();
        }
        /*
                let grid = GridCoordinatesToGridIndex(this.Position);
                let coords = GridIndexToVector(grid)
        
                Canvas.context.strokeStyle = "green";
                Canvas.context.strokeRect(coords.x, coords.y, 26, 26);
        */
        //        Canvas.context.strokeStyle
        //        console.log(this.Position, GridCoordinatesToGridIndex(this.Position))
    }

    public GetBlackHearts(): number {
        return [...this.hearts]
            .filter((value) => value === Enum.Hearts.BLACK)
            .map((value) => 1)
            .reduce((a, b) => a + b, 0);
    }

    public GetHearts(): number {
        return [...this.hearts]
            .filter((value) => value === Enum.Hearts.FULL || value === Enum.Hearts.HALF)
            .map((value) => value === Enum.Hearts.HALF ? 0.5 : 1)
            .reduce((a, b) => a + b, 0);
    }

    public GetMaxHearts(): number {
        return [...this.hearts]
            .filter((value) => value === Enum.Hearts.FULL || value === Enum.Hearts.HALF || value === Enum.Hearts.EMPTY)
            .length;
    }

    public GetSoulHearts(): number {
        return [...this.hearts]
            .filter((value) => value === Enum.Hearts.SOUL)
            .map((value) => 1)
            .reduce((a, b) => a + b, 0);
    }

    public GetBombs(): number {
        return Clamp(this.bombs, 0, 99);
    }

    public GetCoins(): number {
        return Clamp(this.coins, 0, 99);
    }

    public GetKeys(): number {
        return Clamp(this.keys, 0, 99);
    }

    public GetDamageCooldown(): number {
        return this.damageCooldown;
    }

    public GetDamage(): number {
        return this.damage;
    }
}