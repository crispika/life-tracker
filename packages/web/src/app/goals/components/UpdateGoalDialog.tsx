import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface UpdateGoalDialogProps {
  goalId: number
  goalSummary: string
  goalDescription?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateGoalDialog({
  goalId,
  goalSummary,
  goalDescription = '',
  open,
  onOpenChange
}: UpdateGoalDialogProps) {
  const [summary, setSummary] = useState(goalSummary)
  const [description, setDescription] = useState(goalDescription || '')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '100000'
        },
        body: JSON.stringify({ summary, description })
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '更新目标失败')
      }
      toast({
        title: '目标已更新',
        description: '目标信息已成功更新'
      })
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            编辑该目标
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            修改目标的摘要和描述。点击保存按钮应用更改。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="summary" className="flex items-center">
                目标名称
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="请输入目标名称"
                autoComplete="off"
                className="h-10"
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请输入目标描述"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="px-6"
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading} className="px-6">
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
