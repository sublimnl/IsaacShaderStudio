/* eslint-disable no-control-regex */
import { useCallback, useState } from 'react'
import { useShaderStore, ParamDefinition, ParamType, ShaderError, SavedShader } from '@/site/stores/shaderStore'
import { lintGLSL, findErrorLocation, findAllErrorLocations } from '@/site/utils/glslLinter'
import { formatGLSL } from '@/site/utils/glslFormatter'

// Type for shader manifest entries
interface ManifestEntry {
  id: string
  label: string
  description?: string
}

// Interfaces for dynamically loaded ShaderStudio module
interface StudioInstance {
  isInitialized(): boolean
  compileWithCode(vertex: string, fragment: string, params: ParamDefinition[]): boolean
  setParameter(name: string, value: number | number[]): void
  disable(): void
}

interface StudioModule {
  Studio: StudioInstance
}

// Reference to the ShaderStudio singleton
let studioInstance: StudioInstance | null = null
let studioModule: StudioModule | null = null

export function useShaderStudio() {
  const [isInitialized, setIsInitialized] = useState(false)
  const {
    vertexCode,
    fragmentCode,
    parameters,
    shaderName,
    shaderDescription,
    setShaderExamples,
    addConsoleMessage,
    setIsCompiled,
    loadShader,
  } = useShaderStore()

  // Initialize connection to ShaderStudio
  const initialize = useCallback(async () => {
    if (studioInstance) {
      setIsInitialized(true)
      return studioInstance
    }

    try {
      // Import the ShaderStudio module
      const imports = await import('../../demo/imports')
      studioModule = imports.ShaderStudio
      studioInstance = studioModule.Studio

      // Check if it's already initialized
      if (studioInstance.isInitialized()) {
        setIsInitialized(true)
        addConsoleMessage('info', 'Connected to ShaderStudio')
      }

      return studioInstance
    } catch (error) {
      console.error('Failed to connect to ShaderStudio:', error)
      addConsoleMessage('error', `Failed to connect to ShaderStudio: ${error}`)
      return null
    }
  }, [addConsoleMessage])

  // Format error message for console display
  const formatErrorMessage = (err: ShaderError): string => {
    const shaderType = err.type === 'vertex' ? 'Vertex Shader'
      : err.type === 'fragment' ? 'Fragment Shader'
        : 'Linker'

    if (err.line !== undefined) {
      const location = err.column !== undefined
        ? `line ${err.line}, col ${err.column}`
        : `line ${err.line}`
      return `${shaderType} (${location}) — ${err.message}`
    }

    return `${shaderType} — ${err.message}`
  }

  // Parse shader error messages to extract line numbers and try to find column positions
  const parseShaderError = (errorMessage: string, vertexCode: string, fragmentCode: string): ShaderError[] => {
    const errors: ShaderError[] = []

    // Determine shader type from error message
    let shaderType: 'vertex' | 'fragment' | 'linker' = 'linker'
    if (errorMessage.toLowerCase().includes('vertex shader')) {
      shaderType = 'vertex'
    } else if (errorMessage.toLowerCase().includes('fragment shader')) {
      shaderType = 'fragment'
    } else if (errorMessage.toLowerCase().includes('link') || errorMessage.toLowerCase().includes('program')) {
      shaderType = 'linker'
    }

    // Get the source code lines for column detection
    const sourceLines = shaderType === 'vertex'
      ? vertexCode.split('\n')
      : shaderType === 'fragment'
        ? fragmentCode.split('\n')
        : []

    // Extract the actual error part (after "vertex shader error:" or "fragment shader error:")
    const errorPart = errorMessage.replace(/^(vertex|fragment)\s+shader\s+error:\s*/i, '')

    // WebGL error format: ERROR: 0:LINE: message
    // The format is: ERROR: <shader_index>:<line_number>: <message>
    // Split by ERROR: to handle multiple errors
    const errorSegments = errorPart.split(/ERROR:\s*/).filter(s => s.trim())

    // Track which locations we've used for each line to handle multiple same errors
    const usedLocationsPerLine: Map<number, Set<string>> = new Map()

    for (const segment of errorSegments) {
      // Match pattern: 0:29: 'message here'
      const match = segment.match(/^(\d+):(\d+):\s*(.+)$/s)
      if (match) {
        const lineNum = Number.parseInt(match[2], 10)
        // Strip whitespace and control characters (including trailing block chars)
        const message = match[3].trim().replace(/[\x00-\x1F\x7F]/g, '')

        // The line number from WebGL, adjust for preprocessor lines
        // Fragment shaders get 3 lines added: #version, precision, out vec4 FragColor
        // Vertex shaders get 1 line added: #version
        const preprocessorLines = shaderType === 'fragment' ? 3 : 1
        const adjustedLine = Math.max(1, lineNum - preprocessorLines)

        // Try to find column position and range using pattern matching
        let column: number | undefined
        let endColumn: number | undefined

        if (adjustedLine <= sourceLines.length) {
          const sourceLine = sourceLines[adjustedLine - 1]

          // Find all possible locations for this error type
          const allLocations = findAllErrorLocations(message, sourceLine)

          if (allLocations.length > 0) {
            // Get or create the set of used locations for this line
            if (!usedLocationsPerLine.has(adjustedLine)) {
              usedLocationsPerLine.set(adjustedLine, new Set())
            }
            const usedLocations = usedLocationsPerLine.get(adjustedLine)!

            // Find the first unused location
            for (const loc of allLocations) {
              const locKey = `${loc.column}-${loc.endColumn}`
              if (!usedLocations.has(locKey)) {
                column = loc.column
                endColumn = loc.endColumn
                usedLocations.add(locKey)
                break
              }
            }
          }

          // Fall back to single location detection if no multiple matches
          if (column === undefined) {
            const location = findErrorLocation(message, sourceLine)
            if (location) {
              column = location.column
              endColumn = location.endColumn
            }
          }
        }

        errors.push({
          type: shaderType,
          line: adjustedLine,
          column: column,
          endColumn: endColumn,
          message: message,
          source: 'webgl'
        })
      } else if (segment.trim()) {
        // No line number found, add the whole segment
        errors.push({
          type: shaderType,
          message: segment.trim().replace(/[\x00-\x1F\x7F]/g, ''),
          source: 'webgl'
        })
      }
    }

    // If no errors parsed, add the whole message
    if (errors.length === 0) {
      errors.push({
        type: shaderType,
        message: errorPart.trim().replace(/[\x00-\x1F\x7F]/g, ''),
        source: 'webgl'
      })
    }

    return errors
  }

  // Compile shader
  const compile = useCallback(async () => {
    const { setShaderErrors, clearShaderErrors } = useShaderStore.getState()

    // Clear previous errors
    clearShaderErrors()

    // Get fresh values from store to avoid stale closure values
    const { vertexCode: vert, fragmentCode: frag, parameters: params } = useShaderStore.getState()

    // Step 1: Run the GLSL parser/linter for syntax errors (provides column info)
    addConsoleMessage('info', 'Linting shader...')

    const vertexLintErrors = lintGLSL(vert, 'vertex')
    const fragmentLintErrors = lintGLSL(frag, 'fragment')
    const allLintErrors: ShaderError[] = [
      ...vertexLintErrors.map(e => ({ ...e, source: 'parser' as const })),
      ...fragmentLintErrors.map(e => ({ ...e, source: 'parser' as const }))
    ]

    // Separate actual errors from warnings
    const actualErrors = allLintErrors.filter(e => e.severity !== 'warning')
    const warnings = allLintErrors.filter(e => e.severity === 'warning')

    // Set all errors/warnings for editor display
    if (allLintErrors.length > 0) {
      console.log('[useShaderStudio] Lint errors/warnings:', allLintErrors)
      setShaderErrors(allLintErrors)
    }

    // Add warnings to console (but don't block compilation)
    warnings.forEach(err => {
      const errorLocation = err.type !== 'linker' && err.line
        ? { shaderType: err.type as 'vertex' | 'fragment', line: err.line, column: err.column }
        : undefined
      addConsoleMessage('warning', formatErrorMessage(err), errorLocation)
    })

    // Only block compilation for actual errors
    if (actualErrors.length > 0) {
      // Add each error to console with column info and clickable location
      actualErrors.forEach(err => {
        const errorLocation = err.type !== 'linker' && err.line
          ? { shaderType: err.type as 'vertex' | 'fragment', line: err.line, column: err.column }
          : undefined
        addConsoleMessage('error', formatErrorMessage(err), errorLocation)
      })

      setIsCompiled(false)
      return false
    }

    // Step 2: Try to initialize WebGL if not already done
    if (!studioInstance) {
      try {
        const imports = await import('../../demo/imports')
        studioModule = imports.ShaderStudio
        studioInstance = studioModule.Studio
      } catch (error) {
        addConsoleMessage('error', `Failed to connect to ShaderStudio: ${error}`)
        return false
      }
    }

    if (!studioInstance || !studioInstance.isInitialized()) {
      addConsoleMessage('error', 'ShaderStudio not initialized - game may still be loading')
      return false
    }

    // Step 3: Compile with WebGL for semantic validation
    try {
      addConsoleMessage('info', 'Compiling shader...')

      // Use the new compileWithCode method
      const success = studioInstance.compileWithCode(vert, frag, params)

      if (success) {
        addConsoleMessage('success', 'Shader compiled successfully!')
        setIsCompiled(true)

        // Sync runtime values to the shader renderer after successful compilation
        const { runtimeValues } = useShaderStore.getState()
        Object.entries(runtimeValues).forEach(([name, value]) => {
          try {
            studioInstance?.setParameter(name, value)
          } catch {
            // Parameter may not exist yet, ignore
          }
        })

        return true
      } else {
        addConsoleMessage('error', 'Compilation failed')
        setIsCompiled(false)
        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.log('[useShaderStudio] Compilation error:', errorMessage)

      // Parse WebGL errors with column detection from pattern matching
      const parsedErrors = parseShaderError(errorMessage, vert, frag)
      console.log('[useShaderStudio] Parsed errors:', parsedErrors)

      // Merge WebGL errors with existing warnings (don't overwrite them)
      setShaderErrors([...warnings, ...parsedErrors])

      // Add each error to console with column info and clickable location
      parsedErrors.forEach(err => {
        const errorLocation = err.type !== 'linker' && err.line
          ? { shaderType: err.type as 'vertex' | 'fragment', line: err.line, column: err.column }
          : undefined
        addConsoleMessage('error', formatErrorMessage(err), errorLocation)
      })

      setIsCompiled(false)
      return false
    }
  }, [addConsoleMessage, setIsCompiled])

  // Load shader examples manifest
  const loadShaderManifest = useCallback(async () => {
    try {
      const response = await fetch('/shaders/manifest.json')
      if (!response.ok) {
        throw new Error('Failed to load shader manifest')
      }
      const manifest = await response.json()

      const examples = manifest.shaders.map((entry: ManifestEntry) => ({
        id: entry.id,
        name: entry.label,
        description: entry.description,
      }))

      setShaderExamples(examples)
      return manifest
    } catch (error) {
      console.error('Failed to load shader manifest:', error)
      // Try to load from example XML files directly
      return null
    }
  }, [setShaderExamples])

  // Load a specific shader by ID
  const loadShaderById = useCallback(async (shaderId: string) => {
    try {
      addConsoleMessage('info', `Loading shader: ${shaderId}`)

      const response = await fetch(`/shaders/${shaderId}.xml`)
      if (!response.ok) {
        throw new Error(`Failed to load shader: ${shaderId}`)
      }

      const xmlText = await response.text()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

      const shaderEl = xmlDoc.querySelector('shader')
      if (!shaderEl) {
        throw new Error('Invalid shader XML: no <shader> element')
      }

      const name = shaderEl.getAttribute('name') || shaderId
      const description = shaderEl.getAttribute('description') || ''

      // Parse parameters
      const params: ParamDefinition[] = []
      const paramEls = shaderEl.querySelectorAll('parameters > param')
      paramEls.forEach((paramEl) => {
        const param: ParamDefinition = {
          name: paramEl.getAttribute('name') || '',
          type: (paramEl.getAttribute('studioType') || paramEl.getAttribute('type') || 'float') as ParamType,
        }

        const defaultVal = paramEl.getAttribute('default')
        if (defaultVal) param.default = defaultVal

        const min = paramEl.getAttribute('min')
        if (min) param.min = parseFloat(min)

        const max = paramEl.getAttribute('max')
        if (max) param.max = parseFloat(max)

        const step = paramEl.getAttribute('step')
        if (step) param.step = parseFloat(step)

        const fps = paramEl.getAttribute('fps')
        if (fps) param.fps = parseInt(fps)

        const index = paramEl.getAttribute('index')
        if (index) param.index = parseInt(index)

        const coordSpace = paramEl.getAttribute('coordinateSpace')
        if (coordSpace) param.coordinateSpace = coordSpace as 'screen' | 'world'

        params.push(param)
      })

      // Parse vertex shader and format it
      const vertexEl = shaderEl.querySelector('vertex')
      const vertexRaw = vertexEl?.textContent?.trim() || ''
      const vertex = formatGLSL(vertexRaw)

      // Parse fragment shader and format it
      const fragmentEl = shaderEl.querySelector('fragment')
      const fragmentRaw = fragmentEl?.textContent?.trim() || ''
      const fragment = formatGLSL(fragmentRaw)

      // Load into store
      loadShader(vertex, fragment, params, name, description)
      addConsoleMessage('success', `Loaded shader: ${name}`)

      return { name, description, params, vertex, fragment }
    } catch (error) {
      addConsoleMessage('error', `Failed to load shader: ${error}`)
      return null
    }
  }, [addConsoleMessage, loadShader])

  // Save shader to localStorage
  const saveShader = useCallback(() => {
    try {
      const savedShaders = JSON.parse(localStorage.getItem('isaac_shader_studio_saved_shaders') || '[]')

      const newShader = {
        id: `saved_${Date.now()}`,
        name: shaderName || 'Untitled',
        description: shaderDescription,
        vertex: vertexCode,
        fragment: fragmentCode,
        params: parameters,
        savedAt: new Date().toISOString(),
      }

      savedShaders.push(newShader)
      localStorage.setItem('isaac_shader_studio_saved_shaders', JSON.stringify(savedShaders))

      addConsoleMessage('success', `Saved shader: ${newShader.name}`)
      return newShader
    } catch (error) {
      addConsoleMessage('error', `Failed to save shader: ${error}`)
      return null
    }
  }, [shaderName, shaderDescription, vertexCode, fragmentCode, parameters, addConsoleMessage])

  // Load saved shaders from localStorage
  const loadSavedShaders = useCallback((): SavedShader[] => {
    try {
      const savedShaders: SavedShader[] = JSON.parse(localStorage.getItem('isaac_shader_studio_saved_shaders') || '[]')
      return savedShaders
    } catch {
      return []
    }
  }, [])

  // Delete a saved shader from localStorage
  const deleteSavedShader = useCallback((shaderId: string) => {
    try {
      const savedShaders: SavedShader[] = JSON.parse(localStorage.getItem('isaac_shader_studio_saved_shaders') || '[]')
      const filtered = savedShaders.filter((s) => s.id !== shaderId)
      localStorage.setItem('isaac_shader_studio_saved_shaders', JSON.stringify(filtered))
      addConsoleMessage('info', 'Shader deleted')
      return true
    } catch (error) {
      addConsoleMessage('error', `Failed to delete shader: ${error}`)
      return false
    }
  }, [addConsoleMessage])

  // Update runtime parameter in renderer
  const updateParameter = useCallback((name: string, value: number | number[]) => {
    if (!studioInstance) return

    try {
      // Call the ShaderStudio's setParameter method which updates the ParameterManager
      studioInstance.setParameter(name, value)
    } catch (error) {
      console.error('Failed to update parameter:', error)
    }
  }, [])

  // Update all parameters in renderer
  const syncAllParameters = useCallback((params: Record<string, number | number[]>) => {
    if (!studioInstance) return

    // Capture reference for the callback
    const studio = studioInstance

    try {
      Object.entries(params).forEach(([name, value]) => {
        studio.setParameter(name, value)
      })
    } catch (error) {
      console.error('Failed to sync parameters:', error)
    }
  }, [])

  // Reset to passthrough shader (show raw game output)
  const disableShader = useCallback(() => {
    if (!studioInstance) return

    try {
      studioInstance.disable()
      addConsoleMessage('info', 'Reset to passthrough shader')
    } catch (error) {
      console.error('Failed to reset shader:', error)
    }
  }, [addConsoleMessage])

  return {
    isInitialized,
    initialize,
    compile,
    loadShaderManifest,
    loadShaderById,
    saveShader,
    loadSavedShaders,
    deleteSavedShader,
    updateParameter,
    syncAllParameters,
    disableShader,
    studioInstance,
  }
}
