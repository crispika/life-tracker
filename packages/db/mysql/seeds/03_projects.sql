USE life_tracker;

-- 获取用户ID
SET @demo_user_id = (SELECT user_id FROM USER WHERE email = 'demo@example.com');

-- 获取目标ID
SET @dev_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '技术开发');
SET @mgmt_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '项目管理');
SET @exe_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '锻炼');
SET @diet_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '饮食');
SET @read_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '阅读');
SET @travel_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '旅行');
SET @prog_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '编程语言');
SET @family_act_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '家庭活动');

-- 获取项目状态ID
SET @open_state_id = (SELECT state_id FROM UC_PROJECT_STATE WHERE user_id = @demo_user_id AND name = 'OPEN');
SET @in_progress_state_id = (SELECT state_id FROM UC_PROJECT_STATE WHERE user_id = @demo_user_id AND name = 'IN_PROGRESS');
SET @completed_state_id = (SELECT state_id FROM UC_PROJECT_STATE WHERE user_id = @demo_user_id AND name = 'COMPLETED');
SET @on_hold_state_id = (SELECT state_id FROM UC_PROJECT_STATE WHERE user_id = @demo_user_id AND name = 'ON_HOLD');
SET @aborted_state_id = (SELECT state_id FROM UC_PROJECT_STATE WHERE user_id = @demo_user_id AND name = 'ABORTED');
SET @archived_state_id = (SELECT state_id FROM UC_PROJECT_STATE WHERE user_id = @demo_user_id AND name = 'ARCHIVED');

INSERT INTO UC_PROJECT (
  user_id, color, summary, description, 
  start_date, due_date, original_estimate_minutes, time_spent_minutes, 
  state_id, goal_id
)
VALUES 
(
  @demo_user_id, '#6554C0', '学习 React', '深入学习 React 框架及其生态系统',
  '2023-01-01 00:00:00', '2023-03-31 23:59:59',
  4800, 3600, @completed_state_id, @dev_id
),
(
  @demo_user_id, '#6554C0', '学习 Next.js', '学习 Next.js 框架，构建全栈应用',
  '2023-04-01 00:00:00', '2023-06-30 23:59:59',
  7200, 5400, @in_progress_state_id, @dev_id
),
(
  @demo_user_id, '#6554C0', '学习 TypeScript', '掌握 TypeScript 类型系统',
  '2023-07-01 00:00:00', '2023-09-30 23:59:59',
  3600, 0, @open_state_id, @dev_id
),
(
  @demo_user_id, '#00C7E6', '敏捷开发认证', '获取敏捷开发认证',
  '2023-02-01 00:00:00', '2023-05-31 23:59:59',
  6000, 2400, @on_hold_state_id, @mgmt_id
),
(
  @demo_user_id, '#57D9A3', '每周跑步计划', '每周跑步三次，每次至少30分钟',
  '2023-01-01 00:00:00', '2023-12-31 23:59:59',
  7800, 5200, @in_progress_state_id, @exe_id
),
(
  @demo_user_id, '#57D9A3', '参加马拉松', '训练并参加半程马拉松',
  '2023-03-01 00:00:00', '2023-10-31 23:59:59',
  9000, 3000, @aborted_state_id, @exe_id
),
(
  @demo_user_id, '#00B8D9', '健康饮食计划', '制定并执行健康饮食计划',
  '2023-01-15 00:00:00', '2023-04-15 23:59:59',
  2700, 2700, @completed_state_id, @diet_id
),
(
  @demo_user_id, '#FFC400', '阅读《三体》三部曲', '阅读刘慈欣的科幻小说《三体》三部曲',
  '2023-02-01 00:00:00', '2023-05-31 23:59:59',
  1800, 1500, @completed_state_id, @read_id
),
(
  @demo_user_id, '#FFC400', '阅读《人类简史》', '阅读尤瓦尔·赫拉利的《人类简史》',
  '2023-06-01 00:00:00', '2023-07-31 23:59:59',
  1200, 300, @in_progress_state_id, @read_id
),
(
  @demo_user_id, '#FF5630', '国内旅行计划', '计划并执行国内旅行',
  '2023-05-01 00:00:00', '2023-10-31 23:59:59',
  4800, 1200, @in_progress_state_id, @travel_id
),
(
  @demo_user_id, '#36B37E', '学习 Rust 语言', '学习 Rust 编程语言基础',
  '2023-01-01 00:00:00', '2023-03-31 23:59:59',
  3600, 900, @on_hold_state_id, @prog_id
),
(
  @demo_user_id, '#00B8D9', '周末家庭日', '每月安排一个周末家庭日',
  '2023-01-01 00:00:00', '2023-12-31 23:59:59',
  5200, 2600, @in_progress_state_id, @family_act_id
),
(
  @demo_user_id, '#00B8D9', '家庭旅行', '规划并执行一次家庭旅行',
  '2023-07-01 00:00:00', '2023-08-31 23:59:59',
  3600, 0, @open_state_id, @family_act_id
); 