import { Abstract, Canvas, Game, Media, SceneManager, Transition, Level } from "../imports";

export class LoadScreen extends Abstract.Scene {
    private loadImageIndex: string;
    private loadingImageV1: string;
    private loadingImageV2: string;
    private currentImage: string;
    private counter: number = 0;
    private nextScene: Abstract.Scene;
    private level: Level | null = null;
    private levelGenerationComplete: boolean = false;

    private displayFrames: number = 20;

    constructor() {
        super();

        // Select a random loading screen image to display (1-6).
        this.loadImageIndex = String(Math.floor(Math.random() * 6) + 1).padStart(2, '0');
        this.loadingImageV1 = `LoadImage0${this.loadImageIndex}`
        this.loadingImageV2 = `LoadImage0${this.loadImageIndex}.2`;
        this.currentImage = this.loadingImageV1;

        // Pre-load the next screen to accomodate the transitionOut
        //this.nextScene = new BasementScreen();
        this.nextScene = Game;
    }

    public Enter(): void {
        // Since this scene is pre-loaded by the title screen, only start the counter
        // for how long this scene will be displayed once we enter the scene, and not
        // on instantiation
        this.counter = 1;

        // Start level generation asynchronously
        this.generateLevelAsync();
    }

    public Update(delta: number) {
        // Jitter the selected loading image.
        this.currentImage = (this.counter % 4 === 0) ? this.loadingImageV1 : this.loadingImageV2;

        // Start the display time counter
        if (this.counter > 0) {
            this.counter++;
        }

        // Start transitioning the scene when level generation is complete and display time has passed
        if (this.levelGenerationComplete && this.counter >= this.displayFrames) {
            // Pass the generated level to the game scene
            if (this.level) {
                (this.nextScene as any).setLevel(this.level);
            }
            SceneManager.Transition(this.nextScene);
        }
    }

    public Render() {
        Canvas.context.fillStyle = '#000';
        Canvas.context.fillRect(0, 0, Canvas.width, Canvas.height);

        const image = Media.getImage(this.currentImage);
        if (image) {
            Media.draw(this.currentImage,
                (Canvas.width / 2) - (image.width / 2),
                (Canvas.height / 2) - (image.height / 2)
            );
        }
    }

    public TransitionOut(startTime: number, delta: number): boolean {
        return Transition.CrossFade(this, this.nextScene, 30, startTime, delta)
    }

    private generateLevelAsync(): void {
        // Use setTimeout to allow the main thread to continue with animation updates
        setTimeout(() => {
            try {
                this.level = new Level();
                this.levelGenerationComplete = true;
            } catch (error) {
                console.error("Level generation failed:", error);
                // Fallback: create a simple level
                this.level = new Level();
                this.levelGenerationComplete = true;
            }
        }, 0);
    }
}
