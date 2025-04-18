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

//FIXME : 暂时这样让颜色不那么刺眼，有空了挑选一些好颜色
// 将颜色处理逻辑抽取为独立函数

/* eslint-disable @typescript-eslint/no-unused-vars */
export const processColor = (color: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 转换为 HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // 将色相转换为角度（0-360）
  h = Math.round(h * 360);

  // 根据不同的色相范围调整颜色
  let targetH = h,
    targetS = 80,
    targetL = 60;

  // 红色系：保持原有色相，但调整饱和度和亮度
  if (h >= 330 || h <= 30) {
    targetH = h;
    targetS = 80;
    targetL = 60;
  }
  // 蓝色系：稍微提高亮度
  else if (h >= 180 && h <= 240) {
    targetH = h;
    targetS = 70;
    targetL = 65;
  }
  // 绿色系：降低饱和度，提高亮度
  else if (h >= 90 && h <= 150) {
    targetH = h;
    targetS = 60;
    targetL = 70;
  }
  // 其他颜色：适度调整
  else {
    targetH = h;
    targetS = 75;
    targetL = 65;
  }

  return `hsl(${targetH}, ${targetS}%, ${targetL}%, 0.85)`;
};
/* eslint-enable @typescript-eslint/no-unused-vars */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateChartConfig = (rawData: any[]) => {
  const config: Record<string, { label: string; color: string }> = {};
  rawData.forEach((item) => {
    const processedColor = processColor(item.color);
    config[String(item.goalId)] = {
      label: item.summary,
      color: processedColor
    };
  });
  return config satisfies ChartConfig;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateChartData = (rawData: any[]) => {
  return rawData.map((item) => ({
    goalId: item.goalId,
    count: item.count,
    fill: processColor(item.color) // 使用处理过的颜色
  }));
};
