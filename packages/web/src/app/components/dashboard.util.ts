import { ChartConfig } from '@/components/ui/chart';
import { formatMinutesToTimeString } from '../tasks/tasks.util';

export type ChartDataItem<D extends string, N extends string> = {
  [K in N]: string;
} & {
  [K in D]: number;
} & {
  fill?: string;
};

export enum ValueFormatterType {
  DEFAULT = 'default',
  MINUTES_TO_TIME = 'minutesToTime'
}

export const formatters: Record<string, (value: number) => string> = {
  [ValueFormatterType.DEFAULT]: (value) => value.toString(),
  [ValueFormatterType.MINUTES_TO_TIME]: (value) =>
    formatMinutesToTimeString(value)
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateChartConfig = (rawData: any[]) => {
  const config: Record<string, { label: string; color: string }> = {};
  rawData.forEach((item) => {
    config[String(item.goalId)] = {
      label: item.summary,
      color: item.color
    };
  });
  return config satisfies ChartConfig;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateChartData = (rawData: any[]) => {
  return rawData.map((item) => ({
    goalId: item.goalId,
    count: item.count,
    fill: item.color
  }));
};
