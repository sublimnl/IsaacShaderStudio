import { Abstract, Canvas, Entity, Enum, GridIndexToVector, Media, Polygon, Type, Vector, weightedRandom } from "../imports";
import { polygon } from 'polygon-tools';

const RoomConfigDefaults: Type.RoomConfig = {
    BackdropMediaName: "LevelBackdrop",
    Type: Enum.RoomType.DEFAULT,
    Doors: {},
    ID: 0,
}

export abstract class Room extends Abstract.Scene {
    private backdrop: HTMLImageElement;
    private config: Type.RoomConfig;
    private gridEntities: any[] = [];
    private GridEntityTemplate: any[] = [
        Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall,
        Entity.Grid.Wall, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Grid.Wall,
        Entity.Grid.Wall, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Grid.Wall,
        Entity.Grid.Wall, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Grid.Wall,
        Entity.Grid.Wall, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Grid.Wall,
        Entity.Grid.Wall, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Grid.Wall,
        Entity.Grid.Wall, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Grid.Wall,
        Entity.Grid.Wall, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Null, Entity.Grid.Wall,
        Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall, Entity.Grid.Wall,
    ]
    private roomId: number;
    private layoutId: string;
    public WallsReplaced: boolean;
    public walls: any[] = [];

    constructor(roomConfig?: Type.RoomConfig) {
        super();

        this.config = Object.assign(RoomConfigDefaults, roomConfig);
        this.roomId = this.config.ID;

        this.GenerateBackdrop();

        for (let i = 0; i < this.GridEntityTemplate.length; i++) {
            if (this.GridEntityTemplate[i] === Entity.Null) continue;
            this.gridEntities[i] = new this.GridEntityTemplate[i](GridIndexToVector(i));
        }

        // Doors disabled for shader studio demo
        // for (const value in this.config.Doors) {
        //     const doorSlot = parseInt(value, 10);
        //     this.gridEntities[doorSlot] = new Entity.Door(doorSlot, this.config.Doors[doorSlot])
        // }

        this.gridEntities.forEach(((entity: Abstract.Entity) => {
            entity.Enter();
        }))
    }

    get ID(): number {
        return this.roomId;
    }

    get LayoutID(): string {
        return this.layoutId ?? "UNKNOWN";
    }

    private GenerateBackdrop(): void {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.height = Canvas.height;
        canvas.width = Canvas.width;

        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.imageSmoothingEnabled = false;
        const sprite = Media.getImage(this.config.BackdropMediaName as string);

        const offsets = [
            {
                item: new Vector(0, 0),
                weight: 80,
            },
            {
                item: new Vector(9 * 26, 0),
                weight: 15,
            },
            {
                item: new Vector(0, 6 * 26),
                weight: 5,
            },
        ];

        // Top Left Corner
        const topLeftCorner = weightedRandom(offsets);
        context.drawImage(sprite, topLeftCorner.x, topLeftCorner.y, 52, 52, 0, 0, 52, 52);

        // First 7 top wall slots
        for (let i = 2; i < 9; i++) {
            const offset = weightedRandom(offsets);
            context.drawImage(sprite, offset.x + (i * 26), offset.y, 26, 52, i * 26, 0, 26, 52);
        }

        // Next 6 top wall slots, mirrored horizontally
        for (let i = 10; i < 16; i++) {
            const offset = weightedRandom(offsets);
            context.save();
            context.scale(-1, 1);
            context.drawImage(sprite, offset.x + ((17 - i) * 26), offset.y, 26, 52, i * 26 * -1, 0, 26, 52);
            context.restore();
        }

        // Top Right Corner
        const topRightCorner = weightedRandom(offsets);
        context.save();
        context.scale(-1, 1);
        context.drawImage(sprite, topRightCorner.x, topRightCorner.y, 52, 52, 17 * 26 * -1, 0, 52, 52);
        context.restore();

        // First 4 left and right walls
        for (let i = 2; i < 6; i++) {
            const leftWall = weightedRandom(offsets);
            context.drawImage(sprite, leftWall.x, leftWall.y + (i * 26), 52, 26, 0, i * 26, 52, 26);

            const rightWall = weightedRandom(offsets);
            context.save();
            context.scale(-1, 1);
            context.drawImage(sprite, rightWall.x, rightWall.y + (i * 26), 52, 26, 17 * 26 * -1, i * 26, 52, 26);
            context.restore();
        }

        // Next 3 left and right walls, mirrored vertically
        for (let i = 6; i < 10; i++) {
            const leftWall = weightedRandom(offsets);
            context.save();
            context.scale(1, -1);
            context.drawImage(sprite, leftWall.x, leftWall.y + ((11 - i) * 26), 52, 26, 0, i * 26 * -1, 52, 26);
            context.restore();

            const rightWall = weightedRandom(offsets);
            context.save();
            context.scale(-1, -1);
            context.drawImage(sprite, rightWall.x, rightWall.y + ((11 - i) * 26), 52, 26, 17 * 26 * -1, i * 26 * -1, 52, 26);
            context.restore();
        }

        // Bottom Left Corner
        const bottomLeftCorner = weightedRandom(offsets);
        context.save();
        context.scale(1, -1);
        context.drawImage(sprite, bottomLeftCorner.x, bottomLeftCorner.y, 52, 52, 0, 11 * 26 * -1, 52, 52);
        context.restore();

        // First 7 bottom wall slots, mirrored horizontally
        for (let i = 2; i < 9; i++) {
            const bottomWall = weightedRandom(offsets);
            context.save();
            context.scale(1, -1);
            context.drawImage(sprite, bottomWall.x + (i * 26), bottomWall.y, 26, 52, i * 26, 11 * 26 * -1, 26, 52);
            context.restore();
        }

        // Next 6 bottom wall slots, mirrored horizontally & vertically
        for (let i = 10; i < 16; i++) {
            const bottomWall = weightedRandom(offsets);
            context.save();
            context.scale(-1, -1);
            context.drawImage(sprite, bottomWall.x + ((17 - i) * 26), bottomWall.y, 26, 52, i * 26 * -1, 11 * 26 * -1, 26, 52);
            context.restore();
        }

        // Bottom Right Corner
        const bottomRightCorner = weightedRandom(offsets);
        context.save();
        context.scale(-1, -1);
        context.drawImage(sprite, bottomRightCorner.x, bottomRightCorner.y, 52, 52, 17 * 26 * -1, 11 * 26 * -1, 52, 52);
        context.restore();

        // Floor grid edges
        const floorOffsets = [
            {
                item: new Vector(52, 52),
                weight: 100,
            },
            {
                item: new Vector(286, 52),
                weight: 100,
            },
            {
                item: new Vector(52, 208),
                weight: 100,
            },
            {
                item: new Vector(286, 208),
                weight: 100,
            },
            {
                item: new Vector(52, 364),
                weight: 100,
            },
            {
                item: new Vector(286, 364),
                weight: 100,
            },
        ];

        // Top left grid (7x4)
        let offset = weightedRandom(floorOffsets);
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 4; j++) {
                context.drawImage(sprite, offset.x + (i * 26), offset.y + (j * 26), 26, 26, (i + 2) * 26, (j + 2) * 26, 26, 26)
            }
        }

        offset = weightedRandom(floorOffsets);
        for (let i = 7; i < 13; i++) {
            for (let j = 0; j < 4; j++) {
                context.save();
                context.scale(-1, 1);
                context.drawImage(sprite, offset.x + ((12 - i) * 26), offset.y + (j * 26), 26, 26, (i + 3) * 26 * -1, (j + 2) * 26, 26, 26)
                context.restore();
            }
        }

        offset = weightedRandom(floorOffsets);
        for (let i = 0; i < 7; i++) {
            for (let j = 4; j < 8; j++) {
                context.save();
                context.scale(1, -1);
                context.drawImage(sprite, offset.x + (i * 26), offset.y + ((7 - j) * 26), 26, 26, (i + 2) * 26, (j + 2) * 26 * -1, 26, 26)
                context.restore();
            }
        }

        offset = weightedRandom(floorOffsets);
        for (let i = 7; i < 13; i++) {
            for (let j = 4; j < 8; j++) {
                context.save();
                context.scale(-1, -1);
                context.drawImage(sprite, offset.x + ((12 - i) * 26), offset.y + ((7 - j) * 26), 26, 26, (i + 3) * 26 * -1, (j + 2) * 26 * -1, 26, 26)
                context.restore();
            }
        }

        const image = document.createElement("img") as HTMLImageElement;
        image.src = canvas.toDataURL();

        this.backdrop = image;
    }

    public GetEntities(): Abstract.Entity[] {
        return this.gridEntities.concat(this.entities);
    }

    public GetNonGridEntities(): Abstract.Entity[] {
        return this.entities;
    }

    public SetNonGridEntities(entities: Abstract.Entity[]) {
        this.entities = entities;
    }

    public AddEntity(entity: Abstract.Entity): void {
        this.entities.push(entity);
    }

    public RemoveEntity(reference: Abstract.Entity): void {
        // Remove from non-grid entities (NPCs, projectiles, etc.)
        const entities: Abstract.Entity[] = [];
        this.entities.forEach((entity: Abstract.Entity) => {
            if (reference !== entity) {
                entities.push(entity);
            }
        })

        this.entities = entities;
    }

    public SetGridEntity(index: number, entity: Abstract.Entity) {
        this.gridEntities[index] = entity;
    }

    public SetLayoutID(name: string) {
        this.layoutId = name;
    }

    public Update(delta: number) {
        this.gridEntities.forEach((entity: Abstract.Entity) => {
            entity.Update(delta);
        })

        this.entities.forEach((entity: Abstract.Entity) => {
            entity.Update(delta);
        });
    }

    public BeforeEnter(): void {
        this.gridEntities.forEach((entity: Abstract.Entity) => {
            entity.Update(0);
        })

        if (!this.WallsReplaced) {
            // Get connected walls
            let walls: { [id: number]: number[] } = {};
            for (let i = 0; i < this.GridEntityTemplate.length; i++) {
                if (this.gridEntities[i] instanceof Entity.Grid.Wall) {
                    let placed = false;
                    for (const wallGroup in walls) {
                        if ((i % 15 !== 0 && walls[wallGroup].includes(i - 1)) || walls[wallGroup].includes(i - 15)) {
                            walls[wallGroup].push(i);
                            placed = true;
                        }
                    }

                    if (!placed) {
                        walls[Object.keys(walls).length] = [i];
                    }
                }
            }

            walls = {};
            if (this.gridEntities[Enum.DoorSlot.UP] instanceof Entity.Grid.Wall) {
                walls[Object.keys(walls).length] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
            } else {
                walls[Object.keys(walls).length] = [0, 1, 2, 3, 4, 5, 6];
                walls[Object.keys(walls).length] = [8, 9, 10, 11, 12, 13, 14];
            }
            if (this.gridEntities[Enum.DoorSlot.RIGHT] instanceof Entity.Grid.Wall) {
                walls[Object.keys(walls).length] = [29, 44, 59, 74, 89, 104, 119];
            } else {
                walls[Object.keys(walls).length] = [29, 44, 59];
                walls[Object.keys(walls).length] = [89, 104, 119];
            }
            if (this.gridEntities[Enum.DoorSlot.DOWN] instanceof Entity.Grid.Wall) {
                walls[Object.keys(walls).length] = [120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134];
            } else {
                walls[Object.keys(walls).length] = [120, 121, 122, 123, 124, 125, 126];
                walls[Object.keys(walls).length] = [128, 129, 130, 131, 132, 133, 134];
            }
            if (this.gridEntities[Enum.DoorSlot.LEFT] instanceof Entity.Grid.Wall) {
                walls[Object.keys(walls).length] = [15, 30, 45, 60, 75, 90, 105];
            } else {
                walls[Object.keys(walls).length] = [15, 30, 45];
                walls[Object.keys(walls).length] = [75, 90, 105];
            }


            for (const wallGroup in walls) {
                const points = [];
                for (const i in walls[wallGroup]) {
                    const position = this.gridEntities[walls[wallGroup][i]].Position;
                    <Abstract.GridEntity>this.gridEntities[walls[wallGroup][i]].SetHitbox();
                    points.push([[position.x, position.y], [position.x + 26, position.y], [position.x + 26, position.y + 26], [position.x, position.y + 26]]);

                }

                // Get union of points
                const tempPoints = polygon.union(...points)[0];

                // Remove unnecessary grid points and convert to Vectors
                const newPoints = [];
                newPoints.push(new Vector(tempPoints[0][0], tempPoints[0][1]))
                for (let i = 1; i < tempPoints.length - 1; i++) {
                    if (!(tempPoints[i][0] === tempPoints[i - 1][0] && tempPoints[i][0] === tempPoints[i + 1][0]) && !(tempPoints[i][1] === tempPoints[i - 1][1] && tempPoints[i][1] === tempPoints[i + 1][1])) {
                        newPoints.push(new Vector(tempPoints[i][0], tempPoints[i][1]));
                    }
                }

                this.gridEntities.push(new Entity.Grid.WallGroup(new Vector(newPoints[0].x, newPoints[0].y), new Polygon(new Vector(0, 0), newPoints)))
            }
            this.WallsReplaced = true;
        }
    }

    public Enter(): void {
        // Room enter - doors and enemies disabled for shader studio demo
    }

    public Render() {
        Canvas.context.drawImage(this.backdrop, 0, 0);
        Media.draw("RoomShading", 0, 0);

        // Entity Rendering is handled by the Game Scene to ensure Pivot Position indexing for layers.
    }
}