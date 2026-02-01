import { AppLayout } from './components/layout/AppLayout'
import { ExportModal } from './components/modals/ExportModal'
import { ImportModal } from './components/modals/ImportModal'

function App() {
  return (
    <>
      <AppLayout />
      <ExportModal />
      <ImportModal />
    </>
  )
}

export default App
