export type CircleHitbox = {
    Radius: number,
}

export type PolygonHitbox = {
    OffsetX: number,
    OffsetY: number,
    Height: number,
    Width: number,
}

export type BoxHitbox = PolygonHitbox;
