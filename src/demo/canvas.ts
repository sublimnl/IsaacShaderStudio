import { Type } from "./imports";

export class Canvas {
    private static instance: Canvas;
    protected height: number = 0;
    protected width: number = 0;
    protected canvas: HTMLCanvasElement;
    protected context: CanvasRenderingContext2D;
    protected bufferCanvas: HTMLCanvasElement;
    protected bufferContext: CanvasRenderingContext2D;

    constructor(element: HTMLCanvasElement | Element | null, height: number, width: number) {
        this.height = height;
        this.width = width;

        if (element instanceof HTMLCanvasElement) {
            this.canvas = element;
            this.canvas.tabIndex = 1;
        } else {
            this.canvas = this.createCanvas(height, width);
            this.canvas.tabIndex = 1;
            element?.appendChild(this.canvas)
        }

        this.canvas.style.imageRendering = 'pixelated';
        this.context = <CanvasRenderingContext2D> this.canvas.getContext('2d');
        this.context.canvas.classList.add("fade-in");

        this.bufferCanvas = this.createCanvas(height, width);
        this.bufferCanvas.style.imageRendering = 'pixelated';
    
        this.bufferContext = <CanvasRenderingContext2D> this.bufferCanvas.getContext('2d');

        this.canvas.addEventListener('focus', () => {
            const focus: Type.OnFocusEvent = new CustomEvent("focus", {
                detail: {
                    state: true,
                },
            });
    		document.dispatchEvent(focus);
        })

        this.canvas.addEventListener('blur', () => {
            const focus: Type.OnFocusEvent = new CustomEvent("focus", {
                detail: {
                    state: false,
                }
            });
    		document.dispatchEvent(focus);
        })
    }

    public static initialize(element: HTMLCanvasElement | Element | null, height: number, width: number) {
        if (!Canvas.instance) {
            Canvas.instance = new Canvas(element, height, width);
        }

        return Canvas.instance;
    }

    public static get canvas() {
        return Canvas.instance;
    }

    public static get context() {
        return Canvas.instance.bufferContext;
    }

    public static get height() {
        //if (!Canvas.instance) return 0;
        return Canvas.instance.height;
    }

    public static get width() {
        //if (!Canvas.instance) return 0;
        return Canvas.instance.width;
    }

    public static getBufferCanvas(): HTMLCanvasElement {
        return Canvas.instance.bufferCanvas;
    }

    public static getDisplayCanvas(): HTMLCanvasElement {
        return Canvas.instance.canvas;
    }

    public createCanvas(h: number, w: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.height = h;
        canvas.width = w;

        return canvas;
    }

    public static Clear() {
        if (Canvas.instance.bufferCanvas && Canvas.instance.canvas) {
            Canvas.instance.context.clearRect(0, 0, Canvas.instance.canvas.width, Canvas.instance.canvas.height);
        }
    }

    public static Render() {
        if (Canvas.instance.bufferCanvas && Canvas.instance.canvas) {
            Canvas.instance.context.imageSmoothingEnabled = false;
            Canvas.instance.context.drawImage(Canvas.instance.bufferCanvas,
                0, 0, Canvas.instance.bufferCanvas.width, Canvas.instance.bufferCanvas.height,
                0, 0, Canvas.instance.canvas.width, Canvas.instance.canvas.height
            );
        }
    }
}