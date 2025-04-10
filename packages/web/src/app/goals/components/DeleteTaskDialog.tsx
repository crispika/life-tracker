import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'

interface DeleteTaskDialogProps {
  taskId: number
  taskSummary: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteTaskDialog({
  taskId,
  taskSummary,
  open,
  onOpenChange
}: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '100000'
        }
      })

      if (!response.ok) {
        throw new Error('删除任务失败')
      }

      toast({
        title: '删除成功',
        description: '任务已成功删除'
      })
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('删除任务失败:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            即将删除任务: {taskSummary}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            您确定要删除该任务吗？此操作无法恢复。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="px-6"
          >
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6"
          >
            {isDeleting ? '删除中...' : '删除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
