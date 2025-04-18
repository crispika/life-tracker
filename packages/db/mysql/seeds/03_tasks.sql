USE life_tracker;

-- 获取用户ID
SET @demo_user_id = (SELECT user_id FROM USER WHERE email = 'demo@example.com');

-- 获取前缀ID
SET @health_prefix_id = (SELECT prefix_id FROM UC_GOAL_PREFIX WHERE user_id = @demo_user_id AND prefix = 'HT');
SET @work_prefix_id = (SELECT prefix_id FROM UC_GOAL_PREFIX WHERE user_id = @demo_user_id AND prefix = 'WK');
SET @learning_prefix_id = (SELECT prefix_id FROM UC_GOAL_PREFIX WHERE user_id = @demo_user_id AND prefix = 'LX');
SET @relax_prefix_id = (SELECT prefix_id FROM UC_GOAL_PREFIX WHERE user_id = @demo_user_id AND prefix = 'RL');
SET @family_prefix_id = (SELECT prefix_id FROM UC_GOAL_PREFIX WHERE user_id = @demo_user_id AND prefix = 'FM');

-- 获取目标ID
SET @health_sport_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '运动健身');
SET @health_diet_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '健康饮食');
SET @work_dev_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '项目开发');
SET @work_mgmt_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '项目管理能力');
SET @work_career_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '职业发展规划');
SET @learning_tech_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '技术学习');
SET @learning_lang_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '外语学习计划');
SET @relax_read_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '阅读计划');
SET @relax_travel_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '旅行计划');
SET @family_act_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '家庭活动计划');
SET @family_finance_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '家庭财务规划');

-- 获取任务状态ID
SET @open_state_id = (SELECT state_id FROM UC_TASK_STATE WHERE user_id = @demo_user_id AND name = 'OPEN');
SET @in_progress_state_id = (SELECT state_id FROM UC_TASK_STATE WHERE user_id = @demo_user_id AND name = 'IN_PROGRESS');
SET @completed_state_id = (SELECT state_id FROM UC_TASK_STATE WHERE user_id = @demo_user_id AND name = 'COMPLETED');
SET @on_hold_state_id = (SELECT state_id FROM UC_TASK_STATE WHERE user_id = @demo_user_id AND name = 'ON_HOLD');
SET @aborted_state_id = (SELECT state_id FROM UC_TASK_STATE WHERE user_id = @demo_user_id AND name = 'ABORTED');
SET @archived_state_id = (SELECT state_id FROM UC_TASK_STATE WHERE user_id = @demo_user_id AND name = 'ARCHIVED');

-- 创建任务
CALL create_task(
  @health_prefix_id,
  @demo_user_id,
  '#FF0000',
  '每周跑步计划',
  '每周进行3次跑步训练',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 1 MONTH),
  180,
  @health_sport_id,
  @health_sport_task_id,
  @health_sport_task_code
);

CALL create_task(
  @health_prefix_id,
  @demo_user_id,
  '#FF69B4',
  '健康饮食计划',
  '制定并执行健康饮食计划',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 3 MONTH),
  120,
  @health_diet_id,
  @health_diet_task_id,
  @health_diet_task_code
);

CALL create_task(
  @health_prefix_id,
  @demo_user_id,
  '#00FF00',
  '睡眠改善计划',
  '改善睡眠质量，建立健康的作息习惯',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 2 MONTH),
  240,
  @health_sport_id,
  @health_sleep_task_id,
  @health_sleep_task_code
);

CALL create_task(
  @work_prefix_id,
  @demo_user_id,
  '#4B0082',
  '项目重构',
  '对现有项目进行重构，提高代码质量',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 2 MONTH),
  480,
  @work_dev_id,
  @work_refactor_task_id,
  @work_refactor_task_code
);

CALL create_task(
  @work_prefix_id,
  @demo_user_id,
  '#00C7E6',
  '团队管理培训',
  '参加团队管理培训课程',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 3 MONTH),
  360,
  @work_mgmt_id,
  @work_mgmt_task_id,
  @work_mgmt_task_code
);

CALL create_task(
  @work_prefix_id,
  @demo_user_id,
  '#FF8B00',
  '职业发展规划',
  '制定详细的职业发展规划',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 1 MONTH),
  180,
  @work_career_id,
  @work_career_task_id,
  @work_career_task_code
);

CALL create_task(
  @learning_prefix_id,
  @demo_user_id,
  '#8B4513',
  'TypeScript学习',
  '学习TypeScript基础知识',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 1 MONTH),
  240,
  @learning_tech_id,
  @learning_ts_task_id,
  @learning_ts_task_code
);

CALL create_task(
  @learning_prefix_id,
  @demo_user_id,
  '#36B37E',
  '英语口语提升',
  '提升英语口语水平',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 6 MONTH),
  720,
  @learning_lang_id,
  @learning_english_task_id,
  @learning_english_task_code
);

CALL create_task(
  @relax_prefix_id,
  @demo_user_id,
  '#FFC400',
  '周末徒步计划',
  '每月安排一次周末徒步活动',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 6 MONTH),
  720,
  @relax_travel_id,
  @relax_hiking_task_id,
  @relax_hiking_task_code
);

CALL create_task(
  @relax_prefix_id,
  @demo_user_id,
  '#FF5630',
  '音乐欣赏计划',
  '每周欣赏一部古典音乐作品',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 3 MONTH),
  180,
  @relax_read_id,
  @relax_music_task_id,
  @relax_music_task_code
);

CALL create_task(
  @relax_prefix_id,
  @demo_user_id,
  '#00B8D9',
  '电影观影计划',
  '每月观看一部经典电影',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 6 MONTH),
  360,
  @relax_read_id,
  @relax_movie_task_id,
  @relax_movie_task_code
);

CALL create_task(
  @family_prefix_id,
  @demo_user_id,
  '#FF8B00',
  '家庭旅行计划',
  '规划并执行一次家庭旅行',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 3 MONTH),
  480,
  @family_act_id,
  @family_travel_task_id,
  @family_travel_task_code
);

CALL create_task(
  @family_prefix_id,
  @demo_user_id,
  '#00B8D9',
  '家庭财务规划',
  '制定家庭财务规划方案',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 2 MONTH),
  240,
  @family_finance_id,
  @family_finance_task_id,
  @family_finance_task_code
);

CALL create_task(
  @family_prefix_id,
  @demo_user_id,
  '#FFC400',
  '家庭装修计划',
  '规划并执行家庭装修',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 6 MONTH),
  1440,
  @family_act_id,
  @family_renovation_task_id,
  @family_renovation_task_code
);

-- 创建历史任务
CALL create_task(
  @work_prefix_id,
  @demo_user_id,
  '#6554C0',
  '学习 React',
  '深入学习 React 框架及其生态系统',
  '2023-01-01 00:00:00',
  '2023-03-31 23:59:59',
  4800,
  @work_dev_id,
  @react_task_id,
  @react_task_code
);

CALL create_task(
  @work_prefix_id,
  @demo_user_id,
  '#6554C0',
  '学习 Next.js',
  '学习 Next.js 框架，构建全栈应用',
  '2023-04-01 00:00:00',
  '2023-06-30 23:59:59',
  7200,
  @work_dev_id,
  @nextjs_task_id,
  @nextjs_task_code
);

CALL create_task(
  @work_prefix_id,
  @demo_user_id,
  '#6554C0',
  '学习 TypeScript',
  '掌握 TypeScript 类型系统',
  '2023-07-01 00:00:00',
  '2023-09-30 23:59:59',
  3600,
  @work_dev_id,
  @ts_task_id,
  @ts_task_code
);

CALL create_task(
  @work_prefix_id,
  @demo_user_id,
  '#00C7E6',
  '敏捷开发认证',
  '获取敏捷开发认证',
  '2023-02-01 00:00:00',
  '2023-05-31 23:59:59',
  6000,
  @work_mgmt_id,
  @agile_task_id,
  @agile_task_code
);

CALL create_task(
  @health_prefix_id,
  @demo_user_id,
  '#57D9A3',
  '参加马拉松',
  '训练并参加半程马拉松',
  '2023-03-01 00:00:00',
  '2023-10-31 23:59:59',
  9000,
  @health_sport_id,
  @marathon_task_id,
  @marathon_task_code
);

CALL create_task(
  @relax_prefix_id,
  @demo_user_id,
  '#00B8D9',
  '阅读《三体》三部曲',
  '阅读刘慈欣的科幻小说《三体》三部曲',
  '2023-02-01 00:00:00',
  '2023-05-31 23:59:59',
  1800,
  @relax_read_id,
  @three_body_task_id,
  @three_body_task_code
);

CALL create_task(
  @relax_prefix_id,
  @demo_user_id,
  '#FFC400',
  '阅读《人类简史》',
  '阅读尤瓦尔·赫拉利的《人类简史》',
  '2023-06-01 00:00:00',
  '2023-07-31 23:59:59',
  1200,
  @relax_read_id,
  @sapiens_task_id,
  @sapiens_task_code
);

CALL create_task(
  @relax_prefix_id,
  @demo_user_id,
  '#FF5630',
  '国内旅行计划',
  '计划并执行国内旅行',
  '2023-05-01 00:00:00',
  '2023-10-31 23:59:59',
  4800,
  @relax_travel_id,
  @domestic_travel_task_id,
  @domestic_travel_task_code
);

CALL create_task(
  @learning_prefix_id,
  @demo_user_id,
  '#36B37E',
  '学习 Rust 语言',
  '学习 Rust 编程语言基础',
  '2023-01-01 00:00:00',
  '2023-03-31 23:59:59',
  3600,
  @learning_tech_id,
  @rust_task_id,
  @rust_task_code
);

CALL create_task(
  @family_prefix_id,
  @demo_user_id,
  '#00B8D9',
  '周末家庭日',
  '每月安排一个周末家庭日',
  '2023-01-01 00:00:00',
  '2023-12-31 23:59:59',
  5200,
  @family_act_id,
  @family_weekend_task_id,
  @family_weekend_task_code
);

CALL create_task(
  @family_prefix_id,
  @demo_user_id,
  '#00B8D9',
  '家庭旅行',
  '规划并执行一次家庭旅行',
  '2023-07-01 00:00:00',
  '2023-08-31 23:59:59',
  3600,
  @family_act_id,
  @family_travel_history_task_id,
  @family_travel_history_task_code
);