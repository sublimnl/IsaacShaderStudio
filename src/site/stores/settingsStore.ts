import { create } from 'zustand'

export type AIProvider = 'openai' | 'anthropic'

export interface AISettings {
  enabled: boolean
  provider: AIProvider
  apiKey: string
  model: string
  termsAccepted: boolean
  connectionTested: boolean
}

interface SettingsState {
  // AI Assistant settings
  ai: AISettings

  // Settings dialog state
  settingsDialogOpen: boolean

  // Actions
  setSettingsDialogOpen: (open: boolean) => void
  updateAISettings: (settings: Partial<AISettings>) => void
  saveAISettings: (settings: AISettings) => void
  loadAISettings: () => AISettings
  resetAISettings: () => void
}

const DEFAULT_AI_SETTINGS: AISettings = {
  enabled: false,
  provider: 'anthropic',
  apiKey: '',
  model: '',
  termsAccepted: false,
  connectionTested: false,
}

const STORAGE_KEY = 'isaac_shader_studio_ai_settings'

// Load settings from localStorage
function loadFromStorage(): AISettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...DEFAULT_AI_SETTINGS,
        ...parsed,
        // Always reset connection tested on load - user should retest
        connectionTested: false,
      }
    }
  } catch {
    // Ignore storage errors
  }
  return { ...DEFAULT_AI_SETTINGS }
}

// Save settings to localStorage
function saveToStorage(settings: AISettings): void {
  try {
    // Don't store connectionTested state
    const toStore = { ...settings, connectionTested: false }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
  } catch {
    // Ignore storage errors
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Initial state
  ai: loadFromStorage(),
  settingsDialogOpen: false,

  // Actions
  setSettingsDialogOpen: (open) => set({ settingsDialogOpen: open }),

  updateAISettings: (settings) => set((state) => ({
    ai: { ...state.ai, ...settings }
  })),

  saveAISettings: (settings) => {
    saveToStorage(settings)
    set({ ai: settings })
  },

  loadAISettings: () => {
    const settings = loadFromStorage()
    set({ ai: settings })
    return settings
  },

  resetAISettings: () => {
    const defaults = { ...DEFAULT_AI_SETTINGS }
    set({ ai: defaults })
  },
}))

// Model options for each provider
export const AI_MODELS = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  ],
  anthropic: [
    { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
    { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
  ],
} as const

// Get default model for a provider
export function getDefaultModel(provider: AIProvider): string {
  return AI_MODELS[provider][0].value
}
