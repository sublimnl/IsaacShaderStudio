import { RuntimeParams } from '@/site/components/viewport/RuntimeParams'
import { GameViewport } from '@/site/components/viewport/GameViewport'
import { ShaderConsole } from '@/site/components/console/ShaderConsole'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/site/components/ui/resizable'
import { useShaderStore } from '@/site/stores/shaderStore'

export function RightPanel() {
  const { parameters } = useShaderStore()

  // Check if there are any adjustable params to show
  const hasAdjustableParams = parameters.some(
    (p) => !['time', 'playerpos', 'mousepos', 'tearpos'].includes(p.type)
  )

  // Render with runtime params panel
  if (hasAdjustableParams) {
    return (
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <ResizablePanelGroup orientation="vertical" autoSaveId="right-panel-with-params">
          <ResizablePanel id="runtime-params" defaultSize="15%" minSize="10%" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <RuntimeParams />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="game-viewport-with-params" defaultSize="70%" minSize="50%" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <GameViewport />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="console-with-params" defaultSize="15%" minSize="10%" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <ShaderConsole />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    )
  }

  // Render without runtime params panel
  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0">
      <ResizablePanelGroup orientation="vertical" autoSaveId="right-panel-simple">
        <ResizablePanel id="game-viewport" defaultSize="80%" minSize="50%" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <GameViewport />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="console" defaultSize="20%" minSize="10%" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ShaderConsole />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
