import { Type } from "./imports";

/**
 * Parses an ANM2 Animation file from XML to an ANM2 class object.
 */
export class ANM2 {
    private node: Element;
    public name: string;
    public frames: number;
    public loop: boolean;

    public rootAnimation: Type.ANM2AnimationFrame[] = [];
    public layerAnimations: Type.ANM2LayerAnimation[] = [];
    public nullAnimations: Type.ANM2NullAnimation[] = [];
    public triggers: Type.ANM2Trigger[] = [];

    constructor(node: Element) {
        this.node = node;

        this.name = node.getAttribute('Name') as string;
        this.frames = parseInt(node.getAttribute('FrameNum') as string, 10);
        this.loop = node.getAttribute('Loop')?.toLowerCase() === 'true';

        this.Initialize();
    }

    private Initialize(): void {
        for (let i = 0; i < this.node.childNodes.length; i++) {
            const child: Element = this.node.childNodes[i] as Element;
            if (child.nodeType === Node.ELEMENT_NODE) {
                switch (child.nodeName) {
                    case 'RootAnimation':
                        this.LoadRootAnimation(child);
                        break;
                    case 'LayerAnimations':
                        this.LoadLayerAnimations(child);
                        break;
                    case 'NullAnimations':
                        this.LoadNullAnimations(child);
                        break;
                    case 'Triggers':
                        this.LoadTriggers(child);
                        break;
                    default:
                        throw new Error(`Unknown animation node: ${child.nodeName}`);
                }
            }
        }
    }

    private LoadRootAnimation(node: ChildNode): void {
        this.rootAnimation = this.GetFrames(node) as Type.ANM2AnimationFrame[];
    }

    private LoadLayerAnimations(node: ChildNode): void {
        const layers: Type.ANM2LayerAnimation[] = [];
        for (let i = 0; i < node.childNodes.length; i++) {
            const child: Element = node.childNodes[i] as Element;
            if (child.nodeType === Node.ELEMENT_NODE) {
                layers.push({
                    layerId: parseInt(child.getAttribute('LayerId') as string, 10),
                    visible: child.getAttribute('Visible')?.toLowerCase() === 'true',
                    frames: this.GetFrames(child)
                })
            }
        }
        this.layerAnimations = layers;
    }

    private LoadNullAnimations(node: ChildNode): void {
        const layers: Type.ANM2NullAnimation[] = [];
        for (let i = 0; i < node.childNodes.length; i++) {
            const child: Element = node.childNodes[i] as Element;
            if (child.nodeType === Node.ELEMENT_NODE) {
                layers.push({
                    layerId: parseInt(child.getAttribute('NullId') as string, 10),
                    visible: child.getAttribute('Visible')?.toLowerCase() === 'true',
                    frames: this.GetFrames(child)
                })
            }
        }
        this.nullAnimations = layers;
    }

    private LoadTriggers(node: ChildNode): void {
        const triggers: Type.ANM2Trigger[] = [];
        for (let i = 0; i < node.childNodes.length; i++) {
            const child: Element = node.childNodes[i] as Element;
            if (child.nodeType === Node.ELEMENT_NODE) {
                triggers.push({
                    eventId: parseInt(child.getAttribute('EventId') as string, 10),
                    atFrame: parseInt(child.getAttribute('AtFrame') as string, 10)
                })
            }
        }
        this.triggers = triggers;
    }

    private GetFrames(node: ChildNode): Type.ANM2AnimationFrame[] {
        const frames: Type.ANM2AnimationFrame[] = [];
        for (let i = 0; i < node.childNodes.length; i++) {
            const child = <Element>node.childNodes[i];

            let nextChild: Element;
            for (let j = i + 1; j < node.childNodes.length; j++) {
                const candidate = <Element>node.childNodes[j];
                if (candidate.nodeType === Node.ELEMENT_NODE) {
                    nextChild = candidate;
                    break;
                }
            }

            if (child.nodeType === Node.ELEMENT_NODE) {
                const count = parseInt(child.getAttribute('Delay') as string, 10);
                const interpolated = JSON.parse(child.getAttribute('Interpolated') ? (child.getAttribute('Interpolated') as string)?.toLowerCase() : "false");
                const visible = child.getAttribute('Visible')?.toLowerCase() === 'true';
                for (let step = 0; step < count; step++) {
                    const getValue = (attribute: string) => {
                        return parseInt(child.getAttribute(attribute) as string, 10);
                    }

                    const interpolateValue = (attribute: string) => {
                        if (!interpolated || !nextChild) {
                            return getValue(attribute);
                        } else {
                            const currentValue = getValue(attribute);
                            const nextValue = parseInt(nextChild.getAttribute(attribute) as string, 10);
                            return Math.floor(currentValue + (((nextValue - currentValue) / count) * step));
                        }
                    }

                    frames.push({
                        interpolated,
                        visible,
                        height: getValue('Height'),
                        width: getValue('Width'),
                        rotation: getValue('Rotation'),
                        xPosition: getValue('XPosition'),
                        yPosition: getValue('YPosition'),
                        xPivot: getValue('XPivot'),
                        yPivot: getValue('YPivot'),
                        xCrop: getValue('XCrop'),
                        yCrop: getValue('YCrop'),
                        xScale: interpolateValue('XScale'),
                        yScale: interpolateValue('YScale'),
                        redTint: interpolateValue('RedTint'),
                        greenTint: interpolateValue('GreenTint'),
                        blueTint: interpolateValue('BlueTint'),
                        alphaTint: interpolateValue('AlphaTint'),
                        redOffset: interpolateValue('RedOffset'),
                        greenOffset: interpolateValue('GreenOffset'),
                        blueOffset: interpolateValue('BlueOffset'),
                    });
                }
            }
        }
        return frames;
    }
}