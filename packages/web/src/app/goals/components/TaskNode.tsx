import { Task } from '@/app/tasks/tasks.type'
import {
  formatTimeEstimate,
  minutesToTimeEstimate
} from '@/app/tasks/tasks.util'
import { Button } from '@/components/ui/button'
import { TimeProgressBar } from '@/components/ui/progress-bar'
import { formatDate } from '@/lib/utils'
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  ListTodo,
  Pencil,
  Timer
} from 'lucide-react'
import Link from 'next/link'
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow'

export function TaskNode({ data, selected }: NodeProps) {
  const task = data as Task

  // 添加调试日志
  console.log('Task data:', {
    timeSpent: task.timeSpent,
    originalEstimate: task.originalEstimate,
    progress: task.originalEstimate
      ? (task.timeSpent / task.originalEstimate) * 100
      : 0
  })

  return (
    <>
      <div
        className={`relative min-w-[300px] max-w-[300px] rounded-lg border bg-white/95 p-3 shadow-sm backdrop-blur-sm transition-all ${
          selected
            ? 'border-gray-200 ring-1 ring-gray-300 shadow-md'
            : 'border-transparent shadow-sm hover:shadow-md'
        }`}
        style={{
          backgroundColor: `${task.goalColor}05`
        }}
      >
        {/* 顶部工具栏 */}
        <NodeToolbar position={Position.Top} offset={6} align={'start'}>
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-lg border border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              title="编辑任务"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Link href={`/tasks/${task.id}`} target="_blank">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                title="查看任务详情"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </NodeToolbar>

        {/* 左侧连接点 */}
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-gray-400"
        />

        {/* 节点内容 */}
        <div className="space-y-2.5">
          {/* 任务代码和状态 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
                <ListTodo className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-gray-100">
                  {task.prefix}-{task.code}
                </span>
                <TimeProgressBar
                  timeSpent={task.timeSpent}
                  originalEstimate={task.originalEstimate}
                  className="w-20"
                />
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-gray-100">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {task.state.name}
            </span>
          </div>

          {/* 任务摘要 */}
          <div className="truncate px-1">
            <span className="font-medium text-gray-700">{task.summary}</span>
          </div>

          {/* 任务描述 */}
          {task.description && (
            <p className="px-1 text-sm text-gray-500 line-clamp-2 break-words">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <NodeToolbar position={Position.Bottom} offset={6} align={'start'}>
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 max-w-md transform transition-all duration-200 hover:shadow-xl">
          <div className=" space-y-3 ">
            <p className="text-sm font-medium text-gray-900 whitespace-pre-wrap break-words mb-1">
              {task.summary}
            </p>
            {task.description && (
              <p className="text-xs text-gray-500 whitespace-pre-wrap break-words border-t border-gray-100 pt-2 mt-2">
                {task.description}
              </p>
            )}
          </div>

          {/* 时间信息 */}
          <div className="mt-4 rounded-lg overflow-hidden border border-gray-100">
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              {/* 左侧：时间安排 */}
              <div className="bg-gray-100/50">
                <div className="py-2 px-3 bg-gray-200/50 border-b border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>时间安排</span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <span className="text-gray-500 min-w-[36px]">开始:</span>
                    <span className="font-medium text-gray-700 ml-auto">
                      {task.startDate ? formatDate(task.startDate) : '未设置'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                    <span className="text-gray-500 min-w-[36px]">截止:</span>
                    <span className="font-medium text-gray-700 ml-auto">
                      {task.dueDate ? formatDate(task.dueDate) : '未设置'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 右侧：时间统计 */}
              <div className="bg-gray-100/50">
                <div className="py-2 px-3 bg-gray-200/50 border-b border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                    <Timer className="h-3.5 w-3.5" />
                    <span>时间统计</span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <span className="text-gray-500 min-w-[36px]">预估:</span>
                    <span className="font-medium text-gray-700 ml-auto">
                      {task.originalEstimate
                        ? formatTimeEstimate(
                            minutesToTimeEstimate(task.originalEstimate)
                          )
                        : '未设置'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                    <span className="text-gray-500 min-w-[36px]">已用:</span>
                    <span className={'font-medium ml-auto text-gray-700'}>
                      {formatTimeEstimate(
                        minutesToTimeEstimate(task.timeSpent)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NodeToolbar>
    </>
  )
}
