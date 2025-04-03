import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { Goal } from '../goals.type'

const COLORS = [
  { name: '红', value: '#ff4d4f' },
  { name: '橙', value: '#fa8c16' },
  { name: '黄', value: '#fadb14' },
  { name: '绿', value: '#52c41a' },
  { name: '青', value: '#13c2c2' },
  { name: '蓝', value: '#1890ff' },
  { name: '紫', value: '#722ed1' },
  { name: '褐', value: '#8B4513' },
  { name: '灰', value: '#8c8c8c' },
  { name: '黑', value: '#000000' }
]

interface AddGoalDialogProps {
  parentId: number
  onAddGoal: (goal: Omit<Goal, 'id' | 'children'>) => void
}

export function AddGoalDialog({ parentId, onAddGoal }: AddGoalDialogProps) {
  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [prefix, setPrefix] = useState('')
  const [color, setColor] = useState(COLORS[0].value)
  const [errors, setErrors] = useState<{
    summary?: string
    prefix?: string
  }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!summary.trim()) {
      newErrors.summary = '目标名称不能为空'
    }

    if (!prefix.trim()) {
      newErrors.prefix = '前缀不能为空'
    } else if (prefix.length > 15) {
      newErrors.prefix = '前缀不能超过15个字符'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onAddGoal({
      summary,
      description,
      parentId,
      prefix: {
        id: 0, // 这个值会在后端生成
        name: prefix
      },
      state: {
        id: 1, // 默认状态：进行中
        name: '进行中'
      }
    })
    setOpen(false)
    // 重置表单
    setSummary('')
    setDescription('')
    setPrefix('')
    setColor(COLORS[0].value)
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-white text-black hover:bg-slate-50 shadow-md"
        >
          添加目标
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/95 backdrop-blur-sm">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">
            添加新目标
          </DialogTitle>
          <p className="text-sm text-gray-500">
            为目标设置名称、前缀和颜色，以便于识别和管理
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="summary" className="flex items-center">
                目标概述
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="请输入目标概述"
                autoComplete="off"
                className="h-10"
              />
              {errors.summary && (
                <p className="text-xs text-red-500 ml-2 -mt-1">
                  {errors.summary}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prefix" className="flex items-center">
                任务序列前缀
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="请输入简短的目标前缀（如wk），后续任务将以此编号（如wk-001）"
                maxLength={5}
                autoComplete="off"
                className="h-10"
              />
              {errors.prefix && (
                <p className="text-xs text-red-500 ml-2 -mt-1">
                  {errors.prefix}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>目标颜色</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      color === c.value
                        ? 'border-gray-400 scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => setColor(c.value)}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">目标描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请输入目标描述（可选，详细描述您的目标和期望）"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-6"
            >
              取消
            </Button>
            <Button type="submit" className="px-6">
              添加
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
