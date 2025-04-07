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

interface DeleteGoalDialogProps {
  goalId: number
  goalSummary: string
  open: boolean
  onOpenChange: (open: boolean) => void
  isFirstLevel: boolean
}

export function DeleteGoalDialog({
  goalId,
  goalSummary,
  isFirstLevel,
  open,
  onOpenChange
}: DeleteGoalDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '100000'
        }
      })

      if (!response.ok) {
        throw new Error('删除目标失败')
      }

      toast({
        title: '删除成功',
        description: '目标已成功删除'
      })
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('删除目标失败:', error)
      toast({
        title: '删除失败',
        description: '删除目标时发生错误',
        variant: 'destructive'
      })
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
            {isFirstLevel
              ? `即将删除一级目标: ${goalSummary}`
              : `即将删除目标: ${goalSummary}`}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isFirstLevel
              ? `您确定要删除该一级目标吗？此操作将同时删除属于该目标的任务序列，以及所有子目标和关联任务，且无法恢复。`
              : `您确定要删除该目标吗？此操作将同时删除所有子目标和关联任务，且无法恢复。`}
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
