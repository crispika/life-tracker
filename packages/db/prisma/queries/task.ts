import { prisma } from '../../index';

const getTasksByUserId = async (userId: number) => {
  const tasks = await prisma.uC_TASK.findMany({
    where: {
      user_id: userId
    },
    select: {
      task_id: true,
      code: true,
      summary: true,
      description: true,
      start_date: true,
      due_date: true,
      original_estimate_minutes: true,
      time_spent_minutes: true,
      UC_GOAL: {
        select: {
          goal_id: true,
          summary: true,
          color: true,
          UC_GOAL_PREFIX: {
            select: {
              prefix: true
            }
          }
        }
      },
      UC_TASK_STATE: {
        select: {
          name: true,
          state_id: true,
          system_defined: true
        }
      }
    },
    orderBy: {
      UC_GOAL: {
        goal_id: 'asc'
      }
    }
  });

  return tasks.map((t) => ({
    id: t.task_id,
    code: t.code,
    summary: t.summary,
    description: t.description,
    startDate: t.start_date,
    dueDate: t.due_date,
    originalEstimate: t.original_estimate_minutes,
    timeSpent: t.time_spent_minutes,
    goalSummary: t.UC_GOAL?.summary,
    goalColor: t.UC_GOAL?.color,
    prefix: t.UC_GOAL?.UC_GOAL_PREFIX?.prefix,
    goalId: t.UC_GOAL?.goal_id,
    state: {
      name: t.UC_TASK_STATE.name,
      id: t.UC_TASK_STATE.state_id,
      systemDefined: t.UC_TASK_STATE.system_defined
    }
  }));
};

const getTaskDetailById = async (taskId: number) => {
  const task = await prisma.uC_TASK.findUnique({
    where: {
      task_id: taskId
    },
    select: {
      task_id: true,
      code: true,
      summary: true,
      description: true,
      start_date: true,
      due_date: true,
      original_estimate_minutes: true,
      time_spent_minutes: true,
      UC_TASK_STATE: {
        select: {
          name: true,
          state_id: true,
          system_defined: true
        }
      },
      UC_GOAL: {
        select: {
          summary: true,
          color: true,
          goal_id: true,
          UC_GOAL_PREFIX: {
            select: {
              prefix: true
            }
          }
        }
      }
    }
  });
  if (!task) {
    throw new Error('Task not found');
  }
  return {
    id: task.task_id,
    code: task.code,
    summary: task.summary,
    description: task.description,
    startDate: task.start_date,
    dueDate: task.due_date,
    originalEstimate: task.original_estimate_minutes,
    timeSpent: task.time_spent_minutes,
    state: {
      name: task.UC_TASK_STATE.name,
      id: task.UC_TASK_STATE.state_id,
      systemDefined: task.UC_TASK_STATE.system_defined
    },
    prefix: task.UC_GOAL?.UC_GOAL_PREFIX.prefix,
    goalSummary: task.UC_GOAL?.summary,
    goalColor: task.UC_GOAL?.color,
    goalId: task.UC_GOAL?.goal_id
  };
};

const getTaskStatesByUserId = async (userId: number) => {
  const states = await prisma.uC_TASK_STATE.findMany({
    where: {
      user_id: userId
    },
    select: {
      name: true,
      state_id: true,
      system_defined: true
    }
  });
  return states.map((state) => ({
    name: state.name,
    id: state.state_id,
    systemDefined: state.system_defined
  }));
};

const getTaskCurrentState = async (taskId: number) => {
  const currentState = await prisma.uC_TASK.findUnique({
    where: {
      task_id: taskId
    },
    select: {
      UC_TASK_STATE: {
        select: {
          name: true,
          state_id: true,
          system_defined: true
        }
      }
    }
  });

  if (!currentState) {
    throw new Error('Task state not found');
  }

  return {
    name: currentState.UC_TASK_STATE.name,
    id: currentState.UC_TASK_STATE.state_id,
    systemDefined: currentState.UC_TASK_STATE.system_defined
  };
};

const getTaskWorklogs = async (taskId: number, userId: number) => {
  const worklogs = await prisma.uC_TASK_WORKLOG.findMany({
    where: {
      task_id: taskId,
      user_id: userId
    },
    select: {
      worklog_id: true,
      time_spent_minutes: true,
      note: true,
      log_date: true,
      task_id: true
    },
    orderBy: {
      log_date: 'desc'
    }
  });

  return worklogs.map((worklog) => ({
    logId: worklog.worklog_id,
    timeSpent: worklog.time_spent_minutes,
    note: worklog.note || '',
    logDate: worklog.log_date,
    taskId: worklog.task_id
  }));
};

const getActiveTasksWithGoalPath = async (userId: number) => {
  // 1. 首先获取所有符合条件的任务
  const tasks = await prisma.uC_TASK.findMany({
    where: {
      user_id: userId,
      UC_TASK_STATE: {
        name: 'IN_PROGRESS'
      }
    },
    select: {
      task_id: true,
      code: true,
      summary: true,
      description: true,
      start_date: true,
      due_date: true,
      original_estimate_minutes: true,
      time_spent_minutes: true,
      UC_GOAL: {
        select: {
          goal_id: true,
          summary: true,
          color: true,
          goal_path: true,
          UC_GOAL_PREFIX: {
            select: {
              prefix: true
            }
          }
        }
      },
      UC_TASK_STATE: {
        select: {
          name: true,
          state_id: true,
          system_defined: true
        }
      }
    }
  });

  // 2. 收集所有需要的goal_id
  const goalIds = new Set<number>();
  tasks.forEach((task) => {
    if (task.UC_GOAL?.goal_path) {
      // 解析goal_path中的goal_id
      const ids = task.UC_GOAL.goal_path
        .split('/')
        .filter((id) => id !== '')
        .map((id) => parseInt(id));
      ids.forEach((id) => goalIds.add(id));
    }
  });

  // 3. 一次性查询所有相关的目标
  const goals = await prisma.uC_GOAL.findMany({
    where: {
      goal_id: {
        in: Array.from(goalIds)
      }
    },
    select: {
      goal_id: true,
      summary: true,
      color: true
    }
  });

  // 4. 创建目标ID到目标对象的映射
  const goalMap = new Map(
    goals.map((goal) => [
      goal.goal_id,
      {
        id: goal.goal_id,
        summary: goal.summary,
        color: goal.color
      }
    ])
  );

  // 5. 返回任务列表，每个任务包含其路径中的所有目标
  return tasks.map((t) => {
    const goalPath = t.UC_GOAL?.goal_path || '';
    const goals = goalPath
      .split('/')
      .filter((id) => id !== '')
      .map((id) => parseInt(id))
      .map((id) => goalMap.get(id))
      .filter(
        (goal): goal is { id: number; summary: string; color: string } =>
          goal !== undefined
      );

    return {
      id: t.task_id,
      code: t.code,
      summary: t.summary,
      description: t.description,
      startDate: t.start_date,
      dueDate: t.due_date,
      originalEstimate: t.original_estimate_minutes,
      timeSpent: t.time_spent_minutes,
      goalSummary: t.UC_GOAL.summary,
      goalColor: t.UC_GOAL.color,
      prefix: t.UC_GOAL.UC_GOAL_PREFIX.prefix,
      goalId: t.UC_GOAL.goal_id,
      rootGoal: goals[0],
      goalPath,
      pathedGoals: goals.slice(1),
      state: {
        name: t.UC_TASK_STATE.name,
        id: t.UC_TASK_STATE.state_id,
        systemDefined: t.UC_TASK_STATE.system_defined
      }
    };
  });
};

async function getGroupedTaskCountByTaskState(
  userId: number,
  taskState: string
) {
  try {
    // 1. 首先获取所有进行中的任务
    const inProcessTasks = await prisma.uC_TASK.findMany({
      where: {
        user_id: userId,
        UC_TASK_STATE: {
          name: taskState
        }
      },
      select: {
        task_id: true,
        goal_id: true,
        UC_GOAL: {
          select: {
            goal_path: true
          }
        }
      }
    });

    // 2. 收集所有需要的一级目标ID
    const firstLevelGoalIds = new Set<number>();
    inProcessTasks.forEach((task) => {
      const firstLevelGoalId = task.UC_GOAL.goal_path.split('/')[1];
      if (firstLevelGoalId) {
        firstLevelGoalIds.add(Number(firstLevelGoalId));
      }
    });

    // 3. 一次性查询所有一级目标的信息
    const firstLevelGoals = await prisma.uC_GOAL.findMany({
      where: {
        goal_id: {
          in: Array.from(firstLevelGoalIds)
        }
      },
      select: {
        goal_id: true,
        summary: true,
        color: true
      }
    });

    // 4. 创建一级目标ID到目标信息的映射
    const firstLevelGoalMap = new Map(
      firstLevelGoals.map((goal) => [goal.goal_id, goal])
    );

    // 5. 统计每个一级目标下的任务数
    return Object.values(
      inProcessTasks.reduce<
        Record<
          string,
          { color: string; count: number; summary: string; goalId: number }
        >
      >((acc, curr) => {
        const firstLevelGoalId = curr.UC_GOAL.goal_path.split('/')[1];
        if (!acc[firstLevelGoalId]) {
          const firstLevelGoal = firstLevelGoalMap.get(
            Number(firstLevelGoalId)
          );
          if (firstLevelGoal) {
            acc[firstLevelGoalId] = {
              color: firstLevelGoal.color,
              count: 1,
              summary: firstLevelGoal.summary,
              goalId: firstLevelGoal.goal_id
            };
          }
        } else {
          acc[firstLevelGoalId].count++;
        }
        return acc;
      }, {})
    );
  } catch (error) {
    console.error('Error fetching in-process task count:', error);
    throw error;
  }
}

async function getWorklogTimeByFirstLevelGoal(userId: number) {
  try {
    // 1. 获取所有任务的工作日志
    const worklogs = await prisma.uC_TASK_WORKLOG.findMany({
      where: {
        user_id: userId
      },
      select: {
        time_spent_minutes: true,
        task_id: true,
        UC_TASK: {
          select: {
            UC_GOAL: {
              select: {
                goal_path: true
              }
            }
          }
        }
      }
    });

    // 2. 收集所有需要的一级目标ID
    const firstLevelGoalIds = new Set<number>();
    worklogs.forEach((worklog) => {
      const firstLevelGoalId = worklog.UC_TASK.UC_GOAL.goal_path.split('/')[1];
      if (firstLevelGoalId) {
        firstLevelGoalIds.add(Number(firstLevelGoalId));
      }
    });

    // 3. 一次性查询所有一级目标的信息
    const firstLevelGoals = await prisma.uC_GOAL.findMany({
      where: {
        goal_id: {
          in: Array.from(firstLevelGoalIds)
        }
      },
      select: {
        goal_id: true,
        summary: true,
        color: true
      }
    });

    // 4. 创建一级目标ID到目标信息的映射
    const firstLevelGoalMap = new Map(
      firstLevelGoals.map((goal) => [goal.goal_id, goal])
    );

    // 5. 统计每个一级目标下的总工时
    return Object.values(
      worklogs.reduce<
        Record<
          string,
          { color: string; count: number; summary: string; goalId: number }
        >
      >((acc, curr) => {
        const firstLevelGoalId = curr.UC_TASK.UC_GOAL.goal_path.split('/')[1];
        if (!acc[firstLevelGoalId]) {
          const firstLevelGoal = firstLevelGoalMap.get(
            Number(firstLevelGoalId)
          );
          if (firstLevelGoal) {
            acc[firstLevelGoalId] = {
              color: firstLevelGoal.color,
              count: curr.time_spent_minutes,
              summary: firstLevelGoal.summary,
              goalId: firstLevelGoal.goal_id
            };
          }
        } else {
          acc[firstLevelGoalId].count += curr.time_spent_minutes;
        }
        return acc;
      }, {})
    );
  } catch (error) {
    console.error('Error fetching worklog time by first level goal:', error);
    throw error;
  }
}

async function getWorklogTimeByDateAndFirstLevelGoal(userId: number) {
  try {
    // 使用视图获取数据
    const worklogs = await prisma.$queryRaw<
      Array<{
        user_id: number;
        date: Date;
        task_id: number;
        time_spent_minutes: number;
        goal_id: number;
        goal_summary: string;
        goal_color: string;
        goal_path: string;
        task_summary: string;
        task_description: string | null;
      }>
    >`
      SELECT * FROM vw_recent_worklog_by_date
      WHERE user_id = ${userId}
    `;

    // 按日期和一级目标分组
    const groupedData = worklogs.reduce<Record<string, Record<string, number>>>(
      (acc, worklog) => {
        const date = worklog.date.toISOString().split('T')[0];
        const firstLevelGoalId = worklog.goal_path.split('/')[1];

        if (!acc[date]) {
          acc[date] = {};
        }

        if (!acc[date][firstLevelGoalId]) {
          acc[date][firstLevelGoalId] = 0;
        }

        acc[date][firstLevelGoalId] += worklog.time_spent_minutes;
        return acc;
      },
      {}
    );

    // 获取所有涉及的一级目标信息
    const firstLevelGoalIds = new Set<number>();
    worklogs.forEach((worklog) => {
      const firstLevelGoalId = worklog.goal_path.split('/')[1];
      if (firstLevelGoalId) {
        firstLevelGoalIds.add(Number(firstLevelGoalId));
      }
    });

    const firstLevelGoals = await prisma.uC_GOAL.findMany({
      where: {
        goal_id: {
          in: Array.from(firstLevelGoalIds)
        }
      },
      select: {
        goal_id: true,
        summary: true,
        color: true
      }
    });

    // 转换数据格式为前端所需的格式
    const result = Object.entries(groupedData).map(([date, goals]) => {
      const dataPoint: any = { date };
      firstLevelGoals.forEach((goal) => {
        dataPoint[goal.goal_id] = goals[goal.goal_id] || 0;
      });
      return dataPoint;
    });

    return {
      data: result,
      firstLevelGoals: firstLevelGoals.map((goal) => ({
        goalId: goal.goal_id,
        summary: goal.summary,
        color: goal.color
      }))
    };
  } catch (error) {
    console.error(
      'Error fetching worklog time by date and first level goal:',
      error
    );
    throw error;
  }
}

export default {
  getTasksByUserId,
  getTaskDetailById,
  getTaskStatesByUserId,
  getTaskCurrentState,
  getTaskWorklogs,
  getActiveTasksWithGoalPath,
  getInProcessTaskCount: getGroupedTaskCountByTaskState,
  getWorklogTimeByFirstLevelGoal,
  getWorklogTimeByDateAndFirstLevelGoal
};
