import { useState, useRef, useEffect, ComponentType } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/site/components/ui/dialog'
import { Button } from '@/site/components/ui/button'
import { ScrollArea } from '@/site/components/ui/scroll-area'
import { cn } from '@/site/lib/utils'

// Import MDX documentation files
import GettingStarted from '@/site/docs/getting-started.mdx'
import ShaderBasics from '@/site/docs/shader-basics.mdx'
import Attributes from '@/site/docs/attributes.mdx'
import Exporting from '@/site/docs/exporting.mdx'
import KeyboardShortcuts from '@/site/docs/keyboard-shortcuts.mdx'
import Examples from '@/site/docs/examples.mdx'

interface DocumentationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface DocSection {
  id: string
  title: string
  Component: ComponentType
}

const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    Component: GettingStarted,
  },
  {
    id: 'shader-basics',
    title: 'Shader Basics',
    Component: ShaderBasics,
  },
  {
    id: 'attributes',
    title: 'Attributes',
    Component: Attributes,
  },
  {
    id: 'exporting',
    title: 'Exporting',
    Component: Exporting,
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    Component: KeyboardShortcuts,
  },
  {
    id: 'examples',
    title: 'Examples',
    Component: Examples,
  },
]

export function DocumentationDialog({ open, onOpenChange }: DocumentationDialogProps) {
  const [activeSection, setActiveSection] = useState(docSections[0].id)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const currentSection = docSections.find(s => s.id === activeSection) || docSections[0]
  const ContentComponent = currentSection.Component

  // Reset scroll position when section changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) {
        viewport.scrollTop = 0
      }
    }
  }, [activeSection])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col" fullscreenable>
        <DialogHeader>
          <DialogTitle>Documentation</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 min-h-0 gap-4">
          {/* Left Navigation */}
          <nav className="w-48 shrink-0">
            <ScrollArea className="h-full">
              <div className="space-y-1 pr-2">
                {docSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start text-sm',
                      activeSection === section.id && 'font-medium'
                    )}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.title}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </nav>

          {/* Main Content */}
          <ScrollArea className="flex-1 border-l pl-4" ref={scrollAreaRef}>
            <div className="pr-4 pb-4 prose">
              <ContentComponent />
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
