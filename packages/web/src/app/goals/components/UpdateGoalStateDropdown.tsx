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

export function UpdateGoalStateDropdown({
  goalId,
  currentState
}: GoalStateDropdownProps) {
  const [_goalState, setGoalState] = useState(currentState.name)

  const handleGoalStateChange = async (newState: string) => {
    try {
      const response = await fetch(`/api/goals/${goalId}/state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': '100000'
        },
        body: JSON.stringify({ state: newState })
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '更新目标状态失败')
      }
      toast({
        title: '状态更新成功',
        description: '目标状态已更新'
      })
      setGoalState(newState)
    } catch (error) {
      console.error(error)
    }
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
