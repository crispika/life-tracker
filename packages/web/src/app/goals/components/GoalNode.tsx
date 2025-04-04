import { Handle, Position } from 'reactflow'
import { Goal } from '../goals.type'

interface GoalNodeProps {
  data: Goal
}

export function GoalNode({ data }: GoalNodeProps) {
  const { summary, description, color, prefix, isFirstLevel, children } = data

  return (
    <div
      className="relative min-w-[200px] rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
      style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
    >
      {/* 左侧连接点 */}
      <Handle type="target" position={Position.Left} className="!bg-gray-400" />

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
    </div>
  )
}
