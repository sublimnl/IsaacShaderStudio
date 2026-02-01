//import { Entity } from "./entity";

import { Abstract } from "../imports";

export abstract class Scene {
    public entities: Abstract.Entity[] = [];

    public BeforeEnter() {}
    public Enter() { }
    public Exit() { }
    public Update(delta: number) { }
    public Render() { }
    public TransitionIn(startTime: number, delta: number) { return false; }
    public TransitionOut(startTime: number, delta: number) { return false; }
}