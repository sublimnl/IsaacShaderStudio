import { Box, Circle, Polygon, Response, Vector, testCircleCircle, testPolygonPolygon, testCirclePolygon, testPolygonCircle, pointInCircle } from "sat";

const Collider = {
    testCircleCircle,
    testCirclePolygon,
    testPolygonCircle,
    testPolygonPolygon,
    pointInCircle
}

Vector.prototype.Null = new Vector(0, 0);

export {
    Box,
    Circle,
    Collider,
    Response,
    Polygon,
    Vector
}