import { useEffect, useRef, useState, useCallback } from 'react'
import { useShaderStore } from '@/site/stores/shaderStore'

// Minimal interfaces for dynamically loaded game engine modules
interface WebBOIConstructor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new(): any
}

interface StudioInstance {
  isInitialized(): boolean
  refreshCanvas(): void
  getInstance?(): { renderer?: { fps?: number; frameCount?: number } } | null
}

// Import from existing game engine
// These will be loaded dynamically since they have side effects
let gameEngineLoaded = false
let WebBOI: WebBOIConstructor | null = null
let Studio: StudioInstance | null = null
let Canvas: object | null = null

export function useGameEngine() {
  // If game is already loaded, start with isLoading: false
  const [isLoading, setIsLoading] = useState(!gameEngineLoaded)
  const [loadProgress, setLoadProgress] = useState(gameEngineLoaded ? 100 : 0)
  const [isReady, setIsReady] = useState(gameEngineLoaded)
  const gameInstanceRef = useRef<object | null>(null)

  const { updateStats, addConsoleMessage } = useShaderStore()

  // Initialize the game engine
  const initializeGame = useCallback(async () => {
    // If game is already loaded, just refresh the canvas reference
    if (gameEngineLoaded) {
      // Refresh ShaderStudio's canvas reference in case the DOM element was replaced
      if (Studio && Studio.isInitialized()) {
        Studio.refreshCanvas()
      }
      return
    }

    try {
      // Dynamically import the game engine modules
      const mainModule = await import('../../demo/main')
      const importsModule = await import('../../demo/imports')

      WebBOI = mainModule.WebBOI
      Studio = importsModule.ShaderStudio.Studio
      Canvas = importsModule.Canvas

      gameEngineLoaded = true

      // Listen for loading events
      document.addEventListener('loadingEvent', ((e: CustomEvent) => {
        setLoadProgress(e.detail.progress)
        if (e.detail.progress >= 100) {
          setIsLoading(false)
          setIsReady(true)
        }
      }) as EventListener)

      // Create game instance
      const instance = new WebBOI()
      gameInstanceRef.current = instance
      window.TBOI = instance

      addConsoleMessage('info', 'Game engine initialized')
    } catch (error) {
      console.error('Failed to initialize game engine:', error)
      addConsoleMessage('error', `Failed to initialize game: ${error}`)
    }
  }, [addConsoleMessage])

  // Set up stats update interval
  useEffect(() => {
    if (!isReady || !Studio) return

    // Capture Studio reference for the interval callback
    const studioRef = Studio

    const interval = setInterval(() => {
      if (studioRef.isInitialized()) {
        // Get stats from the renderer if available
        const renderer = studioRef.getInstance?.()?.renderer
        if (renderer) {
          updateStats(
            renderer.fps || 0,
            renderer.frameCount || 0,
            { x: 0, y: 0 } // Player pos would come from game
          )
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isReady, updateStats])

  return {
    isLoading,
    loadProgress,
    isReady,
    initializeGame,
    gameInstance: gameInstanceRef.current,
    Studio,
    Canvas,
  }
}
