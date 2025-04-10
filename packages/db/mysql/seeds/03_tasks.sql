USE life_tracker;

-- 获取用户ID
SET @demo_user_id = (SELECT user_id FROM USER WHERE email = 'demo@example.com');

-- 获取子目标ID
SET @health_sport_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '运动健身');
SET @health_diet_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '健康饮食');
SET @health_sleep_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '睡眠管理');

SET @work_dev_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '项目开发');
SET @work_tech_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '技术开发能力');
SET @work_mgmt_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '项目管理能力');
SET @work_career_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '职业发展规划');

SET @relax_read_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '阅读计划');
SET @relax_travel_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '旅行计划');
SET @relax_photo_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '摄影技能');

-- 获取任务状态ID
SET @open_state_id = (SELECT state_id FROM UC_TASK_STATE WHERE user_id = @demo_user_id AND name = 'OPEN');
SET @in_progress_state_id = (SELECT state_id FROM UC_TASK_STATE WHERE user_id = @demo_user_id AND name = 'IN_PROGRESS');
SET @completed_state_id = (SELECT state_id FROM UC_TASK_STATE WHERE user_id = @demo_user_id AND name = 'COMPLETED');
SET @on_hold_state_id = (SELECT state_id FROM UC_TASK_STATE WHERE user_id = @demo_user_id AND name = 'ON_HOLD');
SET @aborted_state_id = (SELECT state_id FROM UC_TASK_STATE WHERE user_id = @demo_user_id AND name = 'ABORTED');
SET @archived_state_id = (SELECT state_id FROM UC_TASK_STATE WHERE user_id = @demo_user_id AND name = 'ARCHIVED');

-- 创建健康相关任务
CALL create_task(
  @demo_user_id,
  '每周跑步计划',
  '每周进行3次跑步训练，每次30分钟',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 1 MONTH),
  180,
  @health_sport_id
);

CALL create_task(
  @demo_user_id,
  '健康饮食计划',
  '制定并执行健康饮食计划，控制饮食',
  NULL,
  NULL,
  120,
  @health_diet_id
);

CALL create_task(
  @demo_user_id,
  '睡眠改善计划',
  '改善睡眠质量，建立健康的作息习惯',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 2 MONTH),
  240,
  @health_sleep_id
);

-- 创建工作相关任务
CALL create_task(
  @demo_user_id,
  '项目重构',
  '对现有项目进行重构，提高代码质量',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 2 MONTH),
  480,
  @work_dev_id
);

CALL create_task(
  @demo_user_id,
  '技术栈升级',
  '升级项目技术栈，引入新技术',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 3 MONTH),
  360,
  @work_tech_id
);

CALL create_task(
  @demo_user_id,
  '团队管理培训',
  '参加团队管理培训课程',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 3 MONTH),
  360,
  @work_mgmt_id
);

CALL create_task(
  @demo_user_id,
  '职业发展规划',
  '制定详细的职业发展规划',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 1 MONTH),
  180,
  @work_career_id
);

-- 创建休闲相关任务
CALL create_task(
  @demo_user_id,
  '阅读《三体》',
  '阅读刘慈欣的科幻小说《三体》',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 1 MONTH),
  240,
  @relax_read_id
);

CALL create_task(
  @demo_user_id,
  '周末徒步计划',
  '每月安排一次周末徒步活动',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 6 MONTH),
  720,
  @relax_travel_id
);

CALL create_task(
  @demo_user_id,
  '摄影技能学习',
  '学习基础摄影技巧和构图',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 3 MONTH),
  180,
  @relax_photo_id
);

-- 创建历史任务
CALL create_task(
  @demo_user_id,
  '学习 React',
  '深入学习 React 框架及其生态系统',
  '2023-01-01 00:00:00',
  '2023-03-31 23:59:59',
  4800,
  @work_tech_id
);

CALL create_task(
  @demo_user_id,
  '学习 Next.js',
  '学习 Next.js 框架，构建全栈应用',
  '2023-04-01 00:00:00',
  '2023-06-30 23:59:59',
  7200,
  @work_tech_id
);

CALL create_task(
  @demo_user_id,
  '敏捷开发认证',
  '获取敏捷开发认证',
  '2023-02-01 00:00:00',
  '2023-05-31 23:59:59',
  6000,
  @work_mgmt_id
);

CALL create_task(
  @demo_user_id,
  '参加马拉松',
  '训练并参加半程马拉松',
  '2023-03-01 00:00:00',
  '2023-10-31 23:59:59',
  9000,
  @health_sport_id
);

CALL create_task(
  @demo_user_id,
  '阅读《人类简史》',
  '阅读尤瓦尔·赫拉利的《人类简史》',
  '2023-06-01 00:00:00',
  '2023-07-31 23:59:59',
  1200,
  @relax_read_id
);

CALL create_task(
  @demo_user_id,
  '国内旅行计划',
  '计划并执行国内旅行',
  '2023-05-01 00:00:00',
  '2023-10-31 23:59:59',
  4800,
  @relax_travel_id
);