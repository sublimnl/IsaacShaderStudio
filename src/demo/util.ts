import { Abstract, Box, Circle, Collider, Entity, Enum, Game, Polygon, Response, Trait, Vector } from "./imports";

export const GridIndexToVector = (index: number): Vector => {
	const gridCoordinates = GridIndexToGridCoordinates(index);
	return new Vector(26 + (gridCoordinates.x * 26), 26 + (gridCoordinates.y * 26))
}

export const GridIndexToGridCoordinates = (index: number): Vector => {
	const row = Math.floor(index / 15)
	const col = (index - (15 * row))
	return new Vector(col, row);
}

export const GridCoordinatesToGridIndex = (coords: Vector): number => {
	return (Math.floor(coords.x / 26) + ((Math.floor(coords.y / 26) - 1) * 15)) - 1;
}

export function VectorDistance(vec1: Vector, vec2: Vector): number {
	return Math.sqrt((vec1.x - vec2.x) ** 2 + (vec1.y - vec2.y) ** 2);
}

export const calcEndPosition = (distance: number, position: Vector, velocity: Vector) => {
	const radian = Math.atan2(velocity.y, velocity.x);

	return new Vector(
		position.x + (distance * Math.cos(radian)),
		position.y + (distance * Math.sin(radian)),
	);
}

export function DistanceTo(source: Vector, target: Vector): number {
	if (!target) return 0;
	return Math.sqrt((source.x - target.x) ** 2 + (source.y - target.y) ** 2);
}

export function TargetDirection(source: Vector, target: Vector): Vector {
	if (!target) return source;

	const distance = DistanceTo(source, target);
	const velocityX = 8 / distance * (target.x - source.x);
	const velocityY = 8 / distance * (target.y - source.y);

	return new Vector(velocityX, velocityY);
}

export function LineOfSight(source: Vector, target: Vector, width: number, ignore?: Abstract.Entity): boolean {
	const los = new Box(source, width, DistanceTo(source, target));

	const dir = TargetDirection(source, target);
	const angle = Math.atan2(dir.x, dir.y);

	const poly = los.toPolygon()
	poly.rotate(-angle)

	const entities = Game.GetLevel().GetRoom().GetEntities();
	let collision: boolean = false;

	const response: Response = new Response();

	entities.forEach((subject: Abstract.Entity) => {
		if (collision || !subject) return;
		if (ignore && subject === ignore) return;

		// Check for entities that block line of sight
		let shouldBlock = false;
		let subjectHitbox: Circle | Polygon | Vector = null;

		if (subject instanceof Abstract.GridEntity) {
			// Check grid entities by collision class
			const collisionClass = subject.GetCollisionClass();
			if (collisionClass === Enum.GridCollisionClass.SOLID ||
				collisionClass === Enum.GridCollisionClass.OBJECT ||
				collisionClass === Enum.GridCollisionClass.WALL) {
				shouldBlock = true;
			}
		}

		if (!shouldBlock) return;

		// Get the hitbox for collision testing
		subjectHitbox = (subject.getTrait('hitbox') as Trait.HitBox | Trait.Solid)?.hitbox;
		if (!subjectHitbox && subject instanceof Abstract.Entity) {
			subjectHitbox = (subject as Abstract.Entity).GetHitbox();
		}
		if (!subjectHitbox) return;

		response.clear();

		if (subjectHitbox instanceof Circle) {
			collision = Collider.testPolygonCircle(poly, subjectHitbox, response)
		} else if (subjectHitbox instanceof Box) {
			collision = Collider.testPolygonPolygon(poly, subjectHitbox.toPolygon(), response)
		} else if (subjectHitbox instanceof Polygon) {
			collision = Collider.testPolygonPolygon(poly, subjectHitbox, response)
		}
	})

	return !collision;
}

export function Clamp(num: number, min: number, max: number): number {
	return Math.min(Math.max(num, min), max);
}

export function roundX(num: number, precision: number) {
	return Number(num.toPrecision(precision));
}

export function rand(items: any[]) {
	return items[items.length * Math.random() | 0];
}

export function weightedRandom(options: { item: Vector, weight: number }[]): Vector {
	let i: number;
	const weights: number[] = [];

	for (i = 0; i < options.length; i++)
		weights[i] = options[i].weight + (weights[i - 1] || 0);

	const random = Math.random() * weights[weights.length - 1];

	for (i = 0; i < weights.length; i++)
		if (weights[i] > random)
			break;

	return options[i].item;
}

export function hexToRGB(hex: string): { r: number; g: number; b: number } {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
		}
		: {
			r: 0.0,
			g: 0.0,
			b: 0.0,
		};
}

export const fitRectIntoContainer = (rectWidth: number, rectHeight: number, containerWidth: number, containerHeight: number) => {

	const widthRatio = containerWidth / rectWidth;    // ration container width to rect width
	const heightRatio = containerHeight / rectHeight; // ration container height to rect height

	const ratio = Math.min(widthRatio, heightRatio); // take the smaller ratio

	// new rect width and height, scaled by the same ratio
	return {
		width: rectWidth * ratio,
		height: rectHeight * ratio,
	};
};
