import { useState } from 'react'
import { useShaderStore } from '@/site/stores/shaderStore'
import { useGameEngine } from '@/site/hooks/useGameEngine'
import { encodeAndDownloadGif } from '@/site/utils/gifRecorder'
import { Square, Loader2 } from 'lucide-react'

export function ViewportControls() {
  const { isRecording, setIsRecording, shaderName } = useShaderStore()
  const { Studio } = useGameEngine()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleRecord = () => {
    if (!Studio?.startRecording) return
    setIsRecording(true)
    Studio.startRecording()
  }

  const handleStop = () => {
    if (!Studio?.stopRecording) return
    setIsRecording(false)
    setIsGenerating(true)
    const frames = Studio.stopRecording()
    // Defer encoding so React can render the "Generating..." state before the blocking work
    setTimeout(() => {
      encodeAndDownloadGif(frames, shaderName || 'untitled')
      setIsGenerating(false)
    }, 50)
  }

  if (isGenerating) {
    return (
      <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/80 rounded px-3 py-2 text-xs text-muted-foreground">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Generating GIF…</span>
      </div>
    )
  }

  return (
    <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/80 rounded px-3 py-2 text-xs">
      <button
        onClick={isRecording ? handleStop : handleRecord}
        className="w-7 h-7 flex items-center justify-center border border-border/50 rounded hover:bg-white/10 transition-colors"
        title={isRecording ? 'Stop recording and export GIF' : 'Record GIF'}
      >
        {isRecording ? (
          <Square className="w-3.5 h-3.5 fill-red-500 text-red-500" />
        ) : (
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
        )}
      </button>

      {isRecording && (
        <span className="text-red-400 text-[10px] animate-pulse">REC</span>
      )}
    </div>
  )
}
