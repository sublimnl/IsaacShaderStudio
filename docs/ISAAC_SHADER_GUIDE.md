# Binding of Isaac Shader Development Guide

This guide explains how to create custom shaders for The Binding of Isaac: Repentance. Isaac's shader system has specific requirements and quirks that differ from standard WebGL/OpenGL shader development.

## Table of Contents

1. [Understanding Isaac's Shader Architecture](#understanding-isaacs-shader-architecture)
2. [Required Attributes and Varyings](#required-attributes-and-varyings)
3. [The Attribute-Varying Pattern](#the-attribute-varying-pattern)
4. [Data Types and Precision](#data-types-and-precision)
5. [Tutorial: RandomColors Shader](#tutorial-randomcolors-shader)
6. [Common Patterns](#common-patterns)
7. [Lua Integration](#lua-integration)
8. [Debugging Tips](#debugging-tips)

---

## Understanding Isaac's Shader Architecture

### How Isaac Shaders Work

Unlike typical game engines where you pass shader parameters as uniforms, **Isaac passes custom parameters as vertex attributes**. This is a fundamental architectural decision that affects how you write every shader.

The data flow is:

```
Lua (MC_GET_SHADER_PARAMS) → Vertex Attributes → Vertex Shader → Varyings → Fragment Shader
```

### Why Attributes Instead of Uniforms?

Isaac's rendering pipeline batches draw calls for performance. Parameters are set per-instance using vertex attributes, allowing the GPU to process multiple entities with different parameter values in a single draw call.

**This means:**
- You CANNOT use `uniform` declarations for custom parameters
- Custom parameters MUST be declared as `attribute` in the vertex shader
- Parameters MUST be passed to the fragment shader via `varying` declarations

### Shader File Format

Isaac shaders are defined in XML files located in `content/shaders.xml`:

```xml
<shaders>
  <shader name="MyShader">
    <parameters>
      <param name="Time" type="float"/>
      <param name="PlayerPos" type="vec2"/>
    </parameters>
    <vertex><![CDATA[
      // Vertex shader GLSL code here
    ]]></vertex>
    <fragment><![CDATA[
      // Fragment shader GLSL code here
    ]]></fragment>
  </shader>
</shaders>
```

---

## Required Attributes and Varyings

Every Isaac shader receives a set of standard attributes from the engine. Your vertex shader must declare and handle these.

### Standard Vertex Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `Position` | `vec3` | Vertex position in normalized device coordinates (-1 to 1) |
| `Color` | `vec4` | Per-vertex color (RGBA, typically white for screen effects) |
| `TexCoord` | `vec2` | Texture coordinates (0 to 1) |
| `RenderData` | `vec4` | `.xy` = window size, `.zw` = texture size (in pixels) |
| `Scale` | `float` | Room zoom level (1.0 = no zoom) |

### Required Varyings

The fragment shader expects to receive these varyings from the vertex shader:

| Varying | Type | Description |
|---------|------|-------------|
| `Color0` | `vec4` | Passed from `Color` attribute |
| `TexCoord0` | `vec2` | Passed from `TexCoord` attribute |
| `RenderDataOut` | `vec4` | Passed from `RenderData` attribute |
| `ScaleOut` | `float` | Passed from `Scale` attribute |

### Standard Uniforms

Isaac provides these uniforms (these ARE uniforms, not attributes):

| Uniform | Type | Description |
|---------|------|-------------|
| `Transform` | `mat4` | Model-view-projection matrix |
| `Texture0` | `sampler2D` | The source texture being rendered |

---

## The Attribute-Varying Pattern

This is the most important pattern to understand. For every custom parameter, you must:

1. Declare it as an `attribute` in the vertex shader
2. Declare a corresponding `varying` with an "Out" suffix
3. Copy the attribute to the varying in `main()`
4. Declare and use the varying in the fragment shader

### Example: Single Float Parameter

**Vertex Shader:**
```glsl
// Standard attributes
attribute vec3 Position;
attribute vec4 Color;
attribute vec2 TexCoord;
attribute vec4 RenderData;
attribute float Scale;

// Custom parameter - MUST be an attribute
attribute float Brightness;

// Standard varyings
varying vec4 Color0;
varying vec2 TexCoord0;
varying vec4 RenderDataOut;
varying float ScaleOut;

// Custom varying to pass to fragment shader
varying float BrightnessOut;

uniform mat4 Transform;

void main(void) {
    // Pass standard attributes
    Color0 = Color;
    TexCoord0 = TexCoord;
    RenderDataOut = RenderData;
    ScaleOut = Scale;

    // Pass custom parameter to fragment shader
    BrightnessOut = Brightness;

    gl_Position = Transform * vec4(Position.xyz, 1.0);
}
```

**Fragment Shader:**
```glsl
// Standard varyings
varying lowp vec4 Color0;
varying mediump vec2 TexCoord0;
varying lowp vec4 RenderDataOut;
varying lowp float ScaleOut;

// Custom varying from vertex shader
varying lowp float BrightnessOut;

uniform sampler2D Texture0;

void main(void) {
    vec4 texColor = texture2D(Texture0, TexCoord0);
    gl_FragColor = Color0 * texColor * BrightnessOut;
}
```

### Example: Vec2 Parameter

**Vertex Shader (relevant parts):**
```glsl
attribute vec2 PlayerPos;      // Custom vec2 attribute
varying vec2 PlayerPosOut;     // Corresponding varying

void main(void) {
    PlayerPosOut = PlayerPos;  // Pass to fragment
    // ...
}
```

**Fragment Shader:**
```glsl
varying mediump vec2 PlayerPosOut;

void main(void) {
    float dist = distance(TexCoord0, PlayerPosOut);
    // ...
}
```

---

## Data Types and Precision

### Use Floats, Not Integers

Isaac's shader system expects **float types only** for custom parameters. The Lua API passes all numeric values as floats.

**Correct:**
```glsl
attribute float Time;
attribute vec2 Position;
```

**Incorrect:**
```glsl
attribute int Time;     // Won't work!
attribute ivec2 Position;  // Won't work!
```

### Precision Qualifiers

Mobile GPUs (and some integrated graphics) benefit from precision hints. Always use them in fragment shaders:

| Qualifier | Use For |
|-----------|---------|
| `lowp` | Colors, normalized values (0-1 range) |
| `mediump` | Texture coordinates, positions |
| `highp` | Time values, precise calculations (use sparingly) |

**Example:**
```glsl
varying lowp vec4 Color0;         // Color is 0-1 range
varying mediump vec2 TexCoord0;   // UVs need medium precision
varying lowp float ScaleOut;      // Scale is small range
varying mediump vec2 PlayerPosOut; // Position needs precision
varying lowp float TimeOut;       // Frame count, lowp often sufficient
```

### Literal Numbers

Always write float literals with decimal points:

**Correct:**
```glsl
float x = 0.5;
float y = 1.0;
float z = 0.0;
```

**Avoid (may cause issues):**
```glsl
float x = 0.5f;  // C++ style suffix - Isaac Studio converts these automatically
float y = 1;     // Integer literal - may cause type errors
```

---

## Tutorial: RandomColors Shader

Let's walk through the RandomColors example shader step by step.

### Goal

Create a shader that modifies RGB color channels based on:
- Player X position affects red channel
- Player Y position affects green channel
- Time affects blue channel with a sine wave

### Step 1: Define Parameters

In Isaac Shader Studio, add two parameters:
- `PlayerPos` (type: `playerpos`)
- `Time` (type: `time`, fps: 30)

### Step 2: Vertex Shader

```glsl
attribute vec3 Position;
attribute vec4 Color;
attribute vec2 TexCoord;
attribute vec4 RenderData;
attribute float Scale;

// Custom parameters as attributes
attribute vec2 PlayerPos;
attribute float Time;

// Standard varyings
varying vec4 Color0;
varying vec2 TexCoord0;
varying vec4 RenderDataOut;
varying float ScaleOut;

// Custom varyings
varying vec2 PlayerPosOut;
varying float TimeOut;

uniform mat4 Transform;

void main(void) {
    // Pass all standard data
    RenderDataOut = RenderData;
    ScaleOut = Scale;
    Color0 = Color;
    TexCoord0 = TexCoord;

    // Pass custom parameters
    PlayerPosOut = PlayerPos;
    TimeOut = Time;

    gl_Position = Transform * vec4(Position.xyz, 1.0);
}
```

**Key points:**
- `PlayerPos` is `vec2` because it contains X and Y coordinates
- `Time` is `float` representing the frame count
- Both are declared as `attribute` and passed via `varying`

### Step 3: Fragment Shader

```glsl
varying lowp vec4 Color0;
varying mediump vec2 TexCoord0;
varying lowp vec4 RenderDataOut;
varying lowp float ScaleOut;

// Custom varyings from vertex shader
varying mediump vec2 PlayerPosOut;
varying lowp float TimeOut;

uniform sampler2D Texture0;

void main(void) {
    // Sample the original texture
    vec4 texColor = Color0 * texture2D(Texture0, TexCoord0);

    // PlayerPosOut is in screen pixels from WorldToScreen()
    // Normalize to 0-1 range using texture dimensions
    vec2 normalizedPos = PlayerPosOut / RenderDataOut.zw;

    // Multiply color channels by normalized position
    texColor.r *= normalizedPos.x;  // Red increases left-to-right
    texColor.g *= normalizedPos.y;  // Green increases top-to-bottom

    // Animate blue channel with sine wave
    // abs() keeps it positive, TimeOut * 0.1 slows the animation
    texColor.b *= abs(sin(TimeOut * 0.1));

    gl_FragColor = texColor;
}
```

**Key points:**
- Receive varyings with `lowp`/`mediump` qualifiers
- Sample texture with `texture2D(Texture0, TexCoord0)`
- Multiply by `Color0` to respect vertex colors
- Normalize `PlayerPosOut` using `RenderDataOut.zw` (texture dimensions)
- `abs(sin(...))` keeps the blue channel positive (0 to 1 range)

### Step 4: Lua Callback

The generated Lua provides parameter values to Isaac:

```lua
local RandomColorsMod = RegisterMod("RandomColorsMod", 1)

function RandomColorsMod:GetShaderParams(shaderName)
    if shaderName == 'RandomColors' then
        local player = Isaac.GetPlayer()
        local screenPos = Isaac.WorldToScreen(player.Position)

        local params = {
            PlayerPos = { screenPos.X, screenPos.Y },
            Time = math.floor(Isaac.GetFrameCount() / 2)  -- 30fps from 60fps
        }
        return params
    end
end

RandomColorsMod:AddCallback(ModCallbacks.MC_GET_SHADER_PARAMS, RandomColorsMod.GetShaderParams)
```

---

## Common Patterns

### Passthrough Shader (No Effect)

The minimal shader that renders the texture unchanged:

**Vertex:**
```glsl
attribute vec3 Position;
attribute vec4 Color;
attribute vec2 TexCoord;
attribute vec4 RenderData;
attribute float Scale;

varying vec4 Color0;
varying vec2 TexCoord0;
varying vec4 RenderDataOut;
varying float ScaleOut;

uniform mat4 Transform;

void main(void) {
    Color0 = Color;
    TexCoord0 = TexCoord;
    RenderDataOut = RenderData;
    ScaleOut = Scale;
    gl_Position = Transform * vec4(Position.xyz, 1.0);
}
```

**Fragment:**
```glsl
varying lowp vec4 Color0;
varying mediump vec2 TexCoord0;
varying lowp vec4 RenderDataOut;
varying lowp float ScaleOut;

uniform sampler2D Texture0;

void main(void) {
    gl_FragColor = Color0 * texture2D(Texture0, TexCoord0);
}
```

### Spotlight Effect

Darken everything except near the player. Normalizes pixel coordinates to texture space:

```glsl
// Fragment shader
uniform sampler2D Texture0;
varying lowp vec4 Color0;
varying mediump vec2 TexCoord0;
varying lowp vec4 RenderDataOut;
varying mediump vec2 PlayerPosOut;  // Screen pixel coordinates

void main(void) {
    vec4 texColor = Color0 * texture2D(Texture0, TexCoord0);

    // Convert screen pixels to 0-1 range using texture dimensions
    vec2 center = PlayerPosOut / RenderDataOut.zw;

    // Account for aspect ratio to make spotlight circular
    float aspectRatio = RenderDataOut.z / RenderDataOut.w;
    vec2 diff = TexCoord0 - center;
    diff.x *= aspectRatio;
    float dist = length(diff);

    // Spotlight falloff (scaled by aspect ratio)
    float radius = 0.05 * aspectRatio;
    float softness = 0.16 * aspectRatio;
    float spotlight = smoothstep(radius + softness, radius, dist);

    // Ambient controls minimum brightness (0.2 = 20%)
    float ambient = 0.2;
    gl_FragColor = texColor * (ambient + (1.0 - ambient) * spotlight);
}
```

### Color Tint

Apply a color overlay:

```glsl
// Fragment shader
varying lowp vec3 TintColorOut;
varying lowp float TintStrengthOut;

void main(void) {
    vec4 texColor = Color0 * texture2D(Texture0, TexCoord0);
    vec3 tinted = mix(texColor.rgb, TintColorOut, TintStrengthOut);
    gl_FragColor = vec4(tinted, texColor.a);
}
```

### Screen-Space Distortion

Apply UV distortion for wave effects:

```glsl
// Fragment shader
varying lowp float TimeOut;
varying lowp float AmplitudeOut;
varying lowp float FrequencyOut;

void main(void) {
    vec2 uv = TexCoord0;
    uv.x += sin(uv.y * FrequencyOut + TimeOut) * AmplitudeOut;
    uv.y += cos(uv.x * FrequencyOut + TimeOut) * AmplitudeOut;
    gl_FragColor = Color0 * texture2D(Texture0, uv);
}
```

---

## Lua Integration

### The MC_GET_SHADER_PARAMS Callback

Isaac calls this callback every frame for each shader. Return a table with parameter values:

```lua
function MyMod:GetShaderParams(shaderName)
    if shaderName == 'MyShader' then
        return {
            ParamName = value,
            Vec2Param = { x, y },
            Vec3Param = { x, y, z },
            Vec4Param = { x, y, z, w }
        }
    end
end

MyMod:AddCallback(ModCallbacks.MC_GET_SHADER_PARAMS, MyMod.GetShaderParams)
```

### Getting Player Position

**Screen Coordinates** (default - for UI-relative effects):
```lua
local player = Isaac.GetPlayer()
local screenPos = Isaac.WorldToScreen(player.Position)
PlayerPos = { screenPos.X, screenPos.Y }
-- Range: roughly X: 72-397, Y: 50-217
```

**World Coordinates** (for gameplay-relative effects):
```lua
local player = Isaac.GetPlayer()
local playerPos = player.Position
PlayerPos = { playerPos.X, playerPos.Y }
-- Range: roughly X: 70-569, Y: 150-409
```

**Note**: These are raw pixel/world coordinates. To use them with texture coordinates in your shader, normalize using `RenderDataOut`:

```glsl
vec2 normalizedPos = PlayerPosOut / RenderDataOut.zw;
```

### Getting Time

```lua
-- Native 60fps frame count
local time = Isaac.GetFrameCount()

-- Convert to 30fps
local time30 = math.floor(Isaac.GetFrameCount() / 2)

-- Convert to custom fps
local targetFps = 24
local time24 = math.floor(Isaac.GetFrameCount() * targetFps / 60)
```

---

## Debugging Tips

### Shader Won't Compile

1. Check the Isaac Shader Studio console for error messages
2. Look for Isaac compatibility warnings (parameters as uniforms instead of attributes)
3. Verify all required attributes are declared
4. Check for missing varying declarations

### Shader Compiles but Looks Wrong

1. Verify varying names match between vertex and fragment shaders
2. Check precision qualifiers (use `mediump` for coordinates)
3. Ensure you're passing values through varyings, not using uniforms
4. Test with the RandomColors shader to verify the studio works

### Parameter Values Not Updating

1. Verify the Lua callback returns the correct shader name
2. Check that parameter names match exactly (case-sensitive)
3. Ensure the mod is properly loaded in Isaac
4. Add `print()` statements in Lua to debug values

### Colors Look Wrong

1. Remember to multiply by `Color0` for proper vertex color handling
2. Check if you're accidentally clamping values outside 0-1 range
3. Verify texture sampling uses correct coordinates

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using `uniform` for custom params | Use `attribute` + `varying` pattern |
| Missing `Out` suffix on varying | Match naming convention: `Param` → `ParamOut` |
| Integer literals in GLSL | Use `1.0` not `1` |
| Forgetting to multiply by Color0 | Always include `Color0 *` when sampling texture |
| Wrong precision for coordinates | Use `mediump` for vec2 positions/UVs |

---

## Summary

The key points for Isaac shader development:

1. **Attributes, not uniforms**: Custom parameters must be vertex attributes
2. **Varying passthrough**: Pass attributes to fragment shader via varyings
3. **Float types only**: Use float, vec2, vec3, vec4 - no integers
4. **Precision matters**: Use lowp/mediump/highp appropriately
5. **Required attributes**: Always include Position, Color, TexCoord, RenderData, Scale
6. **Multiply by Color0**: Respect vertex colors when sampling textures
7. **Lua callback**: Return parameter values from MC_GET_SHADER_PARAMS

Follow the RandomColors example as a template for your own shaders!
