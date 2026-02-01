import { ANM2, Canvas, Game, Type, Vector } from "./imports";
import { ANM2AnimationFrame, ANM2NullAnimation, ANM2Trigger } from "./types";

export class Animation {
    private animation: BaseAnimation;
    private currentAnimation: ANM2 | boolean = false;
    private animationFrame: number;
    private nullAnimationFrame: number = 0;
    private rotation: number;
    private spritesheets: { [name: string]: HTMLImageElement };
    private playing: boolean = false;

    private mirror: boolean = false;

    private RGBTintImageCache: { [name: string]: HTMLImageElement } = {};
    private RGBOffsetImageCache: { [name: string]: HTMLImageElement } = {};

    public xOffset: number = 0;
    public yOffset: number = 0;

    private scale: Vector = new Vector(1, 1);
    private layerScale: { [layerId: number]: Vector } = {};

    constructor(animation: BaseAnimation) {
        this.animation = animation;
        this.animation.Enter();

        this.InitializeCache()
    }

    public Enter() {
        this.currentAnimation = this.animation.GetAnimations()[this.animation.GetDefaultAnimation()];
        if (this.currentAnimation instanceof ANM2) {
            this.animationFrame = 0;
        }
    }

    public GetFrameCount(): number {
        if (!(this.currentAnimation instanceof ANM2)) return -1;

        return this.currentAnimation.frames;
    }

    public GetAnimationName(): null | string {
        if (!(this.currentAnimation instanceof ANM2)) return null;

        return this.currentAnimation.name
    }

    public HideLayer(id: number): void {
        if (!(this.currentAnimation instanceof ANM2)) return;

        console.log(this.currentAnimation)
        //        this.currentAnimation.layerAnimations[id].frames[0].visible = false;
    }

    public IsPlaying(): boolean {
        return this.playing;
    }

    GetSpritesheet() {
        return this.spritesheets ? this.spritesheets : this.animation.GetSpritesheet();
    }

    Play(name?: string, force?: boolean): void {
        if (this.playing && !force) return;

        name = name ? name : this.animation.GetDefaultAnimation()

        if (name in this.animation.GetAnimations() && this.currentAnimation instanceof ANM2 && (this.currentAnimation.name !== name || force)) {
            this.currentAnimation = this.animation.GetAnimations()[name];
            if (this.currentAnimation instanceof ANM2) {
                this.animationFrame = this.currentAnimation.frames;
                this.playing = true;
            }
        }
    }

    public Scale(scale: Vector) {
        this.scale = scale;
    }

    public ScaleLayer(layerId: number, scale: Vector) {
        this.layerScale[layerId] = scale;
    }

    Stop() {
        this.playing = false;
    }

    private async InitializeCache() {
        Object.keys(this.animation.GetAnimations()).forEach((name: string) => {
            const animation = this.animation.GetAnimations()[name] as ANM2;
            for (let layerId = 0; layerId < animation.layerAnimations.length; layerId++) {

                for (let frameId = 0; frameId < animation.layerAnimations[layerId].frames.length; frameId++) {
                    const frame = animation.layerAnimations[layerId].frames[frameId];
                    const spritesheetID: number = this.animation.GetLayers()[layerId].spritesheet;
                    let spritesheet = this.GetSpritesheet()[spritesheetID];

                    if (frame.redOffset !== 0 || frame.greenOffset !== 0 || frame.blueOffset !== 0) {
                        const token = `${layerId}:${spritesheetID}@[RO=${frame.redOffset},GO=${frame.greenOffset},BO=${frame.blueOffset}]`;

                        if (!(token in this.RGBOffsetImageCache)) {
                            const height = spritesheet.height;
                            const width = spritesheet.width;
                            const canvas = new Canvas(null, spritesheet.height, spritesheet.width).createCanvas(spritesheet.height, spritesheet.width);
                            const context = canvas.getContext('2d') as CanvasRenderingContext2D;
                            context.drawImage(spritesheet, 0, 0);

                            const map = context.getImageData(0, 0, spritesheet.width, spritesheet.height);
                            const data = map.data;

                            for (let p = 0, len = data.length as number; p < len; p += 4) {
                                const r = data[p];
                                const g = data[p + 1];
                                const b = data[p + 2];

                                const avg = Math.floor((r + g + b) / 3);
                                data[p] = data[p + 1] = data[p + 2] = avg;
                            }

                            context?.putImageData(map, 0, 0);

                            context.globalCompositeOperation = 'source-atop';
                            context.globalAlpha = 1;
                            context.fillStyle = `rgb(${frame.redOffset}, ${frame.greenOffset}, ${frame.blueOffset})`;
                            context.fillRect(0, 0, spritesheet.width, spritesheet.height);

                            context.globalCompositeOperation = 'lighter';
                            context.drawImage(spritesheet, 0, 0);

                            const image = new Image();
                            image.src = canvas.toDataURL();
                            spritesheet = image;
                            spritesheet.height = height;
                            spritesheet.width = width;

                            this.RGBOffsetImageCache[token] = spritesheet;
                        }
                    }


                    if (frame.redTint !== 255 || frame.greenTint !== 255 || frame.blueTint !== 255) {
                        const token = `${layerId}:${spritesheetID}@[RT=${frame.redTint},GT=${frame.greenTint},TO=${frame.blueTint}]`;

                        if (!(token in this.RGBTintImageCache)) {
                            const height = spritesheet.height;
                            const width = spritesheet.width;
                            const canvas = new Canvas(null, spritesheet.height, spritesheet.width).createCanvas(spritesheet.height, spritesheet.width);
                            const context = canvas.getContext('2d') as CanvasRenderingContext2D;
                            context.drawImage(spritesheet, 0, 0);

                            const map = context.getImageData(0, 0, spritesheet.width, spritesheet.height);
                            const data = map.data;

                            for (let p = 0, len = data.length as number; p < len; p += 4) {
                                const r = data[p];
                                const g = data[p + 1];
                                const b = data[p + 2];

                                const avg = Math.floor((r + g + b) / 3);
                                data[p] = data[p + 1] = data[p + 2] = avg;
                            }

                            context?.putImageData(map, 0, 0);

                            context.globalCompositeOperation = 'source-atop';
                            context.globalAlpha = 1;
                            context.fillStyle = `rgb(${frame.redTint}, ${frame.greenTint}, ${frame.blueTint})`;
                            context.fillRect(0, 0, spritesheet.width, spritesheet.height);

                            context.globalCompositeOperation = 'multiply';
                            context.drawImage(spritesheet, 0, 0);

                            const image = new Image();
                            image.src = canvas.toDataURL();
                            spritesheet = image;
                            spritesheet.height = height;
                            spritesheet.width = width;

                            this.RGBTintImageCache[token] = spritesheet;
                        }
                    }
                }
            }
        })
    }


    Render(position: Vector, topLeftClamp?: Vector, bottomRightClamp?: Vector) {
        if (!(this.currentAnimation instanceof ANM2)) return;

        for (let layerId = 0; layerId < this.currentAnimation.layerAnimations.length; layerId++) {
            this.RenderLayer(layerId, position, topLeftClamp, bottomRightClamp)
        }
    }

    RenderLayer(layerId: number, position: Vector, topLeftClamp?: Vector, bottomRightClamp?: Vector) {
        if (!(this.currentAnimation instanceof ANM2)) return;

        const layer = this.currentAnimation.layerAnimations[layerId];
        let frame = layer.frames[this.currentAnimation.frames - this.animationFrame];
        if (!frame) {
            frame = [...layer.frames].pop() as Type.ANM2AnimationFrame
        }

        if (frame && frame.visible) {
            const spritesheetID: number = this.animation.GetLayers()[layer.layerId].spritesheet;
            let spritesheet: HTMLImageElement = this.GetSpritesheet()[spritesheetID];

            if (frame.redOffset !== 0 || frame.greenOffset !== 0 || frame.blueOffset !== 0) {
                const token = `${layer.layerId}:${spritesheetID}@[RO=${frame.redOffset},GO=${frame.greenOffset},BO=${frame.blueOffset}]`;

                if (token in this.RGBOffsetImageCache) {
                    spritesheet = this.RGBOffsetImageCache[token];
                } else {
                    console.log("RGB Offset Spritesheet doesn't exist?")
                }
            }

            if (frame.redTint !== 255 || frame.greenTint !== 255 || frame.blueTint !== 255) {
                const token = `${layer.layerId}:${spritesheetID}@[RT=${frame.redTint},GT=${frame.greenTint},TO=${frame.blueTint}]`;
                if (token in this.RGBTintImageCache) {
                    spritesheet = this.RGBTintImageCache[token];
                } else {
                    console.log("RGB Tint Spritesheet doesn't exist, creating?", token)
                }
            }

            const sx = frame.xCrop;
            const sy = frame.yCrop;
            const sw = frame.width;
            const sh = frame.height;
            const dx = (position.x) - frame.xPivot + frame.xPosition;
            const dy = (position.y) - frame.yPivot + frame.yPosition;
            const dw = frame.width;
            const dh = frame.height;


            Canvas.context.save()
            Canvas.context['imageSmoothingEnabled'] = false;

            // Set alpha
            Canvas.context.globalAlpha = frame.alphaTint / 255;

            // Set pivot point
            Canvas.context.translate(dx + frame.xPivot, dy + frame.yPivot);

            // Rotate on pivot point
            Canvas.context.rotate((this.rotation * Math.PI / 180) || frame.rotation * Math.PI / 180);

            // Flip the image based on xScale/yScale
            Canvas.context.scale(frame.xScale / 100, frame.yScale / 100);
            Canvas.context.translate(frame.xScale < 0 ? -1 : 0, frame.yScale < 0 ? -1 : 0);

            if (this.scale.x !== 1 || this.scale.y !== 1) Canvas.context.scale(this.scale.x, this.scale.y);
            if (layerId in this.layerScale) {
                Canvas.context.scale(this.layerScale[layerId].x, this.layerScale[layerId].y);
            }

            // Restore pivot point
            Canvas.context.translate((dx + frame.xPivot) * -1, (dy + frame.yPivot) * -1);

            // Draw Image
            // Check if spritesheet is properly loaded before drawing
            if (spritesheet && spritesheet.complete && spritesheet.naturalWidth > 0) {
                Canvas.context.drawImage(spritesheet, sx, sy, sw, sh, dx + this.xOffset, dy + this.yOffset, dw, dh);
            } else {
                console.warn(`Spritesheet for animation is not properly loaded or is broken`, { spritesheet });
            }

            Canvas.context.restore();

            if (Game.GetDebugSettings().GridInfo) {
                // Draw the x/y coordinate of the animation
                Canvas.context.strokeStyle = "#ff0000"
                Canvas.context.strokeRect(position.x, position.y, 1, 1);
            }

        }
    }

    async ReplaceSpritesheet(layerId: number, source: string) {
        if (!this.spritesheets) {
            this.spritesheets = Object.assign({}, this.animation.GetSpritesheet())
        }

        const url = new URL(source, window.location.href);
        await fetch(url).then(async (response) => {
            if (!response.ok) {
                if (url.pathname.startsWith('/public/resources-dlc3')) {
                    url.pathname = url.pathname.replace('/public/resources-dlc3', '/public/resources');
                    await fetch(url).then((response) => {
                        if (!response.ok) {
                            throw new Error("Not 2xx response");
                        } else {
                            const image = new Image();
                            image.src = url.href;
                            this.spritesheets[layerId] = image;
                        }
                    });
                }
            } else {
                const image = new Image();
                image.src = url.href;
                this.spritesheets[layerId] = image;
            }
        });
    }

    Mirror() {
        this.mirror = !this.mirror;
    }

    Rotate(degrees: number) {
        this.rotation = degrees;
    }

    SetAnimation(name: string, reset: boolean = true) {
        if (name in this.animation.GetAnimations() && this.currentAnimation instanceof ANM2 && this.currentAnimation.name !== name) {
            this.currentAnimation = this.animation.GetAnimations()[name];
            if (this.currentAnimation instanceof ANM2) {
                this.animationFrame = this.currentAnimation.frames;
            }
        }
    }


    SetFrame(frame: number, name?: string) {
        if (this.playing) return;

        if (name) this.SetAnimation(name);
        if (!(this.currentAnimation instanceof ANM2)) return;

        this.animationFrame = this.currentAnimation.frames - frame;
    }

    Update(callback?: (done: boolean) => void): void {
        if (!(this.currentAnimation instanceof ANM2)) return;

        const currentFrame = this.animationFrame;

        if (this.playing) this.animationFrame--;

        if (this.animationFrame <= 0 && this.playing) {
            if (this.currentAnimation instanceof ANM2 && this.currentAnimation.loop) {
                this.animationFrame = this.currentAnimation.frames;
            } else {
                this.animationFrame = 1;
            }
        }

        if (currentFrame === this.animationFrame && !this.currentAnimation.loop) {
            this.playing = false;
        }

        this.currentAnimation.nullAnimations.every((nullAnimation: ANM2NullAnimation) => {
            if (nullAnimation.frames.length) {
                this.nullAnimationFrame++;
            }
        });

        if (callback !== undefined) {
            callback(currentFrame === this.animationFrame);
        }
    }

    OnNullItem(callback?: (id: number, frame: ANM2AnimationFrame) => void): void {
        if (!(this.currentAnimation instanceof ANM2)) return;

        this.currentAnimation.nullAnimations.forEach((nullAnimation: ANM2NullAnimation) => {
            callback(nullAnimation.layerId, nullAnimation.frames[this.nullAnimationFrame])
        })
    }

    OnTrigger(callback?: (trigger: string) => void): void {
        if (!(this.currentAnimation instanceof ANM2)) return;

        this.currentAnimation.triggers.forEach((trigger: ANM2Trigger) => {
            if (this.animationFrame === trigger.atFrame) {
                Object.values(this.animation.events).forEach((event) => {
                    if (event.id === trigger.eventId) {
                        return callback(event.name);
                    }
                });
            }
        })
        callback(null);
    }
}

export class BaseAnimation {
    public source: string;
    private loaded: boolean = false;

    private spritesheets: { [name: string]: HTMLImageElement } = {};
    private layers: { [name: string]: { name: string, id: number, spritesheet: number } } = {};
    private nulls: { [name: string]: { name: string, id: number, showRect: boolean } } = {};
    public events: { [name: string]: { name: string, id: number } } = {};
    private animations: { [name: string]: ANM2 } = {};
    private defaultAnimationName: string;
    private rotation: number;
    private xScale: number = 0;
    private yScale: number = 0;
    private baseHREF: string;

    private fps: number = 30;
    private playing: boolean = false;
    private currentAnimation: ANM2 | boolean = false;
    public animationFrame: number = NaN;
    public x: number = 0;
    public y: number = 0;

    public xOffset: number = 0;
    public yOffset: number = 0;

    private RGBTintImageCache: { [name: string]: HTMLImageElement } = {};
    private RGBOffsetImageCache: { [name: string]: HTMLImageElement } = {};

    constructor(source?: string | undefined) {
        if (source) {
            this.source = source;

            this.Load(this.source, () => {
                this.loaded = true;
            })
        }
    }

    get frame(): boolean | number {
        if (!(this.currentAnimation instanceof ANM2)) return false;

        return this.currentAnimation.frames - this.animationFrame
    }

    /**
     * 
     */
    public Enter() {
        this.currentAnimation = this.animations[this.defaultAnimationName];
        if (this.currentAnimation instanceof ANM2) {
            this.animationFrame = 0;
        }
    }

    public FrameDebug(callback: (frame: Type.ANM2AnimationFrame) => void): void {
        if (!(this.currentAnimation instanceof ANM2)) return;

        for (let layerId = 0; layerId < this.currentAnimation.layerAnimations.length; layerId++) {
            const layer = this.currentAnimation.layerAnimations[layerId];
            const frame = layer.frames[this.currentAnimation.frames - this.animationFrame];
            if (!frame || !frame.visible) {
                continue;
            }

            callback(frame);
        }
    }
    /**
     * Returns the name of the currently playing animation.
     * 
     * @returns ANM2
     */
    public GetAnimation(): ANM2 {
        return this.currentAnimation as ANM2;
    }

    public GetAnimations(): { [name: string]: ANM2 } {
        return this.animations;
    }

    /**
     * Returns the name of the currently playing animation.
     * 
     * @returns null | string
     */
    public GetAnimationName(): null | string {
        if (!(this.currentAnimation instanceof ANM2)) return null;

        return this.currentAnimation.name
    }

    /**
     * Returns the name of the default animation specified in the currently loaded anm2 file.
     * 
     * @returns string
     */
    public GetDefaultAnimation(): string {
        return this.defaultAnimationName;
    }

    /**
     * Returns the path to the anm2 file that is loaded.
     * 
     * @returns string
     */
    public GetFilename(): string {
        return this.source;
    }

    /**
     * Returns the frame number of the animation that is currently being rendered.
     * 
     * @returns number
     */
    public GetFrame(): number {
        if (!(this.currentAnimation instanceof ANM2)) return 0;

        return this.currentAnimation.frames - this.animationFrame;
    }

    /**
     * Returns the frame count of the animation that is currently being rendered.
     * 
     * @returns number
     */
    public GetFrameCount(): number {
        if (!(this.currentAnimation instanceof ANM2)) return -1;

        return this.currentAnimation.frames;
    }

    /**
     * Returns the number of layers in the currently loaded anm2 file.
     * @returns number
     */
    public GetLayerCount(): number {
        if (!(this.currentAnimation instanceof ANM2)) return 0;

        return this.currentAnimation.layerAnimations.length;
    }

    public GetLayers(): { [name: string]: { name: string, id: number, spritesheet: number } } {
        return this.layers;
    }

    /**
     * @returns number
     */
    public GetSpritesheet(): { [name: string]: HTMLImageElement } {
        return this.spritesheets;
    }

    /**
     * Returns the name of the currently playing overlay animation.
     * 
     * @returns null | string
     */
    public GetOverlayAnimation(): null | string {
        // TODO
        return "";
    }

    /**
     * Returns the frame number of the overlay animation that is currently being rendered.
     * 
     * @returns null | number
     */
    public GetOverlayFrame(): null | number {
        // TODO
        return 0
    }

    /**
     * Returns if an event by the specified name is triggered during the current frame.
     * 
     * @param name string | Name of the event
     * @returns boolean
     */
    public IsEventTriggered(name: string): boolean {
        // TODO?
        // Implement as event emit (as well?)
        return false;
    }

    /**
     * Returns whether the animation by the specified name finished playing.
     * 
     * @param name string | Name of the animation
     * @returns boolean
     */
    public IsFinished(name: string): boolean {
        // TODO?
        // Implement as event emit (as well?)
        return this.frame === (this.currentAnimation as ANM2).frames;
    }

    /**
     * Returns whether the animation has finished loading.
     * 
     * @returns boolean
     */
    public IsLoaded(): boolean {
        return this.loaded;
    }

    /**
     * Returns whether the overlay animation of the specified name has finished playing.
     * 
     * @param name string
     * @returns boolean
     */
    public IsOverlayFinished(name: string): boolean {
        // TODO
        return false;
    }

    /**
     * Returns whether the overlay animation of the specified name is currently playing.
     * 
     * @param name string
     * @returns boolean
     */
    public IsOverlayPlaying(name: string): boolean {
        // TODO
        return false;
    }

    /**
     * Returns whether the animation of the specified name is currently playing.
     * 
     * @param name string | Name of the animation
     * @returns boolean
     */
    public IsPlaying(name: string): boolean {
        if (!(this.currentAnimation instanceof ANM2)) return false;

        return this.currentAnimation.name === name && this.playing;
    }

    public IsVisible(): boolean {
        if (!(this.currentAnimation instanceof ANM2)) return false;

        let visible = false;

        for (let layerId = 0; layerId < this.currentAnimation.layerAnimations.length; layerId++) {
            const layer = this.currentAnimation.layerAnimations[layerId];
            let frame = layer.frames[this.currentAnimation.frames - this.animationFrame];
            if (!frame) {
                frame = [...layer.frames].pop() as Type.ANM2AnimationFrame
            }

            if (frame && frame.visible) {
                visible = true;
            }
        }

        return visible;
    }

    /**
     * Load the specified anm2 file and it's associated assets.
     * 
     * @param file string | Name of the anm2 file to load
     * @param onComplete () | 
     */
    async Load(file: string, onComplete?: (() => void)) {
        const url = new URL(file.toLowerCase(), window.location.href);
        const baseHREF = url.href.substring(0, url.href.lastIndexOf('/')) + '/';

        const response = await fetch(url.href);
        const data = await response.text();
        const doc = (new window.DOMParser()).parseFromString(data, 'application/xml');

        // Load the Spritesheets
        const spritesheets = doc.evaluate('/AnimatedActor/Content/Spritesheets/Spritesheet', doc, null, XPathResult.ANY_TYPE, null);
        let spritesheet: Element;
        while (spritesheet = spritesheets.iterateNext() as Element) {
            if (spritesheet instanceof Element) {
                // Convert backslashes to forward slashes (anm2 files use Windows-style paths)
                const spritesheetPath = (spritesheet.getAttribute('Path') as string).replace(/\\/g, '/');
                const url = new URL(spritesheetPath, baseHREF);
                await fetch(url).then(async (response) => {
                    if (!response.ok) {
                        if (url.pathname.startsWith('/public/resources-dlc3')) {
                            url.pathname = url.pathname.replace('/public/resources-dlc3', '/public/resources');
                            await fetch(url).then((response) => {
                                if (!response.ok) {
                                    throw new Error("Not 2xx response");
                                } else {
                                    const image = new Image();
                                    image.src = url.href;
                                    this.spritesheets[spritesheet.getAttribute('Id')] = image;
                                }
                            });
                        }
                    } else {
                        const image = new Image();
                        image.src = url.href;
                        this.spritesheets[spritesheet.getAttribute('Id') as string] = image;
                    }
                });
            }
        }

        // Create the Layers
        const layers = doc.evaluate('/AnimatedActor/Content/Layers/Layer', doc, null, XPathResult.ANY_TYPE, null);
        let layer: Element;
        while (layer = layers.iterateNext() as Element) {
            if (layer) {
                this.layers[layer.getAttribute('Id') as string] = {
                    name: layer.getAttribute('Name'),
                    id: parseInt(layer.getAttribute('Id') as string, 10),
                    spritesheet: parseInt(layer.getAttribute('SpritesheetId') as string, 10)
                }
            }
        }

        // Create the Nulls ??
        const _nulls = doc.evaluate('/AnimatedActor/Content/Nulls/Null', doc, null, XPathResult.ANY_TYPE, null);
        let _null: Element;
        while (_null = _nulls.iterateNext() as Element) {
            if (_null) {
                this.nulls[_null.getAttribute('Id') as string] = {
                    name: _null.getAttribute('Name'),
                    id: parseInt(_null.getAttribute('Id') as string, 10),
                    showRect: _null.getAttribute('ShowRect') ? JSON.parse((_null.getAttribute('ShowRect') as string)?.toLowerCase()) : true
                }
            }
        }

        // Create the Events
        const events = doc.evaluate('/AnimatedActor/Content/Events/Event', doc, null, XPathResult.ANY_TYPE, null);
        let event: Element;
        while (event = events.iterateNext() as Element) {
            if (event) {
                this.events[event.getAttribute('Id') as string] = {
                    name: event.getAttribute('Name'),
                    id: parseInt(event.getAttribute('Id') as string, 10)
                }
            }
        }

        // Get the default animation
        const defaultAnimation = doc.evaluate('/AnimatedActor/Animations/@DefaultAnimation', doc, null, XPathResult.ANY_TYPE, null);
        this.defaultAnimationName = defaultAnimation.iterateNext()?.nodeValue as string;

        // Get the frames per second
        const infoNode = doc.evaluate('/AnimatedActor/Info', doc, null, XPathResult.ANY_TYPE, null);
        const node: Element = infoNode.iterateNext() as Element;
        if (node) {
            this.fps = parseInt(node.getAttribute('Fps') as string, 10) / 1000;
        } else {
            this.fps = 30 / 1000;
        }

        // Load all animations.
        const animations = doc.evaluate('/AnimatedActor/Animations/Animation', doc, null, XPathResult.ANY_TYPE, null);
        let animation: Element | ANM2;
        while (animation = animations.iterateNext() as Element) {
            animation = new ANM2(animation);
            this.animations[animation.name] = animation;
        }

        if (onComplete !== undefined) {
            onComplete();
        }
    }

    /**
     * Starts executing the given animation, starting at frame 0. After calling this method, you must call `Sprite.Update` method
     * on every render frame in order to advance the animation to the next frame.
     * Calling this method again will reset the current frame back to 0.
     * 
     * @param name 
     * @param force boolean, optional
     */
    Play(name: string, force?: boolean): void {
        // TODO: force?
        if (name in this.animations && this.currentAnimation instanceof ANM2 && this.currentAnimation.name !== name) {
            this.currentAnimation = this.animations[name];
            if (this.currentAnimation instanceof ANM2) {
                this.animationFrame = this.currentAnimation.frames;
                this.playing = true;
            }
        }
    }

    /**
     * Starts executing the given overlay animation, starting at frame 0. After calling this method, you must call `Sprite.Update`
     * method on every render frame in order to advance the animation to the next frame.
     * Calling this method again will reset the current frame back to 0.
     * 
     * @param name 
     * @param force boolean, optional
     */
    PlayOverlay(name: string, force: boolean): void {
        // TODO
    }

    /**
     * Plays a random animation from the currently loaded anm2 file.
     * 
     * @param seed number
     */
    PlayRandom(seed: number): void {
        // TODO?
        // Plays a random animation from the currently loaded anm2 file.
    }

    Reload(): void {
        // TODO?
    }

    RemoveOverlay(): void {
        // TODO
    }

    Render(position: Vector, topLeftClamp?: Vector, bottomRightClamp?: Vector) {
        if (!(this.currentAnimation instanceof ANM2)) return;

        for (let layerId = 0; layerId < this.currentAnimation.layerAnimations.length; layerId++) {
            this.RenderLayer(layerId, position, topLeftClamp, bottomRightClamp)
        }
    }

    RenderLayer(layerId: number, position: Vector, topLeftClamp?: Vector, bottomRightClamp?: Vector) {
        if (!(this.currentAnimation instanceof ANM2)) return;

        const layer = this.currentAnimation.layerAnimations[layerId];
        let frame = layer.frames[this.currentAnimation.frames - this.animationFrame];
        if (!frame) {
            frame = [...layer.frames].pop() as Type.ANM2AnimationFrame
        }

        if (frame && frame.visible) {
            let spritesheet: HTMLImageElement = this.GetSpritesheet()[this.layers[layer.layerId].spritesheet];

            if (frame.redOffset !== 0 || frame.greenOffset !== 0 || frame.blueOffset !== 0) {
                const token = `${spritesheet.src}@[RO=${frame.redOffset},GO=${frame.greenOffset},BO=${frame.blueOffset}]`;

                if (token in this.RGBOffsetImageCache) {
                    spritesheet = this.RGBOffsetImageCache[token];
                } else {
                    const canvas = new Canvas(null, spritesheet.height, spritesheet.width).createCanvas(spritesheet.height, spritesheet.width);
                    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
                    context.drawImage(spritesheet, 0, 0);

                    const map = context.getImageData(0, 0, spritesheet.width, spritesheet.height);
                    const data = map.data;

                    for (let p = 0, len = data.length as number; p < len; p += 4) {
                        const r = data[p];
                        const g = data[p + 1];
                        const b = data[p + 2];

                        const avg = Math.floor((r + g + b) / 3);
                        data[p] = data[p + 1] = data[p + 2] = avg;
                    }

                    context?.putImageData(map, 0, 0);

                    context.globalCompositeOperation = 'source-atop';
                    context.globalAlpha = 1;
                    context.fillStyle = `rgb(${frame.redOffset}, ${frame.greenOffset}, ${frame.blueOffset})`;
                    context.fillRect(0, 0, spritesheet.width, spritesheet.height);

                    context.globalCompositeOperation = 'lighter';
                    context.drawImage(spritesheet, 0, 0);

                    const image = new Image();
                    image.src = canvas.toDataURL();
                    spritesheet = image;

                    this.RGBOffsetImageCache[token] = spritesheet;
                }
            }


            if (frame.redTint !== 255 || frame.greenTint !== 255 || frame.blueTint !== 255) {
                const token = `${spritesheet.src}@[RT=${frame.redTint},GT=${frame.greenTint},TO=${frame.blueTint}]`;

                if (token in this.RGBTintImageCache) {
                    spritesheet = this.RGBTintImageCache[token];
                } else {
                    const canvas = new Canvas(null, spritesheet.height, spritesheet.width).createCanvas(spritesheet.height, spritesheet.width);
                    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
                    context.drawImage(spritesheet, 0, 0);

                    const map = context.getImageData(0, 0, spritesheet.width, spritesheet.height);
                    const data = map.data;

                    for (let p = 0, len = data.length as number; p < len; p += 4) {
                        const r = data[p];
                        const g = data[p + 1];
                        const b = data[p + 2];

                        const avg = Math.floor((r + g + b) / 3);
                        data[p] = data[p + 1] = data[p + 2] = avg;
                    }

                    context?.putImageData(map, 0, 0);

                    context.globalCompositeOperation = 'source-atop';
                    context.globalAlpha = 1;
                    context.fillStyle = `rgb(${frame.redTint}, ${frame.greenTint}, ${frame.blueTint})`;
                    context.fillRect(0, 0, spritesheet.width, spritesheet.height);

                    context.globalCompositeOperation = 'multiply';
                    context.drawImage(spritesheet, 0, 0);

                    const image = new Image();
                    image.src = canvas.toDataURL();
                    spritesheet = image;

                    this.RGBTintImageCache[token] = spritesheet;
                }
            }

            const sx = frame.xCrop;
            const sy = frame.yCrop;
            const sw = frame.width;
            const sh = frame.height;
            const dx = (position.x) - frame.xPivot + frame.xPosition;
            const dy = (position.y) - frame.yPivot + frame.yPosition;
            const dw = frame.width;
            const dh = frame.height;


            Canvas.context.save()
            Canvas.context['imageSmoothingEnabled'] = false;

            // Set alpha
            Canvas.context.globalAlpha = frame.alphaTint / 255;

            // Set pivot point
            Canvas.context.translate(dx + frame.xPivot, dy + frame.yPivot);

            // Rotate on pivot point
            Canvas.context.rotate((this.rotation * Math.PI / 180) || frame.rotation * Math.PI / 180);

            // Flip the image based on xScale/yScale
            Canvas.context.scale(frame.xScale / 100, frame.yScale / 100);
            Canvas.context.translate(frame.xScale < 0 ? -1 : 0, frame.yScale < 0 ? -1 : 0);

            // Restore pivot point
            Canvas.context.translate((dx + frame.xPivot) * -1, (dy + frame.yPivot) * -1);

            // Draw Image
            // Check if spritesheet is properly loaded before drawing
            if (spritesheet && spritesheet.complete && spritesheet.naturalWidth > 0) {
                Canvas.context.drawImage(spritesheet, sx, sy, sw, sh, dx + this.xScale + this.xOffset, dy + this.yScale + this.yOffset, dw - this.xScale, dh - this.yScale);
            } else {
                console.warn(`Spritesheet for BaseAnimation is not properly loaded or is broken`);
            }

            Canvas.context.restore();

            Canvas.context.save()

            // Draw the x/y coordinate of the animation
            Canvas.context.strokeStyle = "#ff0000"
            Canvas.context.strokeRect(position.x, position.y, 1, 1);
            Canvas.context.restore();
        }
    }


    Reset(): void {
        // TODO
    }

    Rotate(degrees: number) {
        this.rotation = degrees;
    }

    SetAnimation(name: string, reset: boolean = true) {
        if (name in this.animations && this.currentAnimation instanceof ANM2 && this.currentAnimation.name !== name) {
            this.currentAnimation = this.animations[name];
            if (this.currentAnimation instanceof ANM2) {
                this.animationFrame = this.currentAnimation.frames;
            }
        }
    }

    SetFrame(frame: number, name?: string) {
        if (name) this.SetAnimation(name);
        if (!(this.currentAnimation instanceof ANM2)) return;

        this.animationFrame = this.currentAnimation.frames - frame;
    }

    SetAnimationLength(length: number) {
        if (!(this.currentAnimation instanceof ANM2)) return;

        this.currentAnimation.frames = length;
    }

    Stop() {
        this.playing = false;
    }

    Update(callback?: (done: boolean) => void): void {
        if (!(this.currentAnimation instanceof ANM2)) return;

        const currentFrame = this.animationFrame;

        if (this.currentAnimation) this.animationFrame--;

        if (this.animationFrame <= 0) {
            if (this.currentAnimation instanceof ANM2 && this.currentAnimation.loop) {
                this.animationFrame = this.currentAnimation.frames;
            } else {
                this.animationFrame = 1;
            }
        }

        if (callback !== undefined) {
            callback(currentFrame === this.animationFrame);
        }
    }

    WasEventTriggered(event: string): boolean {
        return false;
    }

}
