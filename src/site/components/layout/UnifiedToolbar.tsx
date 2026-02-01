import { useState } from 'react'
import { Button } from '@/site/components/ui/button'
import { BookOpen, Info, Settings } from 'lucide-react'
import { DocumentationDialog } from '@/site/components/modals/DocumentationDialog'
import { AboutDialog } from '@/site/components/modals/AboutDialog'
import { SettingsDialog } from '@/site/components/modals/SettingsDialog'

// Ko-fi logo SVG component
function KofiIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
    </svg>
  )
}

export function UnifiedToolbar() {
  const [docsOpen, setDocsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <>
      <header className="flex items-center gap-3 px-4 py-2 bg-secondary border-b border-border">
        {/* Logo/Title */}
        <h1 className="font-semibold text-lg whitespace-nowrap">
          Isaac Shader Studio
        </h1>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Documentation */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDocsOpen(true)}
        >
          <BookOpen className="w-4 h-4" />
          Documentation
        </Button>

        {/* Settings */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>

        {/* About */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAboutOpen(true)}
        >
          <Info className="w-4 h-4" />
          About
        </Button>

        {/* Ko-fi */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open('https://ko-fi.com/sublimnl', '_blank')}
        >
          <KofiIcon className="w-4 h-4" />
          Support this on Ko-fi
        </Button>
      </header>

      {/* Dialogs */}
      <DocumentationDialog open={docsOpen} onOpenChange={setDocsOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
    </>
  )
}
