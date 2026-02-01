# Isaac Shader Studio - User Guide

Isaac Shader Studio is a browser-based development environment for creating custom shaders for The Binding of Isaac: Repentance. It provides a live preview using a game simulation, so you can see your shaders in action as you develop them.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Interface Overview](#interface-overview)
3. [Live Preview](#live-preview)
4. [Working with Shaders](#working-with-shaders)
5. [Parameter Types](#parameter-types)
6. [Saving and Loading](#saving-and-loading)
7. [Exporting Your Mod](#exporting-your-mod)
8. [Tips and Best Practices](#tips-and-best-practices)

---

## Getting Started

Open `public/index.html` in a modern web browser (Chrome, Firefox, Edge recommended). The application runs entirely in your browser with no server required.

The interface is split into two main areas:
- **Left Panel**: Shader editor with tabs for vertex/fragment shaders and parameters
- **Right Panel**: Live game preview showing your shader in action

## Interface Overview

### Editor Panel (Left)

The editor panel contains three tabs:

#### Vertex Shader Tab
The vertex shader processes each vertex and passes data to the fragment shader. For most screen-space effects, you'll use a standard passthrough vertex shader that forwards attributes as varyings.

#### Fragment Shader Tab
The fragment shader is where most visual effects happen. It runs for every pixel and determines the final color output.

#### Parameters Tab
Define custom parameters that your shader uses. These become available in both your shader code and in the generated Lua mod.

### Preview Panel (Right)

- **Game Canvas**: A playable game simulation with your shader applied in real-time
- **Stats Display**: Shows FPS, frame count, and player position
- **Viewport Controls**: Play/Pause button for the shader animation

### Toolbar

- **Shader Name**: Enter a name for your shader (required for export)
- **Description**: Optional description that appears in generated code comments
- **Load Shader**: Dropdown to load example shaders or your saved shaders
- **Save**: Save the current shader to browser storage
- **Delete**: Remove a saved shader (only visible when a saved shader is loaded)
- **Compile**: Compile and apply your shader to the preview
- **View Mod**: Preview and download the generated mod files

## Live Preview

The live preview shows a simplified recreation of The Binding of Isaac's gameplay. This allows you to:

- **Test player-reactive shaders**: Move the player character to see how shaders respond to player position
- **Test animated shaders**: Watch time-based effects animate in real-time
- **Iterate quickly**: Make changes and see results immediately after compiling

### Controls

- **Arrow Keys / WASD**: Move the player character
- **Mouse**: When using `mousepos` parameters, tracks cursor position over the preview

### Stats Display

The stats box shows:
- **FPS**: Frames per second the shader is rendering
- **FRAME**: Total frame count since shader started (useful for time-based effects)
- **Player**: Current player screen coordinates (useful for debugging position-based effects)

## Working with Shaders

### Creating a New Shader

1. Select "-- New Shader --" from the Load Shader dropdown
2. Enter a name for your shader
3. Add parameters in the Parameters tab if needed
4. Write your vertex and fragment shader code
5. Click **Compile** to test your shader

### Editing Shaders

1. Make changes in the vertex or fragment shader editors
2. Click **Compile** to apply changes
3. The preview updates immediately with your new shader

### Error Handling

If your shader has errors:
- Error messages appear in the console at the bottom of the editor panel
- The error line is highlighted in the editor
- Isaac compatibility warnings show issues that will prevent the shader from working in-game

## Parameter Types

Parameters let you pass dynamic values to your shader. Add them in the Parameters tab.

### Basic Types

| Type | Description | GLSL Type | UI Control |
|------|-------------|-----------|------------|
| `float` | Single number | `float` | Slider with min/max/step |
| `vec2` | 2D vector | `vec2` | Text input (x, y) |
| `vec3` | 3D vector | `vec3` | Text input (x, y, z) |
| `vec4` | 4D vector | `vec4` | Text input (x, y, z, w) |
| `boolean` | On/Off toggle | `float` (0.0 or 1.0) | Checkbox |
| `color` | RGB color picker | `vec3` | Color picker |

### Special Types

| Type | Description | Options |
|------|-------------|---------|
| `time` | Frame counter | **FPS**: Target frame rate (default 60, Isaac's native rate) |
| `playerpos` | Player position | **Coordinate Space**: Screen or World (affects generated Lua only) |
| `mousepos` | Mouse position | Normalized 0-1 coordinates over the canvas |

**Important**: The `playerpos` parameter provides **pixel coordinates** matching Isaac's coordinate systems. The "Coordinate Space" setting determines which Isaac API is used:
- **Screen**: Uses `Isaac.WorldToScreen()` - screen pixel coordinates
- **World**: Uses `player.Position` - world unit coordinates

To use player position with texture coordinates, normalize in your shader: `PlayerPosOut / RenderDataOut.zw`

### Using Parameters in Shaders

Parameters must be declared as **attributes** in the vertex shader and passed to the fragment shader via **varyings**. This is how Isaac's shader system works.

```glsl
// Vertex shader
attribute float MyParam;      // Receive parameter as attribute
varying float MyParamOut;     // Declare varying to pass to fragment

void main(void) {
    MyParamOut = MyParam;     // Pass to fragment shader
    // ... rest of vertex shader
}

// Fragment shader
varying lowp float MyParamOut;  // Receive from vertex shader

void main(void) {
    // Use MyParamOut in your calculations
}
```

## Saving and Loading

### Saving a Shader

1. Enter a shader name (required)
2. Optionally add a description
3. Click **Save**

Shaders are saved to your browser's local storage and persist between sessions.

### Loading a Shader

Use the "Load Shader" dropdown to select from:
- **Saved Shaders**: Your previously saved shaders (most recent first)
- **Example Shaders**: Built-in example shaders to learn from

### Unsaved Changes

The editor tracks your changes. If you have unsaved modifications:
- A confirmation dialog appears when loading a different shader
- The browser warns you before leaving the page

### Deleting a Shader

1. Load the saved shader you want to delete
2. Click the **Delete** button (red trash icon)
3. Confirm deletion

## Exporting Your Mod

### Viewing Generated Files

Click **View Mod** to see the generated mod files:

1. **metadata.xml**: Mod metadata for Isaac's mod loader
2. **main.lua**: Lua code that passes parameters to your shader
3. **shaders.xml**: Your shader code in Isaac's XML format

You can edit these files in the modal before downloading.

### Downloading the Mod

1. Click **Download Mod** in the View Mod modal
2. A ZIP file downloads containing:
   ```
   YourShaderMod.zip
   ├── metadata.xml
   ├── main.lua
   └── content/
       └── shaders.xml
   ```
3. Extract to your Isaac mods folder: `Documents/My Games/Binding of Isaac Repentance/mods/`

### Mod Structure

The generated mod includes:
- Shader XML with vertex and fragment code
- Lua callback that provides parameter values each frame
- Metadata for the Steam Workshop

## Tips and Best Practices

### Performance

- Keep fragment shader calculations simple - they run for every pixel
- Use `lowp` and `mediump` precision qualifiers appropriately
- Avoid expensive operations like `pow()`, `sqrt()` in tight loops

### Isaac Compatibility

The studio validates your shader for Isaac compatibility:

- **Parameters must be attributes**: Isaac passes custom parameters as vertex attributes, not uniforms
- **Use varyings for fragment access**: Pass attribute values through varyings to use in fragment shader
- **Required attributes**: Include `Position`, `Color`, `TexCoord`, `RenderData`, `Scale`
- **Float suffixes**: The studio automatically converts `0.5f` to `0.5` for WebGL compatibility

### Debugging

- Use the player position display to verify coordinate math
- The frame counter helps debug time-based effects
- Check the console for shader compilation errors and warnings

### Learning from Examples

The example shaders demonstrate common techniques:

- **Simple**: Basic passthrough shader (good starting template)
- **Spotlight**: Player-position-based lighting effect
- **Tint**: Color overlay effect
- **Wave**: Animated distortion using sine waves
- **Water**: Complex animated 3D water surface effect
- **RandomColors**: Uses player position and time to modify colors

Load these examples and study their code to learn Isaac shader patterns.

---

## Quick Reference

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Arrow Keys / WASD | Move player in preview |
| Ctrl+Enter | Compile shader (when editor focused) |

### Common GLSL Functions

```glsl
texture2D(sampler, coord)  // Sample texture
mix(a, b, t)               // Linear interpolation
smoothstep(e0, e1, x)      // Smooth Hermite interpolation
sin(x), cos(x)             // Trigonometry
distance(a, b)             // Euclidean distance
normalize(v)               // Unit vector
dot(a, b)                  // Dot product
```

### Isaac Built-in Uniforms

| Uniform | Type | Description |
|---------|------|-------------|
| `Transform` | `mat4` | Model-view-projection matrix |
| `Texture0` | `sampler2D` | Source texture (game render) |

### Isaac Built-in Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `Position` | `vec3` | Vertex position (NDC) |
| `Color` | `vec4` | Vertex color (RGBA) |
| `TexCoord` | `vec2` | Texture coordinates (UV) |
| `RenderData` | `vec4` | Window/texture dimensions |
| `Scale` | `float` | Room zoom level |
