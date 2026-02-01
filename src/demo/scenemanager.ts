import { Abstract, Canvas, Type } from "./imports";

class SceneState {
    static TRANSITION_IN = 0;
    static RENDER = 1;
    static TRANSITION_OUT = 1;

    private static instance: SceneState;
    private delta: number = 0;
    private mode: number = SceneState.TRANSITION_IN;
    private nextScene: Abstract.Scene | null;
    private startTime: number = 0;
    public scene: Abstract.Scene | null;
    public transitioning: boolean = false;
    public hasFocus: boolean = false;

    private constructor() {
        document.addEventListener("focus", (event: Type.OnFocusEvent) => {
            this.hasFocus = event.detail?.state ?? true;
        });

        document.addEventListener("blur", (event: Type.OnFocusEvent) => {
            this.hasFocus = event.detail?.state ?? false;
        });

        window.addEventListener('mmk-gamepad-connected', (e) => {
            this.hasFocus = true;
        })

        window.addEventListener("message", (event: MessageEvent) => {
            // TODO: Handle postMessages
            // console.log("!!", event)
        },
            false)
    }

    public static initalize(): SceneState {
        if (!SceneState.instance) {
            SceneState.instance = new SceneState();
        }

        return SceneState.instance;
    }

    public ChangeScene(newScene: Abstract.Scene | null) {
        this.scene?.Exit();

        this.scene = newScene;
        this.transitioning = false;
        this.mode = SceneState.TRANSITION_IN;
        this.startTime = 1;

        this.scene?.Enter();
    }

    public Transition(newScene: Abstract.Scene) {
        if (!this.transitioning) {
            newScene?.BeforeEnter();
            this.nextScene = newScene;
            this.transitioning = true;
            this.mode = SceneState.TRANSITION_OUT;
            this.startTime = 1;
        }
    }

    public Render() {
        Canvas.context.save();
        if (this.transitioning) {
            if (this.mode == SceneState.TRANSITION_IN && this.scene?.TransitionIn) {
                this.transitioning = this.scene?.TransitionIn(this.startTime, this.delta)!;
                if (this.transitioning === false) this.mode = SceneState.RENDER;
            } else if (this.mode == SceneState.TRANSITION_OUT && this.scene?.TransitionOut) {
                this.transitioning = this.scene?.TransitionOut(this.startTime, this.delta)!;
                if (this.transitioning === false) this.ChangeScene(this.nextScene);
            } else {
                this.transitioning = false;
                this.mode = SceneState.RENDER;
            }
        } else {
            this.mode = SceneState.RENDER;
        }

        if (!this.transitioning) {
            this.scene?.Render();
        }

        Canvas.context.restore();
    }

    public Update(event: Type.TickEvent) {
        this.delta = event.detail?.delta!;

        if (this.startTime > 0) {
            this.startTime++;
        }

        this.scene?.Update(event.detail?.delta!);
    }
}

export const SceneManager = SceneState.initalize();