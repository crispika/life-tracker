import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { queries } from '@life-tracker/db';
import { DonutPieChart } from './components/DonutPieChart';
import {
  generateChartConfig,
  generateChartData,
  ValueFormatterType
} from './components/dashboard.util';

export default async function Home() {
  const activeGoalCount = await queries.goal.getActiveGoalCount(100000);
  const inProcessTaskCount = await queries.task.getInProcessTaskCount(
    100000,
    'IN_PROGRESS'
  );
  const doneTaskCount = await queries.task.getInProcessTaskCount(
    100000,
    'COMPLETED'
  );
  const worklogTimeByGoal =
    await queries.task.getWorklogTimeByFirstLevelGoal(100000);

  const goalCountChartConfig = generateChartConfig(activeGoalCount);
  const goalCountChartData = generateChartData(activeGoalCount);
  const taskCountChartConfig = generateChartConfig(inProcessTaskCount);
  const taskCountChartData = generateChartData(inProcessTaskCount);
  const doneTaskCountChartConfig = generateChartConfig(doneTaskCount);
  const doneTaskCountChartData = generateChartData(doneTaskCount);
  const worklogTimeChartConfig = generateChartConfig(worklogTimeByGoal);
  const worklogTimeChartData = generateChartData(worklogTimeByGoal);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-8">
        {/* 顶部概览卡片 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="relative">
            <CardHeader className="absolute top-0 left-0">
              <CardTitle className="text-sm font-medium">总活跃目标</CardTitle>
            </CardHeader>
            <CardContent className="mt-6 pb-4">
              <DonutPieChart
                chartData={goalCountChartData}
                chartConfig={goalCountChartConfig}
                dataKey="count"
                nameKey="goalId"
                sumDisplayName="活跃目标"
              />
            </CardContent>
          </Card>
          <Card className="relative">
            <CardHeader className="absolute top-0 left-0">
              <CardTitle className="text-sm font-medium">进行中任务</CardTitle>
            </CardHeader>
            <CardContent className="mt-6 pb-4">
              <DonutPieChart
                chartData={taskCountChartData}
                chartConfig={taskCountChartConfig}
                dataKey="count"
                nameKey="goalId"
                sumDisplayName="进行中任务"
              />
            </CardContent>
          </Card>
          <Card className="relative">
            <CardHeader className="absolute top-0 left-0">
              <CardTitle className="text-sm font-medium">已完成任务</CardTitle>
            </CardHeader>
            <CardContent className="mt-6 pb-4">
              <DonutPieChart
                chartData={doneTaskCountChartData}
                chartConfig={doneTaskCountChartConfig}
                dataKey="count"
                nameKey="goalId"
                sumDisplayName="已完成任务"
              />
            </CardContent>
          </Card>
          <Card className="relative">
            <CardHeader className="absolute top-0 left-0">
              <CardTitle className="text-sm font-medium">已投入时间</CardTitle>
            </CardHeader>
            <CardContent className="mt-6 pb-4">
              <DonutPieChart
                chartData={worklogTimeChartData}
                chartConfig={worklogTimeChartConfig}
                dataKey="count"
                nameKey="goalId"
                sumDisplayName="总投入"
                formatterType={ValueFormatterType.MINUTES_TO_TIME}
              />
            </CardContent>
          </Card>
        </div>

        {/* 长图表展示区域 */}
        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
          </CardHeader>
          <CardContent>{/* 这里将放置数据表格 */}</CardContent>
        </Card>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
