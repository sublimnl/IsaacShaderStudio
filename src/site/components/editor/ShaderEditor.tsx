import { useRef, useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import { Ace, Range } from 'ace-builds'
import { useShaderStore } from '@/site/stores/shaderStore'
import { Alert, AlertTitle, AlertDescription } from '@/site/components/ui/alert'
import { AlertTriangle, XCircle } from 'lucide-react'

// Import ace modes and theme
import 'ace-builds/src-noconflict/mode-glsl'
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-searchbox'

interface ShaderEditorProps {
  mode: 'vertex' | 'fragment'
}

interface ErrorRange {
  row: number
  startCol: number
  endCol: number
  message: string
  severity: 'error' | 'warning'
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  message: string
  errorId: string | null  // Track which error we're showing
  severity: 'error' | 'warning'
  containerWidth: number  // For boundary checking
}

export function ShaderEditor({ mode }: ShaderEditorProps) {
  const { vertexCode, fragmentCode, setVertexCode, setFragmentCode, currentShaderId, activeEditorTab, shaderErrors, editorNavigateTo, clearEditorNavigation } = useShaderStore()
  const editorRef = useRef<Ace.Editor | null>(null)
  const errorRangesRef = useRef<ErrorRange[]>([])
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    message: '',
    errorId: null,
    severity: 'error',
    containerWidth: 0
  })

  const value = mode === 'vertex' ? vertexCode : fragmentCode
  const setValue = mode === 'vertex' ? setVertexCode : setFragmentCode
  const isNoShader = currentShaderId === null
  const isActiveTab = activeEditorTab === mode

  // Force editor refresh when tab becomes active or value changes while active
  useEffect(() => {
    if (!editorRef.current || !isActiveTab) return

    const editor = editorRef.current
    const currentValue = editor.getValue()

    // Always sync content when tab is active and values differ
    if (currentValue !== value) {
      editor.setValue(value, -1) // -1 moves cursor to start
      editor.moveCursorTo(0, 0)
      editor.clearSelection()
    }

    // Always force a re-render when tab becomes active
    editor.renderer.updateFull()
    editor.resize()
  }, [value, isActiveTab])

  // Handle navigation requests (e.g., clicking on error in console)
  useEffect(() => {
    if (!editorRef.current || !editorNavigateTo) return
    if (editorNavigateTo.shaderType !== mode) return
    if (!isActiveTab) return // Wait for tab to become active

    const editor = editorRef.current
    const line = editorNavigateTo.line - 1 // Ace uses 0-based line numbers
    const column = editorNavigateTo.column ?? 0

    // Small delay to ensure editor is fully rendered after tab switch
    requestAnimationFrame(() => {
      // Move cursor to the specified location
      editor.gotoLine(editorNavigateTo.line, column, true)
      editor.focus()

      // Center the line in the viewport
      editor.scrollToLine(line, true, true, () => {})

      // Clear the navigation request
      clearEditorNavigation()
    })
  }, [editorNavigateTo, mode, isActiveTab, clearEditorNavigation])

  // Update annotations and markers when errors change
  useEffect(() => {
    if (!editorRef.current) return

    const session = editorRef.current.getSession()

    // Clear previous markers (check both front and back layers)
    const backMarkers = session.getMarkers(false)
    const frontMarkers = session.getMarkers(true)
    ;[backMarkers, frontMarkers].forEach(markers => {
      if (markers) {
        Object.keys(markers).forEach(id => {
          const marker = markers[Number(id)]
          if (marker.clazz?.includes('error-marker') || marker.clazz?.includes('warning-marker')) {
            session.removeMarker(Number(id))
          }
        })
      }
    })

    // Filter errors for this editor type
    const relevantErrors = shaderErrors.filter(err => err.type === mode)

    if (relevantErrors.length === 0) {
      session.clearAnnotations()
      return
    }

    const annotations: Ace.Annotation[] = relevantErrors
      .filter(err => err.line !== undefined)
      .map(err => ({
        row: (err.line || 1) - 1, // Ace uses 0-based line numbers
        column: err.column ?? 0,
        text: err.message,
        type: err.severity === 'warning' ? 'warning' : 'error'
      }))

    console.log(`[ShaderEditor:${mode}] Setting annotations:`, annotations)
    session.setAnnotations(annotations)

    // Add markers for errors with column information and store ranges for tooltip
    const newErrorRanges: ErrorRange[] = []

    relevantErrors.forEach(err => {
      if (err.line !== undefined && err.column !== undefined) {
        const row = err.line - 1
        const col = err.column
        // Use endColumn if available, otherwise highlight just one character
        const endCol = err.endColumn ?? col + 1
        const range = new Range(row, col, row, endCol)
        // Use different marker class for warnings vs errors
        const markerClass = err.severity === 'warning' ? 'warning-marker-column' : 'error-marker-column'
        // Use inFront=true to render above active line highlight
        session.addMarker(range, markerClass, 'text', true)

        // Store range for tooltip hover detection
        newErrorRanges.push({
          row,
          startCol: col,
          endCol,
          message: err.message,
          severity: err.severity ?? 'error'
        })
      }
    })

    errorRangesRef.current = newErrorRanges
  }, [shaderErrors, mode])

  // Set up mousemove listener for error tooltips
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const handleMouseMove = (e: MouseEvent) => {
      const pos = editor.renderer.screenToTextCoordinates(e.clientX, e.clientY)
      const row = pos.row
      const col = pos.column

      // Check if cursor is over any error range
      const errorRange = errorRangesRef.current.find(
        range => range.row === row && col >= range.startCol && col < range.endCol
      )

      if (errorRange) {
        // Create unique ID for this error
        const errorId = `${errorRange.row}-${errorRange.startCol}-${errorRange.endCol}`

        // Only update if we've entered a new error (not the same one)
        setTooltipState(prev => {
          if (prev.errorId === errorId) {
            return prev // Same error, keep current position
          }

          // Calculate fixed position based on the error's start position
          const editorContainer = editor.container
          const rect = editorContainer.getBoundingClientRect()

          // Get pixel coordinates for the start of the error range (left-aligned)
          const screenPos = editor.renderer.textToScreenCoordinates(errorRange.row, errorRange.startCol)

          // Calculate x position, ensuring it doesn't go off the left edge
          let x = screenPos.pageX - rect.left
          // Minimum 8px padding from left edge
          x = Math.max(8, x)

          return {
            visible: true,
            x,
            y: screenPos.pageY - rect.top - 4, // Position above the text
            message: errorRange.message,
            errorId,
            severity: errorRange.severity,
            containerWidth: rect.width
          }
        })
      } else {
        setTooltipState(prev => prev.visible ? { ...prev, visible: false, errorId: null } : prev)
      }
    }

    const handleMouseLeave = () => {
      setTooltipState(prev => prev.visible ? { ...prev, visible: false, errorId: null } : prev)
    }

    const editorEl = editor.container
    editorEl.addEventListener('mousemove', handleMouseMove)
    editorEl.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      editorEl.removeEventListener('mousemove', handleMouseMove)
      editorEl.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleLoad = (editor: Ace.Editor) => {
    editorRef.current = editor
    // Set cursor to start on initial load
    editor.moveCursorTo(0, 0)
    editor.clearSelection()
  }

  return (
    <div className="relative w-full h-full">
      <AceEditor
        mode="glsl"
        theme="tomorrow_night_bright"
        name={`${mode}-editor`}
        value={value}
        onChange={setValue}
        onLoad={handleLoad}
        width="100%"
        height="100%"
        fontSize={13}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 4,
          useWorker: false,
        }}
        editorProps={{ $blockScrolling: true }}
      />
      {/* Overlay to block interaction when no shader selected */}
      {isNoShader && (
        <div className="absolute inset-0 cursor-not-allowed" />
      )}
      {/* Error/Warning tooltip using Alert component */}
      {tooltipState.visible && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: tooltipState.x,
            top: tooltipState.y,
            transform: 'translateY(-100%)',
            maxWidth: `min(400px, ${tooltipState.containerWidth - tooltipState.x - 8}px)`
          }}
        >
          <Alert
            variant={tooltipState.severity === 'warning' ? 'warning' : 'destructive'}
            className="shadow-lg border py-2"
          >
            {tooltipState.severity === 'warning' ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle className="text-xs font-semibold">
              {tooltipState.severity === 'warning' ? 'Warning' : 'Error'}
            </AlertTitle>
            <AlertDescription className="text-xs leading-snug opacity-90">
              {tooltipState.message}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
