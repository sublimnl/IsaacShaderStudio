import { useShaderStore, ParamDefinition, ParamType } from '@/site/stores/shaderStore'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/site/components/ui/button'
import { Input } from '@/site/components/ui/input'
import { Switch } from '@/site/components/ui/switch'
import { Label } from '@/site/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/site/components/ui/select'
import { Card } from '@/site/components/ui/card'
import { ScrollArea } from '@/site/components/ui/scroll-area'

const PARAM_TYPES: { value: ParamType; label: string }[] = [
  { value: 'float', label: 'Float' },
  { value: 'vec2', label: 'Vec2' },
  { value: 'vec3', label: 'Vec3' },
  { value: 'vec4', label: 'Vec4' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'time', label: 'Time (Auto)' },
  { value: 'playerpos', label: 'Player Position (Auto)' },
  { value: 'tearpos', label: 'Tear Position (Auto)' },
  { value: 'mousepos', label: 'Mouse Position (Debug)' },
  { value: 'color', label: 'Color' },
]

export function ParamsBuilder() {
  const { parameters, addParameter, removeParameter, updateParameter } = useShaderStore()

  const handleAddParameter = () => {
    addParameter({
      name: `param${parameters.length + 1}`,
      type: 'float',
      default: '0.5',
      min: 0,
      max: 1,
      step: 0.01,
    })
  }

  // When type changes, set appropriate default value
  const handleTypeChange = (index: number, newType: ParamType) => {
    const param = { ...parameters[index], type: newType }

    // Set sensible defaults based on type
    if (newType === 'boolean') {
      param.default = '0.0'
      delete param.min
      delete param.max
      delete param.step
    } else if (newType === 'float') {
      param.default = '0.5'
      param.min = 0
      param.max = 1
      param.step = 0.01
    } else if (newType === 'color') {
      param.default = '#ffffff'
      delete param.min
      delete param.max
      delete param.step
    } else if (['vec2', 'vec3', 'vec4'].includes(newType)) {
      const dims = newType === 'vec2' ? 2 : newType === 'vec3' ? 3 : 4
      param.default = Array(dims).fill('0.0').join(', ')
      param.min = 0
      param.max = 1
      param.step = 0.01
    } else {
      // Auto types don't need defaults
      delete param.default
      delete param.min
      delete param.max
      delete param.step
    }

    updateParameter(index, param)
  }

  const handleUpdateField = (index: number, field: keyof ParamDefinition, value: string | number) => {
    const param = { ...parameters[index] }
    if (field === 'min' || field === 'max' || field === 'step' || field === 'fps' || field === 'index') {
      (param as Record<string, unknown>)[field] = value === '' ? undefined : Number(value)
    } else {
      (param as Record<string, unknown>)[field] = value
    }
    updateParameter(index, param)
  }

  const isAutoType = (type: ParamType) => ['time', 'playerpos', 'mousepos', 'tearpos'].includes(type)
  const isNumericType = (type: ParamType) => ['float', 'vec2', 'vec3', 'vec4'].includes(type)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold">Parameters</h3>
        <Button size="sm" onClick={handleAddParameter}>
          <Plus className="w-4 h-4" />
          Add Parameter
        </Button>
      </div>

      {/* Parameter List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {parameters.length === 0 && (
            <p className="text-muted-foreground text-sm">No parameters defined. Click "Add Parameter" to add one.</p>
          )}

          {parameters.map((param, index) => (
            <Card key={index} className="flex flex-wrap items-center gap-2 p-3">
              {/* Name */}
              <Input
                type="text"
                value={param.name}
                onChange={(e) => handleUpdateField(index, 'name', e.target.value)}
                placeholder="Name"
                className="w-32"
              />

              {/* Type */}
              <Select
                value={param.type}
                onValueChange={(value) => handleTypeChange(index, value as ParamType)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PARAM_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Default for non-auto, non-color, non-boolean types */}
              {!isAutoType(param.type) && param.type !== 'color' && param.type !== 'boolean' && (
                <Input
                  type="text"
                  value={param.default || ''}
                  onChange={(e) => handleUpdateField(index, 'default', e.target.value)}
                  placeholder="Default"
                  className="w-20"
                />
              )}

              {/* Boolean default as switch */}
              {param.type === 'boolean' && (
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Default:</Label>
                  <Switch
                    checked={param.default === '1.0' || param.default === '1' || param.default === 'true'}
                    onCheckedChange={(checked) => handleUpdateField(index, 'default', checked ? '1.0' : '0.0')}
                  />
                </div>
              )}

              {/* Color picker */}
              {param.type === 'color' && (
                <input
                  type="color"
                  value={param.default || '#ffffff'}
                  onChange={(e) => handleUpdateField(index, 'default', e.target.value)}
                  className="w-10 h-9 border border-input rounded cursor-pointer"
                />
              )}

              {/* Min/Max/Step for numeric types */}
              {isNumericType(param.type) && (
                <>
                  <Input
                    type="number"
                    value={param.min ?? ''}
                    onChange={(e) => handleUpdateField(index, 'min', e.target.value)}
                    placeholder="Min"
                    className="w-16"
                  />
                  <Input
                    type="number"
                    value={param.max ?? ''}
                    onChange={(e) => handleUpdateField(index, 'max', e.target.value)}
                    placeholder="Max"
                    className="w-16"
                  />
                  <Input
                    type="number"
                    value={param.step ?? ''}
                    onChange={(e) => handleUpdateField(index, 'step', e.target.value)}
                    placeholder="Step"
                    className="w-16"
                  />
                </>
              )}

              {/* FPS for time type */}
              {param.type === 'time' && (
                <Input
                  type="number"
                  value={param.fps ?? ''}
                  onChange={(e) => handleUpdateField(index, 'fps', e.target.value)}
                  placeholder="FPS"
                  className="w-16"
                  min={1}
                  max={120}
                />
              )}

              {/* Coordinate space for playerpos */}
              {param.type === 'playerpos' && (
                <Select
                  value={param.coordinateSpace || 'screen'}
                  onValueChange={(value) => handleUpdateField(index, 'coordinateSpace', value)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screen">Screen</SelectItem>
                    <SelectItem value="world">World</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Index for tearpos */}
              {param.type === 'tearpos' && (
                <Input
                  type="number"
                  value={param.index ?? 1}
                  onChange={(e) => handleUpdateField(index, 'index', e.target.value)}
                  placeholder="Index"
                  className="w-16"
                  min={1}
                  max={10}
                />
              )}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Remove button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeParameter(index)}
                className="text-destructive hover:bg-destructive/20"
                title="Remove parameter"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
