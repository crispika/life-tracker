import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { GoalState } from '../goals.type'
import { toast } from '@/hooks/use-toast'
import { useState } from 'react'

//TODO hardcode now, use api to fetch all available states in the future

const stateMap: Record<string, { name: string; className: string }> = {
  ACTIVE: { name: '进行中', className: 'bg-blue-100 text-blue-800' },
  ON_HOLD: { name: '暂停', className: 'bg-yellow-100 text-yellow-800' },
  COMPLETED: { name: '已完成', className: 'bg-green-100 text-green-800' },
  ABORTED: { name: '已中止', className: 'bg-red-100 text-red-800' },
  ARCHIVED: { name: '已归档', className: 'bg-gray-100 text-gray-800' }
}

export interface GoalStateDropdownProps {
  goalId: number
  currentState: GoalState
}

export function GoalStateDropdown({
  goalId,
  currentState
}: GoalStateDropdownProps) {
  const [_goalState, setGoalState] = useState(currentState.name)

  const handleGoalStateChange = (newState: string) => {
    fetch(`/api/goals/${goalId}/state`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': '100000'
      },
      body: JSON.stringify({ state: newState })
    })
      .then((res) => res.json())
      .then(() => {
        setGoalState(newState)
        toast({
          title: '状态更新成功',
          description: '目标状态已更新'
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="secondary"
          className="cursor-pointer flex items-center gap-1"
        >
          {stateMap[_goalState].name}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        {Object.entries(stateMap)
          .filter(([stateKey]) => stateKey !== _goalState)
          .map(([stateKey, stateName]) => (
            <DropdownMenuItem
              key={stateKey}
              onClick={() => handleGoalStateChange(stateKey)}
            >
              {stateName.name}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
