import { WorkLog } from '@/app/tasks/tasks.type';
import {
  formatMinutesToTimeString,
  isValidTimeString,
  timeStringToMinutes
} from '@/app/tasks/tasks.util';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useThrottle } from '@/hooks/use-throttle';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const workLogFormSchema = z.object({
  logDate: z.string().min(1, { message: '请选择工作日期' }),
  timeSpent: z
    .string()
    .min(1, { message: '请输入花费时间' })
    .refine((val) => isValidTimeString(val), {
      message: '请输入有效的时间格式，如：2h30m'
    }),
  note: z.string().optional()
});

type WorkLogFormValues = z.infer<typeof workLogFormSchema>;

interface WorkLogDialogProps {
  taskId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: WorkLog | null;
  mode: 'add' | 'edit';
}

const workLogFormDefaultValues: WorkLogFormValues = {
  logDate: new Date().toISOString().slice(0, 16),
  timeSpent: '',
  note: ''
};

export function WorkLogDialog({
  taskId,
  open,
  onOpenChange,
  mode,
  initialData
}: WorkLogDialogProps) {
  const router = useRouter();
  const form = useForm<WorkLogFormValues>({
    resolver: zodResolver(workLogFormSchema),
    defaultValues: workLogFormDefaultValues
  });

  useEffect(() => {
    if (mode === 'add') {
      form.reset(workLogFormDefaultValues);
      return;
    }
    if (initialData && mode === 'edit') {
      form.reset({
        logDate: format(initialData.logDate, 'yyyy-MM-dd HH:mm'),
        timeSpent: formatMinutesToTimeString(initialData.timeSpent),
        note: initialData.note
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, mode]);

  const handleSubmit = useThrottle(async (values: WorkLogFormValues) => {
    try {
      const body = JSON.stringify({
        taskId,
        logDate: values.logDate,
        timeSpent: timeStringToMinutes(values.timeSpent),
        note: values.note || ''
      });

      if (mode === 'edit' && initialData) {
        const response = await fetch(
          `/api/tasks/${taskId}/worklogs/${initialData.logId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body
          }
        );

        if (!response.ok) {
          throw new Error('更新工作日志失败');
        }
      } else {
        const response = await fetch(`/api/tasks/${taskId}/worklogs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body
        });
        if (!response.ok) {
          throw new Error('添加工作日志失败');
        }
        form.reset(workLogFormDefaultValues);
        // FIXME : temporary fix - 每次添加工作日志后，再打开添加对话框，时间field报错
        form.clearErrors();
      }
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('添加工作日志失败:', error);
    }
  }, 3000);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加工作日志</DialogTitle>
          <DialogDescription>
            记录你在这项任务上花费的时间和具体工作内容
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="logDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    工作时间
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeSpent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    花费时间
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="例如：2h30m" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>工作内容</FormLabel>
                  <FormControl>
                    <Textarea placeholder="描述你完成的工作内容" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
