import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/site/components/ui/dialog'
import { Button } from '@/site/components/ui/button'
import buildInfo from '@/demo/build.json'

interface AboutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const version = `${buildInfo.buildMajor}.${buildInfo.buildMinor}.${buildInfo.buildRevision}`
const buildDate = new Date(buildInfo.timestamp).toLocaleDateString()

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Isaac Shader Studio</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Version {version} {buildInfo.buildTag && <span className="text-xs opacity-70">({buildInfo.buildTag})</span>} - {buildDate}
              </p>
              <p className="text-sm font-medium">
                by sublimnl
              </p>
              <p className="text-sm text-muted-foreground">
                A shader development environment for The Binding of Isaac: Repentance.
                Create, test, and export custom GLSL shaders with real-time preview
                using a built-in game reproduction. Supports custom parameters,
                player position tracking, and exports to Isaac-compatible shader XML format.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
