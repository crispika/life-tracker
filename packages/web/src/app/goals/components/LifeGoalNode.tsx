import { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { LifeGoal } from '../goals.type'
import { AddFirstLevelGoalDialog } from './AddFirstLevelGoalDialog'

export const LifeGoalNode = ({ data }: { data: LifeGoal }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative p-4 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-lg font-semibold mb-2">{data.summary}</div>
      {data.sidenote && (
        <div className="text-sm opacity-80">{data.sidenote}</div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#fff', width: '8px', height: '8px' }}
      />
      {isHovered && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          {/* TODO: 这里简单修复了modal关闭时，hover状态没有消失的问题，有时间了看如何更好改善 */}
          <AddFirstLevelGoalDialog setParentIsHovered={setIsHovered} />
        </div>
      )}
    </div>
  )
}
