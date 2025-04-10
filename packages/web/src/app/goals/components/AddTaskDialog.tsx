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
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { isValidTimeString, timeStringToMinutes } from '@/app/tasks/tasks.util'

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
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<{
    summary?: string
    startDate?: string
    dueDate?: string
    originalEstimateMinutes?: string
  }>({})
  const { toast } = useToast()
  const router = useRouter()

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset()
    }
    setErrors({})
  }

  const validateForm = (formData: FormData) => {
    const newErrors: typeof errors = {}
    const summary = formData.get('summary') as string
    const startDate = formData.get('startDate') as string
    const dueDate = formData.get('dueDate') as string
    const originalEstimateMinutes = formData.get(
      'originalEstimateMinutes'
    ) as string

    if (!summary?.trim()) {
      newErrors.summary = '任务名称不能为空'
    } else if (summary.length > 300) {
      newErrors.summary = '任务名称不能超过300个字符'
    }

    if (startDate && dueDate && new Date(startDate) > new Date(dueDate)) {
      newErrors.dueDate = '截止日期不能早于开始日期'
    }

    if (originalEstimateMinutes) {
      if (!isValidTimeString(originalEstimateMinutes)) {
        newErrors.originalEstimateMinutes = '请输入有效的时间格式，如：2h30m'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    if (!validateForm(formData)) {
      return
    }

    try {
      const summary = formData.get('summary') as string
      const description = formData.get('description') as string
      const startDate = formData.get('startDate') as string
      const dueDate = formData.get('dueDate') as string
      const originalEstimateMinutes = formData.get(
        'originalEstimateMinutes'
      ) as string

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '100000'
        },
        body: JSON.stringify({
          goalId,
          summary,
          description,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          originalEstimateMinutes: originalEstimateMinutes
            ? timeStringToMinutes(originalEstimateMinutes)
            : null
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '创建任务失败')
      }

      toast({
        title: '创建成功',
        description: '任务已成功创建'
      })
      resetForm()
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('创建任务失败:', error)
      toast({
        title: '创建失败',
        description: error instanceof Error ? error.message : '创建任务失败',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          resetForm()
        }
        onOpenChange(open)
      }}
    >
      <DialogContent className="bg-white/95 backdrop-blur-sm">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">添加任务</DialogTitle>
          <p className="text-sm text-gray-500">为当前目标添加一个新的任务</p>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="summary" className="flex items-center">
                任务名称
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="summary"
                name="summary"
                placeholder="请输入任务名称"
                autoComplete="off"
                className="h-10"
                maxLength={300}
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
                name="description"
                placeholder="请输入任务描述"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center">
                  开始日期
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="h-10"
                />
                {errors.startDate && (
                  <p className="text-xs text-red-500 -mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 fill-red-500 stroke-white" />
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="flex items-center">
                  截止日期
                </Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className="h-10"
                />
                {errors.dueDate && (
                  <p className="text-xs text-red-500 -mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 fill-red-500 stroke-white" />
                    {errors.dueDate}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalEstimateMinutes">预估时间</Label>
              <Input
                id="originalEstimateMinutes"
                name="originalEstimateMinutes"
                placeholder="请输入预估时间，如：2h30m"
                className="h-10"
              />
              {errors.originalEstimateMinutes && (
                <p className="text-xs text-red-500 -mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 fill-red-500 stroke-white" />
                  {errors.originalEstimateMinutes}
                </p>
              )}
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
