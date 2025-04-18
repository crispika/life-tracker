import { Button } from '@/components/ui/button';
import { ListTodo, Minus, Pencil, Plus, Target, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow';
import { AddGoalDialog } from './AddGoalDialog';
import { AddTaskDialog } from './AddTaskDialog';
import { DeleteGoalDialog } from './DeleteGoalDialog';
import { UpdateGoalDialog } from './UpdateGoalDialog';
import { UpdateGoalStateDropdown } from './UpdateGoalStateDropdown';

export function GoalNode({ data, selected }: NodeProps) {
  const {
    id,
    summary,
    description,
    color,
    prefix,
    isFirstLevel,
    children,
    state,
    code,
    hasSubTasks,
    collapsed,
    setExpandedNodes
  } = data;
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const hasChildren = hasSubTasks || (children && children.length > 0);

  const expandNode = useCallback(() => {
    setExpandedNodes((prev: Set<number>) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, [id, setExpandedNodes]);

  const collapseNode = useCallback(() => {
    setExpandedNodes((prev: Set<number>) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, [id, setExpandedNodes]);

  return (
    <>
      <div
        className={`relative min-w-[300px] max-w-[300px] rounded-lg border bg-white p-3 shadow-sm hover:shadow-md ${
          selected ? 'border-gray-200  ring-1 ring-gray-300' : 'border-gray-200'
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
        {!collapsed && hasChildren && (
          <Handle
            type="source"
            position={Position.Right}
            className="!bg-gray-400"
          />
        )}

        {/* 节点内容 */}
        <div className="space-y-2.5">
          {/* Prefix Section */}
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-gray-500" />
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {isFirstLevel ? prefix.name : `${prefix.name}-${code}`}
            </span>
          </div>

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
            <UpdateGoalStateDropdown goalId={id} currentState={state} />
          </div>
        )}
        {collapsed && (
          <div className="absolute top-1/2 -translate-y-1/2 -right-3 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                expandNode();
              }}
              title="展开目标所有子项"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!collapsed && hasChildren && (
          <div className="absolute top-1/2 -translate-y-1/2 -right-3 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                collapseNode();
              }}
              title="折叠目标所有子项"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        )}
        <NodeToolbar position={Position.Top} offset={6} align={'start'}>
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-lg border border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setIsUpdateDialogOpen(true);
              }}
              title="编辑当前目标"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setIsAddGoalOpen(true);
              }}
              title="添加子目标"
            >
              <Target className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setIsAddTaskOpen(true);
              }}
              title="添加任务"
            >
              <ListTodo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-gray-100"
              onClick={() => {
                setIsDeleteDialogOpen(true);
              }}
              title="删除目标"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </NodeToolbar>

        {/* 节点详情工具栏 */}
        <NodeToolbar position={Position.Bottom} offset={6} align={'start'}>
          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs transform transition-all duration-200 hover:shadow-xl">
            <p className="text-sm font-medium text-gray-900 whitespace-pre-wrap break-words mb-1">
              {summary}
            </p>
            {description && (
              <p className="text-xs text-gray-500 whitespace-pre-wrap break-words border-t border-gray-100 pt-2 mt-2">
                {description}
              </p>
            )}
          </div>
        </NodeToolbar>
      </div>

      {/* TODO Optimize: 将对话框组件移到全局组件中，不要每个Node都保有一份实例 */}
      <AddGoalDialog
        parentId={data.id}
        open={isAddGoalOpen}
        onOpenChange={setIsAddGoalOpen}
        onSuccess={expandNode}
      />

      <AddTaskDialog
        goalId={data.id}
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onSuccess={expandNode}
      />

      <DeleteGoalDialog
        goalId={id}
        goalSummary={summary}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        isFirstLevel={isFirstLevel}
      />

      <UpdateGoalDialog
        goalId={id}
        goalSummary={summary}
        goalDescription={description}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />
    </>
  );
}
