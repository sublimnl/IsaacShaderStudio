// Shader Compiler - WebGL 2.0 shader compilation and preprocessing

export interface ShaderValidationResult {
    valid: boolean;
    warnings: string[];
    errors: string[];
}

// Required attributes for Isaac vertex shaders
const REQUIRED_VERTEX_ATTRIBUTES = ['Position', 'Color', 'TexCoord', 'RenderData', 'Scale'];

export class ShaderCompiler {
    private gl: WebGL2RenderingContext | null = null;

    public initGL(canvas: HTMLCanvasElement): boolean {
        // Use preserveDrawingBuffer to prevent buffer clearing after compositing
        const contextAttributes: WebGLContextAttributes = {
            preserveDrawingBuffer: true,
            alpha: true,
            antialias: false,
            premultipliedAlpha: false
        };

        this.gl = canvas.getContext('webgl2', contextAttributes) as WebGL2RenderingContext;
        if (!this.gl) {
            throw new Error('WebGL 2.0 not supported');
        }
        console.log('[ShaderCompiler] WebGL 2.0 context initialized');
        return true;
    }

    public getContext(): WebGL2RenderingContext | null {
        return this.gl;
    }

    public preprocessShader(source: string, type: 'vertex' | 'fragment'): string {
        // Check if shader is already GLSL ES 3.00
        const hasVersion300 = source.includes('#version 300 es');

        // Remove existing #version directives
        //source = source.replace(/#version\s+\d+(\s+es)?\s*/g, '');

        // Remove C++ style float suffixes (e.g., 0.5f -> 0.5)
        source = source.replace(/(\d+\.\d+)f\b/g, '$1');
        source = source.replace(/(\d+)f\b/g, '$1.0');

        if (!hasVersion300) {
            // Convert GLSL ES 1.00 / GLSL 1.20 to GLSL ES 3.00

            // Convert attribute to in (vertex shader only)
            if (type === 'vertex') {
                source = source.replace(/\battribute\b/g, 'in');
                source = source.replace(/\bvarying\b/g, 'out');
            }

            // Convert varying to in (fragment shader only)
            if (type === 'fragment') {
                source = source.replace(/\bvarying\b/g, 'in');

                // Replace gl_FragColor with FragColor output
                if (source.includes('gl_FragColor')) {
                    source = source.replace(/\bgl_FragColor\b/g, 'FragColor');
                }
            }

            // Convert texture2D to texture
            source = source.replace(/\btexture2D\b/g, 'texture');

            // Convert textureCube to texture
            source = source.replace(/\btextureCube\b/g, 'texture');
        }

        // Build the header
        let header = '#version 300 es\n';

        // Add precision for fragment shaders if not present
        if (type === 'fragment') {
            // Remove existing precision statements (we'll add our own)
            source = source.replace(/precision\s+(lowp|mediump|highp)\s+float\s*;/g, '');
            header += 'precision mediump float;\n';

            // Add FragColor output declaration if shader uses gl_FragColor
            if (!source.includes('out vec4 FragColor') && !source.includes('layout')) {
                header += 'out vec4 FragColor;\n';
            }
        }

        // Prepend header
        source = header + source;

        return source;
    }

    public createShader(type: number, source: string, typeName: 'vertex' | 'fragment'): WebGLShader {
        if (!this.gl) throw new Error('WebGL not initialized');

        source = this.preprocessShader(source, typeName);

        const shader = this.gl.createShader(type);
        if (!shader) throw new Error(`Failed to create ${typeName} shader`);

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const error = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error(`${typeName} shader error: ${error}`);
        }

        return shader;
    }

    public createProgram(vertexSource: string, fragmentSource: string): WebGLProgram {
        if (!this.gl) throw new Error('WebGL not initialized');

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource, 'vertex');
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource, 'fragment');

        const program = this.gl.createProgram();
        if (!program) throw new Error('Failed to create shader program');

        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            const error = this.gl.getProgramInfoLog(program);
            this.gl.deleteProgram(program);
            throw new Error('Program linking error: ' + error);
        }

        return program;
    }

    /**
     * Validate shader sources for Isaac compatibility.
     * Isaac's shader system has specific requirements:
     * - Custom parameters MUST be passed as vertex attributes, not uniforms
     * - Vertex shader must declare required attributes
     * - Fragment shader must receive data via varyings, not uniforms
     *
     * This validation is flexible about naming conventions - it checks the data flow,
     * not specific variable names. For example, varying vec4 RenderDataOut, OutRenderData,
     * or RenderData0 are all valid as long as the attribute is assigned to a varying
     * and that varying is declared in the fragment shader.
     */
    public validateIsaacShader(vertexSource: string, fragmentSource: string, customParams: string[]): ShaderValidationResult {
        const result: ShaderValidationResult = {
            valid: true,
            warnings: [],
            errors: []
        };

        // Extract declared attributes from vertex shader
        const vertexAttributes = this.extractDeclarations(vertexSource, 'attribute');
        const vertexIns = this.extractDeclarations(vertexSource, 'in'); // GLSL 300 ES style
        const allVertexAttribs = [...vertexAttributes, ...vertexIns];

        // Extract declared varyings from vertex shader (outputs)
        const vertexVaryings = this.extractDeclarations(vertexSource, 'varying');
        const vertexOuts = this.extractDeclarations(vertexSource, 'out');
        const allVertexOutputs = [...vertexVaryings, ...vertexOuts];

        // Extract declared varyings from fragment shader (inputs)
        const fragmentVaryings = this.extractDeclarations(fragmentSource, 'varying');
        const fragmentIns = this.extractDeclarations(fragmentSource, 'in');
        const allFragmentInputs = [...fragmentVaryings, ...fragmentIns];

        // Extract uniforms from fragment shader (these should NOT include custom params)
        const fragmentUniforms = this.extractDeclarations(fragmentSource, 'uniform');

        // Extract the main() function body from vertex shader for assignment analysis
        const vertexMainBody = this.extractMainBody(vertexSource);

        // Check required vertex attributes
        for (const attr of REQUIRED_VERTEX_ATTRIBUTES) {
            if (!allVertexAttribs.includes(attr)) {
                result.warnings.push(`Vertex shader missing required attribute: ${attr}`);
            }
        }

        // Check for mismatches between vertex outputs and fragment inputs
        // a) Varyings exported from vertex but not imported in fragment
        for (const varying of allVertexOutputs) {
            if (!allFragmentInputs.includes(varying)) {
                result.warnings.push(
                    `Varying "${varying}" is declared in vertex shader but not in fragment shader.`
                );
            }
        }

        // b) Varyings imported in fragment but not exported from vertex
        for (const varying of allFragmentInputs) {
            if (!allVertexOutputs.includes(varying)) {
                result.warnings.push(
                    `Varying "${varying}" is declared in fragment shader but not in vertex shader.`
                );
            }
        }

        // Check custom parameters are handled correctly
        for (const param of customParams) {
            // Custom param should be declared as attribute in vertex shader
            if (!allVertexAttribs.includes(param)) {
                result.errors.push(
                    `Custom parameter "${param}" must be declared as an attribute in the vertex shader. ` +
                    `Isaac passes custom params as vertex attributes, not uniforms.`
                );
                result.valid = false;
                continue;
            }

            // Custom param should NOT be declared as uniform in fragment shader
            if (fragmentUniforms.includes(param)) {
                result.errors.push(
                    `Custom parameter "${param}" cannot be a uniform in the fragment shader. ` +
                    `Isaac only passes custom params through vertex attributes → varyings. ` +
                    `Use "varying" instead of "uniform" and receive it from the vertex shader.`
                );
                result.valid = false;
                continue;
            }

            // Check that the attribute is actually used in main()
            // This handles both direct assignments (Varying = Attribute) and computations (using Attribute.xy, etc.)
            const isUsedInMain = this.isAttributeUsedInMain(vertexMainBody, param);

            if (!isUsedInMain) {
                result.warnings.push(
                    `Custom parameter "${param}" is declared but not used in the vertex shader's main() function.`
                );
            }
        }

        return result;
    }

    /**
     * Extract the body of the main() function from shader source
     */
    private extractMainBody(source: string): string {
        // Match main() { ... } - handles nested braces
        const mainMatch = source.match(/void\s+main\s*\(\s*(?:void)?\s*\)\s*\{/);
        if (!mainMatch) return '';

        const startIndex = mainMatch.index! + mainMatch[0].length;
        let braceCount = 1;
        let endIndex = startIndex;

        for (let i = startIndex; i < source.length && braceCount > 0; i++) {
            if (source[i] === '{') braceCount++;
            else if (source[i] === '}') braceCount--;
            endIndex = i;
        }

        return source.substring(startIndex, endIndex);
    }

    /**
     * Check if an attribute is used anywhere in the main() function body.
     * This includes direct assignments, computations, swizzles (.xy, .xyz), etc.
     */
    private isAttributeUsedInMain(mainBody: string, attributeName: string): boolean {
        // Check if the attribute name appears in main() body
        // This catches: direct use, swizzles (Attr.xy), array access, function calls, etc.
        const usagePattern = new RegExp(`\\b${attributeName}\\b`);
        return usagePattern.test(mainBody);
    }

    /**
     * Extract declared names of a specific type (attribute, varying, uniform, in, out)
     */
    private extractDeclarations(source: string, keyword: string): string[] {
        const names: string[] = [];
        // Match patterns like: keyword type name; or keyword lowp/mediump/highp type name;
        const regex = new RegExp(`\\b${keyword}\\s+(?:lowp|mediump|highp)?\\s*(?:float|vec2|vec3|vec4|mat4|sampler2D)\\s+(\\w+)\\s*;`, 'g');
        let match;
        while ((match = regex.exec(source)) !== null) {
            names.push(match[1]);
        }
        return names;
    }

    /**
     * Try to determine the GLSL type for a parameter based on how it's declared in vertex shader
     */
    private getVaryingType(paramName: string, vertexSource: string): string {
        const regex = new RegExp(`\\b(?:attribute|in)\\s+(float|vec2|vec3|vec4)\\s+${paramName}\\s*;`);
        const match = vertexSource.match(regex);
        return match ? match[1] : 'float';
    }
}
