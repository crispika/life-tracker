'use client';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserTaskStates, updateTaskState } from './taskState.api';
import { fetchCurrentState } from './taskState.api';
import { getTaskStateName } from '@/app/tasks/tasks.util';

export interface TaskStateDropdownProps {
  taskId: number;
}

export function TaskStateDropdown({ taskId }: TaskStateDropdownProps) {
  const queryClient = useQueryClient();

  const { data: currentState, isLoading: isLoadingCurrentState } = useQuery({
    queryKey: ['taskCurrentState', taskId],
    queryFn: () => fetchCurrentState(taskId)
  });

  const { data: availableStates = [], isLoading: isLoadingStates } = useQuery({
    queryKey: ['userTaskStates'],
    queryFn: fetchUserTaskStates
  });

  const isLoading = isLoadingCurrentState || isLoadingStates;

  if (isLoading || !currentState) {
    return <Badge variant="secondary">Loading...</Badge>;
  }

  const handleStateChange = async (stateId: number) => {
    await updateTaskState(taskId, stateId);
    // 使缓存失效，触发重新获取
    queryClient.invalidateQueries({
      queryKey: ['taskCurrentState', taskId]
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="secondary"
          className="cursor-pointer flex items-center gap-1"
        >
          {getTaskStateName(currentState.systemDefined, currentState.name)}
          <ChevronDown className="h-3 w-3" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableStates
          .filter((state) => state.id !== currentState.id)
          .map((state) => (
            <DropdownMenuItem
              key={state.id}
              onClick={() => handleStateChange(state.id)}
            >
              {getTaskStateName(state.systemDefined, state.name)}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
