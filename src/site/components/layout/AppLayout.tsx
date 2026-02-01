import { UnifiedToolbar } from '@/site/components/layout/UnifiedToolbar'
import { LeftPanel } from '@/site/components/layout/LeftPanel'
import { RightPanel } from '@/site/components/layout/RightPanel'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/site/components/ui/resizable'

export function AppLayout() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <UnifiedToolbar />
      <main className="flex-1 min-h-0">
        <ResizablePanelGroup orientation="horizontal" autoSaveId="main-layout">
          <ResizablePanel id="left-panel" defaultSize="30%" minSize="30%" maxSize="60%" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <LeftPanel />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="right-panel" defaultSize="70%" minSize="40%" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <RightPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}
