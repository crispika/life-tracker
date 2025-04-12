import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteTaskDialogProps {
  taskId: number;
  taskSummary: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTaskDialog({
  taskId,
  taskSummary,
  open,
  onOpenChange
}: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '100000'
        }
      });

      if (!response.ok) {
        throw new Error('删除任务失败');
      }

      toast({
        title: '删除成功',
        description: '任务已成功删除'
      });
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('删除任务失败:', error);
      toast({
        title: '删除失败',
        description: '删除任务时发生错误',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white/95 backdrop-blur-sm max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-red-600 mb-2">
            删除任务
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            <div className="mb-4 bg-red-50 p-4 rounded-lg relative">
              <div className="absolute text-gray-300 text-4xl font-serif left-1 -top-2">
                &quot;
              </div>
              <div className="absolute text-gray-300 text-4xl font-serif right-1 bottom-0 leading-[0]">
                &quot;
              </div>
              <div className="px-4">{taskSummary}</div>
            </div>
            您确定要删除该任务吗？此操作不可恢复。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end space-x-3 pt-4">
          <AlertDialogCancel disabled={isDeleting} className="px-6">
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? '删除中...' : '删除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
