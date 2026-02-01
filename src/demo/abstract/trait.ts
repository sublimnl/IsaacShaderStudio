export abstract class Trait {
    public name: string;
    private tasks: (() => any)[] = [];

    constructor(name: string) {
        this.name = name;

        this.tasks = [];
    }

    finalize() {
        this.tasks.forEach(task => task());
        this.tasks.length = 0;
    }

    queue(task: (() => any)) {
        this.tasks.push(task);
    }

    Enter(source: any) {}
    collides(source: any, target: any) {}
    obstruct(source: any, direction: number, target: any) {}
    update(entity: any, delta: number) {}
    render(entity: any, force?: boolean) {}
}
