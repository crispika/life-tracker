import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AddGoalDialogProps {
  parentId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddGoalDialog({
  parentId,
  open,
  onOpenChange,
  onSuccess
}: AddGoalDialogProps) {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{
    summary?: string;
  }>({});
  const { toast } = useToast();
  const router = useRouter();

  const resetState = () => {
    setSummary('');
    setDescription('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!summary.trim()) {
      newErrors.summary = '目标名称不能为空';
    } else if (summary.length > 100) {
      newErrors.summary = '目标名称不能超过100个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '100000'
        },
        body: JSON.stringify({
          summary,
          description,
          parentId,
          isFirstLevel: false
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '创建目标失败');
      }
      toast({
        title: '创建成功',
        description: '目标已成功创建'
      });
      resetState();
      onOpenChange(false);
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error('创建目标失败:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          resetState();
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="bg-white/95 backdrop-blur-sm">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">
            添加子目标
          </DialogTitle>
          <p className="text-sm text-gray-500">为当前目标添加一个新的子目标</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              />
              {errors.summary && (
                <p className="text-xs text-red-500 -mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 fill-red-500 stroke-white" />
                  {errors.summary}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">目标描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请输入目标描述"
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
  );
}
