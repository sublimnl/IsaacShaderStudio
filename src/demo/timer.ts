import { Type } from "./imports";

class TimeManager {
	private static instance: TimeManager;
	private fps: number = 30;
    private first: number = performance.now();
	private last: number = performance.now();
    private interval: number;
    private counter: number = 0;

	private constructor() {
		this.interval = 1000 / this.fps;
	}

	public static initalize(): TimeManager {
		if (!TimeManager.instance) {
			TimeManager.instance = new TimeManager();
		}

		return TimeManager.instance;
	}

    public start() {
        this.tick();
    }

	private tick() {
        window.requestAnimationFrame(() => {
			this.tick();
		})

        const now = performance.now();
		const delta = (now - this.last);

        if (delta > this.interval) {
            this.last = now - (delta % this.interval);

            const tick: Type.TickEvent = new CustomEvent("tick", {
                bubbles: true,
                cancelable: true,
                composed: false,
                detail: {
                    delta: delta / 1000,
                    counter: this.counter,
                    fps: parseFloat(this.counter / ((this.last - this.first) / 1000) + "").toFixed(2),
                },
            });
    
            document.dispatchEvent(tick);
            this.counter++;
        }
	}
}

export const Timer = TimeManager.initalize();