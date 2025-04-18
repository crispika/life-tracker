import { Task } from '@/app/tasks/tasks.type';
import {
  formatMinutesToTimeString,
  isValidTimeString,
  timeStringToMinutes
} from '@/app/tasks/tasks.util';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// 定义表单的schema
const taskFormSchema = z
  .object({
    summary: z
      .string()
      .min(1, { message: '任务名称不能为空' })
      .max(300, { message: '任务名称不能超过300个字符' }),
    description: z.string().optional(),
    startDate: z.string().optional(),
    dueDate: z.string().optional(),
    originalEstimateMinutes: z
      .string()
      .refine((val) => !val || isValidTimeString(val), {
        message: '请输入有效的时间格式，如：2h30m'
      })
      .optional()
  })
  .refine(
    (data) => {
      if (data.startDate && data.dueDate) {
        return new Date(data.startDate) <= new Date(data.dueDate);
      }
      return true;
    },
    {
      message: '截止日期不能早于开始日期',
      path: ['dueDate']
    }
  );

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface AddTaskDialogProps {
  goalId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId?: number;
  task?: Task;
  mode?: 'add' | 'edit';
  onSuccess?: () => void;
}

export function AddTaskDialog({
  goalId,
  open,
  onOpenChange,
  taskId,
  task,
  mode = 'add',
  onSuccess
}: AddTaskDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditMode = mode === 'edit';

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      summary: '',
      description: '',
      startDate: '',
      dueDate: '',
      originalEstimateMinutes: ''
    }
  });

  // 当对话框打开且是编辑模式时，填充表单数据
  useEffect(() => {
    if (open && isEditMode && task) {
      form.reset({
        summary: task.summary,
        description: task.description || '',
        startDate: task.startDate ? format(task.startDate, 'yyyy-MM-dd') : '',
        dueDate: task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : '',
        originalEstimateMinutes: task.originalEstimate
          ? formatMinutesToTimeString(task.originalEstimate)
          : ''
      });
    }
  }, [open, isEditMode, task, form]);

  const onSubmit = async (values: TaskFormValues) => {
    try {
      const body = JSON.stringify({
        goalId,
        summary: values.summary,
        description: values.description,
        startDate: values.startDate
          ? new Date(values.startDate).toISOString()
          : null,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        originalEstimateMinutes: values.originalEstimateMinutes
          ? timeStringToMinutes(values.originalEstimateMinutes)
          : null
      });

      if (isEditMode) {
        // 更新任务
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': '100000'
          },
          body
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || '更新任务失败');
        }

        toast({
          title: '更新成功',
          description: '任务已成功更新'
        });
      } else {
        // 创建任务
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': '100000'
          },
          body
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || '创建任务失败');
        }

        toast({
          title: '创建成功',
          description: '任务已成功创建'
        });
      }

      form.reset();
      onOpenChange(false);
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error(isEditMode ? '更新任务失败:' : '创建任务失败:', error);
      toast({
        title: isEditMode ? '更新失败' : '创建失败',
        description:
          error instanceof Error
            ? error.message
            : isEditMode
              ? '更新任务失败'
              : '创建任务失败',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="bg-white/95 backdrop-blur-sm">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? '编辑任务' : '添加任务'}
          </DialogTitle>
          <p className="text-sm text-gray-500">
            {isEditMode
              ? '修改当前任务的详细信息'
              : '为当前目标添加一个新的任务'}
          </p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      任务名称
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="请输入任务名称"
                        autoComplete="off"
                        className="h-10"
                        maxLength={300}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>任务描述</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="请输入任务描述"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TODO optimize: use shadcn/ui datepicker */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>开始日期</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>截止日期</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="originalEstimateMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>预估时间</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="请输入预估时间，如：2h30m"
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {isEditMode ? '保存' : '添加'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
