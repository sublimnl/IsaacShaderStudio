import { Abstract, Box, Canvas, Circle, Collider, Entity, Enum, Font, HUD, Input, Level, Media, Polygon, Response, Trait, Transition, Type, Vector } from "../imports";

class GameScene extends Abstract.Scene {
    static TRANSITION_IN = 0;
    static RENDER = 1;
    static TRANSITION_OUT = 1;

    private static instance: GameScene;
    private player: Entity.Player;
    private level: Level;
    private hud: HUD;

    private gridXOffset: number = 26;
    private gridYOffset: number = 26;

    private delta: number = 0;
    private mode: number;
    public nextRoom: Abstract.Room | null;
    public started: boolean = false;
    private startTime: number = 0;
    private direction: string = Enum.Direction.DOWN;
    public transitioning: boolean = false;

    private GameTime: number = 0;
    private RoomTime: number = 0;

    private collisions: { [subject: string]: { [candidate: string]: boolean } } = { [0]: { [0]: false } }

    private debug: Type.DebugSettings = {
        EntityPositions: false,
        Grid: false,
        InfiniteHP: false,
        HighDamage: false,
        RoomInfo: false,
        Hitspheres: false,
        DamageValues: false,
        InfiniteItemCharges: false,
        HighLuck: false,
        QuickKill: false,
        GridInfo: false,
        PlayerItemInfo: false,
        GridCollisionPoints: false,
        AStarGrid: false,
    };

    constructor() {
        super();
    }

    public BeforeEnter() {
        this.entities = [];

        // Level will be set by loading screen if available, otherwise create new one
        if (!this.level) {
            this.level = new Level();
        }

        this.player = new Entity.Player();
        this.player.Enter();
        this.hud = new HUD();
        this.entities.push(this.player);
        this.entities.push(this.hud);

        this.level.GetRoom()?.BeforeEnter();
    }

    public setLevel(level: Level): void {
        this.level = level;
    }

    public Enter() {
        this.level.GetRoom()?.Enter();

        /*
        this.entities.forEach(((entity: Abstract.Entity) => {
            console.log("entity enter", entity)

            entity.Enter();
        }));
        */
    }

    public static initalize(): GameScene {
        if (!GameScene.instance) {
            GameScene.instance = new GameScene();
        }

        return GameScene.instance;
    }

    public GetPlayer(): Entity.Player {
        return this.player;
    }

    public GetLevel(): Level {
        return this.level;
    }

    public GetDebugSettings(): Type.DebugSettings {
        return this.debug;
    }

    public GetFrameCount(): number {
        return this.GameTime;
    }

    public GetRoomFrameCount(): number {
        return this.RoomTime;
    }


    public ChangeRoom(newRoom: Abstract.Room | null) {
        // Room changes disabled for shader studio demo - single room only
    }

    public Transition(newRoom: Abstract.Room, direction: Enum.Direction) {
        // Room transitions disabled for shader studio demo
        return;

        if (!this.transitioning) {
            // Immediately remove non-grid entities from current room to prevent collision during transition
            const currentRoom = this.level.GetRoom();
            if (currentRoom) {
                // Get only non-grid entities and call OnRoomExit on them
                const nonGridEntities = currentRoom.GetEntities().filter(entity => !(entity instanceof Abstract.GridEntity));
                nonGridEntities.forEach((entity: Abstract.Entity) => {
                    entity?.OnRoomExit();
                });
                // Only clear non-grid entities, preserve grid entities (walls, rocks, etc.)
                currentRoom.SetNonGridEntities([]);
            }

            this.level.GetRoom()?.Render();
            newRoom.Render();
            this.direction = "Move" + direction;
            this.nextRoom = newRoom;
            this.transitioning = true;
            this.mode = GameScene.TRANSITION_OUT;
            this.startTime = 1;
            this.RoomTime = 0;
        }
    }

    public Render() {
        Canvas.context.save();
        if (this.transitioning) {
            if (this.mode == GameScene.TRANSITION_OUT) {
                this.transitioning = (Transition as any)[this.direction](this.level.GetRoom() as Abstract.Room, this.nextRoom as Abstract.Room, 6, this.startTime, this.delta)!;
                if (this.transitioning === false) {
                    this.ChangeRoom(this.nextRoom);
                }
            } else {
                this.transitioning = false;
                this.mode = GameScene.RENDER;
            }
        } else {
            this.mode = GameScene.RENDER;
        }

        if (!this.transitioning) {
            this.level.GetRoom()?.Render();

            this.entities.concat(this.level.GetRoom().GetEntities()).
                //            this.level?.GetRoom()?.GetEntities().
                sort((a, b) => a.GetRenderOrder() - b.GetRenderOrder()).
                forEach(((entity: Abstract.Entity) => {
                    entity.Render();
                }));
        } else {
            this.entities.forEach(((entity: Abstract.Entity) => {
                entity.Render();
            }));
        }

        Canvas.context.restore();

        if (this.debug.Grid) this.debugDrawGrid();
        if (this.debug.AStarGrid) this.debugDrawAStarGrid();
    }

    public Update(delta: number) {
        this.delta = delta!;

        if (this.startTime > 0) {
            this.startTime++;
        }
        this.GameTime++;
        this.RoomTime++;

        this.entities.forEach(((entity: Abstract.Entity) => {
            entity.Update(delta);
        }));

        if (!this.transitioning) {
            const entities = this.entities.concat(this.level.GetRoom().GetEntities())
            const response: Response = new Response();

            entities.forEach((subject: Abstract.Entity, index: number) => {
                if (!subject) return;

                let subjectHitbox: Circle | Polygon | Vector = (subject.getTrait('hitbox') as Trait.HitBox | Trait.Solid)?.hitbox;
                if (!subjectHitbox && subject instanceof Abstract.Entity) {
                    subjectHitbox = (subject as Abstract.Entity).GetHitbox();
                }
                if (!subjectHitbox) return;

                for (let i = index + 1; i < entities.length; i++) {
                    const candidate = entities[i];
                    if (!candidate) continue;

                    if (subject instanceof Abstract.GridEntity && candidate instanceof Abstract.GridEntity) continue;

                    // Skip collision between NPCs and doors with WALL_EXCEPT_PLAYER collision class
                    // NPCs should be able to pass through doors freely
                    if (subject instanceof Abstract.EntityNPC && candidate instanceof Abstract.GridEntity) {
                        const gridEntity = candidate as Abstract.GridEntity;
                        if (gridEntity.GetCollisionClass() === Enum.GridCollisionClass.WALL_EXCEPT_PLAYER) {
                            continue;
                        }
                        // Flying enemies should not collide with any grid entities
                        if (subject.hasTrait && subject.hasTrait('flying')) {
                            continue;
                        }
                    }
                    if (candidate instanceof Abstract.EntityNPC && subject instanceof Abstract.GridEntity) {
                        const gridEntity = subject as Abstract.GridEntity;
                        if (gridEntity.GetCollisionClass() === Enum.GridCollisionClass.WALL_EXCEPT_PLAYER) {
                            continue;
                        }
                        // Flying enemies should not collide with any grid entities
                        if (candidate.hasTrait && candidate.hasTrait('flying')) {
                            continue;
                        }
                    }

                    let candidateHitbox: Circle | Polygon | Vector = (candidate.getTrait('hitbox') as Trait.HitBox | Trait.Solid)?.hitbox;
                    if (!candidateHitbox && candidate instanceof Abstract.Entity) {
                        candidateHitbox = (candidate as Abstract.Entity).GetHitbox();
                    }
                    if (!candidateHitbox) {
                        continue;
                    }

                    let debug = false;
                    if (candidate instanceof Entity.Grid.WallGroup) debug = true;

                    let collision: boolean = false;
                    response.clear();

                    if (subjectHitbox instanceof Circle && candidateHitbox instanceof Circle) {
                        collision = Collider.testCircleCircle(subjectHitbox, candidateHitbox, response)
                    } else if (subjectHitbox instanceof Polygon && candidateHitbox instanceof Circle) {
                        collision = Collider.testPolygonCircle(subjectHitbox, candidateHitbox, response)
                    } else if (subjectHitbox instanceof Circle && candidateHitbox instanceof Polygon) {
                        collision = Collider.testCirclePolygon(subjectHitbox, candidateHitbox, response)
                    } else if (subjectHitbox instanceof Polygon && candidateHitbox instanceof Polygon) {
                        collision = Collider.testPolygonPolygon(subjectHitbox, candidateHitbox, response)
                    } else if (subjectHitbox instanceof Circle && candidateHitbox instanceof Vector) {
                        collision = Collider.pointInCircle(candidateHitbox, subjectHitbox)
                    }

                    //if (debug) console.log(collision, candidateHitbox);
                    //if (debug) debugger;

                    if (!(subject.UUID in this.collisions)) {
                        this.collisions[subject.UUID] = {
                            [candidate.UUID]: false
                        }
                    } else {
                        if (!(candidate.UUID in this.collisions[subject.UUID])) {
                            this.collisions[subject.UUID][candidate.UUID] = false
                        }
                    }

                    if (!collision) {
                        if (this.collisions[subject.UUID][candidate.UUID]) {
                            subject.OnExitCollision(candidate, response);
                            candidate.OnExitCollision(subject, response);
                        }
                        this.collisions[subject.UUID][candidate.UUID] = false;
                    } else {
                        if (!this.collisions[subject.UUID][candidate.UUID]) {
                            subject.OnEnterCollision(candidate, response);
                            candidate.OnEnterCollision(subject, response);
                        }
                        this.collisions[subject.UUID][candidate.UUID] = true;
                        subject.Collision(candidate, response);
                        candidate.Collision(subject, response);
                    }
                }
            })
        }

        this.level.GetRoom()?.Update(delta);

        // Debug settings
        if (Input.IsKeyPressedOnce('F1')) {
            this.debug.Grid = !(this.debug?.Grid || false);
            console.log("DEBUG Grid is now", (this.debug.Grid ? "enabled" : "disabled"))
        }

        if (Input.IsKeyPressedOnce('F2')) {
            this.debug.Hitspheres = !(this.debug?.Hitspheres || false);
            console.log("DEBUG Hitspheres is now", (this.debug.Hitspheres ? "enabled" : "disabled"))
        }

        if (Input.IsKeyPressedOnce('F3')) {
            this.debug.AStarGrid = !(this.debug?.AStarGrid || false);
            console.log("DEBUG A* Grid is now", (this.debug.AStarGrid ? "enabled" : "disabled"))
        }
    }

    debugDrawGrid() {
        // Grid debug disabled - single room mode
    }

    debugDrawAStarGrid() {
        // Draw A* grid visualization - use 2x2 sub-grid for smoother pathfinding
        const room = this.level.GetRoom();
        if (!room) return;

        // Use 2x2 sub-grid: 30x18 with 13x13 cells starting at (26, 26)
        const gridWidth = 30;  // 15 * 2
        const gridHeight = 18; // 9 * 2 (11 rows - 2 for walls = 9 playable rows)
        const cellSize = 13;   // 26 / 2
        const roomLeft = 26;
        const roomTop = 26;

        // Create a simple grid for visualization
        const grid: number[][] = [];
        for (let y = 0; y < gridHeight; y++) {
            grid[y] = [];
            for (let x = 0; x < gridWidth; x++) {
                grid[y][x] = 1; // Default to walkable
            }
        }

        // Mark wall boundaries as always inaccessible
        // First 2 rows (top walls)
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < gridWidth; x++) {
                grid[y][x] = 0; // Mark as obstacle
            }
        }
        // Last 2 rows (bottom walls)
        for (let y = gridHeight - 2; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                grid[y][x] = 0; // Mark as obstacle
            }
        }
        // First 2 columns (left walls)
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < 2; x++) {
                grid[y][x] = 0; // Mark as obstacle
            }
        }
        // Last 2 columns (right walls)
        for (let y = 0; y < gridHeight; y++) {
            for (let x = gridWidth - 2; x < gridWidth; x++) {
                grid[y][x] = 0; // Mark as obstacle
            }
        }

        // Mark obstacles as unwalkable - only mark collidable grid entities
        const entities = room.GetEntities();

        entities.forEach((entity: Abstract.Entity) => {
            if (entity instanceof Abstract.GridEntity) {
                const collisionClass = entity.GetCollisionClass();

                // Only mark entities that actually block pathfinding based on their collision class
                const blocksPathfinding = collisionClass === Enum.GridCollisionClass.SOLID ||
                    collisionClass === Enum.GridCollisionClass.OBJECT ||
                    collisionClass === Enum.GridCollisionClass.WALL;

                if (blocksPathfinding) {
                    // Convert entity position to grid coordinates
                    // Grid entities are positioned at the center of their 26x26 cells
                    // A* grid uses 13x13 sub-cells, so each 26x26 cell = 2x2 sub-cells
                    const gridX = Math.floor((entity.Position.x - roomLeft) / 26) * 2;
                    const gridY = Math.floor((entity.Position.y - roomTop) / 26) * 2;

                    // Mark the 2x2 sub-grid cells for this entity
                    for (let y = gridY; y < gridY + 2 && y < gridHeight; y++) {
                        for (let x = gridX; x < gridX + 2 && x < gridWidth; x++) {
                            if (y >= 0 && x >= 0) {
                                grid[y][x] = 0; // Mark as obstacle
                            }
                        }
                    }
                }
            }
        });

        // Draw the A* sub-grid
        Canvas.context.save();
        Canvas.context.globalAlpha = 0.5;

        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const worldX = roomLeft + (x * cellSize);
                const worldY = roomTop + (y * cellSize);

                if (grid[y][x] === 0) {
                    // Obstacle - red
                    Canvas.context.fillStyle = '#ff0000';
                } else {
                    // Walkable - green
                    Canvas.context.fillStyle = '#00ff00';
                }

                Canvas.context.fillRect(worldX, worldY, cellSize, cellSize);
                Canvas.context.strokeStyle = '#ffffff';
                Canvas.context.lineWidth = 1;
                Canvas.context.strokeRect(worldX, worldY, cellSize, cellSize);
            }
        }

        Canvas.context.restore();
    }

}

export const Game = GameScene.initalize();