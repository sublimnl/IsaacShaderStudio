import { useEffect, useRef, useState } from 'react'
import { useGameEngine } from '@/site/hooks/useGameEngine'

export function GameViewport() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const { isLoading, loadProgress, initializeGame } = useGameEngine()
  const [canvasReady, setCanvasReady] = useState(false)

  // Initialize game engine after mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeGame()
      setCanvasReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [initializeGame])

  // Fit canvas to viewport while maintaining aspect ratio
  useEffect(() => {
    const fitCanvas = () => {
      const glCanvas = document.getElementById('glCanvas') as HTMLCanvasElement
      if (!glCanvas || !viewportRef.current) return

      const viewport = viewportRef.current
      const rect = viewport.getBoundingClientRect()

      // Target aspect ratio (442:286 from original)
      const targetWidth = 442
      const targetHeight = 286
      const targetRatio = targetWidth / targetHeight

      const availableWidth = rect.width - 20
      const availableHeight = rect.height - 20

      let width: number, height: number

      if (availableWidth / availableHeight > targetRatio) {
        height = availableHeight
        width = height * targetRatio
      } else {
        width = availableWidth
        height = width / targetRatio
      }

      glCanvas.style.width = `${Math.max(100, width)}px`
      glCanvas.style.height = `${Math.max(65, height)}px`
    }

    fitCanvas()

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(fitCanvas, 50)
    })

    if (viewportRef.current) {
      resizeObserver.observe(viewportRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [canvasReady])

  return (
    <div className="flex-1 min-h-0 w-full bg-black overflow-hidden flex flex-col">
      <div
        ref={viewportRef}
        className="flex-1 min-h-0 w-full flex items-center justify-center relative"
      >
        {/* Game canvas (where the game renders) */}
        <canvas
          id="gameCanvas"
          className="game-canvas absolute opacity-0 pointer-events-none"
          width={286}
          height={442}
        />

        {/* WebGL output canvas - ID must match what ShaderStudio expects */}
        <canvas
          id="glCanvas"
          className="game-canvas"
          width={442}
          height={286}
          tabIndex={1}
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10">
            <div className="text-primary mb-2">Loading Game...</div>
            <progress
              className="w-48 h-2"
              value={loadProgress}
              max={100}
            />
            <div className="text-muted-foreground text-sm mt-1">{loadProgress}%</div>
          </div>
        )}
      </div>
    </div>
  )
}
