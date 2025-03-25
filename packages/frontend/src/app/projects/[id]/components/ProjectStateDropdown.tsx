'use client'

import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

const DEFAULT_PROJECT_STATE = {
  ABORTED: 'Aborted',
  ARCHIVED: 'Archived',
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  ON_HOLD: 'On Hold',
  OPEN: 'Open'
} as const

interface ProjectStateDropdownProps {
  currentState: string
  onStateChange: (stateId: number) => Promise<void>
}

type DefaultProjectStateKey = keyof typeof DEFAULT_PROJECT_STATE

interface ProjectState {
  name: string
  id: number
  systemDefined: boolean
}

async function fetchProjectStates(): Promise<ProjectState[]> {
  const response = await fetch('/api/projects/available-states', {
    headers: {
      'x-user-id': '100000'
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch states')
  }
  return response.json()
}

export function ProjectStateDropdown({
  currentState,
  onStateChange
}: ProjectStateDropdownProps) {
  const { data: availableStates = [], isLoading } = useQuery({
    queryKey: ['userProjectStates'],
    queryFn: fetchProjectStates
  })

  if (isLoading) {
    return <Badge variant="secondary">{currentState}</Badge>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="secondary"
          className="cursor-pointer flex items-center gap-1"
        >
          {currentState}
          <ChevronDown className="h-3 w-3" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableStates
          .filter((state) => state.name !== currentState)
          .map((state) => (
            <DropdownMenuItem
              key={state.id}
              onClick={() => onStateChange(state.id)}
            >
              {state.systemDefined
                ? DEFAULT_PROJECT_STATE[state.name as DefaultProjectStateKey]
                : state.name}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
