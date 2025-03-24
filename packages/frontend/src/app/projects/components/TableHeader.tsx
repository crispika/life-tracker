'use client'

import { useRouter } from 'next/navigation'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

type SortOption =
  | 'goal'
  | 'state'
  | 'startDate'
  | 'dueDate'
  | 'estimate'
  | 'timeSpent'
  | 'summary'
type SortDirection = 'asc' | 'desc'

interface TableHeaderProps {
  currentSort: string | undefined
  currentDirection: string | undefined
}

export default function TableHeader({
  currentSort,
  currentDirection
}: TableHeaderProps) {
  const router = useRouter()

  const toggleSort = (field: SortOption) => {
    let newSort = field
    let newDirection: SortDirection = 'asc'

    if (currentSort === field) {
      if (currentDirection === 'asc') {
        newDirection = 'desc'
      } else {
        newSort = '' as SortOption
        newDirection = '' as SortDirection
      }
    }

    const params = new URLSearchParams()
    if (newSort && newDirection) {
      params.set('sort', newSort)
      params.set('dir', newDirection)
    }

    router.replace(params.toString() ? `?${params.toString()}` : '/projects')
  }

  const getSortIcon = (field: SortOption) => {
    if (currentSort !== field) {
      return <ArrowUpDown size={14} className="text-gray-400" />
    }

    return currentDirection === 'asc' ? (
      <ArrowUp size={14} className="text-blue-600" />
    ) : (
      <ArrowDown size={14} className="text-blue-600" />
    )
  }

  const getHeaderItemClass = (field: SortOption) => {
    return `flex items-center cursor-pointer hover:bg-gray-200 px-1 py-1 rounded ${
      currentSort === field ? 'text-blue-600' : ''
    }`
  }

  return (
    <div className="flex items-center p-3 bg-gray-100 rounded-t-lg font-medium text-gray-700 sticky top-16">
      <div className="w-6 h-4 mr-6 text-sm">#</div>
      <div className="w-24 text-sm">编号</div>
      <div className="w-32 text-sm" onClick={() => toggleSort('goal')}>
        <div className={getHeaderItemClass('goal')}>
          目标
          {getSortIcon('goal')}
        </div>
      </div>
      <div className="w-24 text-sm" onClick={() => toggleSort('state')}>
        <div className={getHeaderItemClass('state')}>
          状态
          {getSortIcon('timeSpent')}
        </div>
      </div>
      <div className="flex-1 text-sm" onClick={() => toggleSort('summary')}>
        <div className={getHeaderItemClass('summary')}>
          摘要
          {getSortIcon('summary')}
        </div>
      </div>
      <div className="w-28 text-sm" onClick={() => toggleSort('startDate')}>
        <div className={getHeaderItemClass('startDate')}>
          开始日期
          {getSortIcon('startDate')}
        </div>
      </div>
      <div className="w-28 text-sm" onClick={() => toggleSort('dueDate')}>
        <div className={getHeaderItemClass('dueDate')}>
          截止日期
          {getSortIcon('dueDate')}
        </div>
      </div>
      <div className="w-24 text-sm" onClick={() => toggleSort('estimate')}>
        <div className={getHeaderItemClass('estimate')}>
          预估时间
          {getSortIcon('estimate')}
        </div>
      </div>
      <div className="w-24 text-sm" onClick={() => toggleSort('timeSpent')}>
        <div className={getHeaderItemClass('timeSpent')}>
          已花费时间
          {getSortIcon('timeSpent')}
        </div>
      </div>
    </div>
  )
}
