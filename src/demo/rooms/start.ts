import { Abstract, Canvas, Entity, GridIndexToVector, Media, Room, Type } from "../imports";

export class StartRoom extends Abstract.Room {
    constructor(roomConfig: Type.RoomConfig) {
        super(roomConfig);

        const layout = Room.RoomLayoutGridEntityTest;

        for (let x = 0; x < 14; x++) {
            for (let y = 0; y < 11; y++) {
                if (layout.Grid[y * 11 + x] === Entity.Null) continue;

                try {
                    const EntityClass = layout.Grid[y * 11 + x];
                    if (typeof EntityClass !== 'function') {
                        console.error(`Start Room Layout Error: Entity at position (${x}, ${y}) is not a constructor.`, {
                            roomLayout: layout.LayoutID || 'Unknown',
                            position: { x, y },
                            gridIndex: y * 11 + x,
                            entityType: EntityClass,
                            layoutGrid: layout.Grid
                        });
                        continue;
                    }
                    const entity = new EntityClass(GridIndexToVector(y * 11 + x));
                    this.SetGridEntity(y * 11 + x, entity);
                    entity.Enter();
                } catch (error) {
                    console.error(`Start Room Layout Error: Failed to create entity at position (${x}, ${y}).`, {
                        roomLayout: layout.LayoutID || 'Unknown',
                        position: { x, y },
                        gridIndex: y * 11 + x,
                        entityType: layout.Grid[y * 11 + x],
                        error: error.message,
                        layoutGrid: layout.Grid
                    });
                    continue;
                }
            }
        }
    }

    public Render(): void {
        super.Render();

        const overlay = Media.getImage("instructions")

        Canvas.context.save();
        Canvas.context.globalCompositeOperation = 'multiply';
        Canvas.context.globalAlpha = 0.5;
        Media.draw("instructions", (Canvas.width / 2) - (overlay.width / 2), (Canvas.height / 2) - (overlay.height / 2))
        Canvas.context.restore();
    }
}