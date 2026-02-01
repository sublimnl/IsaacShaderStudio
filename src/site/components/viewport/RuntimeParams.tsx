import { useState, useEffect, useRef } from 'react'
import { useShaderStore, ParamDefinition } from '@/site/stores/shaderStore'
import { useShaderStudio } from '@/site/hooks/useShaderStudio'
import { Slider } from '@/site/components/ui/slider'
import { Switch } from '@/site/components/ui/switch'
import { Label } from '@/site/components/ui/label'
import { RotateCcw } from 'lucide-react'

// Parse default value from parameter definition
function parseDefaultValue(param: ParamDefinition): number | number[] | null {
  if (param.default === undefined) return null

  if (param.type === 'color') {
    const val = param.default
    if (val.startsWith('#') && val.length >= 7) {
      const r = parseInt(val.slice(1, 3), 16) / 255
      const g = parseInt(val.slice(3, 5), 16) / 255
      const b = parseInt(val.slice(5, 7), 16) / 255
      return [r, g, b]
    } else if (val.includes(',')) {
      const parts = val.split(',').map(v => parseFloat(v.trim()))
      if (parts.length >= 3 && parts.every(p => !isNaN(p))) {
        return [parts[0], parts[1], parts[2]]
      }
    }
    return [1, 1, 1]
  } else if (param.type === 'float') {
    return parseFloat(param.default) || 0
  } else if (param.type === 'boolean') {
    const val = param.default.toLowerCase().trim()
    return (val === 'true' || val === '1' || val === '1.0' || val === 'on') ? 1 : 0
  } else if (['vec2', 'vec3', 'vec4'].includes(param.type)) {
    const values = param.default.split(',').map(v => parseFloat(v.trim()) || 0)
    return values
  }
  return null
}

// Reset button component
function ResetButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      title="Reset to default"
    >
      <RotateCcw className="w-3.5 h-3.5" />
    </button>
  )
}

// Color picker that debounces commits while dragging
function ColorPickerParam({
  param,
  value,
  defaultValue,
  onCommit
}: {
  param: ParamDefinition
  value: number[]
  defaultValue: number[] | null
  onCommit: (name: string, value: number[]) => void
}) {
  const [localHex, setLocalHex] = useState(() =>
    `#${value.map((v: number) => Math.round(v * 255).toString(16).padStart(2, '0')).join('')}`
  )
  const [localRgb, setLocalRgb] = useState(value)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync with external value changes (e.g., when loading a new shader)
  useEffect(() => {
    const hex = `#${value.map((v: number) => Math.round(v * 255).toString(16).padStart(2, '0')).join('')}`
    setLocalHex(hex)
    setLocalRgb(value)
  }, [value])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // onChange fires on every color change - debounce the commit
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const h = e.target.value
    setLocalHex(h)
    const r = parseInt(h.slice(1, 3), 16) / 255
    const g = parseInt(h.slice(3, 5), 16) / 255
    const b = parseInt(h.slice(5, 7), 16) / 255
    setLocalRgb([r, g, b])

    // Clear any pending commit
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Debounce: commit after 150ms of no changes
    debounceRef.current = setTimeout(() => {
      onCommit(param.name, [r, g, b])
      debounceRef.current = null
    }, 150)
  }

  // Commit immediately on blur (when picker closes)
  const handleBlur = () => {
    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    // Commit current value
    const r = parseInt(localHex.slice(1, 3), 16) / 255
    const g = parseInt(localHex.slice(3, 5), 16) / 255
    const b = parseInt(localHex.slice(5, 7), 16) / 255
    onCommit(param.name, [r, g, b])
  }

  const handleReset = () => {
    if (defaultValue) {
      onCommit(param.name, defaultValue)
    }
  }

  // Check if current value matches default
  const isDefault = !!(defaultValue &&
    localRgb.length === defaultValue.length &&
    localRgb.every((v, i) => Math.abs(v - defaultValue[i]) < 0.001))

  return (
    <div className="flex items-center gap-3">
      <Label className="text-muted-foreground text-sm min-w-[100px]">
        {param.name}:
      </Label>
      <input
        type="color"
        value={localHex}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-10 h-6 border border-border rounded cursor-pointer"
      />
      <span className="text-foreground text-sm font-mono">
        {localRgb.map((v: number) => v.toFixed(2)).join(', ')}
      </span>
      <ResetButton
        onClick={handleReset}
        disabled={!defaultValue || isDefault}
      />
    </div>
  )
}

export function RuntimeParams() {
  const { parameters, runtimeValues, setRuntimeValue } = useShaderStore()
  const { updateParameter } = useShaderStudio()

  // Filter to only show user-adjustable parameters
  const adjustableParams = parameters.filter(
    (p) => !['time', 'playerpos', 'mousepos', 'tearpos'].includes(p.type)
  )

  if (adjustableParams.length === 0) {
    return null
  }

  const handleValueChange = (name: string, value: number | number[]) => {
    setRuntimeValue(name, value)
    // Also update the shader renderer
    updateParameter(name, value)
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background px-4 py-3">
      <div className="space-y-3">
        {adjustableParams.map((param) => {
          const value = runtimeValues[param.name]

          if (param.type === 'boolean') {
            const checked = value === 1
            const defaultValue = parseDefaultValue(param)
            const hasDefault = defaultValue !== null
            const isDefault = hasDefault && value === defaultValue
            return (
              <div key={param.name} className="flex items-center gap-3">
                <Label className="text-muted-foreground text-sm min-w-[100px]">
                  {param.name}:
                </Label>
                <Switch
                  checked={checked}
                  onCheckedChange={(checked) => handleValueChange(param.name, checked ? 1 : 0)}
                />
                <span className={`text-sm font-mono ${checked ? 'text-green-400' : 'text-red-400'}`}>
                  {checked ? 'ON' : 'OFF'}
                </span>
                <ResetButton
                  onClick={() => hasDefault && handleValueChange(param.name, defaultValue)}
                  disabled={!hasDefault || isDefault}
                />
              </div>
            )
          }

          if (param.type === 'color') {
            // Use runtime value, or parse default, or fall back to white
            const defaultValue = parseDefaultValue(param) as number[] | null
            let colorValue: number[]
            if (Array.isArray(value)) {
              colorValue = value
            } else if (defaultValue) {
              colorValue = defaultValue
            } else {
              colorValue = [1, 1, 1]
            }
            return (
              <ColorPickerParam
                key={param.name}
                param={param}
                value={colorValue}
                defaultValue={defaultValue}
                onCommit={handleValueChange}
              />
            )
          }

          // Float slider
          if (param.type === 'float') {
            const numValue = typeof value === 'number' ? value : parseFloat(param.default || '0')
            const defaultValue = parseDefaultValue(param) as number | null
            const min = param.min ?? 0
            const max = param.max ?? 1
            const step = param.step ?? 0.01
            // Clamp decimals to valid range (0-10) and handle edge cases like step=0
            const decimals = step > 0 ? Math.min(10, Math.max(0, -Math.floor(Math.log10(step)))) : 2
            const isDefault = defaultValue !== null && Math.abs(numValue - defaultValue) < 0.0001

            return (
              <div key={param.name} className="flex items-center gap-3">
                <Label className="text-muted-foreground text-sm min-w-[100px]">
                  {param.name}:
                </Label>
                <Slider
                  min={min}
                  max={max}
                  step={step}
                  value={[numValue]}
                  onValueChange={(values) => handleValueChange(param.name, values[0])}
                  className="flex-1"
                />
                <span className="text-foreground text-sm font-mono w-16 text-right">
                  {numValue.toFixed(decimals)}
                </span>
                <ResetButton
                  onClick={() => defaultValue !== null && handleValueChange(param.name, defaultValue)}
                  disabled={defaultValue === null || isDefault}
                />
              </div>
            )
          }

          // Vec2/Vec3/Vec4 - editable inputs
          if (['vec2', 'vec3', 'vec4'].includes(param.type)) {
            const componentCount = param.type === 'vec2' ? 2 : param.type === 'vec3' ? 3 : 4
            const vecValue = Array.isArray(value) ? value : new Array(componentCount).fill(0)
            const defaultValue = parseDefaultValue(param) as number[] | null
            const labels = ['X', 'Y', 'Z', 'W']
            const min = param.min ?? 0
            const max = param.max ?? 1
            const step = param.step ?? 0.01
            const isDefault = !!(defaultValue &&
              vecValue.length >= componentCount &&
              defaultValue.length >= componentCount &&
              Array.from({ length: componentCount }).every((_, i) =>
                Math.abs((vecValue[i] ?? 0) - (defaultValue[i] ?? 0)) < 0.0001
              ))

            return (
              <div key={param.name} className="flex items-center gap-3">
                <Label className="text-muted-foreground text-sm min-w-[100px]">
                  {param.name}:
                </Label>
                <div className="flex gap-2 flex-1">
                  {Array.from({ length: componentCount }).map((_, i) => (
                    <div key={i} className="flex items-center gap-1 flex-1">
                      <span className="text-muted-foreground text-xs">{labels[i]}</span>
                      <input
                        type="number"
                        value={vecValue[i]?.toFixed(2) ?? '0.00'}
                        min={min}
                        max={max}
                        step={step}
                        onChange={(e) => {
                          const newVec = [...vecValue.slice(0, componentCount)]
                          newVec[i] = parseFloat(e.target.value) || 0
                          handleValueChange(param.name, newVec)
                        }}
                        className="w-full h-7 px-2 text-sm font-mono bg-secondary border border-border rounded text-foreground"
                      />
                    </div>
                  ))}
                </div>
                <ResetButton
                  onClick={() => defaultValue && handleValueChange(param.name, defaultValue.slice(0, componentCount))}
                  disabled={!defaultValue || isDefault}
                />
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
