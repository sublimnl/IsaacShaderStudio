// Shader Renderer - WebGL render loop and texture management

import { GameState } from './types';
import { ParameterManager } from './ParameterManager';

interface AttributeBuffer {
    buffer: WebGLBuffer;
    location: number;
    size: number;
}

interface ParameterAttributeBuffer {
    buffer: WebGLBuffer;
    location: number;
    size: number;
    paramName: string;
    paramType: string;
}

export class ShaderRenderer {
    private gl: WebGL2RenderingContext | null = null;
    private program: WebGLProgram | null = null;
    private texture: WebGLTexture | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private paramManager: ParameterManager;

    private isPlaying: boolean = false;
    private frameCount: number = 0;
    private startTime: number = 0;
    private elapsedTime: number = 0;  // Time in seconds since start
    private lastFpsUpdate: number = Date.now();
    private fpsFrameCount: number = 0;
    private currentFps: number = 0;
    private animationId: number | null = null;

    // Store attribute buffers for re-binding each frame
    private attributeBuffers: AttributeBuffer[] = [];

    // Store dynamic parameter attribute buffers (for Isaac-style shaders)
    private parameterAttributeBuffers: ParameterAttributeBuffer[] = [];

    private gameState: GameState = {
        bufferCanvas: null,
        playerPosition: { x: 0.5, y: 0.5 },
        playerPositionWorld: { x: 0.5, y: 0.5 },
        canvasWidth: 286,
        canvasHeight: 442,
        tearPositions: []
    };

    // Mouse position (scaled same as playerPosition) for mousepos shader parameter
    private mousePosition: { x: number; y: number } = { x: 884, y: 572 };  // Center of doubled canvas

    // Callbacks for UI updates
    public onFpsUpdate: ((fps: number) => void) | null = null;
    public onFrameUpdate: ((frame: number) => void) | null = null;

    constructor(paramManager: ParameterManager) {
        this.paramManager = paramManager;
    }

    public initialize(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement): void {
        // If we're getting a new context, clear all context-specific resources
        // (textures and buffers can't be used across contexts)
        if (this.gl !== gl) {
            this.texture = null;
            this.attributeBuffers = [];
            this.parameterAttributeBuffers = [];
            this.program = null;
        }
        this.gl = gl;
        this.canvas = canvas;
    }

    public setProgram(program: WebGLProgram): void {
        this.program = program;
    }

    public setupGeometry(): void {
        if (!this.gl || !this.program || !this.canvas) return;

        // Clear any existing buffers
        this.attributeBuffers = [];
        this.parameterAttributeBuffers = [];

        // Isaac shader attributes for a fullscreen quad:
        // Position: NDC coordinates (-1 to 1) for the quad vertices
        // Note: Position is vec3 in the shader, z=0 for 2D
        const positions = new Float32Array([
            -1, -1, 0,  // bottom-left
            1, -1, 0,  // bottom-right
            -1, 1, 0,  // top-left
            1, 1, 0   // top-right
        ]);

        // TexCoord: UV coordinates (0-1 range)
        // Note: Y is flipped because OpenGL has (0,0) at bottom-left, 
        // but Isaac's screen has (0,0) at top-left
        const texCoords = new Float32Array([
            0, 1,  // bottom-left  -> top-left of texture
            1, 1,  // bottom-right -> top-right of texture
            0, 0,  // top-left     -> bottom-left of texture
            1, 0   // top-right    -> bottom-right of texture
        ]);

        // Color: Per-vertex RGBA (usually white for screen shaders)
        const colors = new Float32Array([
            1, 1, 1, 1,  // vertex 0
            1, 1, 1, 1,  // vertex 1
            1, 1, 1, 1,  // vertex 2
            1, 1, 1, 1   // vertex 3
        ]);

        // Scale: Isaac's room zoom level (0.5 = typical gameplay)
        // Player position is doubled to compensate, so position math works out correctly
        // and pixel-based parameters (RegionSize, etc.) match Isaac's behavior
        const scales = new Float32Array([0.5, 0.5, 0.5, 0.5]);

        // RenderData: Isaac packs window and texture sizes
        // - RenderData.xy = window dimensions (pixels)
        // - RenderData.zw = texture dimensions (pixels)
        // Isaac's actual render target is ~2x our canvas size, so we double these
        // values to make pixel-based parameters (RegionSize, etc.) match in-game behavior
        const windowWidth = this.canvas.width * 2;
        const windowHeight = this.canvas.height * 2;
        const textureWidth = this.canvas.width * 2;
        const textureHeight = this.canvas.height * 2;

        const renderData = new Float32Array([
            windowWidth, windowHeight, textureWidth, textureHeight,  // vertex 0
            windowWidth, windowHeight, textureWidth, textureHeight,  // vertex 1
            windowWidth, windowHeight, textureWidth, textureHeight,  // vertex 2
            windowWidth, windowHeight, textureWidth, textureHeight   // vertex 3
        ]);

        this.createAttribute('Position', positions, 3);
        this.createAttribute('TexCoord', texCoords, 2);
        this.createAttribute('Color', colors, 4);
        this.createAttribute('Scale', scales, 1);
        this.createAttribute('RenderData', renderData, 4);

        console.log('[ShaderRenderer] Geometry setup complete, buffers:', this.attributeBuffers.length);
    }

    /**
     * Setup parameter attribute buffers for Isaac-style shaders that pass
     * parameters as vertex attributes instead of uniforms.
     * Call this after setupGeometry() and before starting rendering.
     */
    public setupParameterAttributes(vertexSource: string): void {
        if (!this.gl || !this.program) return;

        // Standard attributes that are NOT parameters
        const standardAttributes = ['Position', 'Color', 'TexCoord', 'RenderData', 'Scale'];

        // Find attribute declarations in vertex shader
        // Match patterns like: attribute float Name; attribute vec3 Name;
        // Also handle 'in' keyword for GLSL ES 3.00
        const attributeRegex = /(?:attribute|in)\s+(float|vec2|vec3|vec4)\s+(\w+)\s*;/g;
        let match;

        while ((match = attributeRegex.exec(vertexSource)) !== null) {
            const glslType = match[1];
            const attrName = match[2];

            // Skip standard attributes
            if (standardAttributes.includes(attrName)) continue;

            // Check if this attribute exists in the compiled program
            const location = this.gl.getAttribLocation(this.program, attrName);
            if (location < 0) {
                console.log('[ShaderRenderer] Parameter attribute', attrName, 'not found in program (may be optimized out)');
                continue;
            }

            // Determine size based on type
            let size = 1;
            switch (glslType) {
                case 'float': size = 1; break;
                case 'vec2': size = 2; break;
                case 'vec3': size = 3; break;
                case 'vec4': size = 4; break;
            }

            // Create buffer for this parameter attribute
            const buffer = this.gl.createBuffer();
            if (!buffer) {
                console.error('[ShaderRenderer] Failed to create buffer for parameter attribute', attrName);
                continue;
            }

            // Initialize with zeros (4 vertices)
            const initialData = new Float32Array(4 * size);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, initialData, this.gl.DYNAMIC_DRAW);

            this.parameterAttributeBuffers.push({
                buffer,
                location,
                size,
                paramName: attrName,
                paramType: glslType
            });

            console.log('[ShaderRenderer] Created parameter attribute buffer:', attrName, 'type:', glslType, 'location:', location);
        }

        console.log('[ShaderRenderer] Parameter attribute buffers created:', this.parameterAttributeBuffers.length);
    }

    /**
     * Update all parameter attribute buffers with current values
     */
    private updateParameterAttributeBuffers(): void {
        if (!this.gl || this.parameterAttributeBuffers.length === 0) return;

        const shaderParams = this.paramManager.getShaderParams();
        const paramDefinitions = this.paramManager.getParamDefinitions();

        for (const paramAttr of this.parameterAttributeBuffers) {
            let value: number | number[] | null = null;

            // Check for special parameter types first
            const paramDef = paramDefinitions.find(p => p.name === paramAttr.paramName);

            if (paramDef?.type === 'time') {
                // Use frame count to match Isaac's Isaac.GetFrameCount()
                // Isaac runs at 60 FPS, so frameCount increases by 60 per second
                // Apply fps conversion if specified (default 60)
                const targetFps = paramDef.fps || 60;
                if (targetFps === 60) {
                    value = this.frameCount;
                } else {
                    // Scale from native ~60fps to target fps
                    value = Math.floor(this.frameCount * targetFps / 60);
                }
            } else if (paramDef?.type === 'playerpos') {
                // Use world or screen coordinates based on coordinateSpace setting
                const coords = paramDef.coordinateSpace === 'world'
                    ? this.gameState.playerPositionWorld
                    : this.gameState.playerPosition;
                value = [coords.x, coords.y];
            } else if (paramDef?.type === 'mousepos') {
                value = [this.mousePosition.x, this.mousePosition.y];
            } else if (paramDef?.type === 'tearpos') {
                // Get tear position by index (1-based)
                const tearIndex = (paramDef.index || 1) - 1;
                const tearPos = this.gameState.tearPositions[tearIndex];
                if (tearPos) {
                    value = [tearPos.x, tearPos.y];
                } else {
                    // No tear at this index, return (0,0) to indicate inactive
                    value = [0, 0];
                }
            } else if (shaderParams[paramAttr.paramName] !== undefined) {
                value = shaderParams[paramAttr.paramName] as number | number[];
            } else if (paramDef?.default) {
                // Parse default value
                if (paramAttr.size === 1) {
                    value = parseFloat(paramDef.default);
                } else {
                    value = paramDef.default.split(',').map(v => parseFloat(v.trim()));
                }
            } else {
                // Use zeros as fallback
                value = paramAttr.size === 1 ? 0 : new Array(paramAttr.size).fill(0);
            }

            // Create data array for 4 vertices (same value for all)
            const data = new Float32Array(4 * paramAttr.size);
            for (let i = 0; i < 4; i++) {
                if (typeof value === 'number') {
                    data[i * paramAttr.size] = value;
                } else if (Array.isArray(value)) {
                    for (let j = 0; j < paramAttr.size && j < value.length; j++) {
                        data[i * paramAttr.size + j] = value[j];
                    }
                }
            }

            // Update buffer
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, paramAttr.buffer);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, data);
        }
    }

    private createAttribute(name: string, data: Float32Array, size: number): void {
        if (!this.gl || !this.program) return;

        const buffer = this.gl.createBuffer();
        if (!buffer) {
            console.error('[ShaderRenderer] Failed to create buffer for', name);
            return;
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

        const location = this.gl.getAttribLocation(this.program, name);
        console.log('[ShaderRenderer] Attribute', name, 'location:', location);

        if (location >= 0) {
            // Store buffer info for re-binding during render
            this.attributeBuffers.push({ buffer, location, size });
        }
    }

    private bindAttributes(): void {
        if (!this.gl) return;

        // Bind standard geometry attributes
        for (const attr of this.attributeBuffers) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attr.buffer);
            this.gl.enableVertexAttribArray(attr.location);
            this.gl.vertexAttribPointer(attr.location, attr.size, this.gl.FLOAT, false, 0, 0);
        }

        // Bind parameter attribute buffers (Isaac-style shader parameters)
        for (const paramAttr of this.parameterAttributeBuffers) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, paramAttr.buffer);
            this.gl.enableVertexAttribArray(paramAttr.location);
            this.gl.vertexAttribPointer(paramAttr.location, paramAttr.size, this.gl.FLOAT, false, 0, 0);
        }
    }

    public loadTextureFromCanvas(sourceCanvas: HTMLCanvasElement): void {
        if (!this.gl) return;

        if (!this.texture) {
            this.texture = this.gl.createTexture();
        }

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, sourceCanvas);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    }

    public updateTexture(sourceCanvas: HTMLCanvasElement): void {
        if (!this.gl) return;

        // Create texture on first call
        if (!this.texture) {
            this.loadTextureFromCanvas(sourceCanvas);
            return;
        }

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, sourceCanvas);
    }

    public updateGameState(state: Partial<GameState>): void {
        Object.assign(this.gameState, state);
    }

    public setPlayerPosition(x: number, y: number): void {
        this.gameState.playerPosition = { x, y };
    }

    public setMousePosition(x: number, y: number): void {
        this.mousePosition = { x, y };
    }

    public render(): void {
        if (!this.gl || !this.program || !this.canvas || !this.isPlaying) return;

        // Log first few frames for debugging
        if (this.frameCount < 3) {
            console.log('[ShaderRenderer] render() frame', this.frameCount,
                'bufferCanvas:', !!this.gameState.bufferCanvas,
                'texture:', !!this.texture,
                'buffers:', this.attributeBuffers.length);
        }

        // Update texture from game canvas if available
        if (this.gameState.bufferCanvas) {
            // Check if buffer canvas has content (on first few frames)
            if (this.frameCount < 5) {
                const ctx = this.gameState.bufferCanvas.getContext('2d');
                if (ctx) {
                    const w = this.gameState.bufferCanvas.width;
                    const h = this.gameState.bufferCanvas.height;
                    // Check center of canvas
                    const centerX = Math.floor(w / 2) - 5;
                    const centerY = Math.floor(h / 2) - 5;
                    const imageData = ctx.getImageData(centerX, centerY, 10, 10);
                    let coloredPixels = 0;
                    let sampleR = 0, sampleG = 0, sampleB = 0, sampleA = 0;
                    for (let i = 0; i < imageData.data.length; i += 4) {
                        // Count pixels that aren't pure black
                        if (imageData.data[i] > 0 || imageData.data[i + 1] > 0 || imageData.data[i + 2] > 0) {
                            coloredPixels++;
                            if (sampleR === 0 && sampleG === 0 && sampleB === 0) {
                                sampleR = imageData.data[i];
                                sampleG = imageData.data[i + 1];
                                sampleB = imageData.data[i + 2];
                                sampleA = imageData.data[i + 3];
                            }
                        }
                    }
                    console.log('[ShaderRenderer] Buffer canvas CENTER check: colored pixels:', coloredPixels,
                        'sample RGBA:', sampleR, sampleG, sampleB, sampleA,
                        'at', centerX, centerY);
                }
            }

            this.updateTexture(this.gameState.bufferCanvas);
            if (this.frameCount < 3) {
                console.log('[ShaderRenderer] Updated texture from canvas',
                    this.gameState.bufferCanvas.width, 'x', this.gameState.bufferCanvas.height);
            }
        }

        // Don't render if we don't have a texture yet
        if (!this.texture) {
            if (this.frameCount < 3) {
                console.log('[ShaderRenderer] No texture yet, skipping frame');
            }
            this.animationId = requestAnimationFrame(() => this.render());
            return;
        }

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Ensure clean WebGL state
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.CULL_FACE);
        this.gl.disable(this.gl.SCISSOR_TEST);

        // Enable blending to match Isaac's rendering
        // Using premultiplied alpha blending since canvas 2D uses premultiplied alpha
        // Formula: final = src * 1 + dst * (1 - srcAlpha)
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);

        this.gl.useProgram(this.program);

        // Update parameter attribute buffers with current values (Isaac-style shaders)
        this.updateParameterAttributeBuffers();

        // Re-bind vertex attributes before drawing
        this.bindAttributes();

        if (this.frameCount < 3) {
            // Check if program is valid
            const programValid = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
            console.log('[ShaderRenderer] Program link status:', programValid);
        }

        // Set transform matrix (identity)
        const transformLocation = this.gl.getUniformLocation(this.program, 'Transform');
        if (this.frameCount < 3) {
            console.log('[ShaderRenderer] Transform uniform location:', transformLocation);
        }
        if (transformLocation) {
            const identityMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            this.gl.uniformMatrix4fv(transformLocation, false, identityMatrix);
        }

        // NOTE: Isaac's shader system only passes custom parameters via vertex attributes,
        // NOT via uniforms. This simulator mimics that behavior exactly.
        // Custom parameters are handled by updateParameterAttributeBuffers() which updates
        // the attribute buffers each frame. We do NOT set uniforms for custom params.

        // Bind and set texture
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        const textureLocation = this.gl.getUniformLocation(this.program, 'Texture0');
        if (this.frameCount < 3) {
            console.log('[ShaderRenderer] Texture0 uniform location:', textureLocation);
        }
        if (textureLocation) {
            this.gl.uniform1i(textureLocation, 0);
        }

        // Check GL state before draw
        if (this.frameCount < 3) {
            const currentProgram = this.gl.getParameter(this.gl.CURRENT_PROGRAM);
            console.log('[ShaderRenderer] Current program before draw:', currentProgram === this.program ? 'correct' : 'WRONG');

            // Check attribute bindings
            for (const attr of this.attributeBuffers) {
                const enabled = this.gl.getVertexAttrib(attr.location, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED);
                console.log('[ShaderRenderer] Attribute', attr.location, 'enabled:', enabled);
            }
        }

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        // Check for GL errors on first few frames
        if (this.frameCount < 3) {
            const error = this.gl.getError();
            console.log('[ShaderRenderer] GL Error after draw:', error === this.gl.NO_ERROR ? 'none' : error);

            // Read back pixels from WebGL canvas to verify drawing worked
            const pixels = new Uint8Array(4 * 10 * 10);
            const centerX = Math.floor(this.canvas.width / 2) - 5;
            const centerY = Math.floor(this.canvas.height / 2) - 5;
            this.gl.readPixels(centerX, centerY, 10, 10, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
            console.log('[ShaderRenderer] WebGL canvas center pixels - first pixel RGBA:',
                pixels[0], pixels[1], pixels[2], pixels[3],
                'non-black count:', Array.from(pixels).filter((v, i) => i % 4 < 3 && v > 0).length);

            // Check canvas visibility and style
            const style = window.getComputedStyle(this.canvas);
            console.log('[ShaderRenderer] Canvas visibility check:',
                'display:', style.display,
                'visibility:', style.visibility,
                'opacity:', style.opacity,
                'zIndex:', style.zIndex,
                'position:', style.position);
            console.log('[ShaderRenderer] Canvas rect:', this.canvas.getBoundingClientRect());
        }

        this.frameCount++;
        this.fpsFrameCount++;

        // Update elapsed time (in seconds, for shader Time parameter)
        this.elapsedTime = (performance.now() - this.startTime) / 1000.0;

        // FPS calculation
        const now = Date.now();
        if (now - this.lastFpsUpdate >= 1000) {
            this.currentFps = this.fpsFrameCount;
            this.fpsFrameCount = 0;
            this.lastFpsUpdate = now;
            if (this.onFpsUpdate) this.onFpsUpdate(this.currentFps);
        }

        if (this.onFrameUpdate) this.onFrameUpdate(this.frameCount);

        this.animationId = requestAnimationFrame(() => this.render());
    }

    public startRendering(): void {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.frameCount = 0;
        this.startTime = performance.now();
        this.elapsedTime = 0;
        this.render();
    }

    public stopRendering(): void {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    public isActive(): boolean {
        return this.isPlaying;
    }

    public getFrameCount(): number {
        return this.frameCount;
    }

    public getFps(): number {
        return this.currentFps;
    }
}
