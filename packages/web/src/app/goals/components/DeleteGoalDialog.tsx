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

interface DeleteGoalDialogProps {
  goalId: number;
  goalSummary: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFirstLevel: boolean;
}

export function DeleteGoalDialog({
  goalId,
  goalSummary,
  isFirstLevel,
  open,
  onOpenChange
}: DeleteGoalDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '100000'
        }
      });

      if (!response.ok) {
        throw new Error('删除目标失败');
      }

      toast({
        title: '删除成功',
        description: '目标已成功删除'
      });
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('删除目标失败:', error);
      toast({
        title: '删除失败',
        description: '删除目标时发生错误',
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
            {isFirstLevel ? `删除一级目标` : `删除目标`}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            <div className="mb-4 bg-red-50 p-4 rounded-lg relative">
              <div className="absolute text-gray-300 text-4xl font-serif left-1 -top-2">
                &quot;
              </div>
              <div className="absolute text-gray-300 text-4xl font-serif right-1 bottom-0 leading-[0]">
                &quot;
              </div>
              <div className="px-4">{goalSummary}</div>
            </div>
            {isFirstLevel
              ? `您确定要删除该一级目标吗？此操作将同时删除与该目标相关的所有任务序列、子目标和关联任务，且此操作不可恢复。`
              : `您确定要删除该目标吗？此操作将同时删除所有子目标和关联任务，且此操作不可恢复。`}
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
