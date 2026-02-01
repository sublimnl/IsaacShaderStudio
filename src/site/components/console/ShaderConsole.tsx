import { useShaderStore, ConsoleEntry } from '@/site/stores/shaderStore'
import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/site/components/ui/scroll-area'
import { cn } from '@/site/lib/utils'
import { XCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function getTypeStyles(type: ConsoleEntry['type']): { textColor: string; badgeColor: string; label: string; Icon: typeof XCircle } {
  switch (type) {
    case 'error':
      return {
        textColor: 'text-red-400',
        badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
        label: 'ERROR',
        Icon: XCircle
      }
    case 'success':
      return {
        textColor: 'text-green-400',
        badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
        label: 'OK',
        Icon: CheckCircle
      }
    case 'warning':
      return {
        textColor: 'text-amber-400',
        badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        label: 'WARN',
        Icon: AlertTriangle
      }
    case 'info':
    default:
      return {
        textColor: 'text-muted-foreground',
        badgeColor: 'bg-muted text-muted-foreground border-border',
        label: 'INFO',
        Icon: Info
      }
  }
}

export function ShaderConsole() {
  const { consoleMessages, navigateToError } = useShaderStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [consoleMessages])

  const handleErrorClick = (entry: ConsoleEntry) => {
    if (entry.errorLocation) {
      navigateToError(
        entry.errorLocation.shaderType,
        entry.errorLocation.line,
        entry.errorLocation.column
      )
    }
  }

  return (
    <div ref={scrollRef} className="flex-1 min-h-0 w-full bg-background overflow-hidden flex flex-col">
      <ScrollArea className="flex-1 min-h-0">
        <div className="text-xs p-2">
          {consoleMessages.length === 0 ? (
            <div className="text-muted-foreground italic">Console output will appear here...</div>
          ) : (
            consoleMessages.map((entry, index) => {
              const isClickable = entry.errorLocation !== undefined
              const styles = getTypeStyles(entry.type)
              const Icon = styles.Icon
              return (
                <div
                  key={index}
                  className={cn(
                    "py-1.5 border-b border-border/50 last:border-0 flex items-start gap-2",
                    isClickable && "cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1"
                  )}
                  onClick={isClickable ? () => handleErrorClick(entry) : undefined}
                  title={isClickable ? `Click to go to ${entry.errorLocation!.shaderType} shader line ${entry.errorLocation!.line}` : undefined}
                >
                  <span className="text-muted-foreground shrink-0 tabular-nums">{formatTime(entry.timestamp)}</span>
                  <span className={cn(
                    "shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border",
                    styles.badgeColor
                  )}>
                    <Icon className="w-3 h-3" />
                    {styles.label}
                  </span>
                  <span className={cn(styles.textColor, isClickable && "underline decoration-dotted underline-offset-2")}>
                    {entry.message}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
