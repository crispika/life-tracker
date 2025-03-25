'use client'

import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUserProjectStates, updateProjectState } from './projectState.api'
import { fetchCurrentState } from './projectState.api'
import { getProjectStateName } from '@/app/projects/project.util'

export interface ProjectStateDropdownProps {
  projectId: number
}

export function ProjectStateDropdown({ projectId }: ProjectStateDropdownProps) {
  const queryClient = useQueryClient()

  const { data: currentState, isLoading: isLoadingCurrentState } = useQuery({
    queryKey: ['projectCurrentState', projectId],
    queryFn: () => fetchCurrentState(projectId)
  })

  const { data: availableStates = [], isLoading: isLoadingStates } = useQuery({
    queryKey: ['userProjectStates'],
    queryFn: fetchUserProjectStates
  })

  const isLoading = isLoadingCurrentState || isLoadingStates

  if (isLoading || !currentState) {
    return <Badge variant="secondary">Loading...</Badge>
  }

  const handleStateChange = async (stateId: number) => {
    await updateProjectState(projectId, stateId)
    // 使缓存失效，触发重新获取
    queryClient.invalidateQueries({
      queryKey: ['projectCurrentState', projectId]
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="secondary"
          className="cursor-pointer flex items-center gap-1"
        >
          {getProjectStateName(currentState.systemDefined, currentState.name)}
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
              {getProjectStateName(state.systemDefined, state.name)}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
