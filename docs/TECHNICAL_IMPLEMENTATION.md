# Technical Implementation Documentation

This document details the technical implementation of Isaac Shader Studio's WebGL renderer and how it emulates The Binding of Isaac's shader system.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [WebGL 2.0 Context Configuration](#webgl-20-context-configuration)
3. [Shader Preprocessing](#shader-preprocessing)
4. [Attribute-Based Parameter System](#attribute-based-parameter-system)
5. [XML Parameter Format](#xml-parameter-format)
6. [Geometry and Buffer Setup](#geometry-and-buffer-setup)
7. [Texture Management](#texture-management)
8. [Coordinate System Transformations](#coordinate-system-transformations)
9. [Render Loop](#render-loop)
10. [Isaac Compatibility Validation](#isaac-compatibility-validation)

---

## Architecture Overview

### Module Structure

```
src/demo/shader-studio/
├── ShaderStudio.ts      # Main controller, UI management, state
├── ShaderCompiler.ts    # WebGL shader compilation, preprocessing
├── ShaderRenderer.ts    # WebGL render loop, buffer management
├── ParameterManager.ts  # Parameter definitions, UI controls
└── types.ts             # TypeScript interfaces
```

### Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Game Engine   │────▶│  ShaderStudio    │────▶│ ShaderRenderer  │
│ (Canvas buffer) │     │  (Controller)    │     │ (WebGL render)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │                         │
                               ▼                         ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │ ParameterManager │     │ ShaderCompiler  │
                        │ (UI + values)    │     │ (GLSL ES 3.00)  │
                        └──────────────────┘     └─────────────────┘
```

### Integration Point

The main integration happens in `main.ts` during the game's render loop:

```typescript
// In main.ts Render()
if (ShaderStudio.ShaderStudio.isEnabled()) {
    Studio.updateFromGame(
        Canvas.getBufferCanvas(),  // Game's render output
        player.Position.x,          // Raw player X
        player.Position.y,          // Raw player Y
        Canvas.width,               // Canvas dimensions
        Canvas.height
    );
}
```

---

## WebGL 2.0 Context Configuration

### Context Attributes

The WebGL context is created with specific attributes to match Isaac's rendering behavior:

```typescript
// ShaderCompiler.ts
const contextAttributes: WebGLContextAttributes = {
    preserveDrawingBuffer: true,   // Prevent buffer clearing after compositing
    alpha: true,                    // Support transparency
    antialias: false,               // Pixel-perfect rendering like Isaac
    premultipliedAlpha: false       // Non-premultiplied alpha for correct blending
};

this.gl = canvas.getContext('webgl2', contextAttributes);
```

**Why WebGL 2.0?**

WebGL 2.0 (GLSL ES 3.00) is required for:
- Better precision control
- More shader features
- Easier compatibility testing
- The preprocessor converts GLSL ES 1.00 syntax automatically

### Blending Configuration

Isaac uses premultiplied alpha blending from its Canvas 2D source:

```typescript
// ShaderRenderer.ts
this.gl.enable(this.gl.BLEND);
this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
// Formula: final = src * 1 + dst * (1 - srcAlpha)
```

---

## Shader Preprocessing

### GLSL Version Conversion

Isaac shaders are written in GLSL ES 1.00 syntax. The preprocessor converts them to GLSL ES 3.00:

```typescript
// ShaderCompiler.ts preprocessShader()

// 1. Remove existing #version directives
source = source.replace(/#version\s+\d+(\s+es)?\s*/g, '');

// 2. Remove C++ style float suffixes (0.5f -> 0.5)
source = source.replace(/(\d+\.\d+)f\b/g, '$1');
source = source.replace(/(\d+)f\b/g, '$1.0');

// 3. Convert keywords
if (type === 'vertex') {
    source = source.replace(/\battribute\b/g, 'in');
    source = source.replace(/\bvarying\b/g, 'out');
}
if (type === 'fragment') {
    source = source.replace(/\bvarying\b/g, 'in');
    source = source.replace(/\bgl_FragColor\b/g, 'FragColor');
}

// 4. Convert texture functions
source = source.replace(/\btexture2D\b/g, 'texture');
source = source.replace(/\btextureCube\b/g, 'texture');
```

### Header Injection

The preprocessor adds required headers:

```typescript
let header = '#version 300 es\n';

if (type === 'fragment') {
    header += 'precision mediump float;\n';
    header += 'out vec4 FragColor;\n';
}

source = header + source;
```

### Before and After Example

**Input (GLSL ES 1.00):**
```glsl
attribute vec3 Position;
varying vec4 Color0;

void main(void) {
    Color0 = vec4(1.0f, 0.5f, 0.0f, 1.0f);
    gl_Position = vec4(Position, 1.0);
}
```

**Output (GLSL ES 3.00):**
```glsl
#version 300 es
in vec3 Position;
out vec4 Color0;

void main(void) {
    Color0 = vec4(1.0, 0.5, 0.0, 1.0);
    gl_Position = vec4(Position, 1.0);
}
```

---

## Attribute-Based Parameter System

### The Challenge

Isaac passes custom shader parameters as **vertex attributes**, not uniforms. This is unusual and requires special handling in WebGL.

Standard WebGL uniform approach:
```glsl
uniform float Time;  // Set once per frame via gl.uniform1f()
```

Isaac's attribute approach:
```glsl
attribute float Time;  // Set per-vertex via vertex buffer
```

### Implementation Strategy

Since attributes are per-vertex data, we create a vertex buffer for each parameter and fill it with the same value for all vertices:

```typescript
// ShaderRenderer.ts setupParameterAttributes()

// For each custom parameter found in the vertex shader:
const buffer = this.gl.createBuffer();
const initialData = new Float32Array(4 * size);  // 4 vertices * component count
this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
this.gl.bufferData(this.gl.ARRAY_BUFFER, initialData, this.gl.DYNAMIC_DRAW);

this.parameterAttributeBuffers.push({
    buffer,
    location,
    size,
    paramName: attrName,
    paramType: glslType
});
```

### Per-Frame Updates

Each frame, parameter buffers are updated with current values:

```typescript
// ShaderRenderer.ts updateParameterAttributeBuffers()

for (const paramAttr of this.parameterAttributeBuffers) {
    let value = /* get current value from ParameterManager */;

    // Create data array with same value for all 4 vertices
    const data = new Float32Array(4 * paramAttr.size);
    for (let i = 0; i < 4; i++) {
        if (typeof value === 'number') {
            data[i * paramAttr.size] = value;
        } else if (Array.isArray(value)) {
            for (let j = 0; j < paramAttr.size; j++) {
                data[i * paramAttr.size + j] = value[j];
            }
        }
    }

    // Update buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, paramAttr.buffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, data);
}
```

### Attribute Detection

The renderer parses the vertex shader source to find custom attribute declarations:

```typescript
// Match: attribute float Name; OR in float Name;
const attributeRegex = /(?:attribute|in)\s+(float|vec2|vec3|vec4)\s+(\w+)\s*;/g;

// Skip standard attributes
const standardAttributes = ['Position', 'Color', 'TexCoord', 'RenderData', 'Scale'];

while ((match = attributeRegex.exec(vertexSource)) !== null) {
    const glslType = match[1];
    const attrName = match[2];
    if (!standardAttributes.includes(attrName)) {
        // Create buffer for this parameter
    }
}
```

---

## XML Parameter Format

### Basic Format

Isaac shader XML uses `<param>` elements with `name` and `type` attributes:

```xml
<parameters>
    <param name="Radius" type="float"/>
    <param name="Color" type="vec3"/>
</parameters>
```

### Extended Attributes

The studio supports additional attributes that Isaac safely ignores:

```xml
<param name="Radius" type="float" default="0.5" min="0.0" max="1.0" step="0.01"/>
<param name="Color" type="vec3" default="1.0,0.5,0.0"/>
```

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `default` | Initial value | `"0.5"` or `"1.0,0.5,0.0"` |
| `min` | Minimum slider value | `"0.0"` |
| `max` | Maximum slider value | `"1.0"` |
| `step` | Slider increment | `"0.01"` |
| `fps` | Frame rate for time params | `"30"` |
| `coordinateSpace` | For playerpos: `"screen"` or `"world"` | `"screen"` |

### studioType Attribute

The `studioType` attribute allows the studio to interpret special parameter types while Isaac sees standard GLSL types:

```xml
<!-- Isaac sees: type="float", Studio sees: studioType="time" -->
<param name="Time" type="float" studioType="time"/>

<!-- Isaac sees: type="vec2", Studio sees: studioType="playerpos" -->
<param name="PlayerPos" type="vec2" studioType="playerpos"/>
```

**Special Types:**

| studioType | GLSL Type | UI Control |
|------------|-----------|------------|
| `time` | `float` | Auto-incrementing frame counter |
| `playerpos` | `vec2` | Follows player position |
| `mousepos` | `vec2` | Follows mouse cursor (debug) |
| `boolean` | `float` | Toggle switch (0.0 or 1.0) |
| `color` | `vec3` | Color picker |

### Backward Compatibility

If `studioType` is not present, the parser falls back to name-based detection:
- Parameters named `Time` → treated as `time` type
- Parameters named `PlayerPos` or `PlayerPosition` → treated as `playerpos` type
- Parameters named `MousePos` or `MousePosition` → treated as `mousepos` type

### Export Format

When exporting shaders, all attributes are included:

```xml
<param name="Time" type="float" studioType="time" fps="30"/>
<param name="PlayerPos" type="vec2" studioType="playerpos" coordinateSpace="screen"/>
<param name="Radius" type="float" default="0.5" min="0.0" max="1.0" step="0.01"/>
```

---

## Geometry and Buffer Setup

### Fullscreen Quad

The renderer draws a fullscreen quad (two triangles as a triangle strip):

```typescript
// ShaderRenderer.ts setupGeometry()

// Position: NDC coordinates (-1 to 1)
const positions = new Float32Array([
    -1, -1, 0,  // bottom-left
     1, -1, 0,  // bottom-right
    -1,  1, 0,  // top-left
     1,  1, 0   // top-right
]);

// TexCoord: UV coordinates (0-1, Y-flipped for OpenGL)
const texCoords = new Float32Array([
    0, 1,  // bottom-left  -> top-left of texture
    1, 1,  // bottom-right -> top-right of texture
    0, 0,  // top-left     -> bottom-left of texture
    1, 0   // top-right    -> bottom-right of texture
]);
```

### UV Coordinate Flipping

OpenGL's texture coordinate origin is bottom-left, but Isaac (and the game canvas) uses top-left origin. The UV coordinates are flipped to compensate:

```
Game Canvas          OpenGL Texture       Our UVs
(0,0)───(w,0)        (0,1)───(1,1)        (0,1)───(1,1)
  │       │            │       │            │       │
  │       │    ──▶     │       │    ──▶     │       │
  │       │            │       │            │       │
(0,h)───(w,h)        (0,0)───(1,0)        (0,0)───(1,0)
```

### Standard Attribute Buffers

Each Isaac standard attribute gets its own buffer:

```typescript
this.createAttribute('Position', positions, 3);   // vec3
this.createAttribute('TexCoord', texCoords, 2);   // vec2
this.createAttribute('Color', colors, 4);         // vec4 (all white)
this.createAttribute('Scale', scales, 1);         // float (all 1.0)
this.createAttribute('RenderData', renderData, 4); // vec4
```

### RenderData Format

Isaac packs window and texture dimensions into RenderData:

```typescript
const renderData = new Float32Array([
    windowWidth, windowHeight, textureWidth, textureHeight,  // vertex 0
    windowWidth, windowHeight, textureWidth, textureHeight,  // vertex 1
    windowWidth, windowHeight, textureWidth, textureHeight,  // vertex 2
    windowWidth, windowHeight, textureWidth, textureHeight   // vertex 3
]);
```

Usage in shader:
- `RenderData.xy` = window dimensions in pixels
- `RenderData.zw` = texture dimensions in pixels

---

## Texture Management

### Texture Creation

The source texture is created from the game's buffer canvas:

```typescript
// ShaderRenderer.ts loadTextureFromCanvas()

this.texture = this.gl.createTexture();
this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
this.gl.texImage2D(
    this.gl.TEXTURE_2D,
    0,
    this.gl.RGBA,
    this.gl.RGBA,
    this.gl.UNSIGNED_BYTE,
    sourceCanvas
);
```

### Texture Parameters

Configured for pixel-perfect rendering (no smoothing):

```typescript
this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
```

**NEAREST filtering** ensures pixels are not interpolated, matching Isaac's pixel art style.

### Per-Frame Updates

The texture is updated each frame with the latest game render:

```typescript
// ShaderRenderer.ts render()

if (this.gameState.bufferCanvas) {
    this.updateTexture(this.gameState.bufferCanvas);
}
```

---

## Coordinate System Transformations

### The Coordinate Problem

Isaac's shader system uses specific Scale and RenderData values that affect how coordinates are interpreted. The simulator must replicate these values exactly for shaders to render identically in both environments.

### Isaac's Coordinate Math

In Isaac shaders, player position is typically normalized like this:

```glsl
// Fragment shader coordinate normalization
vec2 pos = (PlayerPosOut / RenderDataOut.zw) * ScaleOut;
```

Where:
- `PlayerPosOut` = screen pixel position from `WorldToScreen()`
- `RenderDataOut.zw` = texture dimensions (Isaac uses ~2x canvas size)
- `ScaleOut` = room zoom level (typically 0.5 in normal gameplay)

### Simulator Configuration

To match Isaac's coordinate math, the simulator uses these values:

```typescript
// ShaderRenderer.ts - Scale attribute
const scales = new Float32Array([0.5, 0.5, 0.5, 0.5]);

// ShaderRenderer.ts - RenderData (doubled canvas dimensions)
const windowWidth = this.canvas.width * 2;   // 884
const windowHeight = this.canvas.height * 2; // 572
const textureWidth = this.canvas.width * 2;
const textureHeight = this.canvas.height * 2;
```

### Player Position Scaling

With Scale=0.5 and RenderData=2x, player positions must be scaled by 4x to produce correct normalized coordinates:

```typescript
// ShaderStudio.ts updateFromGame()
const yOffset = -2;
const scaledX = playerX * 4;
const scaledY = (playerY + yOffset) * 4;
```

**Why 4x scaling?** The math works out as:
```
(PlayerPos * 4) / (RenderData * 2) * 0.5 = PlayerPos / RenderData
```

This produces the same normalized position that Isaac's actual coordinates would produce.

### Mouse Position (Debug)

Mouse position uses the same scaling for debugging shaders that follow the cursor:

```typescript
// ShaderStudio.ts - Mouse move handler
const canvasX = (e.clientX - rect.left) / rect.width * 442;
const canvasY = (e.clientY - rect.top) / rect.height * 286;
const yOffset = -2;
const scaledX = canvasX * 4;
const scaledY = (canvasY + yOffset) * 4;
```

### Coordinate Space Selection

Parameters with type `playerpos` can choose their coordinate space:

```typescript
// ShaderRenderer.ts updateParameterAttributeBuffers()
if (paramDef?.type === 'playerpos' || paramDef?.type === 'mousepos') {
    const coords = paramDef.coordinateSpace === 'world'
        ? this.gameState.playerPositionWorld
        : this.gameState.playerPosition;
    value = [coords.x, coords.y];
}
```

### Generated Lua

The Lua code outputs raw Isaac coordinates (no scaling needed in-game):

**Screen Space** (default):
```lua
local screenPos = Isaac.WorldToScreen(player.Position)
PlayerPos = { screenPos.X, screenPos.Y }
```

**World Space**:
```lua
local playerPos = player.Position
PlayerPos = { playerPos.X, playerPos.Y }
```

### Normalizing in Shaders

Shaders receive pixel coordinates and normalize them using RenderData and Scale:

```glsl
// Convert screen pixels to normalized 0-1 space
vec2 pos = (PlayerPosOut / RenderDataOut.zw) * ScaleOut;

// Use for distance calculations
float dist = distance(TexCoord0, pos);
```

---

## Render Loop

### Frame Lifecycle

```typescript
// ShaderRenderer.ts render()

render(): void {
    if (!this.gl || !this.program || !this.canvas || !this.isPlaying) return;

    // 1. Update texture from game canvas
    if (this.gameState.bufferCanvas) {
        this.updateTexture(this.gameState.bufferCanvas);
    }

    // 2. Setup viewport and clear
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // 3. Configure render state
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.disable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);

    // 4. Use shader program
    this.gl.useProgram(this.program);

    // 5. Update parameter attribute buffers
    this.updateParameterAttributeBuffers();

    // 6. Bind all attribute buffers
    this.bindAttributes();

    // 7. Set Transform uniform (identity matrix)
    const transformLocation = this.gl.getUniformLocation(this.program, 'Transform');
    if (transformLocation) {
        const identityMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        this.gl.uniformMatrix4fv(transformLocation, false, identityMatrix);
    }

    // 8. Bind texture
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    const textureLocation = this.gl.getUniformLocation(this.program, 'Texture0');
    if (textureLocation) {
        this.gl.uniform1i(textureLocation, 0);
    }

    // 9. Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    // 10. Update counters and schedule next frame
    this.frameCount++;
    this.animationId = requestAnimationFrame(() => this.render());
}
```

### Time Management

The frame counter serves as the `Time` parameter source, matching Isaac's `Isaac.GetFrameCount()`:

```typescript
// Time parameter with fps conversion
if (paramDef?.type === 'time') {
    const targetFps = paramDef.fps || 60;
    if (targetFps === 60) {
        value = this.frameCount;
    } else {
        value = Math.floor(this.frameCount * targetFps / 60);
    }
}
```

Isaac runs at 60 FPS, so shaders expecting 30 FPS get every other frame:
```typescript
// For 30 FPS target:
value = Math.floor(frameCount * 30 / 60);  // Effectively frameCount / 2
```

---

## Isaac Compatibility Validation

### Validation Philosophy

The validator is flexible about naming conventions but strict about data flow. Isaac's shader system has specific requirements:
- Custom parameters **must** be passed as vertex attributes (not uniforms)
- Vertex shader outputs data via varyings to fragment shader
- Fragment shader receives data via varyings (not uniforms for custom params)

### Validation Rules

```typescript
// ShaderCompiler.ts validateIsaacShader()

validateIsaacShader(vertexSource: string, fragmentSource: string, customParams: string[]): ShaderValidationResult {
    // 1. Check required vertex attributes (warnings only)
    for (const attr of ['Position', 'Color', 'TexCoord', 'RenderData', 'Scale']) {
        if (!allVertexAttribs.includes(attr)) {
            result.warnings.push(`Missing required attribute: ${attr}`);
        }
    }

    // 2. Check varying mismatches (warnings)
    // a) Vertex outputs not declared in fragment
    for (const varying of allVertexOutputs) {
        if (!allFragmentInputs.includes(varying)) {
            result.warnings.push(`Varying "${varying}" declared in vertex but not fragment`);
        }
    }
    // b) Fragment inputs not declared in vertex
    for (const varying of allFragmentInputs) {
        if (!allVertexOutputs.includes(varying)) {
            result.warnings.push(`Varying "${varying}" declared in fragment but not vertex`);
        }
    }

    // 3. Check custom parameters (errors - these break Isaac compatibility)
    for (const param of customParams) {
        // Must be declared as attribute in vertex shader
        if (!allVertexAttribs.includes(param)) {
            result.errors.push(`"${param}" must be an attribute in vertex shader`);
            result.valid = false;
        }

        // Must NOT be a uniform in fragment shader
        if (fragmentUniforms.includes(param)) {
            result.errors.push(`"${param}" cannot be a uniform in fragment shader`);
            result.valid = false;
        }

        // Should be used in main() function
        if (!isAttributeUsedInMain(vertexMainBody, param)) {
            result.warnings.push(`"${param}" declared but not used in main()`);
        }
    }

    return result;
}
```

### Flexible Naming

The validator does **not** enforce specific varying names. These are all valid:
- `varying vec4 RenderDataOut;`
- `varying vec4 OutRenderData;`
- `varying vec4 RenderData0;`

As long as the attribute is assigned to a varying and that varying is declared in both shaders, the data flow is correct.

### Error vs Warning

| Type | Meaning | Example |
|------|---------|---------|
| **Error** | Shader won't work in Isaac | Custom param as uniform instead of attribute |
| **Warning** | May work, but potential issue | Missing standard attribute, unused parameter |

Shaders with errors still compile for preview, allowing iteration.

---

## Summary

### Key Implementation Decisions

| Aspect | Implementation | Reason |
|--------|---------------|--------|
| WebGL Version | WebGL 2.0 (GLSL ES 3.00) | Better features, automatic conversion from 1.00 |
| Parameters | Vertex attributes + buffers | Matches Isaac's architecture exactly |
| Texture Filtering | NEAREST | Pixel-perfect rendering |
| Blending | ONE, ONE_MINUS_SRC_ALPHA | Matches Isaac's premultiplied alpha |
| UV Coordinates | Y-flipped | Compensates for OpenGL origin difference |
| Scale | 0.5 (fixed) | Matches Isaac's typical room zoom |
| RenderData | Canvas×2 | Matches Isaac's ~2x texture dimensions |
| PlayerPos | Raw×4 scaling | Compensates for Scale×RenderData math |
| XML Format | studioType attribute | Isaac ignores, studio interprets special types |

### Files Modified per Feature

| Feature | Files |
|---------|-------|
| Shader compilation | `ShaderCompiler.ts` |
| Parameter handling | `ParameterManager.ts`, `ShaderRenderer.ts` |
| Render pipeline | `ShaderRenderer.ts` |
| Coordinate transforms | `ShaderStudio.ts`, `ShaderRenderer.ts` |
| Isaac validation | `ShaderCompiler.ts` |
| XML parsing/export | `ShaderStudio.ts` |
| UI/State management | `ShaderStudio.ts` |

### Performance Considerations

1. **Buffer updates**: Only parameter buffers are updated per-frame (dynamic draw)
2. **Geometry buffers**: Static draw, created once
3. **Texture updates**: Uses `texImage2D` from canvas each frame
4. **No shader recompilation**: Shaders compiled once, reused until changed
5. **requestAnimationFrame**: Uses browser's optimal timing
