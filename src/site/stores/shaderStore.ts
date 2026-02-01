import { create } from 'zustand'

export type ParamType = 'float' | 'vec2' | 'vec3' | 'vec4' | 'boolean' | 'time' | 'mousepos' | 'playerpos' | 'tearpos' | 'color'

export interface ParamDefinition {
  name: string
  type: ParamType
  default?: string
  min?: number
  max?: number
  step?: number
  fps?: number
  coordinateSpace?: 'screen' | 'world'
  index?: number
}

export interface ConsoleErrorLocation {
  shaderType: 'vertex' | 'fragment'
  line: number
  column?: number
}

export interface ConsoleEntry {
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  timestamp: Date
  errorLocation?: ConsoleErrorLocation
}

export interface ShaderExample {
  id: string
  name: string
  description?: string
}

export interface SavedShader {
  id: string
  name: string
  description: string
  vertex: string
  fragment: string
  params: ParamDefinition[]
  savedAt: string
}

export interface ShaderError {
  type: 'vertex' | 'fragment' | 'linker'
  line?: number
  column?: number
  endLine?: number
  endColumn?: number
  message: string
  source?: 'parser' | 'webgl'
  severity?: 'error' | 'warning'
}

interface ShaderState {
  // Shader code
  vertexCode: string
  fragmentCode: string

  // Metadata
  shaderName: string
  shaderDescription: string

  // Parameters (Attributes)
  parameters: ParamDefinition[]
  runtimeValues: Record<string, number | number[]>

  // UI State
  activeEditorTab: 'vertex' | 'fragment' | 'attributes'
  isCompiled: boolean
  isPlaying: boolean

  // Dirty tracking
  isDirty: boolean
  hasUnsavedShader: boolean

  // Console
  consoleMessages: ConsoleEntry[]

  // Modal state
  exportModalOpen: boolean
  importModalOpen: boolean

  // Shader examples
  shaderExamples: ShaderExample[]
  currentShaderId: string | null  // null = No Shader, 'unsaved' = new unsaved shader, 'saved:xxx' = saved, 'example' = example
  shaderSessionId: number  // Increments when shader is created/loaded/cleared - used to reset AI chat

  // Display stats
  fps: number
  frame: number
  playerPosition: { x: number; y: number }

  // Shader errors for editor annotations
  shaderErrors: ShaderError[]

  // Navigation request for jumping to error locations
  editorNavigateTo: { shaderType: 'vertex' | 'fragment'; line: number; column?: number } | null

  // Actions
  setVertexCode: (code: string) => void
  setFragmentCode: (code: string) => void
  setShaderName: (name: string) => void
  setShaderDescription: (desc: string) => void
  setActiveEditorTab: (tab: 'vertex' | 'fragment' | 'attributes') => void
  setParameters: (params: ParamDefinition[]) => void
  addParameter: (param: ParamDefinition) => void
  removeParameter: (index: number) => void
  updateParameter: (index: number, param: ParamDefinition) => void
  setRuntimeValue: (name: string, value: number | number[]) => void
  setIsCompiled: (compiled: boolean) => void
  setIsPlaying: (playing: boolean) => void
  addConsoleMessage: (type: ConsoleEntry['type'], message: string, errorLocation?: ConsoleErrorLocation) => void
  navigateToError: (shaderType: 'vertex' | 'fragment', line: number, column?: number) => void
  clearEditorNavigation: () => void
  clearConsole: () => void
  setExportModalOpen: (open: boolean) => void
  setImportModalOpen: (open: boolean) => void
  setShaderExamples: (examples: ShaderExample[]) => void
  setCurrentShaderId: (id: string | null) => void
  updateStats: (fps: number, frame: number, playerPos: { x: number; y: number }) => void
  loadShader: (vertex: string, fragment: string, params: ParamDefinition[], name: string, description: string) => void
  setShaderErrors: (errors: ShaderError[]) => void
  clearShaderErrors: () => void
  createNewShader: () => void
  clearShader: () => void
  markClean: () => void
}

const DEFAULT_VERTEX = `attribute vec3 Position;
attribute vec4 Color;
attribute vec2 TexCoord;
attribute vec4 RenderData;
attribute float Scale;

uniform mat4 Transform;

varying vec4 Color0;
varying vec2 TexCoord0;
varying vec4 RenderDataOut;
varying float ScaleOut;

void main(void) {
    Color0 = Color;
    TexCoord0 = TexCoord;
    RenderDataOut = RenderData;
    ScaleOut = Scale;
    gl_Position = Transform * vec4(Position.xyz, 1.0);
}`

const DEFAULT_FRAGMENT = `varying lowp vec4 Color0;
varying mediump vec2 TexCoord0;
varying lowp vec4 RenderDataOut;
varying lowp float ScaleOut;

uniform sampler2D Texture0;

void main(void) {
    vec4 tex = texture2D(Texture0, TexCoord0);
    gl_FragColor = Color0 * tex;
}`

export const useShaderStore = create<ShaderState>((set) => ({
  // Initial state - start with No Shader selected
  vertexCode: '',
  fragmentCode: '',
  shaderName: '',
  shaderDescription: '',
  parameters: [],
  runtimeValues: {},
  activeEditorTab: 'vertex',
  isCompiled: false,
  isPlaying: true,
  isDirty: false,
  hasUnsavedShader: false,
  consoleMessages: [],
  exportModalOpen: false,
  importModalOpen: false,
  shaderExamples: [],
  currentShaderId: null,  // null = No Shader
  shaderSessionId: 0,
  fps: 0,
  frame: 0,
  playerPosition: { x: 0, y: 0 },
  shaderErrors: [],
  editorNavigateTo: null,

  // Actions - mark dirty when editing
  setVertexCode: (code) => set((state) => ({ vertexCode: code, isDirty: state.currentShaderId !== null })),
  setFragmentCode: (code) => set((state) => ({ fragmentCode: code, isDirty: state.currentShaderId !== null })),
  setShaderName: (name) => set((state) => ({ shaderName: name, isDirty: state.currentShaderId !== null })),
  setShaderDescription: (desc) => set((state) => ({ shaderDescription: desc, isDirty: state.currentShaderId !== null })),
  setActiveEditorTab: (tab) => set({ activeEditorTab: tab }),
  setParameters: (params) => set((state) => ({ parameters: params, isDirty: state.currentShaderId !== null })),
  addParameter: (param) => set((state) => ({
    parameters: [...state.parameters, param],
    isDirty: state.currentShaderId !== null
  })),
  removeParameter: (index) => set((state) => ({
    parameters: state.parameters.filter((_, i) => i !== index),
    isDirty: state.currentShaderId !== null
  })),
  updateParameter: (index, param) => set((state) => ({
    parameters: state.parameters.map((p, i) => i === index ? param : p),
    isDirty: state.currentShaderId !== null
  })),
  setRuntimeValue: (name, value) => set((state) => ({
    runtimeValues: { ...state.runtimeValues, [name]: value }
  })),
  setIsCompiled: (compiled) => set({ isCompiled: compiled }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  addConsoleMessage: (type, message, errorLocation) => set((state) => ({
    consoleMessages: [...state.consoleMessages, { type, message, timestamp: new Date(), errorLocation }]
  })),
  navigateToError: (shaderType, line, column) => set({
    activeEditorTab: shaderType,
    editorNavigateTo: { shaderType, line, column }
  }),
  clearEditorNavigation: () => set({ editorNavigateTo: null }),
  clearConsole: () => set({ consoleMessages: [] }),
  setExportModalOpen: (open) => set({ exportModalOpen: open }),
  setImportModalOpen: (open) => set({ importModalOpen: open }),
  setShaderExamples: (examples) => set({ shaderExamples: examples }),
  setCurrentShaderId: (id) => set({ currentShaderId: id }),
  updateStats: (fps, frame, playerPos) => set({ fps, frame, playerPosition: playerPos }),

  // Create a new unsaved shader
  createNewShader: () => set((state) => ({
    vertexCode: DEFAULT_VERTEX,
    fragmentCode: DEFAULT_FRAGMENT,
    shaderName: 'Untitled Shader',
    shaderDescription: '',
    parameters: [],
    runtimeValues: {},
    currentShaderId: 'unsaved',
    shaderSessionId: state.shaderSessionId + 1,
    hasUnsavedShader: true,
    isDirty: false,
    isCompiled: false,
    shaderErrors: [],
    consoleMessages: [{ type: 'info', message: 'Created new shader: Untitled Shader', timestamp: new Date() }],
  })),

  // Clear to No Shader state
  clearShader: () => set((state) => ({
    vertexCode: '',
    fragmentCode: '',
    shaderName: '',
    shaderDescription: '',
    parameters: [],
    runtimeValues: {},
    currentShaderId: null,
    shaderSessionId: state.shaderSessionId + 1,
    hasUnsavedShader: false,
    isDirty: false,
    isCompiled: false,
    shaderErrors: [],
    consoleMessages: [],
  })),

  // Mark as clean (after saving)
  markClean: () => set({ isDirty: false }),

  loadShader: (vertex, fragment, params, name, description) => {
    // Initialize runtime values from parameter defaults
    const runtimeValues: Record<string, number | number[]> = {}

    params.forEach(param => {
      if (param.default === undefined) return

      if (param.type === 'color') {
        const val = param.default
        if (val.startsWith('#') && val.length >= 7) {
          // Parse hex color like "#1ac725" to [r, g, b] in 0-1 range
          const r = parseInt(val.slice(1, 3), 16) / 255
          const g = parseInt(val.slice(3, 5), 16) / 255
          const b = parseInt(val.slice(5, 7), 16) / 255
          runtimeValues[param.name] = [r, g, b]
        } else if (val.includes(',')) {
          // Parse comma-separated values like "0.2, 0.8, 0.1" (0-1 range)
          const parts = val.split(',').map(v => parseFloat(v.trim()))
          if (parts.length >= 3 && parts.every(p => !isNaN(p))) {
            runtimeValues[param.name] = [parts[0], parts[1], parts[2]]
          }
        }
      } else if (param.type === 'float') {
        runtimeValues[param.name] = parseFloat(param.default) || 0
      } else if (param.type === 'boolean') {
        // Accept various truthy representations: 'true', '1', '1.0', 'on'
        const val = param.default.toLowerCase().trim()
        runtimeValues[param.name] = (val === 'true' || val === '1' || val === '1.0' || val === 'on') ? 1 : 0
      } else if (['vec2', 'vec3', 'vec4'].includes(param.type)) {
        // Parse comma-separated values like "0.5, 0.5, 0.5"
        const values = param.default.split(',').map(v => parseFloat(v.trim()) || 0)
        runtimeValues[param.name] = values
      }
    })

    return set((state) => ({
      vertexCode: vertex,
      fragmentCode: fragment,
      parameters: params,
      shaderName: name,
      shaderDescription: description,
      shaderSessionId: state.shaderSessionId + 1,
      isCompiled: false,
      shaderErrors: [],
      consoleMessages: [{ type: 'info', message: `Loading shader: ${name}`, timestamp: new Date() }],
      runtimeValues,
      isDirty: false,
      hasUnsavedShader: false,
    }))
  },
  setShaderErrors: (errors) => set({ shaderErrors: errors }),
  clearShaderErrors: () => set({ shaderErrors: [] }),
}))
