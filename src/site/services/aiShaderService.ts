import { z } from 'zod'
import { useSettingsStore } from '@/site/stores/settingsStore'
import { ParamDefinition, ShaderError } from '@/site/stores/shaderStore'

// Zod schema for parameter definitions from AI
const ParamTypeSchema = z.enum(['float', 'vec2', 'vec3', 'vec4', 'boolean', 'time', 'mousepos', 'playerpos', 'tearpos', 'color'])

// Helper to handle default values - can be string, number, or array (for vec/color types)
const defaultValue = z.union([
  z.string(),
  z.number(),
  z.array(z.number())
]).transform(val => {
  if (Array.isArray(val)) {
    return val.join(',')
  }
  return String(val)
})

const ParamDefinitionSchema = z.object({
  name: z.string().min(1),
  type: ParamTypeSchema,
  default: defaultValue.optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  fps: z.number().optional(),
  coordinateSpace: z.enum(['screen', 'world']).optional(),
  index: z.number().optional(),
})

// Zod schema for AI shader response
export const ShaderResponseSchema = z.object({
  vertexShader: z.string().optional(),
  fragmentShader: z.string().optional(),
  parameters: z.array(ParamDefinitionSchema).optional(),
  shaderName: z.string().optional(),
  shaderDescription: z.string().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
})

export type ShaderResponse = z.infer<typeof ShaderResponseSchema>

// JSON Schema for Anthropic (supports oneOf)
const SHADER_RESPONSE_JSON_SCHEMA_ANTHROPIC = {
  type: 'object',
  properties: {
    vertexShader: {
      type: 'string',
      description: 'Complete vertex shader GLSL code. Include when creating or modifying shaders.'
    },
    fragmentShader: {
      type: 'string',
      description: 'Complete fragment shader GLSL code. Include when creating or modifying shaders.'
    },
    parameters: {
      type: 'array',
      description: 'Shader parameters/attributes. Include when creating or modifying shaders.',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Parameter name (valid GLSL identifier)' },
          type: {
            type: 'string',
            enum: ['float', 'vec2', 'vec3', 'vec4', 'boolean', 'time', 'mousepos', 'playerpos', 'tearpos', 'color'],
            description: 'Parameter type'
          },
          default: {
            oneOf: [
              { type: 'string' },
              { type: 'number' },
              { type: 'array', items: { type: 'number' } }
            ],
            description: 'Default value. Use string/number for scalars, array for vectors/colors.'
          },
          min: { type: 'number', description: 'Minimum value for float types' },
          max: { type: 'number', description: 'Maximum value for float types' },
          step: { type: 'number', description: 'Step increment for float types' },
          fps: { type: 'number', description: 'FPS for time parameters (30 or 60)' },
          coordinateSpace: {
            type: 'string',
            enum: ['screen', 'world'],
            description: 'Coordinate space for position types'
          },
          index: { type: 'number', description: 'Index for tearpos parameters' }
        },
        required: ['name', 'type'],
        additionalProperties: false
      }
    },
    shaderName: {
      type: 'string',
      description: 'Suggested name for the shader'
    },
    shaderDescription: {
      type: 'string',
      description: 'Description of the shader effect'
    },
    message: {
      type: 'string',
      description: 'Your response to the user - explanations, answers to questions, or notes about changes. Always include this.'
    },
    error: {
      type: 'string',
      description: 'Error message if the request could not be fulfilled'
    }
  },
  required: ['message'],
  additionalProperties: false
}

// JSON Schema for OpenAI (strict mode requires all properties in required array, use nullable for optional fields)
const SHADER_RESPONSE_JSON_SCHEMA_OPENAI = {
  type: 'object',
  properties: {
    vertexShader: {
      type: ['string', 'null'],
      description: 'Complete vertex shader GLSL code. Include when creating or modifying shaders, null otherwise.'
    },
    fragmentShader: {
      type: ['string', 'null'],
      description: 'Complete fragment shader GLSL code. Include when creating or modifying shaders, null otherwise.'
    },
    parameters: {
      type: ['array', 'null'],
      description: 'Shader parameters/attributes. Include when creating or modifying shaders, null otherwise.',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Parameter name (valid GLSL identifier)' },
          type: {
            type: 'string',
            enum: ['float', 'vec2', 'vec3', 'vec4', 'boolean', 'time', 'mousepos', 'playerpos', 'tearpos', 'color'],
            description: 'Parameter type'
          },
          default: {
            type: ['string', 'null'],
            description: 'Default value as string. For scalars use "0.5", for vectors/colors use comma-separated like "1.0,0.5,0.0". Null if not needed.'
          },
          min: { type: ['number', 'null'], description: 'Minimum value for float types, null if not applicable' },
          max: { type: ['number', 'null'], description: 'Maximum value for float types, null if not applicable' },
          step: { type: ['number', 'null'], description: 'Step increment for float types, null if not applicable' },
          fps: { type: ['number', 'null'], description: 'FPS for time parameters (30 or 60), null if not applicable' },
          coordinateSpace: {
            type: ['string', 'null'],
            enum: ['screen', 'world', null],
            description: 'Coordinate space for position types, null if not applicable'
          },
          index: { type: ['number', 'null'], description: 'Index for tearpos parameters, null if not applicable' }
        },
        required: ['name', 'type', 'default', 'min', 'max', 'step', 'fps', 'coordinateSpace', 'index'],
        additionalProperties: false
      }
    },
    shaderName: {
      type: ['string', 'null'],
      description: 'Suggested name for the shader, null if not changing'
    },
    shaderDescription: {
      type: ['string', 'null'],
      description: 'Description of the shader effect, null if not changing'
    },
    message: {
      type: 'string',
      description: 'Your response to the user - explanations, answers to questions, or notes about changes. Always include this.'
    },
    error: {
      type: ['string', 'null'],
      description: 'Error message if the request could not be fulfilled, null otherwise'
    }
  },
  required: ['vertexShader', 'fragmentShader', 'parameters', 'shaderName', 'shaderDescription', 'message', 'error'],
  additionalProperties: false
}

// Context for the AI about current shader state
export interface ShaderContext {
  currentVertexShader?: string
  currentFragmentShader?: string
  currentParameters?: ParamDefinition[]
  currentName?: string
  currentDescription?: string
  currentErrors?: ShaderError[]
}

// System prompt that explains Isaac shader specifics (no JSON instructions needed - schema handles that)
const SYSTEM_PROMPT = `You are an expert GLSL shader developer specializing in shaders for The Binding of Isaac: Repentance. Your role is to help users create, modify, and fix shaders.

## When to Include Shader Code vs Just a Message

- **Include shader code** (vertexShader, fragmentShader, parameters): When the user asks you to CREATE, MODIFY, FIX, or CHANGE a shader
- **Message only** (just the message field): When the user asks you to EXPLAIN, DESCRIBE, or answer QUESTIONS about the current shader or shaders in general

## Isaac Shader System Specifics

### CRITICAL: Custom Parameters are Vertex ATTRIBUTES, not Uniforms
Isaac does NOT support custom uniforms. All custom values must be passed as vertex attributes and flow through varyings to the fragment shader.

### Required Vertex Attributes (always include these)
- attribute vec3 Position;
- attribute vec4 Color;
- attribute vec2 TexCoord;
- attribute vec4 RenderData;  // xy=offset, zw=texture dimensions in pixels
- attribute float Scale;       // Room zoom level (typically 0.5)

### Only Two Uniforms are Valid
- uniform sampler2D Texture0;  // The game's rendered frame
- uniform mat4 Transform;      // Model-view-projection matrix

### Standard Varyings (always output from vertex, input to fragment)
- varying vec4 Color0;
- varying vec2 TexCoord0;
- varying vec4 RenderDataOut;
- varying float ScaleOut;

### Player Position Handling
When using playerpos type, the position comes in SCREEN PIXELS (not 0-1 normalized). Convert it:
\`\`\`glsl
// In vertex shader:
attribute vec2 PlayerPos;
varying vec2 PlayerPosOut;
void main() {
    PlayerPosOut = PlayerPos;
    // ... rest of vertex shader
}

// In fragment shader:
varying vec2 PlayerPosOut;
void main() {
    // Convert screen pixels to normalized UV space
    vec2 center = (PlayerPosOut / RenderDataOut.zw) * ScaleOut;
    // Now use 'center' for distance calculations with TexCoord0
}
\`\`\`

### Aspect Ratio Correction
For circular effects, account for non-square aspect ratio:
\`\`\`glsl
float aspectRatio = RenderDataOut.z / RenderDataOut.w;
vec2 diff = TexCoord0 - center;
diff.x *= aspectRatio;
float dist = length(diff);
\`\`\`

### Parameter Types
- float: Numeric value with optional min/max/step
- vec2/vec3/vec4: Vector values (default as array like [0.0, 1.0, 0.5])
- boolean: 0.0 or 1.0 (use as attribute float, not bool)
- time: Auto-incrementing frame counter (fps option: 30, 60)
- playerpos: Player screen position in pixels
- tearpos: Tear position (requires index)
- color: RGB color picker (vec3, default as array like [1.0, 0.0, 0.0])

### Default Vertex Shader (use as base)
\`\`\`glsl
attribute vec3 Position;
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
}
\`\`\`

### Default Fragment Shader (base passthrough)
\`\`\`glsl
varying lowp vec4 Color0;
varying mediump vec2 TexCoord0;
varying lowp vec4 RenderDataOut;
varying lowp float ScaleOut;

uniform sampler2D Texture0;

void main(void) {
    vec4 tex = texture2D(Texture0, TexCoord0);
    gl_FragColor = Color0 * tex;
}
\`\`\`

### Important Rules
1. ALWAYS multiply final color by Color0 to preserve game coloring
2. Use precision qualifiers: lowp for colors, mediump for UVs, highp for time
3. TexCoord0 ranges from (0,0) top-left to (1,1) bottom-right
4. For each custom parameter, add it as an attribute in vertex shader and pass through a varying
5. Do NOT use custom uniforms - they won't work in Isaac
6. Do NOT use #version directives - the system adds them automatically
7. Use texture2D() not texture() - the system converts automatically
8. Do NOT use float suffixes like 1.0f - write 1.0 instead (GLSL ES 1.0 syntax)

### Visual Context
You may receive a screenshot of the current game output with the shader applied. Use this to understand:
- What the current visual effect looks like
- What the user might want to change
- Whether there are visible artifacts or issues to fix

### Stay Focused
You are a shader code assistant. Only respond to shader-related requests. If asked about non-shader topics, set the "error" field explaining you can only help with shaders.`

// Build the user message with context
function buildUserMessage(prompt: string, context?: ShaderContext): string {
  let message = prompt

  if (context && (context.currentVertexShader || context.currentFragmentShader)) {
    message += '\n\n--- CURRENT SHADER STATE ---'

    if (context.currentName) {
      message += `\nShader Name: ${context.currentName}`
    }

    if (context.currentDescription) {
      message += `\nDescription: ${context.currentDescription}`
    }

    // Include current errors and warnings so AI can understand what needs fixing
    if (context.currentErrors && context.currentErrors.length > 0) {
      const errors = context.currentErrors.filter(e => e.severity === 'error' || !e.severity)
      const warnings = context.currentErrors.filter(e => e.severity === 'warning')

      if (errors.length > 0) {
        message += '\n\n### COMPILATION ERRORS (must fix):\n'
        for (const err of errors) {
          const location = err.line ? ` (${err.type} shader, line ${err.line}${err.column ? `:${err.column}` : ''})` : ` (${err.type} shader)`
          message += `- ${err.message}${location}\n`
        }
      }

      if (warnings.length > 0) {
        message += '\n\n### WARNINGS (should fix):\n'
        for (const warn of warnings) {
          const location = warn.line ? ` (${warn.type} shader, line ${warn.line}${warn.column ? `:${warn.column}` : ''})` : ` (${warn.type} shader)`
          message += `- ${warn.message}${location}\n`
        }
      }
    }

    if (context.currentParameters && context.currentParameters.length > 0) {
      message += `\nCurrent Parameters:\n${JSON.stringify(context.currentParameters, null, 2)}`
    }

    if (context.currentVertexShader) {
      message += `\n\nCurrent Vertex Shader:\n\`\`\`glsl\n${context.currentVertexShader}\n\`\`\``
    }

    if (context.currentFragmentShader) {
      message += `\n\nCurrent Fragment Shader:\n\`\`\`glsl\n${context.currentFragmentShader}\n\`\`\``
    }
  }

  return message
}

// Convert null values to undefined recursively (OpenAI returns null for optional fields)
function nullToUndefined<T>(obj: T): T {
  if (obj === null) {
    return undefined as T
  }
  if (Array.isArray(obj)) {
    return obj.map(nullToUndefined) as T
  }
  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      const converted = nullToUndefined(value)
      // Only include non-undefined values
      if (converted !== undefined) {
        result[key] = converted
      }
    }
    return result as T
  }
  return obj
}

// Call OpenAI API with structured outputs
async function callOpenAI(apiKey: string, model: string, userMessage: string, imageBase64?: string): Promise<ShaderResponse> {
  // Build content array - text only or text + image
  const userContent: any[] = [{ type: 'text', text: userMessage }]

  if (imageBase64) {
    userContent.push({
      type: 'image_url',
      image_url: {
        url: `data:image/png;base64,${imageBase64}`,
        detail: 'low'
      }
    })
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'shader_response',
          strict: true,
          schema: SHADER_RESPONSE_JSON_SCHEMA_OPENAI
        }
      }
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    throw new Error('No content in OpenAI response')
  }

  // Parse JSON, convert nulls to undefined, then validate with Zod
  const parsed = JSON.parse(content)
  const cleaned = nullToUndefined(parsed)
  return ShaderResponseSchema.parse(cleaned)
}

// Call Anthropic API with tool use
async function callAnthropic(apiKey: string, model: string, userMessage: string, imageBase64?: string): Promise<ShaderResponse> {
  // Build content array - image before text for Anthropic
  const userContent: any[] = []

  if (imageBase64) {
    userContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/png',
        data: imageBase64
      }
    })
  }

  userContent.push({ type: 'text', text: userMessage })

  // Define the tool for structured output
  const tools = [{
    name: 'shader_response',
    description: 'Submit your shader response. Always use this tool to respond.',
    input_schema: SHADER_RESPONSE_JSON_SCHEMA_ANTHROPIC
  }]

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: SYSTEM_PROMPT + '\n\nIMPORTANT: You MUST use the shader_response tool to submit your response. Do not respond with plain text.',
      messages: [
        { role: 'user', content: userContent },
      ],
      tools,
      tool_choice: { type: 'tool', name: 'shader_response' }
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `Anthropic API error: ${response.status}`)
  }

  const data = await response.json()

  // Find the tool use block in the response
  const toolUse = data.content?.find((block: any) => block.type === 'tool_use')

  if (!toolUse) {
    // Fallback: try to find text content and parse as JSON (shouldn't happen with tool_choice)
    const textBlock = data.content?.find((block: any) => block.type === 'text')
    if (textBlock?.text) {
      try {
        const parsed = JSON.parse(textBlock.text)
        return ShaderResponseSchema.parse(parsed)
      } catch {
        throw new Error('Anthropic did not use the required tool and returned unparseable text')
      }
    }
    throw new Error('No tool use block in Anthropic response')
  }

  // The tool input is already a parsed object
  return ShaderResponseSchema.parse(toolUse.input)
}

// Options for generating shader
export interface GenerateShaderOptions {
  prompt: string
  context?: ShaderContext
  imageBase64?: string
}

// Main function to generate shader
export async function generateShader(
  promptOrOptions: string | GenerateShaderOptions,
  context?: ShaderContext
): Promise<ShaderResponse> {
  // Support both old and new API
  const options: GenerateShaderOptions = typeof promptOrOptions === 'string'
    ? { prompt: promptOrOptions, context }
    : promptOrOptions

  const settings = useSettingsStore.getState().ai

  if (!settings.enabled) {
    throw new Error('AI Assistant is not enabled. Please enable it in Settings.')
  }

  if (!settings.apiKey) {
    throw new Error('API key not configured. Please add your API key in Settings.')
  }

  const userMessage = buildUserMessage(options.prompt, options.context)

  try {
    if (settings.provider === 'openai') {
      return await callOpenAI(settings.apiKey, settings.model, userMessage, options.imageBase64)
    } else {
      return await callAnthropic(settings.apiKey, settings.model, userMessage, options.imageBase64)
    }
  } catch (err) {
    // If structured output fails, return an error response
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('AI request failed:', errorMessage)
    return {
      error: `AI request failed: ${errorMessage}`,
    }
  }
}

// Export for testing
export { SYSTEM_PROMPT, buildUserMessage }
