import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/site/components/ui/button'
import { Textarea } from '@/site/components/ui/textarea'
import { ScrollArea } from '@/site/components/ui/scroll-area'
import { useShaderStore, ShaderError } from '@/site/stores/shaderStore'
import { useSettingsStore } from '@/site/stores/settingsStore'
import { useShaderStudio } from '@/site/hooks/useShaderStudio'
import { generateShader, ShaderResponse, ShaderContext } from '@/site/services/aiShaderService'
import { formatGLSL } from '@/site/utils/glslFormatter'
import { Send, Loader2, Bot, User, Sparkles, AlertCircle, CheckCircle2, FileCode, RefreshCw } from 'lucide-react'
import { cn } from '@/site/lib/utils'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  response?: ShaderResponse
  error?: string
  applied?: boolean
  isAutoRetry?: boolean  // Marks messages that are auto-retry attempts
}

// Maximum auto-retry attempts for compilation errors
const MAX_AUTO_RETRIES = 2

export function AIChatConsole() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [autoRetryCount, setAutoRetryCount] = useState(0)
  const [lastAIAppliedMessageId, setLastAIAppliedMessageId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const prevSessionIdRef = useRef<number>(0)
  const isApplyingAICodeRef = useRef(false)  // Track when AI is applying code
  const lastKnownCodeRef = useRef<{ vertex: string; fragment: string }>({ vertex: '', fragment: '' })

  const { ai } = useSettingsStore()
  const { compile } = useShaderStudio()
  const {
    vertexCode,
    fragmentCode,
    parameters,
    shaderName,
    shaderDescription,
    shaderErrors,
    setVertexCode,
    setFragmentCode,
    setParameters,
    setShaderName,
    setShaderDescription,
    addConsoleMessage,
    currentShaderId,
    shaderSessionId,
    createNewShader,
  } = useShaderStore()

  // Capture the game canvas as base64 PNG
  const captureCanvas = useCallback((): string | undefined => {
    try {
      // Try to find the shader output canvas (glCanvas) or game canvas
      const glCanvas = document.getElementById('glCanvas') as HTMLCanvasElement
      const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement
      const canvas = glCanvas || gameCanvas

      if (!canvas) {
        console.warn('No canvas found for screenshot')
        return undefined
      }

      // Get base64 data without the data:image/png;base64, prefix
      const dataUrl = canvas.toDataURL('image/png')
      return dataUrl.replace(/^data:image\/png;base64,/, '')
    } catch (error) {
      console.error('Failed to capture canvas:', error)
      return undefined
    }
  }, [])

  // Clear messages when shader session changes (new shader, load shader, etc.)
  useEffect(() => {
    if (prevSessionIdRef.current !== 0 && shaderSessionId !== prevSessionIdRef.current) {
      // Shader session changed, clear the chat
      setMessages([])
      setInput('')
      setAutoRetryCount(0)
      setLastAIAppliedMessageId(null)
      lastKnownCodeRef.current = { vertex: '', fragment: '' }
    }
    prevSessionIdRef.current = shaderSessionId
  }, [shaderSessionId])

  // Detect manual edits and clear AI tracking
  // If code changes when we're NOT applying AI code, it's a manual edit
  useEffect(() => {
    const currentCode = { vertex: vertexCode, fragment: fragmentCode }
    const lastKnown = lastKnownCodeRef.current

    // Skip if we're in the middle of applying AI code
    if (isApplyingAICodeRef.current) {
      return
    }

    // Skip initial mount
    if (!lastKnown.vertex && !lastKnown.fragment) {
      lastKnownCodeRef.current = currentCode
      return
    }

    // Check if code changed (manual edit)
    if (lastKnown.vertex !== currentCode.vertex || lastKnown.fragment !== currentCode.fragment) {
      // Manual edit detected - clear AI tracking
      if (lastAIAppliedMessageId) {
        setLastAIAppliedMessageId(null)
        setAutoRetryCount(0)
      }
      lastKnownCodeRef.current = currentCode
    }
  }, [vertexCode, fragmentCode, lastAIAppliedMessageId])

  // Format shader errors for the AI
  const formatErrorsForAI = useCallback((errors: ShaderError[]): string => {
    return errors.map(err => {
      const location = err.line !== undefined
        ? err.column !== undefined
          ? `Line ${err.line}, Column ${err.column}`
          : `Line ${err.line}`
        : ''
      const shaderType = err.type === 'vertex' ? 'Vertex Shader' : err.type === 'fragment' ? 'Fragment Shader' : 'Linker'
      return `${shaderType}${location ? ` (${location})` : ''}: ${err.message}`
    }).join('\n')
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // Build context from current shader state
  const buildContext = useCallback((): ShaderContext | undefined => {
    if (!vertexCode && !fragmentCode) {
      return undefined
    }
    return {
      currentVertexShader: vertexCode,
      currentFragmentShader: fragmentCode,
      currentParameters: parameters,
      currentName: shaderName,
      currentDescription: shaderDescription,
      currentErrors: shaderErrors.length > 0 ? shaderErrors : undefined,
    }
  }, [vertexCode, fragmentCode, parameters, shaderName, shaderDescription, shaderErrors])

  // Apply shader response to the editor and return compilation success
  const applyShaderResponse = useCallback(async (response: ShaderResponse, messageId: string): Promise<boolean> => {
    // Mark that we're applying AI code (prevents manual edit detection)
    isApplyingAICodeRef.current = true

    try {
      // If no shader is currently loaded, create a new one
      if (currentShaderId === null) {
        createNewShader()
      }

      // Apply the shader code (formatted)
      const newVertex = response.vertexShader ? formatGLSL(response.vertexShader) : vertexCode
      const newFragment = response.fragmentShader ? formatGLSL(response.fragmentShader) : fragmentCode

      if (response.vertexShader) {
        setVertexCode(newVertex)
      }
      if (response.fragmentShader) {
        setFragmentCode(newFragment)
      }

      // Apply parameters
      if (response.parameters) {
        setParameters(response.parameters)
      }

      // Apply metadata if provided
      if (response.shaderName) {
        setShaderName(response.shaderName)
      }
      if (response.shaderDescription) {
        setShaderDescription(response.shaderDescription)
      }

      // Update our known code state to prevent false manual edit detection
      lastKnownCodeRef.current = { vertex: newVertex, fragment: newFragment }

      // Mark message as applied and track it for auto-retry
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, applied: true } : msg
      ))
      setLastAIAppliedMessageId(messageId)

      addConsoleMessage('success', 'AI shader applied to editor')

      // Wait a bit for state to settle, then compile
      await new Promise(resolve => setTimeout(resolve, 100))
      const success = await compile()
      return success
    } finally {
      // Clear the flag after applying
      isApplyingAICodeRef.current = false
    }
  }, [currentShaderId, createNewShader, setVertexCode, setFragmentCode, setParameters, setShaderName, setShaderDescription, addConsoleMessage, compile, vertexCode, fragmentCode])

  // Send error feedback to AI for auto-fix
  const sendErrorFeedback = useCallback(async (issues: ShaderError[]) => {
    if (autoRetryCount >= MAX_AUTO_RETRIES) {
      addConsoleMessage('warning', `Auto-fix limit reached (${MAX_AUTO_RETRIES} attempts). Please fix issues manually or describe the problem.`)
      setAutoRetryCount(0)
      setLastAIAppliedMessageId(null)
      return
    }

    const errors = issues.filter(e => e.severity !== 'warning')
    const warnings = issues.filter(e => e.severity === 'warning')

    let retryPrompt = 'The shader code you provided has issues that need to be fixed:\n\n'

    if (errors.length > 0) {
      retryPrompt += `**Errors (must fix):**\n${formatErrorsForAI(errors)}\n\n`
    }

    if (warnings.length > 0) {
      retryPrompt += `**Warnings (should fix):**\n${formatErrorsForAI(warnings)}\n\n`
    }

    retryPrompt += 'Please provide the corrected shader code that addresses all of these issues.'

    // Add system message showing the auto-retry
    const systemMessageId = crypto.randomUUID()
    const systemMessage: ChatMessage = {
      id: systemMessageId,
      role: 'system',
      content: `Auto-fixing compilation errors (attempt ${autoRetryCount + 1}/${MAX_AUTO_RETRIES})...`,
      timestamp: new Date(),
      isAutoRetry: true,
    }
    setMessages(prev => [...prev, systemMessage])
    setAutoRetryCount(prev => prev + 1)
    setIsLoading(true)

    try {
      const context = buildContext()
      const imageBase64 = captureCanvas()
      const response = await generateShader({
        prompt: retryPrompt,
        context,
        imageBase64
      })

      const assistantMessageId = crypto.randomUUID()
      const hasShaderCode = response.vertexShader || response.fragmentShader

      let displayMessage = response.message || ''
      if (!displayMessage && !response.error) {
        displayMessage = hasShaderCode ? 'Fixed shader code:' : ''
      }

      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: displayMessage,
        timestamp: new Date(),
        response: (!response.error && hasShaderCode) ? response : undefined,
        error: response.error,
        isAutoRetry: true,
      }

      setMessages(prev => [...prev, assistantMessage])

      // Apply the fix if we have shader code
      if (!response.error && hasShaderCode) {
        const success = await applyShaderResponse(response, assistantMessageId)
        if (success) {
          // Reset retry count on success
          setAutoRetryCount(0)
          setLastAIAppliedMessageId(null)
          // Remove auto-retry messages from history on successful fix
          setMessages(prev => prev.filter(msg => !msg.isAutoRetry))
          addConsoleMessage('success', 'AI auto-fix successful!')
        }
        // If still failing, the effect below will trigger another retry
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Auto-fix failed',
        isAutoRetry: true,
      }
      setMessages(prev => [...prev, errorMessage])
      setAutoRetryCount(0)
      setLastAIAppliedMessageId(null)
    } finally {
      setIsLoading(false)
    }
  }, [autoRetryCount, formatErrorsForAI, buildContext, captureCanvas, applyShaderResponse, addConsoleMessage])

  // Watch for shader errors after AI-applied code and trigger auto-retry
  useEffect(() => {
    // Only auto-retry if:
    // 1. There are errors (not just warnings)
    // 2. The last applied code was from AI
    // 3. We're not currently loading
    // 4. We haven't exceeded retry limit
    if (
      shaderErrors.length > 0 &&
      lastAIAppliedMessageId &&
      !isLoading &&
      autoRetryCount < MAX_AUTO_RETRIES
    ) {
      // Check if there are actual errors (not just warnings)
      const actualErrors = shaderErrors.filter(e => e.severity !== 'warning')
      if (actualErrors.length > 0) {
        // Small delay to let the UI update first
        // Send ALL issues (errors + warnings) so AI can fix everything
        const timeoutId = setTimeout(() => {
          sendErrorFeedback(shaderErrors)
        }, 500)
        return () => clearTimeout(timeoutId)
      }
    }
  }, [shaderErrors, lastAIAppliedMessageId, isLoading, autoRetryCount, sendErrorFeedback])

  // Send message to AI
  const handleSend = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    // Reset auto-retry state for new user message
    setAutoRetryCount(0)
    setLastAIAppliedMessageId(null)

    const userMessageId = crypto.randomUUID()
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const context = buildContext()
      const imageBase64 = captureCanvas()
      const response = await generateShader({
        prompt: trimmedInput,
        context,
        imageBase64
      })

      const assistantMessageId = crypto.randomUUID()
      const hasShaderCode = response.vertexShader || response.fragmentShader

      // Determine the message to display
      let displayMessage = response.message || ''
      if (!displayMessage && !response.error) {
        displayMessage = hasShaderCode ? 'Shader generated successfully.' : ''
      }

      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: displayMessage,
        timestamp: new Date(),
        // Only include response if there's shader code to potentially apply
        response: (!response.error && hasShaderCode) ? response : undefined,
        error: response.error,
      }

      setMessages(prev => [...prev, assistantMessage])

      // Auto-apply if no error and we have shader code
      if (!response.error && hasShaderCode) {
        await applyShaderResponse(response, assistantMessageId)
        // Note: if there are errors, the effect above will trigger auto-retry
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter to send (Shift+Enter for newline)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!ai.enabled || !ai.apiKey.trim()) {
    return null
  }

  const isNoShader = currentShaderId === null

  return (
    <div className="flex flex-col h-full border-t border-border bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary border-b border-border">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">AI Shader Assistant</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {ai.provider === 'anthropic' ? 'Claude' : 'OpenAI'}
        </span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0" ref={scrollRef}>
        <div className="p-3 space-y-3">
          {isNoShader ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileCode className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No shader selected</p>
              <p className="text-xs mt-1">Create or load a shader to use the AI assistant.</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Ask me to create or modify shaders.</p>
              <p className="text-xs mt-1">I understand Isaac's shader system specifics.</p>
            </div>
          ) : null}

          {!isNoShader && messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-2',
                message.role === 'user' ? 'justify-end' : 'justify-start',
                message.role === 'system' && 'justify-center'
              )}
            >
              {/* System messages (auto-retry notifications) */}
              {message.role === 'system' && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>{message.content}</span>
                </div>
              )}

              {/* Assistant messages */}
              {message.role === 'assistant' && (
                <>
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>

                  <div className={cn(
                    'max-w-[85%] rounded-lg px-3 py-2 text-sm bg-muted',
                    message.isAutoRetry && 'border border-yellow-500/30'
                  )}>
                    {message.error ? (
                      <div className="flex items-start gap-2 text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{message.error}</span>
                      </div>
                    ) : (
                      <>
                        {message.content && (
                          <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:my-2 prose-pre:my-2 prose-pre:bg-black/30 prose-pre:text-xs prose-code:text-primary prose-code:bg-black/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}
                        {message.response && message.applied && (
                          <div className="flex items-center gap-1 mt-2 text-green-400 text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Applied to editor</span>
                          </div>
                        )}
                        {message.response && !message.applied && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => applyShaderResponse(message.response!, message.id)}
                          >
                            Apply Shader
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}

              {/* User messages */}
              {message.role === 'user' && (
                <>
                  <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm bg-primary text-primary-foreground">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                </>
              )}
            </div>
          ))}

          {!isNoShader && isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-2 border-t border-border bg-secondary">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isNoShader ? "Select or create a shader first..." : "Describe the shader you want..."}
            className="min-h-[60px] max-h-[120px] resize-none text-sm"
            disabled={isLoading || isNoShader}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isNoShader}
            size="icon"
            className="shrink-0 self-end"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          {isNoShader ? "Create or load a shader to start" : "Press Enter to send, Shift+Enter for new line"}
        </p>
      </div>
    </div>
  )
}
