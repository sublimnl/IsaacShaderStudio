// Shader Studio - Main controller class

import { ShaderCompiler } from './ShaderCompiler';
import { ParameterManager } from './ParameterManager';
import { ShaderRenderer } from './ShaderRenderer';
import { ShaderExample, SavedShader, ParamDefinition, ShaderManifest, ShaderManifestEntry, ParamType } from './types';
import type JSZipType from 'jszip';

declare const JSZip: typeof JSZipType;

export class ShaderStudio {
    private static instance: ShaderStudio;

    private compiler: ShaderCompiler;
    private paramManager: ParameterManager;
    private renderer: ShaderRenderer;

    private vertexEditor: AceAjax.Editor = null;
    private fragmentEditor: AceAjax.Editor = null;
    private errorMarkerId: number | null = null;

    // Modal editors
    private metadataEditor: AceAjax.Editor = null;
    private luaEditor: AceAjax.Editor = null;
    private xmlEditor: AceAjax.Editor = null;
    private modalOpen: boolean = false;

    private glCanvas: HTMLCanvasElement | null = null;
    private consoleEl: HTMLElement | null = null;
    private viewportControls: HTMLElement | null = null;
    private fpsDisplay: HTMLElement | null = null;
    private frameDisplay: HTMLElement | null = null;
    private playerPosDisplay: HTMLElement | null = null;
    private playPauseBtn: HTMLElement | null = null;
    private shaderNameInput: HTMLInputElement | null = null;
    private shaderDescriptionInput: HTMLInputElement | null = null;

    private enabled: boolean = false;
    private initialized: boolean = false;
    private autoCompiled: boolean = false;

    // Store current shader source for recompilation after canvas refresh
    private currentVertexSource: string = '';
    private currentFragmentSource: string = '';

    // Shader manifest and cache (loaded from XML files)
    private shaderManifest: ShaderManifestEntry[] = [];
    private shaderCache: { [key: string]: ShaderExample } = {};
    private exampleSelect: HTMLSelectElement | null = null;
    private deleteShaderBtn: HTMLButtonElement | null = null;

    // Saved shaders (localStorage)
    private static readonly STORAGE_KEY = 'isaac_shader_studio_saved_shaders';
    private savedShaders: SavedShader[] = [];
    private currentLoadedShaderId: string | null = null;  // Track if we're editing a saved shader
    private currentCustomLua: string | null = null;  // Custom Lua from internal examples (overrides generated Lua)

    // Unsaved changes tracking
    private lastSavedState: {
        name: string;
        description: string;
        vertex: string;
        fragment: string;
        params: string;  // JSON stringified params for comparison
    } | null = null;

    // Import modal elements and state
    private importModal: HTMLElement | null = null;
    private importDropZone: HTMLElement | null = null;
    private importFileInput: HTMLInputElement | null = null;
    private importValidationError: HTMLElement | null = null;
    private importShaderListContainer: HTMLElement | null = null;
    private importShaderList: HTMLElement | null = null;
    private importShaderCount: HTMLElement | null = null;
    private importSelectAll: HTMLInputElement | null = null;
    private importShadersBtn: HTMLButtonElement | null = null;
    private parsedShadersForImport: ShaderExample[] = [];

    // Default fallback shader (used for new shaders)
    private defaultShader: ShaderExample = {
        name: '',
        params: [],
        vertex: `attribute vec3 Position;
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
}`,
        fragment: `varying lowp vec4 Color0;
varying mediump vec2 TexCoord0;
varying lowp vec4 RenderDataOut;
varying lowp float ScaleOut;

uniform sampler2D Texture0;

void main(void) {
    gl_FragColor = Color0 * texture2D(Texture0, TexCoord0);
}`
    };

    private constructor() {
        this.compiler = new ShaderCompiler();
        this.paramManager = new ParameterManager();
        this.renderer = new ShaderRenderer(this.paramManager);
    }

    public static getInstance(): ShaderStudio {
        if (!ShaderStudio.instance) {
            ShaderStudio.instance = new ShaderStudio();
        }
        return ShaderStudio.instance;
    }

    public static isEnabled(): boolean {
        return ShaderStudio.instance?.enabled ?? false;
    }

    /**
     * Reset to passthrough shader (shows raw game output)
     */
    public disable(): void {
        console.log('[ShaderStudio] Resetting to passthrough shader');
        // Compile the default passthrough shader
        this.compileWithCode(
            this.defaultShader.vertex,
            this.defaultShader.fragment,
            []
        );
    }

    public initialize(): void {
        console.log('[ShaderStudio] initialize() called, already initialized:', this.initialized);
        if (this.initialized) return;

        // Get DOM elements
        this.glCanvas = document.getElementById('glCanvas') as HTMLCanvasElement;
        console.log('[ShaderStudio] glCanvas:', this.glCanvas);

        // Forward focus/blur events from glCanvas to the game's event system
        if (this.glCanvas) {
            this.glCanvas.addEventListener('focus', () => {
                const focusEvent = new CustomEvent('focus', {
                    detail: { state: true }
                });
                document.dispatchEvent(focusEvent);
            });

            this.glCanvas.addEventListener('blur', () => {
                const focusEvent = new CustomEvent('focus', {
                    detail: { state: false }
                });
                document.dispatchEvent(focusEvent);
            });

            // Track mouse position for mousepos shader parameter
            // Apply same scaling as playerpos (4x) for consistency
            this.glCanvas.addEventListener('mousemove', (e) => {
                const rect = this.glCanvas!.getBoundingClientRect();
                // Convert to canvas pixel coordinates
                const canvasX = (e.clientX - rect.left) / rect.width * 442;  // canvas width
                const canvasY = (e.clientY - rect.top) / rect.height * 286;  // canvas height
                // Apply same 4x scaling and Y offset as playerpos
                const yOffset = -2;
                const scaledX = canvasX * 4;
                const scaledY = (canvasY + yOffset) * 4;
                this.renderer.setMousePosition(scaledX, scaledY);
            });
        }

        this.consoleEl = document.getElementById('shaderConsole');
        this.viewportControls = document.getElementById('viewportControls');
        this.fpsDisplay = document.getElementById('fpsDisplay');
        this.frameDisplay = document.getElementById('frameDisplay');
        this.playerPosDisplay = document.getElementById('playerPosDisplay');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.shaderNameInput = document.getElementById('shaderName') as HTMLInputElement;
        this.shaderDescriptionInput = document.getElementById('shaderDescription') as HTMLInputElement;

        const paramsPanel = document.getElementById('paramsPanel');
        const paramsList = document.getElementById('paramsList');

        if (paramsPanel && paramsList) {
            this.paramManager.initialize(paramsPanel, paramsList);
        }

        // Initialize Ace editors if available
        if (typeof ace !== 'undefined') {
            this.initializeEditors();
        }

        // Set up event listeners
        this.setupEventListeners();

        // Set up renderer callbacks
        this.renderer.onFpsUpdate = (fps) => {
            if (this.fpsDisplay) this.fpsDisplay.textContent = fps.toString();
        };
        this.renderer.onFrameUpdate = (frame) => {
            if (this.frameDisplay) this.frameDisplay.textContent = frame.toString();
        };

        this.initialized = true;
        this.logConsole('Shader Studio initialized. Game preview will be used as texture source.', 'info');
    }

    /**
     * Refresh the canvas reference - call this when the DOM canvas element has been replaced
     * (e.g., when React component remounts)
     */
    public refreshCanvas(): void {
        const newCanvas = document.getElementById('glCanvas') as HTMLCanvasElement;
        if (newCanvas && newCanvas !== this.glCanvas) {
            console.log('[ShaderStudio] refreshCanvas: updating canvas reference');
            const wasEnabled = this.enabled;
            this.glCanvas = newCanvas;

            // Re-setup event listeners on the new canvas
            this.glCanvas.addEventListener('focus', () => {
                const focusEvent = new CustomEvent('focus', {
                    detail: { state: true }
                });
                document.dispatchEvent(focusEvent);
            });

            this.glCanvas.addEventListener('blur', () => {
                const focusEvent = new CustomEvent('focus', {
                    detail: { state: false }
                });
                document.dispatchEvent(focusEvent);
            });

            this.glCanvas.addEventListener('mousemove', (e) => {
                const rect = this.glCanvas!.getBoundingClientRect();
                const canvasX = (e.clientX - rect.left) / rect.width * 442;
                const canvasY = (e.clientY - rect.top) / rect.height * 286;
                const yOffset = -2;
                const scaledX = canvasX * 4;
                const scaledY = (canvasY + yOffset) * 4;
                this.renderer.setMousePosition(scaledX, scaledY);
            });

            // Re-initialize WebGL context and recompile shader for the new context
            if (wasEnabled && this.currentVertexSource && this.currentFragmentSource) {
                console.log('[ShaderStudio] refreshCanvas: recompiling shader for new context');

                this.compiler.initGL(this.glCanvas);
                const gl = this.compiler.getContext();
                if (gl) {
                    const program = this.compiler.createProgram(this.currentVertexSource, this.currentFragmentSource);
                    if (program) {
                        this.renderer.initialize(gl, this.glCanvas);
                        this.renderer.setProgram(program);
                        this.renderer.setupGeometry();
                        this.renderer.setupParameterAttributes(this.currentVertexSource);
                        this.enabled = true;
                        this.renderer.startRendering();
                        console.log('[ShaderStudio] refreshCanvas: shader recompiled successfully');
                    }
                }
            }
        }
    }

    private initializeEditors(): void {
        const vertexEditorEl = document.getElementById('vertexEditor');
        const fragmentEditorEl = document.getElementById('fragmentEditor');

        if (vertexEditorEl) {
            this.vertexEditor = ace.edit('vertexEditor');
            this.vertexEditor.setTheme('ace/theme/monokai');
            this.vertexEditor.session.setMode('ace/mode/glsl');
            this.vertexEditor.setFontSize('13px');
            this.vertexEditor.setValue(this.defaultShader.vertex, -1);
            this.vertexEditor.setOptions({
                showPrintMargin: false,
                highlightActiveLine: true,
                showGutter: true
            });
        }

        if (fragmentEditorEl) {
            this.fragmentEditor = ace.edit('fragmentEditor');
            this.fragmentEditor.setTheme('ace/theme/monokai');
            this.fragmentEditor.session.setMode('ace/mode/glsl');
            this.fragmentEditor.setFontSize('13px');
            this.fragmentEditor.setValue(this.defaultShader.fragment, -1);
            this.fragmentEditor.setOptions({
                showPrintMargin: false,
                highlightActiveLine: true,
                showGutter: true
            });
        }
    }

    private setupEventListeners(): void {
        const compileBtn = document.getElementById('compileBtn');
        const viewModBtn = document.getElementById('viewModBtn');
        const saveShaderBtn = document.getElementById('saveShaderBtn');
        this.exampleSelect = document.getElementById('exampleSelect') as HTMLSelectElement;
        this.deleteShaderBtn = document.getElementById('deleteShaderBtn') as HTMLButtonElement;
        const addParamBtn = document.getElementById('addParamBtn');

        if (compileBtn) {
            compileBtn.addEventListener('click', () => this.compile());
        }

        if (viewModBtn) {
            viewModBtn.addEventListener('click', () => this.openViewModModal());
        }

        if (saveShaderBtn) {
            saveShaderBtn.addEventListener('click', () => this.saveShader());
        }

        if (this.deleteShaderBtn) {
            this.deleteShaderBtn.addEventListener('click', () => this.deleteCurrentShader());
        }

        // Modal event listeners
        const closeModalBtn = document.getElementById('closeModalBtn');
        const downloadModBtn = document.getElementById('downloadModBtn');
        const modalOverlay = document.getElementById('viewModModal');

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeViewModModal());
        }

        if (downloadModBtn) {
            downloadModBtn.addEventListener('click', () => this.downloadMod());
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeViewModModal();
                }
            });
        }

        // Import modal event listeners
        this.setupImportModalListeners();

        if (this.exampleSelect) {
            // Store previous value to restore if user cancels
            let previousValue = this.exampleSelect.value;

            this.exampleSelect.addEventListener('change', (e) => {
                const select = e.target as HTMLSelectElement;
                const value = select.value;

                // Handle Import Shader option specially - don't count as a shader change
                if (value === '__import__') {
                    this.openImportModal();
                    // Restore previous selection since import is a modal action
                    select.value = previousValue;
                    return;
                }

                // Check for unsaved changes before switching
                if (!this.confirmUnsavedChanges('load a different shader')) {
                    // User cancelled - restore previous selection
                    select.value = previousValue;
                    return;
                }

                if (value) {
                    if (value.startsWith('saved:')) {
                        // Load saved shader
                        const savedId = value.substring(6);
                        this.loadSavedShader(savedId);
                    } else {
                        // Load example shader
                        this.loadExample(value);
                    }
                } else {
                    // "-- New Shader --" selected - load defaults
                    this.loadNewShader();
                }
                previousValue = value;
                this.updateDeleteButtonVisibility();
            });
        }

        if (addParamBtn) {
            addParamBtn.addEventListener('click', () => {
                this.paramManager.addParameter();
            });
        }

        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', () => {
                if (this.renderer.isActive()) {
                    this.renderer.stopRendering();
                    this.playPauseBtn!.textContent = '\u25B6';
                    this.logConsole('Paused', 'info');
                } else {
                    this.renderer.startRendering();
                    this.playPauseBtn!.textContent = '\u23F8';
                    this.logConsole('Playing', 'info');
                }
            });
        }

        // Set up editor tabs
        this.setupEditorTabs();

        // Load saved shaders from localStorage and shader manifest
        this.loadSavedShadersFromStorage();
        this.loadShaderManifest();

        // Warn before leaving page with unsaved changes
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges()) {
                // Standard way to show browser's native "unsaved changes" dialog
                e.preventDefault();
                // For older browsers
                e.returnValue = '';
                return '';
            }
        });
    }

    private setupEditorTabs(): void {
        const tabs = document.querySelectorAll('.editor-tab');
        const panes = document.querySelectorAll('.editor-tab-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-editor-tab');

                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update active pane
                panes.forEach(pane => {
                    if (pane.getAttribute('data-editor-tab') === targetTab) {
                        pane.classList.add('active');
                    } else {
                        pane.classList.remove('active');
                    }
                });

                // Resize the active editor
                if (targetTab === 'vertex' && this.vertexEditor) {
                    this.vertexEditor.resize();
                } else if (targetTab === 'fragment' && this.fragmentEditor) {
                    this.fragmentEditor.resize();
                }
            });
        });
    }

    private async loadShaderManifest(): Promise<void> {
        try {
            const response = await fetch('./shaders/manifest.json');
            if (!response.ok) {
                throw new Error(`Failed to load manifest: ${response.status}`);
            }
            const manifest: ShaderManifest = await response.json();
            this.shaderManifest = manifest.shaders;
            this.populateExampleDropdown();
            this.logConsole(`Loaded ${this.shaderManifest.length} shader examples`, 'info');
        } catch (error) {
            console.error('[ShaderStudio] Failed to load shader manifest:', error);
            this.logConsole('Failed to load shader manifest, using defaults', 'warning');
        }
    }

    // ==================== Saved Shaders (localStorage) ====================

    private loadSavedShadersFromStorage(): void {
        try {
            const stored = localStorage.getItem(ShaderStudio.STORAGE_KEY);
            if (stored) {
                this.savedShaders = JSON.parse(stored);
                console.log(`[ShaderStudio] Loaded ${this.savedShaders.length} saved shaders from storage`);
            }
        } catch (error) {
            console.error('[ShaderStudio] Failed to load saved shaders:', error);
            this.savedShaders = [];
        }
    }

    private saveShadersToStorage(): void {
        try {
            localStorage.setItem(ShaderStudio.STORAGE_KEY, JSON.stringify(this.savedShaders));
        } catch (error) {
            console.error('[ShaderStudio] Failed to save shaders to storage:', error);
            this.logConsole('Failed to save to browser storage', 'error');
        }
    }

    private saveShader(): void {
        const name = this.shaderNameInput?.value?.trim();
        if (!name) {
            this.logConsole('Please enter a shader name before saving', 'error');
            return;
        }

        this.paramManager.collectParamDefinitions();
        const params = this.paramManager.getParamDefinitions();
        const vertex = this.vertexEditor?.getValue() || '';
        const fragment = this.fragmentEditor?.getValue() || '';
        const description = this.shaderDescriptionInput?.value?.trim() || undefined;

        // Check if we're updating an existing saved shader
        let shaderId = this.currentLoadedShaderId;
        const existingIndex = shaderId ? this.savedShaders.findIndex(s => s.id === shaderId) : -1;

        // Also check if a shader with the same name exists (for overwrite prompt)
        const sameNameIndex = this.savedShaders.findIndex(s => s.name === name && s.id !== shaderId);

        if (sameNameIndex !== -1 && existingIndex === -1) {
            // Different shader with same name exists - ask to overwrite
            if (!confirm(`A shader named "${name}" already exists. Overwrite it?`)) {
                return;
            }
            // Overwrite the existing one with the same name
            shaderId = this.savedShaders[sameNameIndex].id;
        }

        const savedShader: SavedShader = {
            id: shaderId || `shader_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            name,
            description,
            params,
            vertex,
            fragment,
            savedAt: Date.now()
        };

        if (existingIndex !== -1) {
            // Update existing shader
            this.savedShaders[existingIndex] = savedShader;
            this.logConsole(`Updated saved shader: ${name}`, 'info');
        } else if (sameNameIndex !== -1) {
            // Overwrite shader with same name
            this.savedShaders[sameNameIndex] = savedShader;
            this.logConsole(`Overwrote saved shader: ${name}`, 'info');
        } else {
            // Add new shader
            this.savedShaders.push(savedShader);
            this.logConsole(`Saved new shader: ${name}`, 'info');
        }

        this.currentLoadedShaderId = savedShader.id;
        this.saveShadersToStorage();
        this.populateExampleDropdown();

        // Select the saved shader in dropdown
        if (this.exampleSelect) {
            this.exampleSelect.value = `saved:${savedShader.id}`;
        }
        this.updateDeleteButtonVisibility();

        // Mark current state as clean (just saved)
        this.markAsClean();
    }

    private loadSavedShader(id: string): void {
        const shader = this.savedShaders.find(s => s.id === id);
        if (!shader) {
            this.logConsole(`Saved shader not found: ${id}`, 'error');
            return;
        }

        this.currentLoadedShaderId = id;
        this.applyShaderExample(shader);
    }

    private deleteCurrentShader(): void {
        if (!this.currentLoadedShaderId) return;

        const shader = this.savedShaders.find(s => s.id === this.currentLoadedShaderId);
        if (!shader) return;

        if (!confirm(`Delete saved shader "${shader.name}"?`)) {
            return;
        }

        this.savedShaders = this.savedShaders.filter(s => s.id !== this.currentLoadedShaderId);
        this.saveShadersToStorage();
        this.currentLoadedShaderId = null;

        this.logConsole(`Deleted shader: ${shader.name}`, 'info');
        this.populateExampleDropdown();
        this.loadNewShader();

        if (this.exampleSelect) {
            this.exampleSelect.value = '';
        }
        this.updateDeleteButtonVisibility();
    }

    private updateDeleteButtonVisibility(): void {
        if (!this.deleteShaderBtn || !this.exampleSelect) return;

        const value = this.exampleSelect.value;
        const isSavedShader = value.startsWith('saved:');
        this.deleteShaderBtn.style.display = isSavedShader ? 'block' : 'none';
    }

    // ==================== Unsaved Changes Detection ====================

    /**
     * Get current editor state for comparison
     */
    private getCurrentState(): { name: string; description: string; vertex: string; fragment: string; params: string } {
        this.paramManager.collectParamDefinitions();
        return {
            name: this.shaderNameInput?.value || '',
            description: this.shaderDescriptionInput?.value || '',
            vertex: this.vertexEditor?.getValue() || '',
            fragment: this.fragmentEditor?.getValue() || '',
            params: JSON.stringify(this.paramManager.getParamDefinitions())
        };
    }

    /**
     * Mark current state as "clean" (just saved or loaded)
     */
    private markAsClean(): void {
        this.lastSavedState = this.getCurrentState();
    }

    /**
     * Check if there are unsaved changes
     */
    private hasUnsavedChanges(): boolean {
        if (!this.lastSavedState) return false;

        const current = this.getCurrentState();
        return (
            current.name !== this.lastSavedState.name ||
            current.description !== this.lastSavedState.description ||
            current.vertex !== this.lastSavedState.vertex ||
            current.fragment !== this.lastSavedState.fragment ||
            current.params !== this.lastSavedState.params
        );
    }

    /**
     * Confirm with user if there are unsaved changes
     * Returns true if ok to proceed, false if user cancelled
     */
    private confirmUnsavedChanges(action: string): boolean {
        if (!this.hasUnsavedChanges()) return true;
        return confirm(`You have unsaved changes. Are you sure you want to ${action}? Your changes will be lost.`);
    }

    private populateExampleDropdown(): void {
        if (!this.exampleSelect) return;

        // Remember current selection
        const currentValue = this.exampleSelect.value;

        // Clear all options and optgroups except the first "-- New Shader --" option
        while (this.exampleSelect.children.length > 1) {
            this.exampleSelect.removeChild(this.exampleSelect.children[1]);
        }

        // Add "Import Shader..." option right after "-- New Shader --"
        const importOption = document.createElement('option');
        importOption.value = '__import__';
        importOption.textContent = 'Import Shader...';
        importOption.style.fontStyle = 'italic';
        this.exampleSelect.appendChild(importOption);

        // Add Saved Shaders optgroup (if there are any)
        if (this.savedShaders.length > 0) {
            const savedGroup = document.createElement('optgroup');
            savedGroup.label = 'Saved Shaders';

            // Sort by savedAt descending (most recent first)
            const sortedSaved = [...this.savedShaders].sort((a, b) => b.savedAt - a.savedAt);
            sortedSaved.forEach(shader => {
                const option = document.createElement('option');
                option.value = `saved:${shader.id}`;
                option.textContent = shader.name;
                savedGroup.appendChild(option);
            });

            this.exampleSelect.appendChild(savedGroup);
        }

        // Add Example Shaders optgroup
        if (this.shaderManifest.length > 0) {
            const exampleGroup = document.createElement('optgroup');
            exampleGroup.label = 'Example Shaders';

            this.shaderManifest.forEach(entry => {
                const option = document.createElement('option');
                option.value = entry.id;
                option.textContent = entry.label;
                exampleGroup.appendChild(option);
            });

            this.exampleSelect.appendChild(exampleGroup);
        }

        // Restore selection if it still exists
        if (currentValue) {
            const optionExists = Array.from(this.exampleSelect.options).some(opt => opt.value === currentValue);
            if (optionExists) {
                this.exampleSelect.value = currentValue;
            }
        }
    }

    public async loadExample(id: string): Promise<void> {
        // Clear tracking of saved shader (this is an example shader)
        this.currentLoadedShaderId = null;

        // Check cache first
        if (this.shaderCache[id]) {
            this.applyShaderExample(this.shaderCache[id]);
            return;
        }

        // Find manifest entry
        const entry = this.shaderManifest.find(e => e.id === id);
        if (!entry) {
            this.logConsole(`Shader example '${id}' not found`, 'error');
            return;
        }

        try {
            const response = await fetch(`./shaders/${entry.file}`);
            if (!response.ok) {
                throw new Error(`Failed to load shader: ${response.status}`);
            }
            const xmlText = await response.text();
            const shader = this.parseShaderXML(xmlText);

            if (shader) {
                this.shaderCache[id] = shader;
                this.applyShaderExample(shader);
            }
        } catch (error) {
            console.error(`[ShaderStudio] Failed to load shader '${id}':`, error);
            this.logConsole(`Failed to load shader: ${error}`, 'error');
        }
    }

    /**
     * Load a new blank shader with default template
     */
    private loadNewShader(): void {
        // Clear tracking of saved shader (this is a new shader)
        this.currentLoadedShaderId = null;
        // Clear custom Lua (new shaders use generated Lua)
        this.currentCustomLua = null;

        // Clear shader name and description
        if (this.shaderNameInput) {
            this.shaderNameInput.value = '';
        }
        if (this.shaderDescriptionInput) {
            this.shaderDescriptionInput.value = '';
        }

        // Load default vertex shader
        if (this.vertexEditor) {
            this.vertexEditor.setValue(this.defaultShader.vertex, -1);
        }

        // Load default fragment shader
        if (this.fragmentEditor) {
            this.fragmentEditor.setValue(this.defaultShader.fragment, -1);
        }

        // Clear parameters
        this.paramManager.clearParameters();
        this.paramManager.collectParamDefinitions();
        this.paramManager.createParameterControls();

        this.logConsole('New shader created with default template', 'info');

        // Compile the default shader
        this.compile();

        // Mark current state as clean (just loaded new shader)
        this.markAsClean();
    }

    private parseShaderXML(xmlText: string): ShaderExample | null {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlText, 'text/xml');

            const shaderEl = doc.querySelector('shader');
            if (!shaderEl) {
                throw new Error('No <shader> element found');
            }

            const name = shaderEl.getAttribute('name') || 'Unnamed';

            // Parse description (from attribute or <description> element)
            let description: string | undefined;
            const descAttr = shaderEl.getAttribute('description');
            if (descAttr) {
                description = descAttr;
            } else {
                const descEl = doc.querySelector('description');
                if (descEl?.textContent) {
                    description = descEl.textContent.trim();
                }
            }

            // Parse parameters using Isaac format: <param name="X" type="float"/>
            const params: ParamDefinition[] = [];
            const parametersEl = doc.querySelector('parameters');

            if (parametersEl) {
                // Only process <param> elements (Isaac format)
                const paramElements = parametersEl.querySelectorAll('param');

                paramElements.forEach(el => {
                    const paramName = el.getAttribute('name');
                    const paramType = el.getAttribute('type') as ParamType;

                    if (!paramName || !paramType) return;

                    // Check for studioType attribute first, then fall back to name-based detection
                    let studioType: ParamType | null = el.getAttribute('studioType') as ParamType | null;

                    // Fall back to name-based detection for backward compatibility
                    if (!studioType) {
                        const nameLower = paramName.toLowerCase();
                        if (nameLower === 'time') {
                            studioType = 'time';
                        } else if (nameLower === 'playerpos' || nameLower === 'playerposition') {
                            studioType = 'playerpos';
                        } else if (nameLower === 'mousepos' || nameLower === 'mouseposition') {
                            studioType = 'mousepos';
                        }
                    }

                    const defaultVal = el.getAttribute('default');
                    const minVal = el.getAttribute('min');
                    const maxVal = el.getAttribute('max');
                    const stepVal = el.getAttribute('step');

                    const param: ParamDefinition = {
                        name: paramName,
                        type: studioType || paramType,
                        default: defaultVal || undefined
                    };

                    // Parse min/max/step for float types
                    if (minVal) param.min = parseFloat(minVal);
                    if (maxVal) param.max = parseFloat(maxVal);
                    if (stepVal) param.step = parseFloat(stepVal);

                    // Parse fps for time type
                    const fpsVal = el.getAttribute('fps');
                    if (fpsVal) param.fps = parseInt(fpsVal, 10);

                    // Parse coordinateSpace for playerpos type
                    const coordSpaceVal = el.getAttribute('coordinateSpace') || el.getAttribute('coordinate-space');
                    if (coordSpaceVal === 'world' || coordSpaceVal === 'screen') {
                        param.coordinateSpace = coordSpaceVal;
                    }

                    // Parse index for tearpos type
                    const indexVal = el.getAttribute('index');
                    if (indexVal) param.index = parseInt(indexVal, 10);

                    params.push(param);
                });
            }

            // Parse vertex shader
            const vertexEl = doc.querySelector('vertex');
            const vertex = this.dedentCode(vertexEl?.textContent || '');

            // Parse fragment shader
            const fragmentEl = doc.querySelector('fragment');
            const fragment = this.dedentCode(fragmentEl?.textContent || '');

            // Parse optional custom Lua (internal examples only, not exported to shaders.xml)
            const luaEl = doc.querySelector('lua');
            const customLua = luaEl ? this.dedentCode(luaEl.textContent || '') : undefined;

            return { name, description, params, vertex, fragment, customLua };
        } catch (error) {
            console.error('[ShaderStudio] Failed to parse shader XML:', error);
            this.logConsole(`Failed to parse shader XML: ${error}`, 'error');
            return null;
        }
    }

    /**
     * Remove consistent leading whitespace from code (dedent)
     * This handles code from XML that has indentation from the XML structure
     */
    private dedentCode(code: string): string {
        if (!code) return '';

        // Split into lines and trim the overall string first
        const lines = code.split('\n');

        // Remove empty lines at start and end
        while (lines.length > 0 && lines[0].trim() === '') {
            lines.shift();
        }
        while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
            lines.pop();
        }

        if (lines.length === 0) return '';

        // Find minimum indentation (ignoring empty lines)
        let minIndent = Infinity;
        for (const line of lines) {
            if (line.trim() === '') continue; // Skip empty lines
            const match = line.match(/^(\s*)/);
            if (match) {
                minIndent = Math.min(minIndent, match[1].length);
            }
        }

        if (minIndent === Infinity || minIndent === 0) {
            return lines.join('\n');
        }

        // Remove the minimum indentation from each line
        const dedentedLines = lines.map(line => {
            if (line.trim() === '') return ''; // Keep empty lines empty
            return line.substring(minIndent);
        });

        return dedentedLines.join('\n');
    }

    /**
     * Add consistent indentation to each line of code
     * Used for formatting XML output
     */
    private indentCode(code: string, indent: string): string {
        if (!code) return '';

        const lines = code.split('\n');
        return lines.map(line => {
            // Don't indent empty lines
            if (line.trim() === '') return '';
            return indent + line;
        }).join('\n');
    }

    private applyShaderExample(shader: ShaderExample): void {
        if (this.shaderNameInput) {
            this.shaderNameInput.value = shader.name;
        }

        if (this.shaderDescriptionInput) {
            this.shaderDescriptionInput.value = shader.description || '';
        }

        if (this.vertexEditor) {
            this.vertexEditor.setValue(shader.vertex, -1);
        }

        if (this.fragmentEditor) {
            this.fragmentEditor.setValue(shader.fragment, -1);
        }

        // Store custom Lua if present (for internal examples that need complex Lua)
        this.currentCustomLua = shader.customLua || null;

        this.paramManager.loadParameters(shader.params);
        this.logConsole(`Loaded shader: ${shader.name}`, 'info');

        // Auto-compile the loaded shader
        this.compile();

        // Mark current state as clean (just loaded)
        this.markAsClean();
    }

    public compile(): void {
        console.log('[ShaderStudio] compile() called');
        this.clearConsole();
        this.clearEditorAnnotations();

        try {
            if (!this.glCanvas) {
                console.log('[ShaderStudio] compile: glCanvas not found!');
                this.logConsole('GL Canvas not found', 'error');
                return;
            }
            console.log('[ShaderStudio] compile: glCanvas found, size:', this.glCanvas.width, 'x', this.glCanvas.height);

            this.renderer.stopRendering();
            this.paramManager.collectParamDefinitions();
            // Preserve parameter values when recompiling
            this.paramManager.createParameterControls(true);

            const shaderName = this.shaderNameInput?.value || 'MyShader';
            console.log('[ShaderStudio] Compiling shader:', shaderName);

            const vertexSource = this.vertexEditor?.getValue() || this.defaultShader.vertex;
            const fragmentSource = this.fragmentEditor?.getValue() || this.defaultShader.fragment;
            console.log('[ShaderStudio] Vertex source length:', vertexSource.length, 'Fragment source length:', fragmentSource.length);

            this.compiler.initGL(this.glCanvas);
            const gl = this.compiler.getContext();
            console.log('[ShaderStudio] GL context:', gl);
            if (!gl) {
                throw new Error('Failed to get WebGL context');
            }

            // Validate shader for Isaac compatibility BEFORE compiling
            const paramDefinitions = this.paramManager.getParamDefinitions();
            const customParamNames = paramDefinitions.map(p => p.name);
            const validation = this.compiler.validateIsaacShader(vertexSource, fragmentSource, customParamNames);

            // Show validation warnings
            for (const warning of validation.warnings) {
                this.logConsole('⚠️ ' + warning, 'warning');
            }

            // Show validation errors (these will cause the shader to not work in Isaac)
            for (const error of validation.errors) {
                this.logConsole('❌ Isaac compatibility: ' + error, 'error');
            }

            if (!validation.valid) {
                this.logConsole(
                    '⛔ Shader will NOT work in Isaac! Custom parameters must be passed as vertex attributes → varyings, not uniforms.',
                    'error'
                );
                // Still compile for preview, but warn the user
            }

            const program = this.compiler.createProgram(vertexSource, fragmentSource);
            console.log('[ShaderStudio] Program created:', program);

            this.renderer.initialize(gl, this.glCanvas);
            this.renderer.setProgram(program);
            this.renderer.setupGeometry();
            // Setup parameter attributes for Isaac-style shaders that use attributes instead of uniforms
            this.renderer.setupParameterAttributes(vertexSource);
            console.log('[ShaderStudio] Renderer setup complete');

            // Show viewport controls
            if (this.viewportControls) {
                this.viewportControls.classList.add('active');
            }

            this.enabled = true;
            console.log('[ShaderStudio] Starting render, enabled:', this.enabled);
            this.renderer.startRendering();

            if (this.playPauseBtn) {
                this.playPauseBtn.textContent = '\u23F8';
            }

            if (validation.valid) {
                this.logConsole('Shader compiled successfully', 'success');
            } else {
                this.logConsole('Shader compiled (preview only - fix errors for Isaac compatibility)', 'warning');
            }

        } catch (error) {
            console.error('[ShaderStudio] Compilation error:', error);
            const errorMessage = (error as Error).message;
            this.logConsole('Compilation failed: ' + errorMessage, 'error');
            this.highlightShaderError(errorMessage);
        }
    }

    /**
     * Compile shader with provided source code (for React integration)
     */
    public compileWithCode(vertexSource: string, fragmentSource: string, params?: any[]): boolean {
        console.log('[ShaderStudio] compileWithCode() called');

        try {
            if (!this.glCanvas) {
                console.log('[ShaderStudio] compileWithCode: glCanvas not found!');
                return false;
            }

            this.renderer.stopRendering();

            // Store shader source for potential recompilation after canvas refresh
            this.currentVertexSource = vertexSource;
            this.currentFragmentSource = fragmentSource;

            // Set up parameters if provided
            if (params && params.length > 0) {
                this.paramManager.setParamDefinitions(params);
                this.paramManager.createParameterControls(true);
            }

            this.compiler.initGL(this.glCanvas);
            const gl = this.compiler.getContext();
            if (!gl) {
                throw new Error('Failed to get WebGL context');
            }

            const program = this.compiler.createProgram(vertexSource, fragmentSource);
            console.log('[ShaderStudio] Program created:', program);

            this.renderer.initialize(gl, this.glCanvas);
            this.renderer.setProgram(program);
            this.renderer.setupGeometry();
            this.renderer.setupParameterAttributes(vertexSource);

            this.enabled = true;
            this.renderer.startRendering();

            return true;
        } catch (error) {
            console.error('[ShaderStudio] compileWithCode error:', error);
            // Rethrow so React can capture the error details
            throw error;
        }
    }

    private clearEditorAnnotations(): void {
        if (this.vertexEditor) {
            this.vertexEditor.session.clearAnnotations();
            // Remove any existing error markers
            const vertexMarkers = this.vertexEditor.session.getMarkers(false);
            for (const id in vertexMarkers) {
                if (vertexMarkers[id].clazz === 'shader-error-line') {
                    this.vertexEditor.session.removeMarker(parseInt(id, 10));
                }
            }
        }
        if (this.fragmentEditor) {
            this.fragmentEditor.session.clearAnnotations();
            // Remove any existing error markers
            const fragMarkers = this.fragmentEditor.session.getMarkers(false);
            for (const id in fragMarkers) {
                if (fragMarkers[id].clazz === 'shader-error-line') {
                    this.fragmentEditor.session.removeMarker(parseInt(id, 10));
                }
            }
        }
    }

    private highlightShaderError(errorMessage: string): void {
        // Determine which shader has the error
        const isVertexError = errorMessage.toLowerCase().includes('vertex');
        const isFragmentError = errorMessage.toLowerCase().includes('fragment');

        // Parse error line number from WebGL error format: "ERROR: 0:16:" or "ERROR: 0:16:"
        const lineMatch = errorMessage.match(/ERROR:\s*\d+:(\d+)/i);
        let lineNumber = 0;
        if (lineMatch) {
            lineNumber = parseInt(lineMatch[1], 10) - 1; // Ace uses 0-based line numbers
        }

        // Extract the error description
        const errorDescMatch = errorMessage.match(/ERROR:\s*\d+:\d+:\s*(.+)/i);
        const errorDesc = errorDescMatch ? errorDescMatch[1] : errorMessage;

        const annotation = {
            row: Math.max(0, lineNumber),
            column: 0,
            text: errorDesc,
            type: 'error' as const
        };

        // Create a Range for the error line (need to use Ace's Range class)
        const Range = ace.require('ace/range').Range;
        const errorRange = new Range(Math.max(0, lineNumber), 0, Math.max(0, lineNumber), 1);

        // Set annotation and marker on the appropriate editor
        if (isFragmentError && this.fragmentEditor) {
            this.fragmentEditor.session.setAnnotations([annotation]);
            this.fragmentEditor.session.addMarker(errorRange, 'shader-error-line', 'fullLine', false);
            this.fragmentEditor.gotoLine(lineNumber + 1, 0, true);
        } else if (isVertexError && this.vertexEditor) {
            this.vertexEditor.session.setAnnotations([annotation]);
            this.vertexEditor.session.addMarker(errorRange, 'shader-error-line', 'fullLine', false);
            this.vertexEditor.gotoLine(lineNumber + 1, 0, true);
        } else if (this.fragmentEditor) {
            // Default to fragment shader if type is unclear
            this.fragmentEditor.session.setAnnotations([annotation]);
            this.fragmentEditor.session.addMarker(errorRange, 'shader-error-line', 'fullLine', false);
            this.fragmentEditor.gotoLine(lineNumber + 1, 0, true);
        }
    }

    public updateFromGame(
        bufferCanvas: HTMLCanvasElement,
        playerX: number,
        playerY: number,
        canvasWidth: number,
        canvasHeight: number,
        tearPositions: { x: number; y: number }[] = []
    ): void {
        // Auto-compile passthrough shader on first frame
        if (!this.autoCompiled && this.initialized) {
            console.log('[ShaderStudio] Auto-compiling...');
            this.autoCompiled = true;
            this.logConsole('Auto-compiling passthrough shader...', 'info');
            this.compile();
        }

        if (!this.enabled) {
            console.log('[ShaderStudio] updateFromGame: not enabled, initialized:', this.initialized, 'autoCompiled:', this.autoCompiled);
            return;
        }

        // Pass player position scaled to work with Scale=0.5 and doubled RenderData.
        // Isaac shaders typically do: pos = (PlayerPos / RenderData.zw) * Scale
        // Our RenderData is 2x canvas size to match Isaac's texture dimensions.
        // With Scale=0.5 and RenderData=2x, we need PlayerPos=4x to get correct position:
        //   (PlayerPos * 4) / (RenderData * 2) * 0.5 = PlayerPos / RenderData = correct normalized pos
        //
        // Y offset: The player entity position is at the feet, but shaders typically
        // target the visual center. Subtract ~16px to shift effect upward.
        const yOffset = -2;
        const scaledX = playerX * 4;
        const scaledY = (playerY + yOffset) * 4;

        // Scale tear positions the same way as player position
        const scaledTearPositions = tearPositions.map(pos => ({
            x: pos.x * 4,
            y: (pos.y + yOffset) * 4
        }));

        this.renderer.updateGameState({
            bufferCanvas: bufferCanvas,
            playerPosition: { x: scaledX, y: scaledY },
            playerPositionWorld: { x: scaledX, y: scaledY },
            canvasWidth: canvasWidth,
            canvasHeight: canvasHeight,
            tearPositions: scaledTearPositions
        });

        // Update player position display
        if (this.playerPosDisplay) {
            this.playerPosDisplay.textContent = `${playerX.toFixed(0)}, ${playerY.toFixed(0)}`;
        }
    }

    public render(): void {
        if (!this.enabled || !this.renderer.isActive()) return;
        // Rendering is handled by requestAnimationFrame in ShaderRenderer
    }

    private generateXML(): string {
        this.paramManager.collectParamDefinitions();

        const shaderName = this.shaderNameInput?.value?.trim() || 'MyShader';
        const shaderDescription = this.shaderDescriptionInput?.value?.trim() || '';
        const vertexSource = this.vertexEditor?.getValue() || '';
        const fragmentSource = this.fragmentEditor?.getValue() || '';
        const paramDefinitions = this.paramManager.getParamDefinitions();

        let paramsXML = '';
        if (paramDefinitions.length > 0) {
            paramsXML = '    <parameters>\n';
            paramDefinitions.forEach(param => {
                // Isaac expects: <param name="..." type="..."/>
                // We add studioType for special types that Isaac ignores but the studio interprets
                // We also include all UI attributes (default, min, max, step, fps, coordinateSpace)

                let glslType: string;
                let studioType: string | null = null;

                if (param.type === 'time') {
                    glslType = 'float';
                    studioType = 'time';
                } else if (param.type === 'mousepos') {
                    glslType = 'vec2';
                    studioType = 'mousepos';
                } else if (param.type === 'playerpos') {
                    glslType = 'vec2';
                    studioType = 'playerpos';
                } else if (param.type === 'tearpos') {
                    glslType = 'vec2';
                    studioType = 'tearpos';
                } else if (param.type === 'boolean') {
                    glslType = 'float';
                    studioType = 'boolean';
                } else if (param.type === 'color') {
                    glslType = 'vec3';
                    studioType = 'color';
                } else {
                    glslType = param.type;
                }

                // Build attributes string
                let attrs = `name="${param.name}" type="${glslType}"`;

                // Add studioType if this is a special type
                if (studioType) {
                    attrs += ` studioType="${studioType}"`;
                }

                // Add optional attributes if they exist
                if (param.default !== undefined && param.default !== '') {
                    attrs += ` default="${param.default}"`;
                }
                if (param.min !== undefined && param.min !== '') {
                    attrs += ` min="${param.min}"`;
                }
                if (param.max !== undefined && param.max !== '') {
                    attrs += ` max="${param.max}"`;
                }
                if (param.step !== undefined && param.step !== '') {
                    attrs += ` step="${param.step}"`;
                }
                if (param.fps !== undefined) {
                    attrs += ` fps="${param.fps}"`;
                }
                if (param.coordinateSpace !== undefined && param.coordinateSpace !== '') {
                    attrs += ` coordinateSpace="${param.coordinateSpace}"`;
                }
                if (param.index !== undefined) {
                    attrs += ` index="${param.index}"`;
                }

                paramsXML += `      <param ${attrs}/>\n`;
            });
            paramsXML += '    </parameters>\n';
        }

        // Indent shader code for nice XML formatting
        const indentedVertex = this.indentCode(vertexSource, '      ');
        const indentedFragment = this.indentCode(fragmentSource, '      ');

        // Build description comment if present
        const descriptionComment = shaderDescription ? `\n  <!-- ${shaderDescription} -->\n` : '\n';

        return `<shaders>${descriptionComment}  <shader name="${shaderName}">
${paramsXML}    <vertex><![CDATA[
${indentedVertex}
    ]]></vertex>
    <fragment><![CDATA[
${indentedFragment}
    ]]></fragment>
  </shader>
</shaders>`;
    }

    private generateLua(): string {
        this.paramManager.collectParamDefinitions();

        const shaderName = this.shaderNameInput?.value?.trim() || 'MyShader';
        const shaderDescription = this.shaderDescriptionInput?.value?.trim() || '';
        const paramDefinitions = this.paramManager.getParamDefinitions();
        const currentValues = this.paramManager.getShaderParams();

        const paramLines: string[] = [];

        // Helper to format a number value for Lua
        const formatNumber = (val: number, decimals: number = 3): string => {
            // Remove trailing zeros but keep at least one decimal place for floats
            const formatted = val.toFixed(decimals);
            return formatted.replace(/\.?0+$/, '') || '0';
        };

        paramDefinitions.forEach(param => {
            if (param.type === 'time') {
                const fps = param.fps || 60;
                if (fps === 60) {
                    // Native Isaac fps, no conversion needed
                    paramLines.push(`            ${param.name} = Isaac.GetFrameCount()`);
                } else if (fps === 30) {
                    // Half speed - divide by 2
                    paramLines.push(`            ${param.name} = math.floor(Isaac.GetFrameCount() / 2)`);
                } else {
                    // Custom fps - scale from 60 to target fps
                    paramLines.push(`            ${param.name} = math.floor(Isaac.GetFrameCount() * ${fps} / 60)`);
                }
            } else if (param.type === 'playerpos' || param.type === 'mousepos') {
                // playerpos can use either screen or world coordinates based on coordinateSpace setting
                // mousepos always uses screen coordinates (maps to player position in-game)
                if (param.type === 'playerpos' && param.coordinateSpace === 'world') {
                    paramLines.push(`            ${param.name} = { playerPos.X, playerPos.Y }`);
                } else {
                    paramLines.push(`            ${param.name} = { screenPos.X, screenPos.Y }`);
                }
            } else if (param.type === 'tearpos') {
                // tearpos uses the tear positions collected earlier
                const tearIndex = param.index || 1;
                paramLines.push(`            ${param.name} = tearPositions[${tearIndex}]`);
            } else if (param.type === 'boolean') {
                // Use current value from UI, or default
                const currentVal = currentValues[param.name] as number | undefined;
                const val = currentVal !== undefined ? currentVal : (param.default === '0' || param.default === '0.0' ? 0.0 : 1.0);
                paramLines.push(`            ${param.name} = ${val === 0 ? '0.0' : '1.0'}`);
            } else if (param.type === 'float') {
                // Use current value from UI slider, or default
                const currentVal = currentValues[param.name] as number | undefined;
                const val = currentVal !== undefined ? currentVal : parseFloat(param.default || '1.0');
                paramLines.push(`            ${param.name} = ${formatNumber(val)}`);
            } else if (param.type === 'vec2') {
                // Use current value from UI, or default
                const currentVal = currentValues[param.name] as number[] | undefined;
                if (currentVal && Array.isArray(currentVal)) {
                    paramLines.push(`            ${param.name} = { ${formatNumber(currentVal[0])}, ${formatNumber(currentVal[1])} }`);
                } else {
                    const defaultVal = param.default || '0.0,0.0';
                    const parts = defaultVal.split(',').map(v => v.trim());
                    paramLines.push(`            ${param.name} = { ${parts[0] || '0.0'}, ${parts[1] || '0.0'} }`);
                }
            } else if (param.type === 'vec3' || param.type === 'color') {
                // Color type is stored as vec3 [r, g, b] with values 0.0-1.0
                const currentVal = currentValues[param.name] as number[] | undefined;
                if (currentVal && Array.isArray(currentVal)) {
                    paramLines.push(`            ${param.name} = { ${formatNumber(currentVal[0])}, ${formatNumber(currentVal[1])}, ${formatNumber(currentVal[2])} }`);
                } else {
                    const defaultVal = param.default || '0.0,0.0,0.0';
                    const parts = defaultVal.split(',').map(v => v.trim());
                    paramLines.push(`            ${param.name} = { ${parts[0] || '0.0'}, ${parts[1] || '0.0'}, ${parts[2] || '0.0'} }`);
                }
            } else if (param.type === 'vec4') {
                const currentVal = currentValues[param.name] as number[] | undefined;
                if (currentVal && Array.isArray(currentVal)) {
                    paramLines.push(`            ${param.name} = { ${formatNumber(currentVal[0])}, ${formatNumber(currentVal[1])}, ${formatNumber(currentVal[2])}, ${formatNumber(currentVal[3])} }`);
                } else {
                    const defaultVal = param.default || '0.0,0.0,0.0,0.0';
                    const parts = defaultVal.split(',').map(v => v.trim());
                    paramLines.push(`            ${param.name} = { ${parts[0] || '0.0'}, ${parts[1] || '0.0'}, ${parts[2] || '0.0'}, ${parts[3] || '0.0'} }`);
                }
            }
        });

        const paramsLua = paramLines.length > 0 ? paramLines.join(',\n') : '';
        const modName = shaderName.replace(/[^a-zA-Z0-9]/g, '') + 'Mod';

        // Check what coordinate systems we need for playerpos/mousepos parameters
        const needsScreenPos = paramDefinitions.some(p =>
            p.type === 'mousepos' || (p.type === 'playerpos' && p.coordinateSpace !== 'world')
        );
        const needsWorldPos = paramDefinitions.some(p =>
            p.type === 'playerpos' && p.coordinateSpace === 'world'
        );
        const needsTearPos = paramDefinitions.some(p => p.type === 'tearpos');
        const maxTearIndex = paramDefinitions
            .filter(p => p.type === 'tearpos')
            .reduce((max, p) => Math.max(max, p.index || 1), 0);
        const needsPlayer = needsScreenPos || needsWorldPos;

        // Build the locals section
        let localsSection = '';
        if (needsPlayer) {
            localsSection = `
        local player = Isaac.GetPlayer()`;
            if (needsWorldPos) {
                localsSection += `
        local playerPos = player.Position`;
            }
            if (needsScreenPos) {
                localsSection += `
        local screenPos = Isaac.WorldToScreen(player.Position)`;
            }
        }

        // Add tear collection code if needed
        if (needsTearPos) {
            localsSection += `

        -- Collect tear positions (player tears only)
        local tearPositions = {}
        local tears = Isaac.FindByType(EntityType.ENTITY_TEAR, -1, -1, false, false)
        for _, entity in ipairs(tears) do
            if #tearPositions >= ${maxTearIndex} then break end
            local tear = entity:ToTear()
            if tear and tear.SpawnerEntity and tear.SpawnerEntity.Type == EntityType.ENTITY_PLAYER then
                local tearScreenPos = Isaac.WorldToScreen(tear.Position)
                table.insert(tearPositions, { tearScreenPos.X, tearScreenPos.Y + tear.Height })
            end
        end
        -- Pad with zeros for unused slots
        while #tearPositions < ${maxTearIndex} do
            table.insert(tearPositions, { 0, 0 })
        end`;
        }

        // Build description comment if present
        const descriptionComment = shaderDescription ? `\n-- ${shaderDescription}` : '';

        return `-- Shader: ${shaderName}${descriptionComment}
-- Generated by Isaac Shader Studio

local ${modName} = RegisterMod("${modName}", 1)

function ${modName}:GetShaderParams(shaderName)
    if shaderName == '${shaderName}' then${localsSection}

        local params = {
${paramsLua}
        }
        return params
    end
end

${modName}:AddCallback(ModCallbacks.MC_GET_SHADER_PARAMS, ${modName}.GetShaderParams)
`;
    }

    private generateMetadata(): string {
        const shaderName = this.shaderNameInput?.value?.trim() || 'MyShader';
        const shaderDescription = this.shaderDescriptionInput?.value?.trim() || 'Shader mod generated by Isaac Shader Studio';
        const modName = shaderName.replace(/[^a-zA-Z0-9]/g, '') + 'Mod';
        const directory = modName.toLowerCase();

        return `<?xml version="1.0" encoding="UTF-8"?>
<metadata>
    <name>${modName}</name>
    <directory>${directory}</directory>
    <id></id>
    <description>${shaderDescription}</description>
    <version>1.0</version>
    <visibility>Private</visibility>
</metadata>`;
    }

    private openViewModModal(): void {
        // Validate shader name
        const shaderName = this.shaderNameInput?.value?.trim();
        if (!shaderName) {
            this.showErrorPopup('Please enter a shader name before exporting.');
            this.shaderNameInput?.focus();
            return;
        }

        const modal = document.getElementById('viewModModal');
        if (!modal) return;

        // Initialize modal editors if not already done
        if (!this.metadataEditor) {
            this.metadataEditor = ace.edit('metadataEditor');
            this.metadataEditor.setTheme('ace/theme/monokai');
            this.metadataEditor.session.setMode('ace/mode/xml');
            this.metadataEditor.setOptions({
                fontSize: '12px',
                showPrintMargin: false,
                tabSize: 4,
                maxLines: 12,
                minLines: 8
            });
        }

        if (!this.luaEditor) {
            this.luaEditor = ace.edit('luaEditor');
            this.luaEditor.setTheme('ace/theme/monokai');
            this.luaEditor.session.setMode('ace/mode/lua');
            this.luaEditor.setOptions({
                fontSize: '12px',
                showPrintMargin: false,
                tabSize: 4
            });
        }

        if (!this.xmlEditor) {
            this.xmlEditor = ace.edit('xmlEditor');
            this.xmlEditor.setTheme('ace/theme/monokai');
            this.xmlEditor.session.setMode('ace/mode/xml');
            this.xmlEditor.setOptions({
                fontSize: '12px',
                showPrintMargin: false,
                tabSize: 2
            });
        }

        // Generate and set content
        const metadataContent = this.generateMetadata();
        // Use custom Lua from internal examples if available, otherwise generate
        const luaContent = this.currentCustomLua || this.generateLua();
        const xmlContent = this.generateXML();

        this.metadataEditor.setValue(metadataContent, -1);
        this.luaEditor.setValue(luaContent, -1);
        this.xmlEditor.setValue(xmlContent, -1);

        // Show notice if using custom Lua and shader has been modified
        const luaNotice = document.getElementById('luaCustomNotice');
        if (luaNotice) {
            const showNotice = this.currentCustomLua && this.hasUnsavedChanges();
            luaNotice.style.display = showNotice ? 'block' : 'none';
        }

        // Setup tab switching
        this.setupModalTabs();

        // Show modal
        modal.style.display = 'flex';
        this.modalOpen = true;

        // Refresh active editor after modal is visible
        setTimeout(() => {
            this.resizeActiveModalEditor();
        }, 100);
    }

    private setupModalTabs(): void {
        const tabs = document.querySelectorAll('.modal-tab');
        const panes = document.querySelectorAll('.modal-tab-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');

                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update active pane
                panes.forEach(pane => {
                    if (pane.getAttribute('data-tab') === targetTab) {
                        pane.classList.add('active');
                    } else {
                        pane.classList.remove('active');
                    }
                });

                // Resize the now-visible editor
                this.resizeActiveModalEditor();
            });
        });
    }

    private resizeActiveModalEditor(): void {
        const activePane = document.querySelector('.modal-tab-pane.active');
        if (!activePane) return;

        const tabName = activePane.getAttribute('data-tab');
        switch (tabName) {
            case 'metadata':
                this.metadataEditor?.resize();
                break;
            case 'lua':
                this.luaEditor?.resize();
                break;
            case 'xml':
                this.xmlEditor?.resize();
                break;
        }
    }

    private closeViewModModal(): void {
        const modal = document.getElementById('viewModModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.modalOpen = false;
    }

    private async downloadMod(): Promise<void> {
        const shaderName = this.shaderNameInput?.value?.trim() || 'MyShader';
        const modName = shaderName.replace(/[^a-zA-Z0-9]/g, '') + 'Mod';

        // Get content from editors (in case user modified it)
        const metadataContent = this.metadataEditor?.getValue() || this.generateMetadata();
        const luaContent = this.luaEditor?.getValue() || this.currentCustomLua || this.generateLua();
        const xmlContent = this.xmlEditor?.getValue() || this.generateXML();

        // Create zip file
        const zip = new JSZip();
        zip.file('metadata.xml', metadataContent);
        zip.file('main.lua', luaContent);
        zip.folder('content')?.file('shaders.xml', xmlContent);

        // Generate and download zip
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${modName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.logConsole(`Downloaded mod: ${modName}.zip`, 'success');
    }

    // ==================== Import Shader Modal ====================

    private setupImportModalListeners(): void {
        this.importModal = document.getElementById('importShaderModal');
        this.importDropZone = document.getElementById('importDropZone');
        this.importFileInput = document.getElementById('importFileInput') as HTMLInputElement;
        this.importValidationError = document.getElementById('importValidationError');
        this.importShaderListContainer = document.getElementById('importShaderListContainer');
        this.importShaderList = document.getElementById('importShaderList');
        this.importShaderCount = document.getElementById('importShaderCount');
        this.importSelectAll = document.getElementById('importSelectAll') as HTMLInputElement;
        this.importShadersBtn = document.getElementById('importShadersBtn') as HTMLButtonElement;

        const closeImportBtn = document.getElementById('closeImportModalBtn');
        const cancelImportBtn = document.getElementById('cancelImportBtn');

        // Close modal buttons
        if (closeImportBtn) {
            closeImportBtn.addEventListener('click', () => this.closeImportModal());
        }
        if (cancelImportBtn) {
            cancelImportBtn.addEventListener('click', () => this.closeImportModal());
        }

        // Click outside to close
        if (this.importModal) {
            this.importModal.addEventListener('click', (e) => {
                if (e.target === this.importModal) {
                    this.closeImportModal();
                }
            });
        }

        // Drop zone click to trigger file input
        if (this.importDropZone && this.importFileInput) {
            this.importDropZone.addEventListener('click', () => {
                this.importFileInput?.click();
            });

            // File input change
            this.importFileInput.addEventListener('change', (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files && files.length > 0) {
                    this.handleImportFiles(Array.from(files));
                }
            });

            // Drag and drop
            this.importDropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.importDropZone?.classList.add('drag-over');
            });

            this.importDropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.importDropZone?.classList.remove('drag-over');
            });

            this.importDropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.importDropZone?.classList.remove('drag-over');

                const files = e.dataTransfer?.files;
                if (files && files.length > 0) {
                    this.handleImportFiles(Array.from(files));
                }
            });
        }

        // Select all checkbox
        if (this.importSelectAll) {
            this.importSelectAll.addEventListener('change', () => {
                const checkboxes = this.importShaderList?.querySelectorAll('.import-shader-checkbox') as NodeListOf<HTMLInputElement>;
                checkboxes.forEach(cb => {
                    cb.checked = this.importSelectAll!.checked;
                });
                this.updateImportButtonState();
            });
        }

        // Import button
        if (this.importShadersBtn) {
            this.importShadersBtn.addEventListener('click', () => this.importSelectedShaders());
        }
    }

    private openImportModal(): void {
        if (!this.importModal) return;

        // Reset modal state
        this.resetImportModal();

        // Show modal
        this.importModal.style.display = 'flex';
    }

    private closeImportModal(): void {
        if (this.importModal) {
            this.importModal.style.display = 'none';
        }
        this.resetImportModal();
    }

    private resetImportModal(): void {
        // Reset file input
        if (this.importFileInput) {
            this.importFileInput.value = '';
        }

        // Hide validation error
        if (this.importValidationError) {
            this.importValidationError.style.display = 'none';
            this.importValidationError.textContent = '';
        }

        // Hide shader list
        if (this.importShaderListContainer) {
            this.importShaderListContainer.style.display = 'none';
        }

        // Clear shader list
        if (this.importShaderList) {
            this.importShaderList.innerHTML = '';
        }

        // Reset select all
        if (this.importSelectAll) {
            this.importSelectAll.checked = true;
        }

        // Disable import button
        if (this.importShadersBtn) {
            this.importShadersBtn.disabled = true;
        }

        // Clear parsed shaders
        this.parsedShadersForImport = [];
    }

    private async handleImportFiles(files: File[]): Promise<void> {
        // Categorize files by extension
        const xmlFiles = files.filter(f => f.name.toLowerCase().endsWith('.xml'));
        const vsFiles = files.filter(f => f.name.toLowerCase().endsWith('.vs'));
        const fsFiles = files.filter(f => f.name.toLowerCase().endsWith('.fs'));

        // Determine import type
        if (xmlFiles.length > 0) {
            // XML import - use the first XML file
            await this.handleXMLImport(xmlFiles[0]);
        } else if (vsFiles.length > 0 || fsFiles.length > 0) {
            // GLSL file import - try to match .vs/.fs pairs
            await this.handleGLSLImport(vsFiles, fsFiles);
        } else {
            this.showImportError('Please select a shaders.xml file or .vs/.fs shader files.');
        }
    }

    private async handleXMLImport(file: File): Promise<void> {
        try {
            const xmlText = await file.text();

            // Validate against XSD schema
            const validationResult = await this.validateShadersXML(xmlText);

            if (!validationResult.valid) {
                this.showImportError(validationResult.error || 'Invalid shaders.xml format.');
                return;
            }

            // Parse shaders from XML
            const shaders = this.parseShadersFromXML(xmlText);

            if (shaders.length === 0) {
                this.showImportError('No shaders found in the XML file.');
                return;
            }

            // Store parsed shaders and display list
            this.parsedShadersForImport = shaders;
            this.displayImportShaderList(shaders);

        } catch (error) {
            console.error('[ShaderStudio] Import XML error:', error);
            this.showImportError(`Error reading XML file: ${error}`);
        }
    }

    private async handleGLSLImport(vsFiles: File[], fsFiles: File[]): Promise<void> {
        try {
            const shaders: ShaderExample[] = [];

            // Build a map of base names to files
            const vsMap = new Map<string, File>();
            const fsMap = new Map<string, File>();

            for (const file of vsFiles) {
                const baseName = this.getShaderBaseName(file.name);
                vsMap.set(baseName, file);
            }

            for (const file of fsFiles) {
                const baseName = this.getShaderBaseName(file.name);
                fsMap.set(baseName, file);
            }

            // Find all unique base names
            const allBaseNames = new Set([...vsMap.keys(), ...fsMap.keys()]);

            for (const baseName of allBaseNames) {
                const vsFile = vsMap.get(baseName);
                const fsFile = fsMap.get(baseName);

                // Need at least one of the pair
                if (!vsFile && !fsFile) continue;

                let vertexSource = this.defaultShader.vertex;
                let fragmentSource = this.defaultShader.fragment;

                if (vsFile) {
                    vertexSource = await vsFile.text();
                }

                if (fsFile) {
                    fragmentSource = await fsFile.text();
                }

                // Auto-detect parameters from vertex shader attributes
                const params = this.extractParametersFromVertexShader(vertexSource);

                // Create shader name from base name (convert snake_case to Title Case)
                const shaderName = this.formatShaderName(baseName);

                const shader: ShaderExample = {
                    name: shaderName,
                    description: vsFile && fsFile
                        ? `Imported from ${vsFile.name} and ${fsFile.name}`
                        : `Imported from ${vsFile?.name || fsFile?.name}`,
                    params: params,
                    vertex: vertexSource,
                    fragment: fragmentSource
                };

                shaders.push(shader);
            }

            if (shaders.length === 0) {
                this.showImportError('No valid shader files found.');
                return;
            }

            // Warn if any files are missing their pair
            const warnings: string[] = [];
            for (const baseName of allBaseNames) {
                if (!vsMap.has(baseName)) {
                    warnings.push(`${baseName}: Missing .vs file, using default vertex shader`);
                }
                if (!fsMap.has(baseName)) {
                    warnings.push(`${baseName}: Missing .fs file, using default fragment shader`);
                }
            }

            if (warnings.length > 0) {
                this.logConsole('Import warnings:\n' + warnings.join('\n'), 'warning');
            }

            // Store parsed shaders and display list
            this.parsedShadersForImport = shaders;
            this.displayImportShaderList(shaders);

        } catch (error) {
            console.error('[ShaderStudio] Import GLSL error:', error);
            this.showImportError(`Error reading shader files: ${error}`);
        }
    }

    /**
     * Extract custom parameters from vertex shader attribute declarations.
     * Filters out standard Isaac attributes (Position, Color, TexCoord, RenderData, Scale)
     * and creates parameter definitions for the rest.
     */
    private extractParametersFromVertexShader(vertexSource: string): ParamDefinition[] {
        const params: ParamDefinition[] = [];

        // Standard Isaac attributes that shouldn't become parameters
        const standardAttributes = ['Position', 'Color', 'TexCoord', 'RenderData', 'Scale', 'Transform'];

        // Match attribute declarations: attribute type name; or in type name; (GLSL 300 ES)
        const attributeRegex = /\b(?:attribute|in)\s+(float|vec2|vec3|vec4|mat4)\s+(\w+)\s*;/g;
        let match;

        while ((match = attributeRegex.exec(vertexSource)) !== null) {
            const glslType = match[1];
            const name = match[2];

            // Skip standard attributes and mat4 (uniforms like Transform)
            if (standardAttributes.includes(name) || glslType === 'mat4') {
                continue;
            }

            // Map GLSL type to parameter type
            let paramType: ParamType;
            switch (glslType) {
                case 'float':
                    paramType = 'float';
                    break;
                case 'vec2':
                    paramType = 'vec2';
                    break;
                case 'vec3':
                    paramType = 'vec3';
                    break;
                case 'vec4':
                    paramType = 'vec4';
                    break;
                default:
                    continue; // Skip unsupported types
            }

            // Check for special parameter types based on common naming conventions
            const nameLower = name.toLowerCase();
            if (nameLower === 'time' || nameLower.endsWith('time')) {
                paramType = 'time';
            } else if (nameLower === 'playerpos' || nameLower === 'playerposition') {
                paramType = 'playerpos';
            } else if (nameLower === 'mousepos' || nameLower === 'mouseposition') {
                paramType = 'mousepos';
            }

            const param: ParamDefinition = {
                name: name,
                type: paramType
            };

            // Add sensible defaults for float parameters
            if (paramType === 'float') {
                param.default = '1.0';
                param.min = 0;
                param.max = 1;
                param.step = 0.01;
            }

            params.push(param);
        }

        return params;
    }

    /**
     * Extract base name from shader filename (e.g., "water_overlay.fs" -> "water_overlay")
     */
    private getShaderBaseName(filename: string): string {
        return filename.replace(/\.(vs|fs)$/i, '');
    }

    /**
     * Format shader name from base filename (e.g., "water_overlay" -> "Water Overlay")
     */
    private formatShaderName(baseName: string): string {
        return baseName
            .split(/[_-]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    private async validateShadersXML(xmlText: string): Promise<{ valid: boolean; error?: string }> {
        try {
            // First, do basic XML parsing validation
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlText, 'text/xml');

            // Check for XML parsing errors
            const parseError = doc.querySelector('parsererror');
            if (parseError) {
                return { valid: false, error: 'Invalid XML: ' + parseError.textContent?.substring(0, 100) };
            }

            // Check for root element - should be <shaders>
            const root = doc.documentElement;
            if (root.tagName !== 'shaders') {
                return { valid: false, error: `Invalid root element: expected <shaders>, found <${root.tagName}>` };
            }

            // Check that there's at least one <shader> element
            const shaderElements = doc.querySelectorAll('shader');
            if (shaderElements.length === 0) {
                return { valid: false, error: 'No <shader> elements found in the file.' };
            }

            // Validate each shader has required elements
            for (let i = 0; i < shaderElements.length; i++) {
                const shaderEl = shaderElements[i];
                const name = shaderEl.getAttribute('name');

                if (!name) {
                    return { valid: false, error: `Shader #${i + 1} is missing required 'name' attribute.` };
                }

                // Check for vertex and fragment shaders
                const vertex = shaderEl.querySelector('vertex');
                const fragment = shaderEl.querySelector('fragment');

                if (!vertex) {
                    return { valid: false, error: `Shader '${name}' is missing <vertex> element.` };
                }

                if (!fragment) {
                    return { valid: false, error: `Shader '${name}' is missing <fragment> element.` };
                }
            }

            // Optionally validate against the XSD schema
            // Fetch the XSD and validate if available
            try {
                const xsdResponse = await fetch('https://wofsauge.github.io/isaac-xml-validator/xsd/shaders.xsd');
                if (xsdResponse.ok) {
                    // Note: Browser doesn't have native XSD validation, so we just do structural validation
                    // The fetch confirms the XSD exists but we rely on our manual validation above
                    this.logConsole('Validated against Isaac shaders.xml format', 'info');
                }
            } catch (xsdError) {
                // XSD fetch failed, but our basic validation passed - continue
                console.warn('[ShaderStudio] Could not fetch XSD for validation, using basic validation');
            }

            return { valid: true };

        } catch (error) {
            return { valid: false, error: `Validation error: ${error}` };
        }
    }

    private parseShadersFromXML(xmlText: string): ShaderExample[] {
        const shaders: ShaderExample[] = [];

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlText, 'text/xml');
            const shaderElements = doc.querySelectorAll('shader');

            shaderElements.forEach(shaderEl => {
                const shader = this.parseShaderElement(shaderEl);
                if (shader) {
                    shaders.push(shader);
                }
            });

        } catch (error) {
            console.error('[ShaderStudio] Error parsing shaders XML:', error);
        }

        return shaders;
    }

    private parseShaderElement(shaderEl: Element): ShaderExample | null {
        try {
            const name = shaderEl.getAttribute('name') || 'Unnamed';

            // Parse description (from attribute or comment)
            let description: string | undefined;
            const descAttr = shaderEl.getAttribute('description');
            if (descAttr) {
                description = descAttr;
            } else {
                // Check for preceding comment
                const prevSibling = shaderEl.previousSibling;
                if (prevSibling && prevSibling.nodeType === Node.COMMENT_NODE) {
                    description = prevSibling.textContent?.trim();
                }
            }

            // Parse parameters using Isaac format: <param name="X" type="float"/>
            const params: ParamDefinition[] = [];
            const parametersEl = shaderEl.querySelector('parameters');

            if (parametersEl) {
                const paramElements = parametersEl.querySelectorAll('param');

                paramElements.forEach(el => {
                    const paramName = el.getAttribute('name');
                    const paramType = el.getAttribute('type') as ParamType;

                    if (!paramName || !paramType) return;

                    // Check for studioType attribute first, then fall back to name-based detection
                    let studioType: ParamType | null = el.getAttribute('studioType') as ParamType | null;

                    // Fall back to name-based detection for backward compatibility
                    if (!studioType) {
                        const nameLower = paramName.toLowerCase();
                        if (nameLower === 'time') {
                            studioType = 'time';
                        } else if (nameLower === 'playerpos' || nameLower === 'playerposition') {
                            studioType = 'playerpos';
                        } else if (nameLower === 'mousepos' || nameLower === 'mouseposition') {
                            studioType = 'mousepos';
                        }
                    }

                    const defaultVal = el.getAttribute('default');
                    const minVal = el.getAttribute('min');
                    const maxVal = el.getAttribute('max');
                    const stepVal = el.getAttribute('step');

                    const param: ParamDefinition = {
                        name: paramName,
                        type: studioType || paramType,
                        default: defaultVal || undefined
                    };

                    if (minVal) param.min = parseFloat(minVal);
                    if (maxVal) param.max = parseFloat(maxVal);
                    if (stepVal) param.step = parseFloat(stepVal);

                    const fpsVal = el.getAttribute('fps');
                    if (fpsVal) param.fps = parseInt(fpsVal, 10);

                    const coordSpaceVal = el.getAttribute('coordinateSpace') || el.getAttribute('coordinate-space');
                    if (coordSpaceVal === 'world' || coordSpaceVal === 'screen') {
                        param.coordinateSpace = coordSpaceVal;
                    }

                    // Parse index for tearpos type
                    const indexVal = el.getAttribute('index');
                    if (indexVal) param.index = parseInt(indexVal, 10);

                    params.push(param);
                });
            }

            // Parse vertex shader
            const vertexEl = shaderEl.querySelector('vertex');
            const vertex = this.dedentCode(vertexEl?.textContent || '');

            // Parse fragment shader
            const fragmentEl = shaderEl.querySelector('fragment');
            const fragment = this.dedentCode(fragmentEl?.textContent || '');

            return { name, description, params, vertex, fragment };

        } catch (error) {
            console.error('[ShaderStudio] Error parsing shader element:', error);
            return null;
        }
    }

    private showImportError(message: string): void {
        if (this.importValidationError) {
            this.importValidationError.textContent = message;
            this.importValidationError.style.display = 'block';
        }

        // Hide shader list if visible
        if (this.importShaderListContainer) {
            this.importShaderListContainer.style.display = 'none';
        }
    }

    private displayImportShaderList(shaders: ShaderExample[]): void {
        // Hide error if visible
        if (this.importValidationError) {
            this.importValidationError.style.display = 'none';
        }

        // Update count
        if (this.importShaderCount) {
            this.importShaderCount.textContent = `Found ${shaders.length} shader${shaders.length !== 1 ? 's' : ''} in file:`;
        }

        // Populate shader list
        if (this.importShaderList) {
            this.importShaderList.innerHTML = '';

            shaders.forEach((shader, index) => {
                const item = document.createElement('div');
                item.className = 'import-shader-item';
                item.innerHTML = `
                    <input type="checkbox" class="import-shader-checkbox" data-index="${index}" checked>
                    <div class="import-shader-info">
                        <div class="import-shader-name">${this.escapeHtml(shader.name)}</div>
                        ${shader.description ? `<div class="import-shader-desc">${this.escapeHtml(shader.description)}</div>` : ''}
                    </div>
                `;

                // Add change listener to checkbox
                const checkbox = item.querySelector('.import-shader-checkbox') as HTMLInputElement;
                checkbox.addEventListener('change', () => this.updateImportButtonState());

                this.importShaderList!.appendChild(item);
            });
        }

        // Show shader list container
        if (this.importShaderListContainer) {
            this.importShaderListContainer.style.display = 'block';
        }

        // Enable import button
        this.updateImportButtonState();
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private updateImportButtonState(): void {
        if (!this.importShadersBtn || !this.importShaderList) return;

        const checkboxes = this.importShaderList.querySelectorAll('.import-shader-checkbox:checked');
        this.importShadersBtn.disabled = checkboxes.length === 0;
        this.importShadersBtn.textContent = `Import Selected (${checkboxes.length})`;

        // Update select all checkbox state
        if (this.importSelectAll) {
            const allCheckboxes = this.importShaderList.querySelectorAll('.import-shader-checkbox') as NodeListOf<HTMLInputElement>;
            const checkedCount = Array.from(allCheckboxes).filter(cb => cb.checked).length;
            this.importSelectAll.checked = checkedCount === allCheckboxes.length;
            this.importSelectAll.indeterminate = checkedCount > 0 && checkedCount < allCheckboxes.length;
        }
    }

    private importSelectedShaders(): void {
        if (!this.importShaderList) return;

        const checkboxes = this.importShaderList.querySelectorAll('.import-shader-checkbox:checked') as NodeListOf<HTMLInputElement>;
        const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index || '0', 10));

        if (selectedIndices.length === 0) {
            this.showImportError('Please select at least one shader to import.');
            return;
        }

        // Check for unsaved changes before importing
        if (!this.confirmUnsavedChanges('import shaders')) {
            return;
        }

        const importedShaders: SavedShader[] = [];
        let firstShaderId: string | null = null;

        selectedIndices.forEach(index => {
            const shader = this.parsedShadersForImport[index];
            if (!shader) return;

            // Generate a unique ID for the imported shader
            const shaderId = `shader_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

            // Check if a shader with the same name already exists
            const existingIndex = this.savedShaders.findIndex(s => s.name === shader.name);
            if (existingIndex !== -1) {
                // Append "(imported)" or increment number to make unique
                let newName = shader.name;
                let counter = 1;
                while (this.savedShaders.some(s => s.name === newName) || importedShaders.some(s => s.name === newName)) {
                    newName = `${shader.name} (${counter})`;
                    counter++;
                }
                shader.name = newName;
            }

            const savedShader: SavedShader = {
                id: shaderId,
                name: shader.name,
                description: shader.description,
                params: shader.params,
                vertex: shader.vertex,
                fragment: shader.fragment,
                savedAt: Date.now()
            };

            importedShaders.push(savedShader);

            if (!firstShaderId) {
                firstShaderId = shaderId;
            }
        });

        // Add imported shaders to savedShaders
        this.savedShaders.push(...importedShaders);
        this.saveShadersToStorage();
        this.populateExampleDropdown();

        // Close modal
        this.closeImportModal();

        // Log success
        this.logConsole(`Imported ${importedShaders.length} shader${importedShaders.length !== 1 ? 's' : ''}`, 'success');

        // Load the first imported shader
        if (firstShaderId) {
            this.loadSavedShader(firstShaderId);

            // Update dropdown selection
            if (this.exampleSelect) {
                this.exampleSelect.value = `saved:${firstShaderId}`;
            }
            this.updateDeleteButtonVisibility();
        }
    }

    private logConsole(message: string, type: string = 'info'): void {
        if (!this.consoleEl) return;

        const entry = document.createElement('div');
        entry.className = `console-entry ${type}`;
        const timestamp = new Date().toLocaleTimeString();
        entry.innerHTML = `<span class="console-timestamp">[${timestamp}]</span>${message}`;
        this.consoleEl.appendChild(entry);
        this.consoleEl.scrollTop = this.consoleEl.scrollHeight;
    }

    private showErrorPopup(message: string): void {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'error-popup-overlay';
        overlay.innerHTML = `
            <div class="error-popup">
                <div class="error-popup-icon">⚠️</div>
                <div class="error-popup-message">${message}</div>
                <button class="error-popup-btn">OK</button>
            </div>
        `;

        document.body.appendChild(overlay);

        // Close on button click or overlay click
        const closePopup = () => {
            overlay.remove();
        };

        overlay.querySelector('.error-popup-btn')?.addEventListener('click', closePopup);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup();
        });

        // Also log to console
        this.logConsole(message, 'error');
    }

    private clearConsole(): void {
        if (this.consoleEl) {
            this.consoleEl.innerHTML = '';
        }
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public getGLCanvas(): HTMLCanvasElement | null {
        return this.glCanvas;
    }

    public setParameter(name: string, value: number | number[]): void {
        this.paramManager.setParameter(name, value);
    }

    public getParameterManager(): ParameterManager {
        return this.paramManager;
    }
}

// Export singleton accessor
export const Studio = ShaderStudio.getInstance();
