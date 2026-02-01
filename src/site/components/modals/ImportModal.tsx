import { useState, useRef, DragEvent } from 'react'
import { useShaderStore, ParamDefinition, ParamType } from '@/site/stores/shaderStore'
import { useShaderStudio } from '@/site/hooks/useShaderStudio'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/site/components/ui/dialog'
import { Button } from '@/site/components/ui/button'
import { Checkbox } from '@/site/components/ui/checkbox'

interface ParsedShader {
  name: string
  description: string
  vertex: string
  fragment: string
  params: ParamDefinition[]
}

export function ImportModal() {
  const {
    importModalOpen,
    setImportModalOpen,
    loadShader,
    addConsoleMessage,
    setCurrentShaderId,
  } = useShaderStore()

  const { compile, loadSavedShaders } = useShaderStudio()

  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedShaders, setParsedShaders] = useState<ParsedShader[]>([])
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())
  const [showConfirmation, setShowConfirmation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await processFiles(files)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await processFiles(Array.from(files))
    }
  }

  const processFiles = async (files: File[]) => {
    try {
      setError(null)
      const shaders: ParsedShader[] = []

      // Categorize files by extension
      const xmlFiles = files.filter(f => f.name.toLowerCase().endsWith('.xml'))
      const vsFiles = files.filter(f => f.name.toLowerCase().endsWith('.vs'))
      const fsFiles = files.filter(f => f.name.toLowerCase().endsWith('.fs'))

      if (xmlFiles.length > 0) {
        // XML import - can contain multiple shaders
        for (const file of xmlFiles) {
          const parsed = await parseXMLFile(file)
          shaders.push(...parsed)
        }
      } else if (vsFiles.length > 0 || fsFiles.length > 0) {
        // GLSL file import - try to match .vs/.fs pairs
        const parsed = await parseGLSLFiles(vsFiles, fsFiles)
        shaders.push(...parsed)
      } else {
        throw new Error('Please select a shaders.xml file or .vs/.fs shader files.')
      }

      if (shaders.length === 0) {
        throw new Error('No valid shaders found in the selected files.')
      }

      // Auto-extract parameters from shaders that don't have any defined
      shaders.forEach(shader => {
        if (shader.params.length === 0 && shader.vertex) {
          shader.params = extractParametersFromVertexShader(shader.vertex)
        }
      })

      setParsedShaders(shaders)
      setSelectedIndices(new Set(shaders.map((_, i) => i)))
      setShowConfirmation(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file')
    }
  }

  const parseXMLFile = async (file: File): Promise<ParsedShader[]> => {
    const xmlText = await file.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

    const parseError = xmlDoc.querySelector('parsererror')
    if (parseError) {
      throw new Error('Invalid XML file')
    }

    const shaders: ParsedShader[] = []

    // Try to find shader elements (could be under <shaders> or directly <shader>)
    const shaderEls = xmlDoc.querySelectorAll('shaders > shader, shader')

    shaderEls.forEach(shaderEl => {
      const name = shaderEl.getAttribute('name') || 'Imported Shader'
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

      // Parse vertex shader
      const vertexEl = shaderEl.querySelector('vertex')
      const vertex = dedentCode(vertexEl?.textContent || '')

      // Parse fragment shader
      const fragmentEl = shaderEl.querySelector('fragment')
      const fragment = dedentCode(fragmentEl?.textContent || '')

      shaders.push({ name, description, params, vertex, fragment })
    })

    return shaders
  }

  const parseGLSLFiles = async (vsFiles: File[], fsFiles: File[]): Promise<ParsedShader[]> => {
    const shaders: ParsedShader[] = []

    // Create maps by base name
    const vsMap = new Map<string, File>()
    const fsMap = new Map<string, File>()

    vsFiles.forEach(f => {
      const baseName = f.name.replace(/\.vs$/i, '')
      vsMap.set(baseName, f)
    })

    fsFiles.forEach(f => {
      const baseName = f.name.replace(/\.fs$/i, '')
      fsMap.set(baseName, f)
    })

    // Find matching pairs
    const processedBases = new Set<string>()

    for (const [baseName, vsFile] of vsMap) {
      const vertexCode = await vsFile.text()
      let fragmentCode = ''

      if (fsMap.has(baseName)) {
        fragmentCode = await (fsMap.get(baseName) as File).text()
        processedBases.add(baseName)
      }

      shaders.push({
        name: formatShaderName(baseName),
        description: '',
        vertex: vertexCode,
        fragment: fragmentCode,
        params: []
      })
    }

    // Add any unmatched .fs files
    for (const [baseName, fsFile] of fsMap) {
      if (!processedBases.has(baseName)) {
        const fragmentCode = await fsFile.text()
        shaders.push({
          name: formatShaderName(baseName),
          description: '',
          vertex: '',
          fragment: fragmentCode,
          params: []
        })
      }
    }

    return shaders
  }

  const extractParametersFromVertexShader = (vertexSource: string): ParamDefinition[] => {
    const params: ParamDefinition[] = []
    const standardAttributes = ['Position', 'Color', 'TexCoord', 'RenderData', 'Scale', 'Transform']
    const attributeRegex = /\b(?:attribute|in)\s+(float|vec2|vec3|vec4|mat4)\s+(\w+)\s*;/g
    let match

    while ((match = attributeRegex.exec(vertexSource)) !== null) {
      const glslType = match[1]
      const name = match[2]

      if (standardAttributes.includes(name) || glslType === 'mat4') {
        continue
      }

      let paramType: ParamDefinition['type']
      switch (glslType) {
        case 'float':
          paramType = 'float'
          break
        case 'vec2':
          paramType = 'vec2'
          break
        case 'vec3':
          paramType = 'vec3'
          break
        case 'vec4':
          paramType = 'vec4'
          break
        default:
          continue
      }

      // Check for special parameter types based on naming conventions
      const nameLower = name.toLowerCase()
      if (nameLower === 'time' || nameLower.endsWith('time')) {
        paramType = 'time'
      } else if (nameLower === 'playerpos' || nameLower === 'playerposition') {
        paramType = 'playerpos'
      } else if (nameLower === 'mousepos' || nameLower === 'mouseposition') {
        paramType = 'mousepos'
      }

      const param: ParamDefinition = {
        name: name,
        type: paramType
      }

      if (paramType === 'float') {
        param.default = '1.0'
        param.min = 0
        param.max = 1
        param.step = 0.01
      }

      params.push(param)
    }

    return params
  }

  const dedentCode = (code: string): string => {
    const lines = code.split('\n')
    let minIndent = Infinity

    for (const line of lines) {
      if (line.trim().length === 0) continue
      const indent = line.match(/^\s*/)?.[0].length || 0
      minIndent = Math.min(minIndent, indent)
    }

    if (minIndent === Infinity || minIndent === 0) return code.trim()

    return lines
      .map(line => line.slice(minIndent))
      .join('\n')
      .trim()
  }

  const formatShaderName = (baseName: string): string => {
    return baseName
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const toggleShaderSelection = (index: number) => {
    const newSelected = new Set(selectedIndices)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedIndices(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIndices.size === parsedShaders.length) {
      setSelectedIndices(new Set())
    } else {
      setSelectedIndices(new Set(parsedShaders.map((_, i) => i)))
    }
  }

  const handleImport = async () => {
    if (selectedIndices.size === 0) {
      setError('Please select at least one shader to import.')
      return
    }

    const existingSavedShaders = loadSavedShaders()
    let firstShaderId: string | null = null

    const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b)

    for (const index of sortedIndices) {
      const shader = parsedShaders[index]
      if (!shader) continue

      // Generate unique name if needed
      let shaderName = shader.name
      let counter = 1
      while (existingSavedShaders.some((s) => s.name === shaderName)) {
        shaderName = `${shader.name} (${counter})`
        counter++
      }

      // Save to localStorage
      const shaderId = `shader_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const savedShader = {
        id: shaderId,
        name: shaderName,
        description: shader.description,
        params: shader.params,
        vertex: shader.vertex,
        fragment: shader.fragment,
        savedAt: new Date().toISOString()
      }

      // Add to existing shaders
      existingSavedShaders.push(savedShader)

      if (!firstShaderId) {
        firstShaderId = shaderId
      }
    }

    // Save all to localStorage
    localStorage.setItem('isaac_shader_studio_saved_shaders', JSON.stringify(existingSavedShaders))

    addConsoleMessage('success', `Imported ${selectedIndices.size} shader${selectedIndices.size !== 1 ? 's' : ''}`)

    // Load the first imported shader
    if (firstShaderId) {
      const shader = existingSavedShaders.find((s) => s.id === firstShaderId)
      if (shader) {
        loadShader(shader.vertex, shader.fragment, shader.params, shader.name, shader.description)
        setCurrentShaderId(`saved:${firstShaderId}`)
        setTimeout(() => compile(), 100)
      }
    }

    // Reset and close
    resetState()
    setImportModalOpen(false)
  }

  const resetState = () => {
    setParsedShaders([])
    setSelectedIndices(new Set())
    setShowConfirmation(false)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    resetState()
    setImportModalOpen(false)
  }

  return (
    <Dialog open={importModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Shader</DialogTitle>
          <DialogDescription className="sr-only">
            Import shader files from XML or GLSL files
          </DialogDescription>
        </DialogHeader>

        {!showConfirmation ? (
          <>
            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xml,.vs,.fs"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-foreground font-medium mb-2">
                {isDragging ? 'Drop files here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-muted-foreground text-sm">
                Supported: .xml or .vs/.fs pairs
              </p>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded flex items-center gap-2 text-destructive-foreground">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Supported formats info */}
            <div className="text-muted-foreground text-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                <span>Supported formats:</span>
              </div>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li><span className="text-foreground font-medium">.xml</span> - Isaac Shader Studio / shaders.xml format</li>
                <li><span className="text-foreground font-medium">.vs/.fs</span> - Raw GLSL vertex/fragment shader files</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation view */}
            <div className="text-sm text-muted-foreground mb-2">
              Found {parsedShaders.length} shader{parsedShaders.length !== 1 ? 's' : ''} to import:
            </div>

            {/* Select all */}
            <div className="flex items-center gap-2 py-2 px-3 bg-secondary rounded-t border border-border">
              <Checkbox
                id="select-all"
                checked={selectedIndices.size === parsedShaders.length}
                onCheckedChange={toggleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm cursor-pointer">
                Select All
              </label>
            </div>

            {/* Shader list */}
            <div className="max-h-[300px] overflow-y-auto border border-t-0 border-border rounded-b">
              {parsedShaders.map((shader, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-3 py-3 border-b border-border last:border-b-0 hover:bg-secondary/50 cursor-pointer"
                  onClick={() => toggleShaderSelection(index)}
                >
                  <Checkbox
                    checked={selectedIndices.has(index)}
                    onCheckedChange={() => toggleShaderSelection(index)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground font-medium truncate">{shader.name}</div>
                    {shader.description && (
                      <div className="text-muted-foreground text-xs truncate">{shader.description}</div>
                    )}
                    {shader.params.length > 0 && (
                      <div className="text-muted-foreground text-xs mt-1">
                        {shader.params.length} parameter{shader.params.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded flex items-center gap-2 text-destructive-foreground">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={selectedIndices.size === 0}>
                Import Selected ({selectedIndices.size})
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
