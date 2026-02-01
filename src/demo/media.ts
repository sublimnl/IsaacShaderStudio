import { Animation, BaseAnimation, Canvas, FontReader, Type } from "./imports";

declare type MediaAsset = {
    name: string,
    src: string,
}

interface AnimationAsset {
    [name: string]: BaseAnimation;
}

interface FontAsset {
    [name: string]: FontReader;
}

interface ImageAsset {
    [name: string]: HTMLImageElement;
}



class MediaManager {
    private static instance: MediaManager;
    private pending: (HTMLImageElement | { complete: boolean })[] = [];
    public assetsLoaded: boolean = false;

    private animations: AnimationAsset = {};
    private fonts: FontAsset = {};
    private images: ImageAsset = {};

    private total: number = 0;

    public static initalize(): MediaManager {
        if (!MediaManager.instance) {
            MediaManager.instance = new MediaManager();
        }

        return MediaManager.instance;
    }

    public Preload(...sets: MediaAsset[][]) {
        this.pending = [];

        sets.forEach((set: MediaAsset[]) => {
            this.total += set.length;
            set.forEach(async (asset: MediaAsset) => {
                await this.LoadAsset(asset.name, asset.src);
            })
        })
    }

    public async LoadAsset(name: string, source: string, callback?: () => void) {
        if (!callback) callback = this.onAssetLoaded.bind(this);

        switch (source.split('.').pop()?.toLowerCase()) {
            case 'anm2':
                await this.loadAnimation(name, source, callback);
                break;
            case 'fnt':
                await this.loadFont(name, source, callback);
                break;
            case 'gif':
            case 'png':
                const response = await this.loadImage(name, source);
                if (!response) {
                    console.warn('Error loading asset', source);
                    return;
                }

                if (this.pending.includes(response)) {
                    console.debug('Already waiting for asset to load', source)
                    return;
                }

                response.onload = () => {
                    if (callback) callback();
                };

                this.pending.push(response);
                break;
            default:
                console.error('No media loader available for', source);
        }
    }

    private async loadAnimation(name: string, source: string, callback?: () => void) {
        const animation = new BaseAnimation();
        animation.Load(source, () => {
            this.animations[name] = animation;
            this.pending.push({ complete: true });
            if (callback) callback();
        })

        this.animations[name] = animation;
    }

    private async loadFont(name: string, source: string, callback?: () => void) {
        return fetch(source).then((response) => {
            return response.arrayBuffer();
        }).then((buffer) => {
            this.fonts[name] = new FontReader(buffer);
            this.pending.push({ complete: true })
            if (callback) callback();
        });
    }

    private async loadImage(name: string, source: string) {
        const img = new Image();
        this.images[name] = img;

        // Set up error handling for broken images
        img.onerror = (error) => {
            console.error(`Failed to load image: ${source}`, error);
            // Mark this image as complete even if it failed to prevent hanging
            img.complete = true;
        };

        img.src = source;
        return img;
    }

    private onAssetLoaded() {
        const progress = Math.floor(
            ((this.pending.length - this.pending.filter((x) => !x.complete).length) / this.total) * 100
        );
        const loadComplete = (this.pending.length === this.total) && (this.pending.length - this.pending.filter((x) => x.complete).length) === 0

        const loadingEvent: Type.LoadingEvent = new CustomEvent("loadingEvent", {
            detail: {
                progress,
            },
        });
        document.dispatchEvent(loadingEvent);

        if (loadComplete) {
            this.assetsLoaded = true;
        }
    }

    public draw(name: string, sx: number, sy: number, sw?: number, sh?: number, dx?: number, dy?: number, dw?: number, dh?: number): void {
        const image = this.images[name];

        // Check if image exists and is properly loaded
        if (!image) {
            console.warn(`Image "${name}" not found`);
            return;
        }

        if (!image.complete || image.naturalWidth === 0) {
            console.warn(`Image "${name}" is not properly loaded or is broken`);
            return;
        }

        Canvas.context.imageSmoothingEnabled = false;
        if (sw !== undefined && sh !== undefined && dx !== undefined && dy !== undefined && dw !== undefined && dh !== undefined) {
            Canvas.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        } else if (sw !== undefined && sh !== undefined) {
            Canvas.context.drawImage(image, sx, sy, sw, sh);
        } else {
            Canvas.context.drawImage(image, sx, sy);
        }
    }

    public getAnimation(name: string): Animation {
        if (!(name in this.animations)) {
            throw 'Invalid animation name. Animation has not been loaded.';
        }

        return new Animation(this.animations[name])
    }

    public getFont(name: string): FontReader {
        return this.fonts[name];
    }

    public getImage(name: string): HTMLImageElement {
        return this.images[name];
    }
}

export const Media = MediaManager.initalize();