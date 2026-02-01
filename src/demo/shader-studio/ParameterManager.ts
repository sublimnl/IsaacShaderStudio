// Parameter Manager - Parameter definitions and UI controls

import { ParamDefinition, ParamType, ShaderParams } from './types';

export class ParameterManager {
    private paramDefinitions: ParamDefinition[] = [];
    private shaderParams: ShaderParams = {};
    private paramsPanel: HTMLElement | null = null;
    private paramsList: HTMLElement | null = null;

    constructor() { }

    public initialize(paramsPanel: HTMLElement, paramsList: HTMLElement): void {
        this.paramsPanel = paramsPanel;
        this.paramsList = paramsList;
    }

    public getParamDefinitions(): ParamDefinition[] {
        return this.paramDefinitions;
    }

    public getShaderParams(): ShaderParams {
        return this.shaderParams;
    }

    public setParameter(name: string, value: number | number[]): void {
        this.shaderParams[name] = value;
    }

    public setParamDefinitions(params: ParamDefinition[]): void {
        this.paramDefinitions = params;
    }

    public addParameter(
        name: string = '',
        type: ParamType = 'float',
        defaultValue: string = '',
        min?: number,
        max?: number,
        step?: number,
        fps?: number,
        coordinateSpace?: 'screen' | 'world',
        index?: number
    ): void {
        if (!this.paramsList) return;

        const paramItem = document.createElement('div');
        paramItem.className = 'param-item';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Name';
        nameInput.value = name;
        nameInput.dataset.field = 'name';

        const typeSelect = document.createElement('select');
        typeSelect.dataset.field = 'type';
        const types: Array<{ value: ParamType; label: string }> = [
            { value: 'float', label: 'Float' },
            { value: 'vec2', label: 'Vec2' },
            { value: 'vec3', label: 'Vec3' },
            { value: 'vec4', label: 'Vec4' },
            { value: 'boolean', label: 'Boolean' },
            { value: 'time', label: 'Time (Auto)' },
            { value: 'playerpos', label: 'Player Position (Auto)' },
            { value: 'tearpos', label: 'Tear Position (Auto)' },
            { value: 'mousepos', label: 'Mouse Position (Debug)' },
            { value: 'color', label: 'Color' }
        ];
        types.forEach(t => {
            const option = document.createElement('option');
            option.value = t.value;
            option.textContent = t.label;
            if (t.value === type) option.selected = true;
            typeSelect.appendChild(option);
        });

        const defaultInput = document.createElement('input');
        defaultInput.type = 'text';
        defaultInput.placeholder = 'Default';
        defaultInput.value = defaultValue;
        defaultInput.dataset.field = 'default';
        defaultInput.style.width = '60px';

        // Min/Max/Step inputs for float type
        const minInput = document.createElement('input');
        minInput.type = 'text';
        minInput.placeholder = 'Min';
        minInput.value = min !== undefined ? min.toString() : '';
        minInput.dataset.field = 'min';
        minInput.style.width = '40px';
        minInput.title = 'Minimum value';

        const maxInput = document.createElement('input');
        maxInput.type = 'text';
        maxInput.placeholder = 'Max';
        maxInput.value = max !== undefined ? max.toString() : '';
        maxInput.dataset.field = 'max';
        maxInput.style.width = '40px';
        maxInput.title = 'Maximum value';

        const stepInput = document.createElement('input');
        stepInput.type = 'text';
        stepInput.placeholder = 'Step';
        stepInput.value = step !== undefined ? step.toString() : '';
        stepInput.dataset.field = 'step';
        stepInput.style.width = '40px';
        stepInput.title = 'Step increment';

        // FPS input for time type
        const fpsInput = document.createElement('input');
        fpsInput.type = 'number';
        fpsInput.placeholder = 'FPS';
        fpsInput.value = fps !== undefined ? fps.toString() : '60';
        fpsInput.dataset.field = 'fps';
        fpsInput.style.width = '50px';
        fpsInput.title = 'Target FPS (Isaac runs at 60fps)';
        fpsInput.min = '1';
        fpsInput.max = '120';

        // Coordinate space select for playerpos type
        const coordSpaceSelect = document.createElement('select');
        coordSpaceSelect.dataset.field = 'coordinateSpace';
        coordSpaceSelect.title = 'Coordinate space';
        const coordSpaces: Array<{ value: 'screen' | 'world', label: string }> = [
            { value: 'screen', label: 'Screen' },
            { value: 'world', label: 'World' }
        ];
        coordSpaces.forEach(cs => {
            const option = document.createElement('option');
            option.value = cs.value;
            option.textContent = cs.label;
            if (cs.value === (coordinateSpace || 'screen')) option.selected = true;
            coordSpaceSelect.appendChild(option);
        });

        // Index input for tearpos type
        const indexInput = document.createElement('input');
        indexInput.type = 'number';
        indexInput.placeholder = 'Index';
        indexInput.value = index !== undefined ? index.toString() : '1';
        indexInput.dataset.field = 'index';
        indexInput.style.width = '50px';
        indexInput.title = 'Tear index (1 = first tear, 2 = second, etc.)';
        indexInput.min = '1';
        indexInput.max = '10';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-param-btn';
        removeBtn.textContent = '\u2715';
        removeBtn.onclick = () => {
            this.paramsList?.removeChild(paramItem);
        };

        // Show/hide fields based on type
        const updateFieldVisibility = () => {
            const currentType = typeSelect.value;
            const autoTypes = ['time', 'mousepos', 'playerpos', 'tearpos', 'boolean'];
            const isFloat = currentType === 'float';
            const isAuto = autoTypes.includes(currentType);
            const isColor = currentType === 'color';
            const isTime = currentType === 'time';
            const isPlayerPos = currentType === 'playerpos';
            const isTearPos = currentType === 'tearpos';

            // Color type shows a color picker in the default field
            defaultInput.style.display = (isAuto && !isColor) ? 'none' : 'block';
            if (isColor) {
                defaultInput.type = 'color';
                defaultInput.style.width = '50px';
                defaultInput.style.padding = '0';
                defaultInput.style.height = '24px';
                defaultInput.style.cursor = 'pointer';
                if (!defaultInput.value || !defaultInput.value.startsWith('#')) {
                    defaultInput.value = '#ffffff';
                }
            } else {
                defaultInput.type = 'text';
                defaultInput.style.width = '60px';
                defaultInput.style.padding = '4px 8px';
                defaultInput.style.height = '';
                defaultInput.style.cursor = '';
            }
            minInput.style.display = isFloat ? 'block' : 'none';
            maxInput.style.display = isFloat ? 'block' : 'none';
            stepInput.style.display = isFloat ? 'block' : 'none';
            fpsInput.style.display = isTime ? 'block' : 'none';
            coordSpaceSelect.style.display = isPlayerPos ? 'block' : 'none';
            indexInput.style.display = isTearPos ? 'block' : 'none';
        };

        typeSelect.addEventListener('change', updateFieldVisibility);
        updateFieldVisibility();

        paramItem.appendChild(nameInput);
        paramItem.appendChild(typeSelect);
        paramItem.appendChild(defaultInput);
        paramItem.appendChild(minInput);
        paramItem.appendChild(maxInput);
        paramItem.appendChild(stepInput);
        paramItem.appendChild(fpsInput);
        paramItem.appendChild(coordSpaceSelect);
        paramItem.appendChild(indexInput);
        paramItem.appendChild(removeBtn);
        this.paramsList.appendChild(paramItem);
    }

    public collectParamDefinitions(): void {
        this.paramDefinitions = [];
        if (!this.paramsList) return;

        const items = this.paramsList.querySelectorAll('.param-item');
        items.forEach(item => {
            const nameInput = item.querySelector('input[data-field="name"]') as HTMLInputElement;
            const typeSelect = item.querySelector('select[data-field="type"]') as HTMLSelectElement;
            const defaultInput = item.querySelector('input[data-field="default"]') as HTMLInputElement;
            const minInput = item.querySelector('input[data-field="min"]') as HTMLInputElement;
            const maxInput = item.querySelector('input[data-field="max"]') as HTMLInputElement;
            const stepInput = item.querySelector('input[data-field="step"]') as HTMLInputElement;
            const fpsInput = item.querySelector('input[data-field="fps"]') as HTMLInputElement;
            const coordSpaceSelect = item.querySelector('select[data-field="coordinateSpace"]') as HTMLSelectElement;
            const indexInput = item.querySelector('input[data-field="index"]') as HTMLInputElement;

            const name = nameInput?.value.trim() || '';
            const type = (typeSelect?.value || 'float') as ParamType;
            const defaultVal = defaultInput?.value.trim() || '';
            const minVal = minInput?.value.trim();
            const maxVal = maxInput?.value.trim();
            const stepVal = stepInput?.value.trim();
            const fpsVal = fpsInput?.value.trim();
            const coordSpaceVal = coordSpaceSelect?.value as 'screen' | 'world' | undefined;
            const indexVal = indexInput?.value.trim();

            if (name) {
                const param: ParamDefinition = {
                    name: name,
                    type: type,
                    default: defaultVal || undefined
                };

                // Only include min/max/step for float types if they have values
                if (type === 'float') {
                    if (minVal) param.min = parseFloat(minVal);
                    if (maxVal) param.max = parseFloat(maxVal);
                    if (stepVal) param.step = parseFloat(stepVal);
                }

                // Include fps for time type (default 60)
                if (type === 'time') {
                    param.fps = fpsVal ? parseInt(fpsVal, 10) : 60;
                }

                // Include coordinateSpace for playerpos type (default 'screen')
                if (type === 'playerpos') {
                    param.coordinateSpace = coordSpaceVal || 'screen';
                }

                // Include index for tearpos type (default 1)
                if (type === 'tearpos') {
                    param.index = indexVal ? parseInt(indexVal, 10) : 1;
                }

                this.paramDefinitions.push(param);
            }
        });
    }

    public createParameterControls(preserveValues: boolean = false): void {
        if (!this.paramsPanel) return;

        // Save existing values if preserving
        const previousValues: ShaderParams = preserveValues ? { ...this.shaderParams } : {};

        this.paramsPanel.innerHTML = '';
        this.shaderParams = {};

        if (this.paramDefinitions.length === 0) {
            this.paramsPanel.classList.remove('active');
            return;
        }

        this.paramsPanel.classList.add('active');

        this.paramDefinitions.forEach(param => {
            // Auto-handled parameters don't need UI
            if (param.type === 'time' || param.type === 'mousepos' || param.type === 'playerpos' || param.type === 'tearpos') {
                return;
            }

            const control = document.createElement('div');
            control.className = 'param-control';

            if (param.type === 'boolean') {
                // Use preserved value if available, otherwise default to ON
                const preservedBool = previousValues[param.name];
                const boolVal = (preservedBool !== undefined) ? preservedBool as number : 1.0;
                this.shaderParams[param.name] = boolVal;
                const isChecked = boolVal !== 0;
                control.innerHTML = `
                    <span class="param-label">${param.name}:</span>
                    <input type="checkbox" class="param-checkbox" ${isChecked ? 'checked' : ''} data-param="${param.name}">
                    <span class="param-value" style="color: ${isChecked ? '#89d185' : '#f48771'}">${isChecked ? 'ON' : 'OFF'}</span>
                `;
            } else if (param.type === 'color') {
                // Color picker with preview swatch
                const preservedVal = previousValues[param.name] as number[] | undefined;
                let colorVec: number[];
                if (preservedVal && Array.isArray(preservedVal)) {
                    colorVec = preservedVal;
                } else {
                    const defaultVal = param.default || this.getDefaultValue(param.type);
                    colorVec = this.parseParamValue(param.type, defaultVal) as number[];
                }
                this.shaderParams[param.name] = colorVec;
                const hexColor = this.vec3ToHex(colorVec);

                control.innerHTML = `
                    <span class="param-label">${param.name}:</span>
                    <div class="color-picker-wrapper">
                        <div class="color-swatch" style="background-color: ${hexColor};" title="Click to change color"></div>
                        <input type="color" class="color-input" value="${hexColor}">
                    </div>
                    <span class="param-value">${colorVec.map(v => v.toFixed(2)).join(', ')}</span>
                `;
            } else {
                // Check for preserved value first
                const preservedVal = previousValues[param.name];
                if (preservedVal !== undefined) {
                    this.shaderParams[param.name] = preservedVal;
                } else {
                    const defaultVal = param.default || this.getDefaultValue(param.type);
                    this.shaderParams[param.name] = this.parseParamValue(param.type, defaultVal);
                }

                if (param.type === 'float') {
                    const val = this.shaderParams[param.name] as number;
                    const min = param.min ?? 0;
                    const max = param.max ?? 2;
                    const step = param.step ?? 0.1;
                    const decimals = this.getDecimalPlaces(step);
                    control.innerHTML = `
                        <span class="param-label">${param.name}:</span>
                        <input type="range" class="param-input" min="${min}" max="${max}" step="${step}" value="${val}">
                        <span class="param-value">${val.toFixed(decimals)}</span>
                    `;
                } else {
                    const vals = this.shaderParams[param.name] as number[];
                    control.innerHTML = `
                        <span class="param-label">${param.name}:</span>
                        <input type="text" class="param-input" value="${vals.join(', ')}" placeholder="${param.type}">
                    `;
                }
            }

            this.paramsPanel!.appendChild(control);

            const input = control.querySelector('.param-checkbox, .param-input, .color-input') as HTMLInputElement;
            if (!input) return;

            if (param.type === 'boolean') {
                const valueDisplay = control.querySelector('.param-value') as HTMLElement;
                input.addEventListener('change', (e) => {
                    const checked = (e.target as HTMLInputElement).checked;
                    this.shaderParams[param.name] = checked ? 1.0 : 0.0;
                    valueDisplay.textContent = checked ? 'ON' : 'OFF';
                    valueDisplay.style.color = checked ? '#89d185' : '#f48771';
                });
            } else if (param.type === 'color') {
                const swatch = control.querySelector('.color-swatch') as HTMLElement;
                const valueDisplay = control.querySelector('.param-value') as HTMLElement;

                // Click swatch to open color picker
                swatch.addEventListener('click', () => input.click());

                input.addEventListener('input', (e) => {
                    const hex = (e.target as HTMLInputElement).value;
                    const colorVec = this.hexToVec3(hex);
                    this.shaderParams[param.name] = colorVec;
                    swatch.style.backgroundColor = hex;
                    valueDisplay.textContent = colorVec.map(v => v.toFixed(2)).join(', ');
                });
            } else if (param.type === 'float') {
                const valueDisplay = control.querySelector('.param-value') as HTMLElement;
                const decimals = this.getDecimalPlaces(param.step ?? 0.1);
                input.addEventListener('input', (e) => {
                    const val = parseFloat((e.target as HTMLInputElement).value);
                    this.shaderParams[param.name] = val;
                    valueDisplay.textContent = val.toFixed(decimals);
                });
            } else {
                input.addEventListener('change', (e) => {
                    const val = this.parseParamValue(param.type, (e.target as HTMLInputElement).value);
                    if (val) this.shaderParams[param.name] = val;
                });
            }
        });
    }

    public clearParameters(): void {
        if (this.paramsList) {
            this.paramsList.innerHTML = '';
        }
        this.paramDefinitions = [];
        this.shaderParams = {};
    }

    public loadParameters(params: ParamDefinition[]): void {
        this.clearParameters();
        params.forEach(p => {
            this.addParameter(p.name, p.type, p.default || '', p.min, p.max, p.step, p.fps, p.coordinateSpace, p.index);
        });
    }

    private getDefaultValue(type: ParamType): string {
        switch (type) {
            case 'float': return '1.0';
            case 'vec2': return '0.5,0.5';
            case 'vec3': return '1.0,1.0,1.0';
            case 'vec4': return '1.0,1.0,1.0,1.0';
            case 'color': return '#ffffff';
            default: return '0.0';
        }
    }

    private parseParamValue(type: ParamType, value: string): number | number[] | null {
        if (!value) return null;
        switch (type) {
            case 'float':
            case 'boolean':
                return parseFloat(value);
            case 'vec2':
            case 'vec3':
            case 'vec4':
                return value.split(',').map(v => parseFloat(v.trim()));
            case 'color':
                return this.hexToVec3(value);
            default:
                return null;
        }
    }

    // Convert hex color (#RRGGBB) to vec3 array [r, g, b] with values 0.0-1.0
    private hexToVec3(hex: string): number[] {
        // Handle both #RGB and #RRGGBB formats
        let h = hex.replace('#', '');
        if (h.length === 3) {
            h = h.split('').map(c => c + c).join('');
        }
        const r = parseInt(h.substring(0, 2), 16) / 255;
        const g = parseInt(h.substring(2, 4), 16) / 255;
        const b = parseInt(h.substring(4, 6), 16) / 255;
        return [r, g, b];
    }

    // Convert vec3 array [r, g, b] (0.0-1.0) to hex color string
    private vec3ToHex(rgb: number[]): string {
        const r = Math.round(Math.max(0, Math.min(1, rgb[0])) * 255);
        const g = Math.round(Math.max(0, Math.min(1, rgb[1])) * 255);
        const b = Math.round(Math.max(0, Math.min(1, rgb[2])) * 255);
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }

    private getDecimalPlaces(step: number): number {
        if (step >= 1) return 0;
        const str = step.toString();
        const decimalIndex = str.indexOf('.');
        if (decimalIndex === -1) return 0;
        return str.length - decimalIndex - 1;
    }

    public setUniform(gl: WebGL2RenderingContext, program: WebGLProgram, name: string, type: ParamType, value: number | number[]): void {
        const location = gl.getUniformLocation(program, name);
        if (!location) return;

        switch (type) {
            case 'float':
            case 'boolean':
                gl.uniform1f(location, value as number);
                break;
            case 'vec2':
                gl.uniform2fv(location, value as number[]);
                break;
            case 'vec3':
                gl.uniform3fv(location, value as number[]);
                break;
            case 'vec4':
                gl.uniform4fv(location, value as number[]);
                break;
        }
    }
}
