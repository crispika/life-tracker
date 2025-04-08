import { GoalErrorCode } from '@/app/api/goals/error.types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'

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

export function AddFirstLevelGoalDialog({
  setParentIsHovered
}: {
  setParentIsHovered: (isHovered: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [prefix, setPrefix] = useState('')
  const [color, setColor] = useState(COLORS[0].value)
  const [errors, setErrors] = useState<{
    summary?: string
    prefix?: string
  }>({})
  const { toast } = useToast()
  const router = useRouter()

  const resetState = () => {
    setSummary('')
    setDescription('')
    setPrefix('')
    setColor(COLORS[0].value)
    setErrors({})
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!summary.trim()) {
      newErrors.summary = '目标名称不能为空'
    } else if (summary.length > 100) {
      newErrors.summary = '目标名称不能超过100个字符'
    }

    if (!prefix.trim()) {
      newErrors.prefix = '前缀不能为空'
    } else if (prefix.length > 15) {
      newErrors.prefix = '前缀不能超过15个字符'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const response = await fetch('/api/goals/first-level-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          color,
          summary,
          description,
          parentId: null,
          prefix,
          isFirstLevel: true
        })
      })
      if (!response.ok) {
        const error = await response.json()
        if (error.code === GoalErrorCode.PREFIX_EXISTS) {
          setErrors((prev) => ({ ...prev, prefix: '该前缀已被其他目标使用' }))
          return
        }
        throw new Error(error.error || '创建目标失败')
      }
      toast({
        title: '创建成功',
        description: '目标已成功创建'
      })
      setOpen(false)
      resetState()
      router.refresh()
    } catch (error) {
      console.error('创建目标失败:', error)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setParentIsHovered(false)
      resetState()
    }
    setOpen(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            添加新的一级目标
          </DialogTitle>
          <p className="text-sm text-gray-500">
            为一级目标设置名称、前缀和颜色，以便于识别和管理后续的所有子目标与任务
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
                maxLength={100}
              />
              {errors.summary && (
                <p className="text-xs text-red-500 -mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 fill-red-500 stroke-white" />
                  {errors.summary}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prefix" className="flex items-center">
                序列前缀
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="请输入简短的目标前缀（如wk），后续所有子目标或任务将以此编号（如wk-001）"
                maxLength={5}
                autoComplete="off"
                className="h-10"
              />
              {errors.prefix && (
                <p className="text-xs text-red-500 -mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 fill-red-500 stroke-white" />
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
                placeholder="请输入目标描述。可以记录您设置这个目标的动机，也可以运用SMART原则具体描述目标。"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
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
