import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface TimeProgressBarProps {
  timeSpent: number
  originalEstimate: number
  className?: string
  showTooltip?: boolean
}

const formatTime = (hours: number) => {
  if (hours < 1) {
    return `${Math.round(hours * 60)}分钟`
  }
  return `${Math.round(hours * 10) / 10}小时`
}

export function TimeProgressBar({
  timeSpent,
  originalEstimate,
  className = '',
  showTooltip = true
}: TimeProgressBarProps) {
  const progress = (timeSpent / originalEstimate) * 100
  const isOvertime = progress > 100

  const progressBar = (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all ${
          isOvertime ? 'bg-red-400' : 'bg-blue-400'
        }`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  )

  const tooltipContent = (
    <div className="text-xs">
      <div className="flex items-center gap-2">
        <span>花费时间: {formatTime(timeSpent)}</span>
        <span className="text-gray-300">|</span>
        <span className={isOvertime ? 'text-red-400' : ''}>
          预估时间: {formatTime(originalEstimate)}
        </span>
      </div>
      {isOvertime && (
        <div className="mt-1 text-red-400">
          超出 {Math.round(progress - 100)}%
        </div>
      )}
    </div>
  )

  if (!showTooltip) {
    return progressBar
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild className="cursor-pointer">
          {progressBar}
        </TooltipTrigger>
        <TooltipContent
          align="start"
          side="bottom"
          sideOffset={10}
          className="bg-white text-black shadow-md p-2 rounded"
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
