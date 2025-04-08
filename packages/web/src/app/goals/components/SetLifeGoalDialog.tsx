'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle } from 'lucide-react'
import { LifeGoal } from '../goals.type'

interface SetLifeGoalDialogProps {
  mode?: 'create' | 'edit'
  initialData?: LifeGoal
  open?: boolean
  onOpenChange?: (open: boolean) => void
  setLifeGoal?: React.Dispatch<React.SetStateAction<LifeGoal>>
}

export function SetLifeGoalDialog({
  mode = 'create',
  initialData,
  open: controlledOpen,
  onOpenChange,
  setLifeGoal
}: SetLifeGoalDialogProps) {
  const [summary, setSummary] = useState(initialData?.summary || '')
  const [sidenote, setSidenote] = useState(initialData?.sidenote || '')
  const [internalOpen, setInternalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [errors, setErrors] = useState<{
    summary?: string
  }>({})

  // 使用受控或非受控的open状态
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  // 当initialData变化时更新表单
  useEffect(() => {
    if (initialData) {
      setSummary(initialData.summary || '')
      setSidenote(initialData.sidenote || '')
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!summary.trim()) {
      newErrors.summary = '目标概述不能为空'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/life-goal', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '100000'
        },
        body: JSON.stringify({ summary, sidenote })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(
          error.error || `${mode === 'create' ? '设置' : '更新'}人生目标失败`
        )
      }

      setOpen(false)
      toast({
        title: '成功',
        description: `人生目标已${mode === 'create' ? '设置' : '更新'}`
      })
      if (mode === 'edit' && setLifeGoal) {
        setLifeGoal((prev) => ({ ...prev, summary, sidenote }))
      }
    } catch (error) {
      console.error(
        `${mode === 'create' ? '设置' : '更新'}人生目标失败:`,
        error
      )
      toast({
        title: '错误',
        description:
          error instanceof Error
            ? error.message
            : `${mode === 'create' ? '设置' : '更新'}人生目标失败`,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mode === 'create' && (
        <DialogTrigger asChild>
          <Button>设置人生目标</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '设置你的人生目标' : '编辑你的人生目标'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? '请描述你的人生目标，这将作为你所有子目标的指导方向。'
              : '修改你的人生目标，这将影响你所有子目标的指导方向。'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="summary" className="flex items-center">
              人生目标概述
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="用一句话描述你的人生目标"
              autoComplete="off"
            />
            {errors.summary && (
              <p className="text-xs text-red-500 -mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 fill-red-500 stroke-white" />
                {errors.summary}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sidenote">补充说明</Label>
            <Textarea
              id="sidenote"
              value={sidenote}
              onChange={(e) => setSidenote(e.target.value)}
              placeholder="可以补充一些细节说明（可选）"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
