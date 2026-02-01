import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/site/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/site/components/ui/alert-dialog'
import { Button } from '@/site/components/ui/button'
import { Input } from '@/site/components/ui/input'
import { Label } from '@/site/components/ui/label'
import { Switch } from '@/site/components/ui/switch'
import { Checkbox } from '@/site/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/site/components/ui/select'
import { Separator } from '@/site/components/ui/separator'
import { useSettingsStore, AISettings, AIProvider, AI_MODELS, getDefaultModel } from '@/site/stores/settingsStore'
import { CheckCircle, XCircle, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type TestStatus = 'idle' | 'testing' | 'success' | 'error'

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { ai: savedSettings, saveAISettings, loadAISettings } = useSettingsStore()

  // Local state for editing
  const [localSettings, setLocalSettings] = useState<AISettings>({ ...savedSettings })
  const [testStatus, setTestStatus] = useState<TestStatus>('idle')
  const [testError, setTestError] = useState<string>('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const [pendingClose, setPendingClose] = useState(false)

  // Reset local state when dialog opens
  useEffect(() => {
    if (open) {
      const current = loadAISettings()
      setLocalSettings({ ...current })
      setTestStatus('idle')
      setTestError('')
      setShowApiKey(false)
    }
  }, [open, loadAISettings])

  // Check if there are unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    if (!localSettings.enabled && !savedSettings.enabled) {
      return false // Both disabled, no meaningful changes
    }
    return (
      localSettings.enabled !== savedSettings.enabled ||
      localSettings.provider !== savedSettings.provider ||
      localSettings.apiKey !== savedSettings.apiKey ||
      localSettings.model !== savedSettings.model ||
      localSettings.termsAccepted !== savedSettings.termsAccepted
    )
  }, [localSettings, savedSettings])

  // Handle dialog close attempt
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && hasUnsavedChanges()) {
      setPendingClose(true)
      setShowDiscardDialog(true)
    } else {
      onOpenChange(newOpen)
    }
  }

  // Handle discard confirmation
  const handleDiscardConfirm = () => {
    setShowDiscardDialog(false)
    if (pendingClose) {
      setPendingClose(false)
      onOpenChange(false)
    }
  }

  // Handle discard cancel
  const handleDiscardCancel = () => {
    setShowDiscardDialog(false)
    setPendingClose(false)
  }

  // Update local settings
  const updateLocal = (updates: Partial<AISettings>) => {
    setLocalSettings(prev => {
      const updated = { ...prev, ...updates }
      // Reset connection test when key settings change
      if ('apiKey' in updates || 'provider' in updates || 'model' in updates) {
        updated.connectionTested = false
        setTestStatus('idle')
        setTestError('')
      }
      return updated
    })
  }

  // Handle provider change
  const handleProviderChange = (provider: AIProvider) => {
    updateLocal({
      provider,
      model: getDefaultModel(provider),
      apiKey: '', // Clear API key when switching providers
    })
  }

  // Test API connection
  const testConnection = async () => {
    if (!localSettings.apiKey.trim()) {
      setTestStatus('error')
      setTestError('API key is required')
      return
    }

    setTestStatus('testing')
    setTestError('')

    try {
      let response: Response

      if (localSettings.provider === 'openai') {
        // Test OpenAI connection
        response = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localSettings.apiKey}`,
          },
        })

        if (!response.ok) {
          const error = await response.json().catch(() => ({}))
          throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`)
        }
      } else {
        // Test Anthropic connection - use messages API with minimal request
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': localSettings.apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: localSettings.model || 'claude-sonnet-4-20250514',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'Hi' }],
          }),
        })

        if (!response.ok) {
          const error = await response.json().catch(() => ({}))
          throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`)
        }
      }

      setTestStatus('success')
      updateLocal({ connectionTested: true })
    } catch (error) {
      setTestStatus('error')
      setTestError(error instanceof Error ? error.message : 'Connection failed')
      updateLocal({ connectionTested: false })
    }
  }

  // Check if save is allowed
  const canSave = () => {
    if (!localSettings.enabled) {
      return true // Can save when disabled
    }
    return (
      localSettings.termsAccepted &&
      localSettings.connectionTested &&
      localSettings.apiKey.trim() !== '' &&
      localSettings.model !== ''
    )
  }

  // Handle save
  const handleSave = () => {
    saveAISettings(localSettings)
    onOpenChange(false)
  }

  // Get models for current provider
  const models = AI_MODELS[localSettings.provider]

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Configure application settings and integrations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* AI Assistant Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ai-enabled" className="text-base font-medium">
                    AI Assistant
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable AI-powered shader assistance
                  </p>
                </div>
                <Switch
                  id="ai-enabled"
                  checked={localSettings.enabled}
                  onCheckedChange={(enabled) => updateLocal({ enabled })}
                />
              </div>

              {localSettings.enabled && (
                <>
                  <Separator />

                  {/* Provider Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="ai-provider">AI Provider</Label>
                    <Select
                      value={localSettings.provider}
                      onValueChange={(v) => handleProviderChange(v as AIProvider)}
                    >
                      <SelectTrigger id="ai-provider">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                        <SelectItem value="openai">OpenAI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Model Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="ai-model">Model</Label>
                    <Select
                      value={localSettings.model}
                      onValueChange={(model) => updateLocal({ model })}
                    >
                      <SelectTrigger id="ai-model">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* API Key */}
                  <div className="space-y-2">
                    <Label htmlFor="ai-api-key">API Key</Label>
                    <div className="relative">
                      <Input
                        id="ai-api-key"
                        type={showApiKey ? 'text' : 'password'}
                        value={localSettings.apiKey}
                        onChange={(e) => updateLocal({ apiKey: e.target.value })}
                        placeholder={localSettings.provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Test Connection */}
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={testConnection}
                      disabled={testStatus === 'testing' || !localSettings.apiKey.trim()}
                      className="w-full"
                    >
                      {testStatus === 'testing' && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {testStatus === 'success' && (
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      )}
                      {testStatus === 'error' && (
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      )}
                      {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                    </Button>
                    {testStatus === 'success' && (
                      <p className="text-sm text-green-500">Connection successful!</p>
                    )}
                    {testStatus === 'error' && testError && (
                      <p className="text-sm text-red-500">{testError}</p>
                    )}
                  </div>

                  <Separator />

                  {/* Terms of Service */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={localSettings.termsAccepted}
                        onCheckedChange={(checked) =>
                          updateLocal({ termsAccepted: checked === true })
                        }
                      />
                      <div className="space-y-1">
                        <Label htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer">
                          I understand and accept the following terms
                        </Label>
                        <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                          <li>Using the AI assistant consumes tokens from my own API account</li>
                          <li>API keys are stored only in my browser's localStorage</li>
                          <li>Shader code and prompts will be sent to the selected AI provider</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Warning if not all requirements met */}
                  {!canSave() && (
                    <div className="flex items-start gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-amber-500">
                        {!localSettings.termsAccepted && 'Please accept the terms of service. '}
                        {!localSettings.connectionTested && 'Please test your connection before saving. '}
                        {!localSettings.apiKey.trim() && 'API key is required. '}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!canSave()}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Confirmation Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes to your settings. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDiscardCancel}>
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardConfirm}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
