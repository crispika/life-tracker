import { UpdateTaskStateDropdown } from './UpdateTaskStateDropdown';
import { TimeProgressBar } from '@/components/ui/progress-bar';
import { format } from 'date-fns';
import { Calendar, ListTodo } from 'lucide-react';
import Link from 'next/link';
import { Task } from '../tasks.type';

export function TaskCard({ task }: { task: Task }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="group relative bg-white rounded-lg border p-3 hover:shadow-md transition-all"
      style={{
        backgroundColor: `${task.goalColor}07`
      }}
    >
      {/* 任务代码和状态 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ListTodo className="w-4 h-4" />
          <span className="rounded bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-gray-100">
            {task.prefix}-{task.code}
          </span>
          <TimeProgressBar
            timeSpent={task.timeSpent}
            originalEstimate={task.originalEstimate}
          />
        </div>
        <UpdateTaskStateDropdown taskId={task.id} currentState={task.state} />
      </div>

      {/* 任务摘要 */}
      <div className="truncate mb-2">
        <span className="font-medium text-gray-700">{task.summary}</span>
      </div>

      {/* 任务描述 */}
      {task.description && (
        <div className="text-sm text-gray-500 line-clamp-2 break-words mb-2">
          {task.description}
        </div>
      )}

      {/* 时间安排 */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            开始:{' '}
            {task.startDate ? format(task.startDate, 'yyyy-MM-dd') : '未开始'}
          </span>
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span className={isOverdue ? 'text-red-500' : 'text-gray-500'}>
              截止: {format(task.dueDate, 'yyyy-MM-dd')}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
