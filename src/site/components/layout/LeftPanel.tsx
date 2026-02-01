import { useEffect, useState, useCallback } from 'react'
import { useShaderStore } from '@/site/stores/shaderStore'
import { useSettingsStore } from '@/site/stores/settingsStore'
import { useShaderStudio } from '@/site/hooks/useShaderStudio'
import { formatGLSL } from '@/site/utils/glslFormatter'
import { ShaderEditor } from '@/site/components/editor/ShaderEditor'
import { ParamsBuilder } from '@/site/components/editor/ParamsBuilder'
import { AIChatConsole } from '@/site/components/ai/AIChatConsole'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/site/components/ui/tabs'
import { Input } from '@/site/components/ui/input'
import { Textarea } from '@/site/components/ui/textarea'
import { Label } from '@/site/components/ui/label'
import { Button } from '@/site/components/ui/button'
import { ButtonGroup } from '@/site/components/ui/button-group'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/site/components/ui/resizable'
import { Trash2, Save, Download, Upload, FilePlus, Play, XCircle, AlertTriangle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/site/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/site/components/ui/alert-dialog'

export function LeftPanel() {
  const {
    activeEditorTab,
    setActiveEditorTab,
    shaderName,
    shaderDescription,
    setShaderName,
    setShaderDescription,
    shaderExamples,
    currentShaderId,
    setCurrentShaderId,
    setExportModalOpen,
    setImportModalOpen,
    hasUnsavedShader,
    isDirty,
    createNewShader,
    clearShader,
    markClean,
    shaderErrors,
  } = useShaderStore()

  const { ai: aiSettings } = useSettingsStore()
  // AI is considered enabled if the toggle is on and we have an API key
  // (connectionTested resets on reload, but we require it before saving)
  const isAIEnabled = aiSettings.enabled && aiSettings.apiKey.trim() !== ''

  // Count errors and warnings per shader type
  const vertexErrors = shaderErrors.filter(e => e.type === 'vertex' && e.severity !== 'warning')
  const vertexWarnings = shaderErrors.filter(e => e.type === 'vertex' && e.severity === 'warning')
  const fragmentErrors = shaderErrors.filter(e => e.type === 'fragment' && e.severity !== 'warning')
  const fragmentWarnings = shaderErrors.filter(e => e.type === 'fragment' && e.severity === 'warning')

  const {
    compile,
    loadShaderManifest,
    loadShaderById,
    loadSavedShaders,
    deleteSavedShader,
    saveShader,
    disableShader,
  } = useShaderStudio()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false)
  const [pendingShaderValue, setPendingShaderValue] = useState<string | null>(null)

  // Check if there are unsaved changes
  const hasUnsavedChanges = hasUnsavedShader || isDirty

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleCompile = useCallback(async () => {
    await compile()
  }, [compile])

  const handleSave = useCallback(() => {
    const savedShader = saveShader()
    if (savedShader) {
      setCurrentShaderId(`saved:${savedShader.id}`)
      markClean()
    }
  }, [saveShader, setCurrentShaderId, markClean])

  const handleNewShader = useCallback(() => {
    if (hasUnsavedChanges) {
      setPendingShaderValue('__new__')
      setUnsavedDialogOpen(true)
      return
    }
    createNewShader()
    setActiveEditorTab('vertex')
    // Compile the default passthrough shader immediately
    setTimeout(() => compile(), 50)
  }, [hasUnsavedChanges, createNewShader, setActiveEditorTab, compile])

  const handleExport = useCallback(() => {
    setExportModalOpen(true)
  }, [setExportModalOpen])

  const handleImport = useCallback(() => {
    setImportModalOpen(true)
  }, [setImportModalOpen])

  // Load shader manifest on mount
  useEffect(() => {
    loadShaderManifest()
  }, [loadShaderManifest])

  const handleShaderSelect = async (value: string) => {
    // If selecting the current shader, do nothing
    if (value === currentShaderId || (value === 'none' && currentShaderId === null)) {
      return
    }

    if (value === 'unsaved' && currentShaderId === 'unsaved') {
      return
    }

    // Check for unsaved changes before switching
    if (hasUnsavedChanges) {
      setPendingShaderValue(value)
      setUnsavedDialogOpen(true)
      return
    }

    await performShaderSelect(value)
  }

  const performShaderSelect = async (value: string) => {
    // Reset to vertex tab when switching shaders
    setActiveEditorTab('vertex')

    if (!value || value === 'none') {
      clearShader()
      disableShader()
      return
    }

    if (value === 'unsaved') {
      // Already on unsaved shader, do nothing
      return
    }

    if (value.startsWith('saved:')) {
      const savedShaders = loadSavedShaders()
      const shader = savedShaders.find((s) => `saved:${s.id}` === value)
      if (shader) {
        const { loadShader } = useShaderStore.getState()
        // Format the shader code when loading
        const formattedVertex = formatGLSL(shader.vertex)
        const formattedFragment = formatGLSL(shader.fragment)
        loadShader(formattedVertex, formattedFragment, shader.params, shader.name, shader.description)
        setCurrentShaderId(value)
        setTimeout(() => compile(), 100)
      }
    } else {
      const result = await loadShaderById(value)
      setCurrentShaderId(value)
      if (result) {
        setTimeout(() => compile(), 100)
      }
    }
  }

  const handleDiscardChanges = async () => {
    setUnsavedDialogOpen(false)
    if (pendingShaderValue === '__new__') {
      createNewShader()
      setActiveEditorTab('vertex')
      // Compile the default passthrough shader immediately
      setTimeout(() => compile(), 50)
    } else if (pendingShaderValue) {
      await performShaderSelect(pendingShaderValue)
    }
    setPendingShaderValue(null)
  }

  const savedShaders = loadSavedShaders()

  // Check if current shader is a saved shader
  const isSavedShader = currentShaderId?.startsWith('saved:') ?? false
  const currentSavedShaderId = isSavedShader ? currentShaderId!.replace('saved:', '') : null
  const currentSavedShaderName = isSavedShader
    ? savedShaders.find((s) => s.id === currentSavedShaderId)?.name || 'this shader'
    : ''

  const handleDeleteShader = () => {
    if (currentSavedShaderId) {
      deleteSavedShader(currentSavedShaderId)
      clearShader()
      disableShader()
      setDeleteDialogOpen(false)
    }
  }

  // Determine if editing should be disabled (No Shader selected)
  const isNoShader = currentShaderId === null

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+N for New (avoids browser shortcuts)
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        handleNewShader()
        return
      }

      // Check for Ctrl (Windows/Linux) or Cmd (Mac)
      const isMod = e.ctrlKey || e.metaKey
      if (!isMod) return

      // Ctrl+Enter for Run
      if (e.key === 'Enter' && !isNoShader) {
        e.preventDefault()
        handleCompile()
        return
      }

      switch (e.key.toLowerCase()) {
        case 's':
          if (!isNoShader) {
            e.preventDefault()
            handleSave()
          }
          break
        case 'e':
          if (!isNoShader) {
            e.preventDefault()
            handleExport()
          }
          break
        case 'i':
          e.preventDefault()
          handleImport()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isNoShader, handleNewShader, handleCompile, handleSave, handleExport, handleImport])

  return (
    <div className="flex-1 min-w-0 flex flex-col border-r border-border overflow-hidden">
      {/* Shader Config Section */}
      <div className="p-3 bg-secondary border-b border-border space-y-3">
        {/* Shader Selection */}
        <div className="flex items-center gap-2">
          <Label className="text-muted-foreground text-sm min-w-[80px]">Shader:</Label>
          <Select
            value={currentShaderId || 'none'}
            onValueChange={handleShaderSelect}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select shader..." />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {hasUnsavedShader && (
                <SelectItem value="unsaved" className="italic">
                  {shaderName || 'Untitled Shader'}
                </SelectItem>
              )}
              <SelectItem value="none">No Shader</SelectItem>
              {savedShaders.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Saved Shaders</SelectLabel>
                  {savedShaders.map((shader) => (
                    <SelectItem key={shader.id} value={`saved:${shader.id}`}>
                      {shader.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
              {shaderExamples.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Example Shaders</SelectLabel>
                  {shaderExamples.map((example) => (
                    <SelectItem key={example.id} value={example.id}>
                      {example.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
          {isSavedShader && (
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Shader</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{currentSavedShaderName}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteShader}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Unsaved Changes Confirmation Dialog */}
        <AlertDialog open={unsavedDialogOpen} onOpenChange={setUnsavedDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes to "{shaderName || 'Untitled Shader'}". Are you sure you want to discard them?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPendingShaderValue(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDiscardChanges}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Discard Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Shader Name */}
        <div className="flex items-center gap-2">
          <Label className="text-muted-foreground text-sm min-w-[80px]">Name:</Label>
          <Input
            type="text"
            placeholder="Shader name..."
            className="flex-1"
            value={shaderName}
            onChange={(e) => setShaderName(e.target.value)}
            disabled={isNoShader}
          />
        </div>

        {/* Description */}
        <div className="flex items-start gap-2">
          <Label className="text-muted-foreground text-sm min-w-[80px] pt-2">Description:</Label>
          <Textarea
            placeholder="Description..."
            className="flex-1 min-h-[60px] resize-none"
            rows={2}
            value={shaderDescription}
            onChange={(e) => setShaderDescription(e.target.value)}
            disabled={isNoShader}
          />
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex items-center px-3 py-2 bg-secondary border-b border-border">
        <ButtonGroup>
          <Button variant="outline" size="sm" onClick={handleNewShader} title="New (Alt+N)">
            <FilePlus className="w-4 h-4" />
            New
          </Button>
          <Button variant="outline" size="sm" onClick={handleCompile} disabled={isNoShader} title="Run (Ctrl+Enter)">
            <Play className="w-4 h-4" />
            Run
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={isNoShader} title="Save (Ctrl+S)">
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isNoShader} title="Export (Ctrl+E)">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport} title="Import (Ctrl+I)">
            <Upload className="w-4 h-4" />
            Import
          </Button>
        </ButtonGroup>
      </div>

      {/* Editor Tabs with optional AI Chat */}
      {isAIEnabled ? (
        <ResizablePanelGroup orientation="vertical" autoSaveId="left-panel-ai" className="flex-1 min-h-0">
          <ResizablePanel defaultSize={65} minSize={30}>
            <Tabs
              value={activeEditorTab}
              onValueChange={(value) => setActiveEditorTab(value as 'vertex' | 'fragment' | 'attributes')}
              className="flex flex-col h-full"
            >
              <TabsList className="w-full justify-start rounded-none border-b border-border bg-secondary px-2">
                <TabsTrigger value="vertex" disabled={isNoShader} className="gap-1.5">
                  Vertex Shader
                  {vertexErrors.length > 0 && (
                    <XCircle className="w-3.5 h-3.5 text-red-500 fill-red-500 stroke-white" />
                  )}
                  {vertexErrors.length === 0 && vertexWarnings.length > 0 && (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 fill-amber-500 stroke-black" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="fragment" disabled={isNoShader} className="gap-1.5">
                  Fragment Shader
                  {fragmentErrors.length > 0 && (
                    <XCircle className="w-3.5 h-3.5 text-red-500 fill-red-500 stroke-white" />
                  )}
                  {fragmentErrors.length === 0 && fragmentWarnings.length > 0 && (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 fill-amber-500 stroke-black" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="attributes" disabled={isNoShader}>Parameters</TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0 relative">
                <TabsContent value="vertex" className="absolute inset-0 m-0" keepMounted>
                  <ShaderEditor mode="vertex" />
                </TabsContent>
                <TabsContent value="fragment" className="absolute inset-0 m-0" keepMounted>
                  <ShaderEditor mode="fragment" />
                </TabsContent>
                <TabsContent value="attributes" className="absolute inset-0 m-0 overflow-auto">
                  <ParamsBuilder />
                </TabsContent>
              </div>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={35} minSize={20}>
            <AIChatConsole />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <Tabs
          value={activeEditorTab}
          onValueChange={(value) => setActiveEditorTab(value as 'vertex' | 'fragment' | 'attributes')}
          className="flex flex-col flex-1 min-h-0"
        >
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-secondary px-2">
            <TabsTrigger value="vertex" disabled={isNoShader} className="gap-1.5">
              Vertex Shader
              {vertexErrors.length > 0 && (
                <XCircle className="w-3.5 h-3.5 text-red-500 fill-red-500 stroke-white" />
              )}
              {vertexErrors.length === 0 && vertexWarnings.length > 0 && (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 fill-amber-500 stroke-black" />
              )}
            </TabsTrigger>
            <TabsTrigger value="fragment" disabled={isNoShader} className="gap-1.5">
              Fragment Shader
              {fragmentErrors.length > 0 && (
                <XCircle className="w-3.5 h-3.5 text-red-500 fill-red-500 stroke-white" />
              )}
              {fragmentErrors.length === 0 && fragmentWarnings.length > 0 && (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 fill-amber-500 stroke-black" />
              )}
            </TabsTrigger>
            <TabsTrigger value="attributes" disabled={isNoShader}>Parameters</TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0 relative">
            <TabsContent value="vertex" className="absolute inset-0 m-0" keepMounted>
              <ShaderEditor mode="vertex" />
            </TabsContent>
            <TabsContent value="fragment" className="absolute inset-0 m-0" keepMounted>
              <ShaderEditor mode="fragment" />
            </TabsContent>
            <TabsContent value="attributes" className="absolute inset-0 m-0 overflow-auto">
              <ParamsBuilder />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  )
}
