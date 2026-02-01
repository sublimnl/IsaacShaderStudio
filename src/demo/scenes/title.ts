import { Abstract, Canvas, Input, Media, Scene, SceneManager, Transition, Vector } from "../imports";

export class TitleScreen extends Abstract.Scene {
    private logoY: number;
    private bounce: number;
    private nextScene: Abstract.Scene;

    constructor() {
        super();

        this.logoY = 210;
        this.bounce = 0;
    }

    public Enter() {
        this.nextScene = new Scene.LoadScreen();
    }

    public Update(delta: number) {
        this.bounce += delta * 2;
        this.logoY = 210 + Math.sin(this.bounce) * 10;

        if (SceneManager.hasFocus && !SceneManager.transitioning) {
            SceneManager.Transition(this.nextScene);
        }
    }

    public Render() {
        Media.draw("TitleBackground", 0, 0);
        Media.draw("TitleLogo", (Canvas.width / 2) - 200, 50, 400, 78);
//        Font.write("CLICK TO START DEMO", Font.White, (Canvas.width / 2) - ((19 * 8) / 2), this.logoY);
        Media.getFont("teammeatfont16bold").write("Click  To  Start  Demo", new Vector((Canvas.width / 2) - ((19 * 13) / 2), this.logoY), 4)

        Media.getFont("teammeatfont10").write("Or press any button on your controller.", new Vector(12, Canvas.height - 20))
    }

    public TransitionOut(startTime: number, delta: number): boolean {
        return Transition.IrisOut(this, this.nextScene, 30, startTime, delta)
    }
}
