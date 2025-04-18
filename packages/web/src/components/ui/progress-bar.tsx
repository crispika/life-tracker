import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { formatMinutesToTimeString } from '@/app/tasks/tasks.util';
interface TimeProgressBarProps {
  timeSpent: number;
  originalEstimate: number | null;
  className?: string;
  showTooltip?: boolean;
  width?: number | string;
}

export function TimeProgressBar({
  timeSpent,
  originalEstimate,
  className = '',
  width = 16,
  showTooltip = true
}: TimeProgressBarProps) {
  const progress = originalEstimate
    ? (timeSpent / originalEstimate) * 100
    : 100;
  const isOvertime = progress > 100;

  const progressBar = (
    <div
      className={`h-1.5 w-${width} overflow-hidden rounded-full bg-gray-100 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all ${
          isOvertime ? 'bg-red-400' : 'bg-blue-400'
        }`}
        style={{
          width: originalEstimate ? `${Math.min(progress, 100)}%` : '100%'
        }}
      />
    </div>
  );

  const tooltipContent = (
    <div className="text-xs">
      <div className="flex items-center gap-2">
        <span>已用: {formatMinutesToTimeString(timeSpent)}</span>
        <span className="text-gray-300">|</span>
        <span className={isOvertime ? 'text-red-400' : ''}>
          预估:{' '}
          {originalEstimate
            ? formatMinutesToTimeString(originalEstimate)
            : ' - '}
        </span>
      </div>
      {isOvertime && (
        <div className="mt-1 text-red-400">
          超出 {Math.round(progress - 100)}%
        </div>
      )}
    </div>
  );

  if (!showTooltip) {
    return progressBar;
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
  );
}
