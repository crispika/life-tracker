'use client';
import { Label, Pie, PieChart } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { useMemo } from 'react';
import {
  ChartDataItem,
  formatters,
  ValueFormatterType
} from './dashboard.util';

export const DonutPieChart = <D extends string, N extends string>({
  chartData,
  chartConfig,
  dataKey,
  nameKey,
  sumDisplayName,
  formatterType = ValueFormatterType.DEFAULT
}: {
  chartData: ChartDataItem<D, N>[];
  chartConfig: ChartConfig;
  dataKey: D;
  nameKey: N;
  sumDisplayName: string;
  formatterType?: ValueFormatterType;
  emptyText?: string;
}) => {
  const total = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + Number(curr[dataKey]), 0);
  }, [chartData, dataKey]);

  const formatter = formatters[formatterType];

  console.log('chartData', chartData);

  if (!chartData.length || total === 0) {
    return (
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px] relative"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xl font-bold text-muted-foreground">
            {formatter(0)}
          </div>
          <div className="text-sm text-muted-foreground">{sumDisplayName}</div>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent valueFormatter={formatter} />}
        />
        <Pie
          data={chartData}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-xl font-bold"
                    >
                      {formatter(total)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {sumDisplayName}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};
