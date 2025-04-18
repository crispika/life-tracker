'use client';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { formatMinutesToTimeString } from '../tasks/tasks.util';
import { generateChartConfig } from './dashboard.util';

interface FirstLevelGoal {
  goalId: number;
  summary: string;
  color: string;
}

interface StackedBarChartProps {
  data: Array<{
    date: string;
    [key: string]: number | string;
  }>;
  firstLevelGoals: FirstLevelGoal[];
}

export function RecentActivityStackedAreaChart({
  data,
  firstLevelGoals
}: StackedBarChartProps) {
  return (
    <ChartContainer
      config={generateChartConfig(firstLevelGoals)}
      className="aspect-auto h-[250px] w-full"
    >
      <BarChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
        barGap={0}
        barCategoryGap="10%"
      >
        <CartesianGrid
          horizontal={true}
          vertical={false}
          strokeDasharray="0 0"
        />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => format(new Date(value), 'MM/dd')}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          fontSize={12}
        />
        <YAxis
          tickFormatter={(value) => formatMinutesToTimeString(value)}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              valueFormatter={formatMinutesToTimeString}
            />
          }
        />
        {firstLevelGoals.map((goal) => (
          <Bar
            key={goal.goalId}
            dataKey={goal.goalId}
            name={goal.summary}
            stackId="1"
            fill={goal.color}
          />
        ))}
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}
