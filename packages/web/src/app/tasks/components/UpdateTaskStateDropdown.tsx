'use client';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { TaskState } from '@/app/tasks/tasks.type';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { DEFAULT_TASK_STATE, getTaskStateName } from '@/app/tasks/tasks.util';

export interface UpdateTaskStateDropdownProps {
  taskId: number;
  currentState: TaskState;
}

export function UpdateTaskStateDropdown({
  taskId,
  currentState
}: UpdateTaskStateDropdownProps) {
  const [_taskState, setTaskState] = useState(currentState);

  const handleTaskStateChange = async (stateName: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/current-state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '100000'
        },
        body: JSON.stringify({ stateName })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '更新任务状态失败');
      }
      toast({
        title: '状态更新成功',
        description: '任务状态已更新'
      });

      // 获取新的状态信息
      const newStateResponse = await fetch(
        `/api/tasks/${taskId}/current-state`,
        {
          headers: {
            'x-user-id': '100000'
          }
        }
      );
      if (newStateResponse.ok) {
        const newState = await newStateResponse.json();
        setTaskState(newState);
      }
    } catch (error) {
      console.error('更新任务状态失败:', error);
      toast({
        title: '更新失败',
        description: '更新任务状态时发生错误',
        variant: 'destructive'
      });
    }
  };

  // 获取状态显示名称
  const stateDisplayName = getTaskStateName(
    _taskState.systemDefined,
    _taskState.name
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="secondary"
          className={`cursor-pointer flex items-center gap-1`}
        >
          {stateDisplayName}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        {/* TODO 这里暂时Hard Code， 未来改为从context获取 */}
        {Object.entries(DEFAULT_TASK_STATE)
          .filter(([stateKey]) => stateKey !== _taskState.name)
          .map(([stateKey, stateInfo]) => (
            <DropdownMenuItem
              key={stateKey}
              onClick={() => handleTaskStateChange(stateKey)}
            >
              {stateInfo}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
