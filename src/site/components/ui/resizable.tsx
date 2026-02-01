import { createContext, useContext, useMemo } from "react"
import { GripVertical } from "lucide-react"
import { Group, Panel, Separator, useDefaultLayout } from "react-resizable-panels"

import { cn } from "../../lib/utils"

// Context to share orientation with handles
const OrientationContext = createContext<"horizontal" | "vertical">("horizontal")

// Simple localStorage wrapper
const createStorage = (id: string) => ({
  getItem: (key: string) => {
    try {
      return localStorage.getItem(`resizable-panels:${id}:${key}`)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(`resizable-panels:${id}:${key}`, value)
    } catch {
      // Ignore storage errors
    }
  },
})

interface ResizablePanelGroupProps extends Omit<React.ComponentProps<typeof Group>, 'defaultLayout'> {
  orientation?: "horizontal" | "vertical"
  autoSaveId?: string
}

const ResizablePanelGroup = ({
  className,
  orientation = "horizontal",
  autoSaveId,
  children,
  ...props
}: ResizablePanelGroupProps) => {
  const storage = useMemo(
    () => autoSaveId ? createStorage(autoSaveId) : undefined,
    [autoSaveId]
  )

  const { defaultLayout, onLayoutChange } = useDefaultLayout({
    storage,
  })

  return (
    <OrientationContext.Provider value={orientation}>
      <Group
        orientation={orientation}
        className={cn("h-full w-full", className)}
        defaultLayout={autoSaveId ? defaultLayout : undefined}
        onLayoutChange={autoSaveId ? onLayoutChange : undefined}
        {...props}
      >
        {children}
      </Group>
    </OrientationContext.Provider>
  )
}

const ResizablePanel = Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean
}) => {
  const orientation = useContext(OrientationContext)
  const isVertical = orientation === "vertical"

  return (
    <Separator
      className={cn(
        "relative flex items-center justify-center bg-border outline-none focus:outline-none focus-visible:outline-none",
        isVertical
          ? "h-1 w-full cursor-row-resize"
          : "w-1 cursor-col-resize",
        className
      )}
      tabIndex={-1}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "z-10 flex items-center justify-center rounded-sm border bg-border",
            isVertical ? "h-23 w-2 rotate-90" : "h-23 w-2"
          )}
        >
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </Separator>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
