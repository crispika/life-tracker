import { Handle, NodeToolbar, Position } from 'reactflow'
import { Button } from '@/components/ui/button'
import { Pencil, Target } from 'lucide-react'
import { SetLifeGoalDialog } from './SetLifeGoalDialog'
import { AddFirstLevelGoalDialog } from './AddFirstLevelGoalDialog'
import { useState } from 'react'
import { LifeGoal } from '../goals.type'

export const LifeGoalNode = ({ data }: { data: LifeGoal }) => {
  const [lifeGoal, setLifeGoal] = useState<LifeGoal>(data)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false)
  return (
    <>
      <NodeToolbar position={Position.Top} offset={6} align={'start'}>
        <div className="flex space-x-1 bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-lg border border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsUpdateDialogOpen(true)}
            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="编辑生命目标"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAddGoalDialogOpen(true)}
            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="添加一级目标"
          >
            <Target className="h-4 w-4" />
          </Button>
        </div>
      </NodeToolbar>

      <div className="relative min-w-[300px] max-w-[300px] min-h-[100px] rounded-lg border bg-gradient-to-br from-white to-gray-50/50 p-4 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm">
        {/* 左侧装饰条 */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 via-purple-500 to-purple-600 rounded-l-lg"></div>

        {/* 装饰性背景元素 */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-100/30 blur-2xl"></div>
          <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-purple-100/30 blur-xl"></div>
          {/* 背景图标 */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.03]">
            <Target className="h-32 w-32 text-gray-900" />
          </div>
        </div>

        {/* 节点内容 */}
        <div className="relative space-y-3 pl-4">
          {/* 目标内容 */}
          <div className="space-y-2">
            <div className="text-xl font-semibold text-gray-900 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              {lifeGoal.summary}
            </div>
            {lifeGoal.sidenote && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {lifeGoal.sidenote}
              </p>
            )}
          </div>
        </div>

        {/* 右侧连接点 */}
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-gray-400"
        />
      </div>

      <SetLifeGoalDialog
        mode="edit"
        initialData={lifeGoal}
        setLifeGoal={setLifeGoal}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />

      <AddFirstLevelGoalDialog
        open={isAddGoalDialogOpen}
        onOpenChange={setIsAddGoalDialogOpen}
      />
    </>
  )
}
