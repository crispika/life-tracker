'use client';

import { WorkLog } from '@/app/tasks/tasks.type';
import {
  formatTimeEstimate,
  minutesToTimeEstimate
} from '@/app/tasks/tasks.util';
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
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Clock, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { WorkLogDialog } from './WorkLogDialog';

export function WorkLogs({
  taskId,
  workLogs
}: {
  taskId: number;
  workLogs: WorkLog[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    mode: 'add' | 'edit';
    initialData: WorkLog | null;
  }>({
    mode: 'add',
    initialData: null
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workLogToDelete, setWorkLogToDelete] = useState<WorkLog | null>(null);

  const addWorkLog = () => {
    setModalConfig({
      mode: 'add',
      initialData: null
    });
    setModalOpen(true);
  };

  const editWorkLog = (workLog: WorkLog) => {
    setModalConfig({
      mode: 'edit',
      initialData: workLog
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (workLog: WorkLog) => {
    setWorkLogToDelete(workLog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!workLogToDelete) return;

    try {
      const response = await fetch(
        `/api/tasks/${taskId}/worklogs/${workLogToDelete.logId}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error('删除工作日志失败');
      }

      window.location.reload();
    } catch (error) {
      console.error('删除工作日志失败:', error);
    } finally {
      setDeleteDialogOpen(false);
      setWorkLogToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-semibold">工作日志</h3>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 hover:bg-gray-100"
            onClick={addWorkLog}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {workLogs.length > 0 ? (
            <div className="space-y-8 border-l border-gray-200 ml-2">
              {workLogs.map((workLog) => (
                <div key={workLog.logId} className="relative pl-8">
                  <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-gray-400 ring-4 ring-white" />
                  <div className="mb-6">
                    <div className="flex flex-col">
                      <h4 className="text-base text-gray-900 mb-1">
                        {format(
                          new Date(workLog.logDate),
                          'yyyy-MM-dd日 HH:mm'
                        )}
                      </h4>
                      <div className="text-sm space-y-1">
                        <div className="text-gray-900">
                          花费时间：
                          {formatTimeEstimate(
                            minutesToTimeEstimate(workLog.timeSpent)
                          )}
                        </div>
                        <div className="text-gray-500">{workLog.note}</div>
                      </div>
                    </div>
                    <div className="absolute right-0 top-0 flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editWorkLog(workLog)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(workLog)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <p>暂无工作日志记录</p>
              <p className="text-sm mt-1">
                点击右上角的&quot;+&quot;添加工作日志
              </p>
            </div>
          )}
        </div>
      </div>
      <WorkLogDialog
        taskId={taskId}
        open={modalOpen}
        onOpenChange={setModalOpen}
        {...modalConfig}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这条工作日志吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
