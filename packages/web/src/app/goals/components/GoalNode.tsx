import { Button } from '@/components/ui/button'
import { ListTodo, Target, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow'
import { AddGoalDialog } from './AddGoalDialog'
import { AddTaskDialog } from './AddTaskDialog'
import { DeleteGoalDialog } from './DeleteGoalDialog'
import { GoalStateDropdown } from './GoalStateDropdown'

export function GoalNode({ data, selected }: NodeProps) {
  const {
    id,
    summary,
    description,
    color,
    prefix,
    isFirstLevel,
    children,
    state
  } = data
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <>
      <div
        className={`relative min-w-[200px] max-w-[300px] rounded-lg border bg-white p-3 shadow-sm ${
          selected ? 'border-gray-300  ring-1 ring-gray-300' : 'border-gray-200'
        }`}
        style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
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
        <div className="space-y-2">
          {/* Prefix Section */}
          {prefix && isFirstLevel && (
            <div className="flex items-center">
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {prefix.name}
              </span>
            </div>
          )}

          {/* Summary Section */}
          <div className="truncate">
            <span className="font-medium">{summary}</span>
          </div>
          {description && (
            <p className="text-sm text-gray-500 line-clamp-2 break-words">
              {description}
            </p>
          )}
        </div>

        {/* 右上角状态下拉菜单 */}
        {state && (
          <div className="absolute top-2 right-2 z-10">
            <GoalStateDropdown goalId={id} currentState={state} />
          </div>
        )}

        <NodeToolbar position={Position.Top} offset={6} align={'start'}>
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-lg border border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation()
                setIsAddGoalOpen(true)
              }}
              title="添加子目标"
            >
              <Target className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation()
                setIsAddTaskOpen(true)
              }}
              title="添加任务"
            >
              <ListTodo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation()
                setIsDeleteDialogOpen(true)
              }}
              title="删除目标"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </NodeToolbar>

        {/* 节点详情工具栏 */}
        <NodeToolbar position={Position.Bottom} offset={6} align={'start'}>
          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-xs">
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {summary}
            </p>
            <p className="text-xs text-gray-700 whitespace-pre-wrap break-words">
              {description}
            </p>
          </div>
        </NodeToolbar>
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

      <DeleteGoalDialog
        goalId={id}
        goalSummary={summary}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        isFirstLevel={isFirstLevel}
      />
    </>
  )
}
