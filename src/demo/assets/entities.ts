declare type Gibs = {
    amount: number,
    blood?: number,
    bone?: number,
    eye?: number,
    gut?: number,
    large?: number,
    poop?: number,
    worm?: number,
}

declare type Entity = {
    name: string,
    anm2path: string,
    baseHP?: number,
    collisionDamage?: number,
    collisionMass?: number,
    collisionRadius?: number,
    friction?: number,
    numGridCollisionPoints?: number,
    shadowSize?: number,
    gibs?: Gibs,
}

export const Entities: Entity[] = [
    {
        "name": "Player",
        "anm2path": "001.000_player.anm2",
        "baseHP": 10,
        "collisionDamage": 0,
        "collisionMass": 5,
        "collisionRadius": 10,
        "friction": 1,
        "numGridCollisionPoints": 40,
        "shadowSize": 16,
    },
    {
        "name": "Tear",
        "anm2path": "002.000_Tear.anm2",
        "baseHP": 10,
        "collisionDamage": 0,
        "collisionMass": 8,
        "collisionRadius": 7,
        "friction": 1,
        "numGridCollisionPoints": 8,
        "shadowSize": 8,
    },
];
