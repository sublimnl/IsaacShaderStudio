import { Canvas, Media, Vector } from "./imports";

declare type FontMap = {
    xOffset: number;
    yOffset: number;
    height: number;
    width: number;
    xPad: number;
    yPad: number;
}

class Chunk {
    private chunk: Uint8Array;

    constructor(chunk: Uint8Array) {
        this.chunk = chunk;
    }

    public toHex() {
        return [...new Uint8Array(this.chunk)]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('');
    }

    public toString() {
        return [...new Uint8Array(this.chunk)]
            .map(x => String.fromCharCode(x))
            .join('');
    }

    public toInt() {
        return [...new Uint8Array(this.chunk)]
            .reduce((a, b) => a + b, 0);

    }

    public Value(): Uint8Array {
        return this.chunk;
    }
}

export class FontReader {
    private data: Uint8Array;
    private position: number = 0;

    private name: string = "";
    private sourceFile: string = "";
    private image: HTMLImageElement;
    private height: number = 0;
    private width: number = 0;
    private map: { [char: string]: FontMap } = {};

    constructor(data: ArrayBuffer) {
        this.data = new Uint8Array(data);

        this.parseFontFile();
    }

    private parseFontFile() {
        const fingerprint = this.read(5);
        if (fingerprint.toHex() !== '424d460301') {
            throw new Error("Not a valid .fnt file header!")
        }
        this.skip(18);
        this.name = this.readString();
        this.skip(9);
        this.height = this.readUint16();
        this.width = this.readUint16();
        this.skip(12);
        this.sourceFile = this.readString().toLowerCase();
        Media.LoadAsset(this.sourceFile, `resources/font/${this.sourceFile}`, () => {
            this.image = Media.getImage(this.sourceFile);
        });
        this.skip(5);

        while (this.remainingBytes >= 20) {
            const letter = String.fromCharCode(this.readUint16());
            this.skip(2);
            this.map[letter] = {
                xOffset: this.readUint16(),
                yOffset: this.readUint16(),
                width: this.readUint16(),
                height: this.readUint16(),
                xPad: this.readUint16(),
                yPad: this.readUint16(),
            }

            if (this.map[letter].xPad > 10) this.map[letter].xPad = 0;
            this.skip(4);
        }
    }

    private get remainingBytes(): number {
        return this.data.byteLength - this.position;
    }

    private read(amount: number): Chunk {
        if (this.remainingBytes < amount) return null;

        const chunk = new Uint8Array(this.data.buffer.slice(this.position, this.position + amount));
        this.position += amount;

        return new Chunk(chunk);
    }

    private skip(amount: number) {
        this.position += amount;
    }

    private readByte(): Chunk {
        return this.read(1);
    }

    private readUint16(): number {
        const bytes = this.read(2).Value();
        if (bytes) {
            return bytes[1] << 8 | bytes[0];
        } else {
            return null;
        }
    }

    private readString(): string {
        let char: Chunk;
        let str: string = "";
        while ((char = this.read(1))) {
            if (char.toHex() === "00") {
                break;
            }

            str += char.toString();
        }

        return str;
    }

    private readRemaining(): Uint8Array {
        if (this.remainingBytes === 0) return null;

        const chunk = new Uint8Array(this.data.buffer.slice(this.position));
        this.position = this.data.byteLength;
        return chunk;
    }

    public write(message: string, position: Vector, extraSpacing: number = 1, scaleX?: number, scaleY?: number): [width: number, height: number] {
        let width: number = 0;
        let height: number = 0;
        const pos = position.clone();
        [...message].forEach(letter => {
            let [w, h] = this.writeLetter(letter, pos, scaleX, scaleY);
            w += extraSpacing;
            pos.add(new Vector(w, 0));
            if (w > width) width = w;
            if (h > height) height = h;
        });

        return [width, height];
    }

    private writeLetter(letter: string, position: Vector, scaleX: number = 1, scaleY: number = 1) {
        if (!(letter in this.map) || !this.image) return [0, 0];

        // Check if font image is properly loaded before drawing
        if (this.image && this.image.complete && this.image.naturalWidth > 0) {
            Canvas.context.drawImage(this.image, this.map[letter].xOffset, this.map[letter].yOffset, this.map[letter].width, this.map[letter].height, position.x + Math.ceil(this.map[letter].xPad * scaleX), position.y + Math.ceil(this.map[letter].yPad + scaleY), Math.ceil(this.map[letter].width * scaleX), Math.ceil(this.map[letter].height * scaleY));
        } else {
            console.warn(`Font image is not properly loaded or is broken`);
        }

        return [Math.ceil(this.map[letter].width * scaleX), Math.ceil(this.map[letter].height * scaleY)];
    }

    public GetName(): string {
        return this.name;
    }
}