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
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-lg border border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsUpdateDialogOpen(true)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAddGoalDialogOpen(true)}
            className="h-8 w-8"
          >
            <Target className="h-4 w-4" />
          </Button>
        </div>
      </NodeToolbar>

      <div className="p-4 min-w-[150px] min-h-[100px] max-w-[300px] rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="text-lg font-semibold mb-2">{lifeGoal.summary}</div>
        {lifeGoal.sidenote && (
          <div className="text-sm opacity-80">{lifeGoal.sidenote}</div>
        )}
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#fff', width: '8px', height: '8px' }}
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
