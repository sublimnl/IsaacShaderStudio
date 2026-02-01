import { useShaderStore } from '@/site/stores/shaderStore'
import { Play, Pause } from 'lucide-react'

export function ViewportControls() {
  const { isPlaying, setIsPlaying } = useShaderStore()

  return (
    <div className="absolute bottom-2 left-2 flex items-center gap-4 bg-black/80 rounded px-3 py-2 text-xs">
      {/* Play/Pause */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-7 h-7 flex items-center justify-center border border-border/50 rounded hover:bg-white/10 transition-colors"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5" />
        ) : (
          <Play className="w-3.5 h-3.5" />
        )}
      </button>

    </div>
  )
}
