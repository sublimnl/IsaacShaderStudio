import { Canvas, Media } from "./imports";

class FontManager {
    public Black = 0;
    public Red = 8;
    public Green = 16;
    public Blue = 24;
    public Yellow = 32;
    public Pink = 40;
    public White = 56;

    private static instance: FontManager;

    private letters : {x: number, y: number}[] = [];
    private charHeight: number = 8;
    private charWidth: number = 8;

    private constructor() {
        for (let i = 32; i < 127; i++) {
            this.letters[i] = {
                x: (i - 32) * 8,
                y: 0,
            }
        }
    }

    public static initialize(): FontManager {
        if (!FontManager.instance) {
            FontManager.instance = new FontManager();
        }

        return FontManager.instance;
    }

    public write(str: string, color: number, dx: number, dy: number) {
        const sprite = Media.getImage("font");
        if (!sprite) return;

        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            Canvas.context.drawImage(
                sprite,
                this.letters[code].x,
                this.letters[code].y + color,
                this.charWidth,
                this.charHeight,
                dx + this.charWidth * (i + 1),
                dy,
                this.charWidth,
                this.charHeight
            )
        }
    }

}

export const Font = FontManager.initialize();