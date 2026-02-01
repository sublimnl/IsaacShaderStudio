import { Abstract, Canvas, Circle, Enum, Game, Polygon, Vector } from "../imports";

export abstract class GridEntity extends Abstract.Entity {
    private GridCollisionClass: Enum.GridCollisionClass = Enum.GridCollisionClass.OBJECT;
    private GridEntityType: Enum.GridEntityType;
    private Variant: number = 0;

    constructor(position: Vector) {
        // TODO: Make grid entities use the grid index for starting position.
        //let position = Utils.GridIndexToVector(index);
        super(position);

        this.SetBaseMass(1000);
    }

    /**
     * What to do when collided with from another entity.
     * 
     * @param {Abstract.Entity} target The target entity colliding with this entity.
     * @param {SAT.Response} response The SAT Collider response for the collision.
     */
    public Collision(target: Abstract.Entity, response?: SAT.Response): void {
        if (target instanceof Abstract.GridEntity) return;

        // Grid entities should be immovable - only apply physics to the target entity
        // We still call super.Collision() to trigger trait behaviors, but we override
        // the position changes to make grid entities immovable
        const originalPosition = this.Position.clone();

        super.Collision(target, response);

        // Restore grid entity position to make it immovable
        this.Position = originalPosition;
    }

    /**
     * Destroy this Grid Entity.
     * 
     * @param {boolean} immediate Whether to destroy it immediately, or after it finishes it's current animation.
     * 
     * @returns {boolean} Whether the command was successful.
     */
    public Destroy(immediate?: boolean): boolean {
        // TODO: Implement self-destruction of Grid Entity entities.
        return false;
    }

    /**
     * Get the grid collision class of the entity.
     * 
     * @returns {Enum.GridCollisionClass} The collision class of the entity.
     */
    public GetCollisionClass(): Enum.GridCollisionClass {
        return this.GridCollisionClass;
    }

    /**
     * Get the grid index position of this entity.
     * 
     * @returns {number} The grid index position.
     */
    public GetGridIndex(): number {
        // TODO: Implement Vector position to Grid Index position and return it.
        return 0;
    }

    /**
     * Get the grid entity type.
     * 
     * @returns {Enum.GridEntityType} The Grid Entity Type
     */
    public GetType(): Enum.GridEntityType {
        return this.GridEntityType;
    }

    /**
     * Get the variant.
     * 
     * @returns {number} The variant id of the entity.
     */
    public GetVariant(): number {
        return this.Variant;
    }

    /**
     * Hurt the entity for specified amount of damage.
     * 
     * @param {number} damage Amount of damage to inflict.
     * 
     * @returns {boolean} Whether damage was inflicted.
     */
    public Hurt(damage: number): boolean {
        return false;
    }

    /**
     * Render the grid entity if an animation has been specified.
     */
    Render(): void {
        super.Render();
    }

    /**
     * Set the Grid Collision class for the entity.
     * 
     * @param {Enum.GridCollisionClass} collisionclass 
     * 
     * @returns GridEntity
     */
    public SetGridCollisionClass(collisionclass: Enum.GridCollisionClass): GridEntity {
        this.GridCollisionClass = collisionclass;

        return this;
    }



    /**
     * Set the type of Grid Entity.
     * 
     * @param {Enum.GridEntityType} type
     * 
     * @returns GridEntity
     */
    public SetType(type: Enum.GridEntityType): GridEntity {
        this.GridEntityType = type;

        return this;
    }

    /**
     * Set the variant.
     * 
     * @param {Enum.GridEntityType} variant
     * 
     * @returns GridEntity
     */
    public SetVariant(variant: number): GridEntity {
        this.Variant = variant;

        return this;
    }

    /**
     * Perform frame update loop on entity.
     * 
     * @param delta 
     */
    Update(delta: number): void {
        super.Update(delta);
    }
}
