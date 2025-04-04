import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon, Plus } from 'lucide-react'
import { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { Goal } from '../goals.type'
import { AddGoalDialog } from './AddGoalDialog'
import { AddTaskDialog } from './AddTaskDialog'

interface GoalNodeProps {
  data: Goal
}

export function GoalNode({ data }: GoalNodeProps) {
  const { summary, description, color, prefix, isFirstLevel, children } = data
  const [isHovered, setIsHovered] = useState(false)
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)

  return (
    <>
      <div
        className="relative min-w-[200px] rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
        style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 左侧连接点 */}
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-gray-400"
        />

        {/* 右侧连接点 - 只在有子节点时显示 */}
        {children && children.length > 0 && (
          <Handle
            type="source"
            position={Position.Right}
            className="!bg-gray-400"
          />
        )}

        {/* 节点内容 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{summary}</span>
            {prefix && isFirstLevel && (
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {prefix.name}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
          )}
        </div>

        {isHovered && (
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-gray-100 hover:bg-gray-200"
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsAddGoalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加子目标
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAddTaskOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加任务
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* TODO Optimize: 将对话框组件移到全局组件中，不要每个Node都保有一份实例 */}
      <AddGoalDialog
        parentId={data.id}
        open={isAddGoalOpen}
        onOpenChange={setIsAddGoalOpen}
      />

      <AddTaskDialog
        goalId={data.id}
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
      />
    </>
  )
}
