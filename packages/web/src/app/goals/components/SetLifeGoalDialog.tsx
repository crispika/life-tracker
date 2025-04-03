'use client'

import { useState } from 'react'
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

export function SetLifeGoalDialog() {
  const [summary, setSummary] = useState('')
  const [sidenote, setSidenote] = useState('')
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [errors, setErrors] = useState<{
    summary?: string
  }>({})

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
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '100000'
        },
        body: JSON.stringify({ summary, sidenote })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '设置人生目标失败')
      }

      setOpen(false)
      // 刷新页面以显示新的目标
      window.location.reload()
    } catch (error) {
      console.error('设置人生目标失败:', error)
      toast({
        title: '错误',
        description:
          error instanceof Error ? error.message : '设置人生目标失败',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>设置人生目标</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>设置你的人生目标</DialogTitle>
          <DialogDescription>
            请描述你的人生目标，这将作为你所有子目标的指导方向。
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
              <p className="text-xs text-red-500 ml-2 -mt-1">
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
