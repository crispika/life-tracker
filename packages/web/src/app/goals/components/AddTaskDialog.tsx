import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

interface AddTaskDialogProps {
  goalId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTaskDialog({
  goalId,
  open,
  onOpenChange
}: AddTaskDialogProps) {
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{
    summary?: string
  }>({})
  const { toast } = useToast()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!summary.trim()) {
      newErrors.summary = '任务名称不能为空'
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
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary,
          description,
          goalId
        })
      })

      if (!response.ok) {
        throw new Error('创建任务失败')
      }

      toast({
        title: '创建成功',
        description: '任务已成功创建'
      })
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('创建任务失败:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95 backdrop-blur-sm">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">添加任务</DialogTitle>
          <p className="text-sm text-gray-500">为当前目标添加一个新的任务</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="summary" className="flex items-center">
                任务名称
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="请输入任务名称"
                autoComplete="off"
                className="h-10"
              />
              {errors.summary && (
                <p className="text-xs text-red-500 -mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 fill-red-500 stroke-white" />
                  {errors.summary}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">任务描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请输入任务描述"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
