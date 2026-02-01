// Shader Studio Types

export interface ParamDefinition {
    name: string;
    type: ParamType;
    default?: string;
    min?: number;
    max?: number;
    step?: number;
    fps?: number;  // For 'time' type: target FPS (default 60, Isaac's native rate)
    coordinateSpace?: 'screen' | 'world';  // For 'playerpos' type: coordinate space (default 'screen')
    index?: number;  // For 'tearpos' type: which tear (1-based, e.g., 1 = first tear)
}

export type ParamType = 'float' | 'vec2' | 'vec3' | 'vec4' | 'boolean' | 'time' | 'mousepos' | 'playerpos' | 'tearpos' | 'color';

export interface ShaderParams {
    [key: string]: number | number[] | null;
}

export interface ShaderExample {
    name: string;
    description?: string;  // Optional description/comment for the shader
    params: ParamDefinition[];
    vertex: string;
    fragment: string;
    customLua?: string;  // Optional custom Lua for internal examples (not exported to shaders.xml)
}

export interface SavedShader extends ShaderExample {
    id: string;  // Unique identifier for the saved shader
    savedAt: number;  // Timestamp when saved
}

export interface GameState {
    bufferCanvas: HTMLCanvasElement | null;
    playerPosition: { x: number; y: number };  // Screen coordinates (Isaac.WorldToScreen)
    playerPositionWorld: { x: number; y: number };  // World coordinates (Isaac.GetPlayer().Position)
    canvasWidth: number;
    canvasHeight: number;
    tearPositions: { x: number; y: number }[];  // Screen coordinates of player tears (up to 10)
}

export interface ShaderManifestEntry {
    id: string;
    label: string;
    file: string;
}

export interface ShaderManifest {
    shaders: ShaderManifestEntry[];
}
