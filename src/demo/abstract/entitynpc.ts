import { Abstract, Box, Canvas, Entity, Enum, Game, LineOfSight, Media, SceneManager, Vector } from "../imports";

export class EntityNPC extends Abstract.Entity {
    protected HP: number = 3;
    protected Ready: boolean = false;
    protected CollisionRadius: number = 8;

    // BFS pathfinding properties
    private bfsDistanceGrid: number[][] | null = null;
    private bfsGridWidth: number = 0;
    private bfsGridHeight: number = 0;
    private bfsCellSize: number = 0;
    private bfsRoomLeft: number = 0;
    private bfsRoomTop: number = 0;

    protected ProjectileCooldown: number;
    protected ProjectileDelay: number;

    protected State: Enum.NpcState = Enum.NpcState.INIT;
    protected StateFrame: number = 0;

    public Alive: boolean = true;

    constructor(position: Vector) {
        position.add(new Vector(13, 13));
        super(position);
    }

    public Update(delta: number): void {
        super.Update(delta);

        if (Game.GetRoomFrameCount() > 10) {
            this.Ready = true;
        }

        if (!this.Alive) {
            Game.GetLevel()?.GetRoom()?.RemoveEntity(this);
        }

        if (this.Hitbox) this.Hitbox.pos = this.Position;
    }

    Render(): void {
        super.Render();

        if (this.Alive) Media.getFont("luaminioutlined").write(String(this.HP), this.Position.clone().sub(new Vector(7, 6)));
    }

    OnRoomEnter(): void {
        super.OnRoomEnter();
    }

    OnRoomExit(): void {
        super.OnRoomExit();

        this.Ready = false;
    }

    private lastPathTarget: Vector | null = null;
    private lastPathTime: number = 0;
    private cachedPath: Vector[] = [];
    private pathCacheTimeout: number = 2000; // Cache path for 2 seconds

    public FindPath(target: Vector, width?: number): Vector[] {
        const currentTime = Date.now();

        // Check if we can use cached BFS grid
        if (this.bfsDistanceGrid &&
            this.lastPathTarget &&
            (currentTime - this.lastPathTime) < this.pathCacheTimeout &&
            Math.abs(this.lastPathTarget.x - target.x) < 20 &&
            Math.abs(this.lastPathTarget.y - target.y) < 20) {
            return []; // Return empty path - entity will use gradient descent
        }

        // First check line of sight - if clear, move directly
        if (this.LineOfSight(target)) {
            // Direct movement - no BFS needed
            this.bfsDistanceGrid = null; // Clear BFS grid
            this.lastPathTarget = target.clone();
            this.lastPathTime = currentTime;
            return []; // Entity will move directly
        }

        // Line of sight blocked - use BFS pathfinding
        this.findBFSPath(target);

        // Cache the BFS grid
        this.lastPathTarget = target.clone();
        this.lastPathTime = currentTime;

        return []; // Return empty path - entity will use gradient descent
    }


    public GetBFSMovementDirection(): Vector | null {
        if (!this.bfsDistanceGrid) {
            // No BFS grid means line of sight is clear - move directly to target
            const player = Game.GetPlayer();
            if (player) {
                const direction = player.Position.clone();
                direction.x -= this.Position.x;
                direction.y -= this.Position.y;
                const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
                console.log(`${this.constructor.name} GetBFSMovementDirection: Direct movement - direction (${direction.x},${direction.y}), magnitude ${magnitude}`);
                if (magnitude > 0.1) {
                    const normalized = direction.normalize();
                    console.log(`${this.constructor.name} GetBFSMovementDirection: Normalized direction (${normalized.x},${normalized.y})`);
                    return normalized;
                }
            }
            console.log(`${this.constructor.name} GetBFSMovementDirection: No direct movement - too close or no player`);
            return null;
        }

        // Convert current position to grid coordinates
        const currentX = Math.floor((this.Position.x - this.bfsRoomLeft) / this.bfsCellSize);
        const currentY = Math.floor((this.Position.y - this.bfsRoomTop) / this.bfsCellSize);

        // Clamp to grid bounds
        const clampedX = Math.max(0, Math.min(this.bfsGridWidth - 1, currentX));
        const clampedY = Math.max(0, Math.min(this.bfsGridHeight - 1, currentY));

        console.log(`${this.constructor.name} GetBFSMovementDirection: pos=(${this.Position.x},${this.Position.y}), grid=(${clampedX},${clampedY})`);

        // Check if we're at the target (distance 0)
        if (this.bfsDistanceGrid[clampedY][clampedX] === 0) {
            console.log(`${this.constructor.name} GetBFSMovementDirection: At target (distance 0)`);
            return null; // We've reached the target
        }

        const currentDistance = this.bfsDistanceGrid[clampedY][clampedX];
        console.log(`${this.constructor.name} GetBFSMovementDirection: Current distance = ${currentDistance}`);

        // Define directions with priority: cardinal first, then diagonal
        const cardinalDirections = [
            { dx: 0, dy: 1 },     // Down
            { dx: 1, dy: 0 },     // Right
            { dx: 0, dy: -1 },    // Up
            { dx: -1, dy: 0 }     // Left
        ];
        const diagonalDirections = [
            { dx: 1, dy: 1 },     // Down-Right
            { dx: 1, dy: -1 },    // Up-Right
            { dx: -1, dy: 1 },    // Down-Left
            { dx: -1, dy: -1 }    // Up-Left
        ];

        let bestDirection: Vector | null = null;
        let bestDistance = currentDistance;

        // First, try cardinal directions (preferred for obstacle avoidance)
        for (const dir of cardinalDirections) {
            const newX = clampedX + dir.dx;
            const newY = clampedY + dir.dy;

            if (newX < 0 || newX >= this.bfsGridWidth || newY < 0 || newY >= this.bfsGridHeight) {
                continue;
            }

            const newDistance = this.bfsDistanceGrid[newY][newX];
            console.log(`${this.constructor.name} GetBFSMovementDirection: Cardinal (${dir.dx},${dir.dy}) -> distance ${newDistance}`);

            if (newDistance !== -1 && newDistance < bestDistance) {
                bestDistance = newDistance;
                bestDirection = new Vector(dir.dx, dir.dy);
                console.log(`${this.constructor.name} GetBFSMovementDirection: New best cardinal direction (${dir.dx},${dir.dy}) with distance ${newDistance}`);
            }
        }

        // If no good cardinal direction found, try diagonal directions
        if (!bestDirection) {
            for (const dir of diagonalDirections) {
                const newX = clampedX + dir.dx;
                const newY = clampedY + dir.dy;

                if (newX < 0 || newX >= this.bfsGridWidth || newY < 0 || newY >= this.bfsGridHeight) {
                    continue;
                }

                const newDistance = this.bfsDistanceGrid[newY][newX];
                console.log(`${this.constructor.name} GetBFSMovementDirection: Diagonal (${dir.dx},${dir.dy}) -> distance ${newDistance}`);

                if (newDistance !== -1 && newDistance < bestDistance) {
                    bestDistance = newDistance;
                    bestDirection = new Vector(dir.dx, dir.dy);
                    console.log(`${this.constructor.name} GetBFSMovementDirection: New best diagonal direction (${dir.dx},${dir.dy}) with distance ${newDistance}`);
                }
            }
        }

        console.log(`${this.constructor.name} GetBFSMovementDirection: Final direction = ${bestDirection ? `(${bestDirection.x},${bestDirection.y})` : 'null'}`);
        return bestDirection;
    }

    private findBlockingObstacle(target: Vector): Abstract.GridEntity | null {
        const room = Game.GetLevel()?.GetRoom();
        if (!room) return null;

        const entities = room.GetEntities();
        let closestObstacle: Abstract.GridEntity | null = null;
        let closestDistance = Infinity;

        for (const entity of entities) {
            if (entity instanceof Abstract.GridEntity) {
                const gridEntity = entity as Abstract.GridEntity;
                const collisionClass = gridEntity.GetCollisionClass();

                if (collisionClass === Enum.GridCollisionClass.SOLID ||
                    collisionClass === Enum.GridCollisionClass.OBJECT ||
                    collisionClass === Enum.GridCollisionClass.WALL) {

                    // Check if this obstacle is between us and the target
                    if (this.isObstacleBetween(this.Position, target, gridEntity)) {
                        const distance = Math.sqrt(
                            (gridEntity.Position.x - this.Position.x) ** 2 +
                            (gridEntity.Position.y - this.Position.y) ** 2
                        );

                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestObstacle = gridEntity;
                        }
                    }
                }
            }
        }

        return closestObstacle;
    }

    private isObstacleBetween(start: Vector, end: Vector, obstacle: Abstract.GridEntity): boolean {
        // Check if obstacle is roughly between start and end points
        const obstaclePos = obstacle.Position;
        const obstacleRadius = (obstacle as any).CollisionRadius || 12;

        // Calculate the distance from the line to the obstacle center
        const lineLength = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
        if (lineLength === 0) return false;

        const t = Math.max(0, Math.min(1,
            ((obstaclePos.x - start.x) * (end.x - start.x) + (obstaclePos.y - start.y) * (end.y - start.y)) / (lineLength * lineLength)
        ));

        const closestPoint = new Vector(
            start.x + t * (end.x - start.x),
            start.y + t * (end.y - start.y)
        );

        const distanceToObstacle = Math.sqrt(
            (closestPoint.x - obstaclePos.x) ** 2 + (closestPoint.y - obstaclePos.y) ** 2
        );

        return distanceToObstacle < (obstacleRadius + this.CollisionRadius + 5);
    }

    private findObstacleAvoidancePath(obstacle: Abstract.GridEntity, target: Vector): Vector[] {
        const obstaclePos = obstacle.Position;
        const obstacleRadius = (obstacle as any).CollisionRadius || 12;
        const safeDistance = obstacleRadius + this.CollisionRadius + 25; // Reduced safe distance

        // Calculate perpendicular directions to go around the obstacle
        const directionToObstacle = this.Position.clone().sub(obstaclePos).normalize();
        const perpendicular1 = new Vector(-directionToObstacle.y, directionToObstacle.x);
        const perpendicular2 = new Vector(directionToObstacle.y, -directionToObstacle.x);

        // Try multiple distances and angles around the obstacle
        const distances = [safeDistance, safeDistance + 20, safeDistance + 40, safeDistance + 60];
        const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]; // Full 360-degree coverage

        // Try to find a path that goes around the obstacle
        for (const distance of distances) {
            for (const angle of angles) {
                // Try both sides with different angles
                const side1Dir = perpendicular1.clone().rotate(angle);
                const side2Dir = perpendicular2.clone().rotate(angle);

                const side1Pos = obstaclePos.clone().add(side1Dir.scale(distance));
                const side2Pos = obstaclePos.clone().add(side2Dir.scale(distance));

                // Check which side gets us closer to the target
                const distance1 = Math.sqrt((side1Pos.x - target.x) ** 2 + (side1Pos.y - target.y) ** 2);
                const distance2 = Math.sqrt((side2Pos.x - target.x) ** 2 + (side2Pos.y - target.y) ** 2);

                const chosenSide = distance1 < distance2 ? side1Pos : side2Pos;

                // Check if we can reach the chosen side
                if (LineOfSight(this.Position, chosenSide, this.CollisionRadius, this)) {
                    // Additional check: make sure the chosen side is not too close to other obstacles
                    const room = Game.GetLevel()?.GetRoom();
                    if (room) {
                        const entities = room.GetEntities();
                        let tooCloseToObstacle = false;

                        for (const entity of entities) {
                            if (entity instanceof Abstract.GridEntity && entity !== obstacle) {
                                const gridEntity = entity as Abstract.GridEntity;
                                const collisionClass = gridEntity.GetCollisionClass();

                                if (collisionClass === Enum.GridCollisionClass.SOLID ||
                                    collisionClass === Enum.GridCollisionClass.OBJECT ||
                                    collisionClass === Enum.GridCollisionClass.WALL) {

                                    const distanceToOtherObstacle = Math.sqrt(
                                        (chosenSide.x - gridEntity.Position.x) ** 2 +
                                        (chosenSide.y - gridEntity.Position.y) ** 2
                                    );

                                    const otherObstacleRadius = (gridEntity as any).CollisionRadius || 12;
                                    const minDistance = otherObstacleRadius + this.CollisionRadius + 20;

                                    if (distanceToOtherObstacle < minDistance) {
                                        tooCloseToObstacle = true;
                                        break;
                                    }
                                }
                            }
                        }

                        if (tooCloseToObstacle) {
                            continue; // Try next angle/distance
                        }
                    }

                    // Check if we can reach the target from the chosen side
                    if (LineOfSight(chosenSide, target, this.CollisionRadius, this)) {
                        const path = [chosenSide, target];
                        if (this.validatePath(path)) {
                            return path;
                        }
                    } else {
                        const path = [chosenSide];
                        if (this.validatePath(path)) {
                            return path;
                        }
                    }
                }
            }
        }

        return [];
    }

    private findWaypointPath(target: Vector): Vector[] {
        // Try to find intermediate waypoints that can help us navigate around obstacles
        const room = Game.GetLevel()?.GetRoom();
        if (!room) return [];

        const entities = room.GetEntities();
        const waypoints: Vector[] = [];

        // Find potential waypoints (corners of obstacles, open spaces)
        for (const entity of entities) {
            if (entity instanceof Abstract.GridEntity) {
                const gridEntity = entity as Abstract.GridEntity;
                const collisionClass = gridEntity.GetCollisionClass();

                if (collisionClass === Enum.GridCollisionClass.SOLID ||
                    collisionClass === Enum.GridCollisionClass.OBJECT ||
                    collisionClass === Enum.GridCollisionClass.WALL) {

                    const obstaclePos = gridEntity.Position;
                    const obstacleRadius = (gridEntity as any).CollisionRadius || 12;
                    const safeDistance = obstacleRadius + this.CollisionRadius + 15;

                    // Add waypoints around this obstacle
                    const angles = [0, 45, 90, 135, 180, 225, 270, 315];
                    for (const angle of angles) {
                        const waypoint = obstaclePos.clone().add(new Vector(
                            Math.cos(angle * Math.PI / 180) * safeDistance,
                            Math.sin(angle * Math.PI / 180) * safeDistance
                        ));
                        waypoints.push(waypoint);
                    }
                }
            }
        }

        // Try to find a path through waypoints
        for (const waypoint of waypoints) {
            if (LineOfSight(this.Position, waypoint, this.CollisionRadius, this) &&
                LineOfSight(waypoint, target, this.CollisionRadius, this)) {
                const path = [waypoint, target];
                // Validate the path before returning
                if (this.validatePath(path)) {
                    return path;
                }
            }
        }

        return [];
    }

    private findFallbackPath(target: Vector): Vector[] {
        // Fallback: try to move in any direction that gets us closer
        const directionToTarget = this.TargetDirection(target);
        const currentDistanceToTarget = Math.sqrt(
            (this.Position.x - target.x) ** 2 + (this.Position.y - target.y) ** 2
        );

        // More comprehensive angle search
        const angles = [0, -15, 15, -30, 30, -45, 45, -60, 60, -75, 75, -90, 90, -105, 105, -120, 120, -135, 135, -150, 150, -165, 165, 180];
        const distances = [15, 20, 25, 30, 35, 40, 50, 60];

        // First pass: try to get closer to target
        for (const distance of distances) {
            for (const angle of angles) {
                const testDir = directionToTarget.clone().rotate(angle);
                const testPos = this.Position.clone().add(testDir.scale(distance));

                if (LineOfSight(this.Position, testPos, this.CollisionRadius, this)) {
                    const distanceToTarget = Math.sqrt(
                        (testPos.x - target.x) ** 2 + (testPos.y - target.y) ** 2
                    );

                    if (distanceToTarget < currentDistanceToTarget) {
                        const path = [testPos];
                        // Validate the path before returning
                        if (this.validatePath(path)) {
                            return path;
                        }
                    }
                }
            }
        }

        // Second pass: try any clear direction (even if not closer)
        for (const distance of distances) {
            for (const angle of angles) {
                const testDir = directionToTarget.clone().rotate(angle);
                const testPos = this.Position.clone().add(testDir.scale(distance));

                if (LineOfSight(this.Position, testPos, this.CollisionRadius, this)) {
                    const path = [testPos];
                    // Validate the path before returning
                    if (this.validatePath(path)) {
                        return path;
                    }
                }
            }
        }

        return [];
    }

    private validatePath(path: Vector[]): boolean {
        if (!path || path.length === 0) {
            if (!SceneManager.IsPaused()) {
            }
            return false;
        }

        // Check if the entire path is clear by testing multiple points along each segment
        let currentPos = this.Position;

        for (let i = 0; i < path.length; i++) {
            const waypoint = path[i];

            // Test multiple points along the path segment to ensure it's truly clear
            const segmentLength = Math.sqrt(
                (waypoint.x - currentPos.x) ** 2 + (waypoint.y - currentPos.y) ** 2
            );

            // Test fewer points along the segment for less strict validation
            const testPoints = Math.max(2, Math.floor(segmentLength / 30)); // Test every 30 pixels


            for (let j = 0; j <= testPoints; j++) {
                const t = j / testPoints;
                const testPoint = new Vector(
                    currentPos.x + t * (waypoint.x - currentPos.x),
                    currentPos.y + t * (waypoint.y - currentPos.y)
                );

                // Check if this point is clear
                const isClear = LineOfSight(currentPos, testPoint, this.CollisionRadius, this);

                if (!isClear) {
                    return false; // Path is blocked
                }
            }

            currentPos = waypoint;
        }

        return true; // All segments are clear
    }


    private findBFSPath(target: Vector): Vector[] {
        // BFS flood-fill pathfinding based on original Isaac implementation
        try {
            // Use the same room instance as the visual debug grid
            const room = Game.GetLevel()?.GetRoom();
            if (!room) return [];

            console.log(`${this.constructor.name} Using room: ${room.constructor.name}`);

            // Use full grid resolution for BFS pathfinding
            const gridWidth = 15;  // Full room width
            const gridHeight = 9;  // Full room height (11 rows - 2 for walls = 9 playable rows)
            const cellSize = 26;   // Full cell size
            const roomLeft = 26;
            const roomTop = 26;

            // Convert positions to grid coordinates relative to room boundaries
            const startX = Math.floor((this.Position.x - roomLeft) / cellSize);
            const startY = Math.floor((this.Position.y - roomTop) / cellSize);
            const endX = Math.floor((target.x - roomLeft) / cellSize);
            const endY = Math.floor((target.y - roomTop) / cellSize);

            console.log(`${this.constructor.name} BFS: Raw conversion - pos(${this.Position.x},${this.Position.y}) -> (${startX},${startY}), roomLeft=${roomLeft}, roomTop=${roomTop}, cellSize=${cellSize}`);

            // Clamp to grid bounds
            const clampedStartX = Math.max(0, Math.min(gridWidth - 1, startX));
            const clampedStartY = Math.max(0, Math.min(gridHeight - 1, startY));
            const clampedEndX = Math.max(0, Math.min(gridWidth - 1, endX));
            const clampedEndY = Math.max(0, Math.min(gridHeight - 1, endY));

            console.log(`${this.constructor.name} BFS inputs: start=(${clampedStartX},${clampedStartY}), end=(${clampedEndX},${clampedEndY})`);
            console.log(`${this.constructor.name} BFS: Entity position (${this.Position.x},${this.Position.y}) -> grid (${clampedStartX},${clampedStartY})`);

            // Create grid with obstacles
            const grid: number[][] = [];
            for (let y = 0; y < gridHeight; y++) {
                grid[y] = [];
                for (let x = 0; x < gridWidth; x++) {
                    grid[y][x] = 0; // Default to walkable (0 = walkable, -1 = un-walkable)
                }
            }

            // Mark wall boundaries as always inaccessible
            // First 2 rows (top walls)
            for (let y = 0; y < 2; y++) {
                for (let x = 0; x < gridWidth; x++) {
                    grid[y][x] = -1; // Mark as obstacle (-1 = un-walkable)
                }
            }
            // Last 2 rows (bottom walls)
            for (let y = gridHeight - 2; y < gridHeight; y++) {
                for (let x = 0; x < gridWidth; x++) {
                    grid[y][x] = -1; // Mark as obstacle
                }
            }
            // First 2 columns (left walls)
            for (let y = 0; y < gridHeight; y++) {
                for (let x = 0; x < 2; x++) {
                    grid[y][x] = -1; // Mark as obstacle
                }
            }
            // Last 2 columns (right walls)
            for (let y = 0; y < gridHeight; y++) {
                for (let x = gridWidth - 2; x < gridWidth; x++) {
                    grid[y][x] = -1; // Mark as obstacle
                }
            }

            // Mark obstacles as unwalkable - only mark collidable grid entities
            const entities = room.GetEntities();
            let obstacleCount = 0;

            entities.forEach((entity: Abstract.Entity) => {
                // Skip the entity that's doing the pathfinding to avoid self-obstacle marking
                if (entity === this) {
                    return;
                }

                if (entity instanceof Abstract.GridEntity) {
                    const collisionClass = entity.GetCollisionClass();

                    // Only mark entities that actually block pathfinding based on their collision class
                    const blocksPathfinding = collisionClass === Enum.GridCollisionClass.SOLID ||
                        collisionClass === Enum.GridCollisionClass.OBJECT ||
                        collisionClass === Enum.GridCollisionClass.WALL;

                    if (blocksPathfinding) {
                        obstacleCount++;
                        // Convert entity position to grid coordinates
                        // Grid entities are positioned at the center of their 26x26 cells
                        // BFS grid now uses full 26x26 cells
                        const gridX = Math.floor((entity.Position.x - roomLeft) / cellSize);
                        const gridY = Math.floor((entity.Position.y - roomTop) / cellSize);

                        // Mark the single grid cell for this entity
                        if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
                            grid[gridY][gridX] = -1; // Mark as obstacle (-1 = un-walkable)
                            console.log(`${this.constructor.name} BFS: Marked obstacle at grid (${gridX},${gridY}) for entity at (${entity.Position.x},${entity.Position.y})`);
                        }
                    }
                }
            });

            console.log(`${this.constructor.name} Marked ${obstacleCount} obstacles in BFS grid`);

            // Validate start and end points are not on obstacles
            console.log(`${this.constructor.name} BFS: Start point (${clampedStartX},${clampedStartY}) has value ${grid[clampedStartY][clampedStartX]}`);
            if (grid[clampedStartY][clampedStartX] === -1) {
                console.log(`${this.constructor.name} BFS: Start point is on obstacle - entity at (${this.Position.x},${this.Position.y}) maps to grid (${clampedStartX},${clampedStartY})`);
                return [];
            }
            if (grid[clampedEndY][clampedEndX] === -1) {
                console.log(`${this.constructor.name} BFS: End point (${clampedEndX},${clampedEndY}) is on obstacle - target at (${target.x},${target.y})`);
                return [];
            }

            // Perform BFS flood-fill from target to start
            const distanceGrid: number[][] = [];
            for (let y = 0; y < gridHeight; y++) {
                distanceGrid[y] = [];
                for (let x = 0; x < gridWidth; x++) {
                    distanceGrid[y][x] = -1; // Unvisited
                }
            }

            // BFS queue: [x, y, distance]
            const queue: [number, number, number][] = [];
            queue.push([clampedEndX, clampedEndY, 0]);
            distanceGrid[clampedEndY][clampedEndX] = 0;

            // 8-directional movement offsets (like original Isaac)
            const directions = [
                [0, 1], [1, 0], [0, -1], [-1, 0],  // 4-directional
                [1, 1], [1, -1], [-1, 1], [-1, -1]  // 8-directional
            ];

            // Flood-fill BFS
            while (queue.length > 0) {
                const [currentX, currentY, currentDist] = queue.shift()!;

                for (const [dx, dy] of directions) {
                    const newX = currentX + dx;
                    const newY = currentY + dy;

                    // Check bounds
                    if (newX < 0 || newX >= gridWidth || newY < 0 || newY >= gridHeight) {
                        continue;
                    }

                    // Check if already visited or is obstacle
                    if (distanceGrid[newY][newX] !== -1 || grid[newY][newX] === -1) {
                        continue;
                    }

                    // Mark as visited with distance
                    distanceGrid[newY][newX] = currentDist + 1;
                    queue.push([newX, newY, currentDist + 1]);
                }
            }

            // Check if path exists
            if (distanceGrid[clampedStartY][clampedStartX] === -1) {
                console.log(`${this.constructor.name} BFS: No path found`);
                return [];
            }

            // Store the distance grid for real-time gradient descent
            // The entity will use this to find the best direction to move
            this.bfsDistanceGrid = distanceGrid;
            this.bfsGridWidth = gridWidth;
            this.bfsGridHeight = gridHeight;
            this.bfsCellSize = cellSize;
            this.bfsRoomLeft = roomLeft;
            this.bfsRoomTop = roomTop;

            console.log(`${this.constructor.name} BFS distance field created successfully`);

            // Return empty path - entity will use gradient descent instead
            return [];
        } catch (error) {
            console.log(`${this.constructor.name} BFS error:`, error);
            // If BFS fails, return empty array
            return this.findSimplePath(target);
        }
    }

    private findSimplePath(target: Vector): Vector[] {
        // Simple pathfinding fallback when A* fails
        // Try direct line of sight first
        if (LineOfSight(this.Position, target, this.CollisionRadius, this)) {
            return [target];
        }

        // Try multi-angle probing
        const testAngles = [0, 45, 90, 135, 180, 225, 270, 315];
        const testDistances = [30, 50, 70];

        for (const distance of testDistances) {
            for (const angle of testAngles) {
                const testDir = new Vector(
                    Math.cos(angle * Math.PI / 180),
                    Math.sin(angle * Math.PI / 180)
                );
                const testPos = this.Position.clone().add(testDir.scale(distance));

                // Check if we can reach this test position
                if (LineOfSight(this.Position, testPos, this.CollisionRadius, this)) {
                    // Check if we can reach target from test position
                    if (LineOfSight(testPos, target, this.CollisionRadius, this)) {
                        return [testPos, target];
                    }
                }
            }
        }

        // If all else fails, try moving towards target anyway
        return [target];
    }

    private validateAStarPath(path: Vector[]): Vector[] {
        // Validate that the path doesn't go through obstacles
        const room = Game.GetLevel()?.GetRoom();
        if (!room) return [];

        for (let i = 0; i < path.length; i++) {
            const waypoint = path[i];

            // Check if this waypoint is on an obstacle
            const entities = room.GetEntities();
            for (const entity of entities) {
                if (entity instanceof Abstract.GridEntity) {
                    const collisionClass = entity.GetCollisionClass();
                    const blocksPathfinding = collisionClass === Enum.GridCollisionClass.SOLID ||
                        collisionClass === Enum.GridCollisionClass.OBJECT ||
                        collisionClass === Enum.GridCollisionClass.WALL;

                    if (blocksPathfinding) {
                        const distance = Math.sqrt(
                            (waypoint.x - entity.Position.x) ** 2 + (waypoint.y - entity.Position.y) ** 2
                        );

                        // If waypoint is too close to an obstacle, this path is invalid
                        // Use a very small distance - A* already handles obstacle avoidance
                        if (distance < 5) {
                            return []; // Return empty path - invalid
                        }
                    }
                }
            }
        }

        return path; // Path is valid
    }

    private drawAStarPath(path: Vector[], color: string): void {
        if (path.length < 2) return;

        Canvas.context.strokeStyle = color;
        Canvas.context.lineWidth = 3;
        Canvas.context.beginPath();
        Canvas.context.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length; i++) {
            Canvas.context.lineTo(path[i].x, path[i].y);
        }
        Canvas.context.stroke();
        Canvas.context.lineWidth = 1;
    }

    public DrawLineOfSight(target: Vector, width?: number): void {
        const los = new Box(this.Position, width, this.DistanceTo(target));

        const dir = this.TargetDirection(target);
        const angle = Math.atan2(dir.x, dir.y);

        const poly = los.toPolygon()
        poly.rotate(-angle)

        if (this.LineOfSight(target, width)) {
            Canvas.context.strokeStyle = "yellow";
        } else {
            Canvas.context.strokeStyle = "red";
        }
        Canvas.context.beginPath();
        Canvas.context.moveTo(this.Position.x, this.Position.y);
        poly.points.forEach((point) => {
            Canvas.context.lineTo(this.Position.x + point.x, this.Position.y + point.y);
        })
        Canvas.context.lineTo(this.Position.x, this.Position.y);
        Canvas.context.stroke();
    }

    public LineOfSight(target: Vector, width?: number): boolean {
        return LineOfSight(this.Position, target, width || 1, this);
    }

    public Collision(target: Abstract.Entity, response?: SAT.Response): void {
        super.Collision(target, response); // Apply base collision physics first

        if (response && target instanceof Abstract.EntityNPC) {
            // For NPC-to-NPC collisions, calculate a direct separation vector
            const directionVector = this.Position.clone().sub(target.Position);
            const distance = Math.sqrt(directionVector.x * directionVector.x + directionVector.y * directionVector.y); // Manual magnitude
            const targetRadius = (target as any).CollisionRadius || 8;

            if (distance < (this.CollisionRadius + targetRadius)) {
                if (distance > 0) {
                    directionVector.x = directionVector.x / distance; // Manual normalize
                    directionVector.y = directionVector.y / distance;
                } else { // Handle zero distance
                    directionVector.x = Math.random() - 0.5;
                    directionVector.y = Math.random() - 0.5;
                    const randomMagnitude = Math.sqrt(directionVector.x * directionVector.x + directionVector.y * directionVector.y);
                    directionVector.x = directionVector.x / randomMagnitude;
                    directionVector.y = directionVector.y / randomMagnitude;
                }

                const targetSeparation = (this.CollisionRadius + targetRadius); // No buffer - only separate when actually overlapping
                const currentSeparation = distance;
                const separationNeeded = targetSeparation - currentSeparation;

                if (separationNeeded > 0) {
                    // Push this entity away from the target
                    const pushVector = directionVector.clone().scale(separationNeeded);
                    this.Position.add(pushVector);
                }
            }
        } else if (response && target instanceof Abstract.GridEntity && !this.hasTrait('flying')) {
            // Only ground-based enemies collide with grid entities
            // Flying enemies should pass over grid entities entirely
            const collisionClass = target.GetCollisionClass();
            if (collisionClass === Enum.GridCollisionClass.SOLID ||
                collisionClass === Enum.GridCollisionClass.OBJECT ||
                collisionClass === Enum.GridCollisionClass.WALL) {
                // Base Entity.Collision() already applies separation using overlapV
                // Only add additional separation if entities are still too close after base collision
                const distance = Math.sqrt(
                    (this.Position.x - target.Position.x) ** 2 +
                    (this.Position.y - target.Position.y) ** 2
                );
                const targetRadius = (target as any).CollisionRadius || 12; // Default for grid entities
                const minDistance = this.CollisionRadius + targetRadius + 2; // 2 pixel buffer

                if (distance < minDistance) {
                    const directionVector = this.Position.clone().sub(target.Position);
                    if (directionVector.x !== 0 || directionVector.y !== 0) {
                        const magnitude = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2);
                        directionVector.x = directionVector.x / magnitude;
                        directionVector.y = directionVector.y / magnitude;
                        const additionalSeparation = directionVector.clone().scale(minDistance - distance);
                        this.Position.add(additionalSeparation);
                    }
                }
            }
        }
    }
}

