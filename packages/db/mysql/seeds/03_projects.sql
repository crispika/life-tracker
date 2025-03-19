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
SET @dev_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '技术开发能力');
SET @mgmt_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '项目管理能力');
SET @exe_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '日常锻炼');
SET @diet_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '健康饮食');
SET @read_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '阅读计划');
SET @travel_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '旅行计划');
SET @prog_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '编程语言学习');
SET @family_act_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '家庭活动计划');

-- 获取项目状态ID
SET @open_state_id = (SELECT state_id FROM UC_PROJECT_STATE WHERE user_id = @demo_user_id AND name = 'OPEN');
SET @in_progress_state_id = (SELECT state_id FROM UC_PROJECT_STATE WHERE user_id = @demo_user_id AND name = 'IN_PROGRESS');
SET @completed_state_id = (SELECT state_id FROM UC_PROJECT_STATE WHERE user_id = @demo_user_id AND name = 'COMPLETED');
SET @on_hold_state_id = (SELECT state_id FROM UC_PROJECT_STATE WHERE user_id = @demo_user_id AND name = 'ON_HOLD');
SET @aborted_state_id = (SELECT state_id FROM UC_PROJECT_STATE WHERE user_id = @demo_user_id AND name = 'ABORTED');
SET @archived_state_id = (SELECT state_id FROM UC_PROJECT_STATE WHERE user_id = @demo_user_id AND name = 'ARCHIVED');

-- 创建项目
CALL create_project(
  @health_prefix_id, -- prefix_id
  @demo_user_id, -- user_id
  '#FF0000', -- color
  '每周跑步计划', -- summary
  '每周进行3次跑步训练', -- description
  NOW(3), -- start_date
  DATE_ADD(NOW(3), INTERVAL 1 MONTH), -- due_date
  180, -- original_estimate_minutes
  @health_sport_goal_id, -- goal_id
  @health_sport_project_id, -- project_id
  @health_sport_project_code -- code
);

CALL create_project(
  @health_prefix_id,
  @demo_user_id,
  '#FF69B4',
  '健康饮食计划',
  '制定并执行健康饮食计划',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 3 MONTH),
  120,
  @health_diet_goal_id,
  @health_diet_project_id,
  @health_diet_project_code
);

CALL create_project(
  @health_prefix_id,
  @demo_user_id,
  '#00FF00',
  '睡眠改善计划',
  '改善睡眠质量，建立健康的作息习惯',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 2 MONTH),
  240,
  @health_sport_goal_id,
  @health_sleep_project_id,
  @health_sleep_project_code
);

CALL create_project(
  @work_prefix_id,
  @demo_user_id,
  '#4B0082',
  '项目重构',
  '对现有项目进行重构，提高代码质量',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 2 MONTH),
  480,
  @work_dev_goal_id,
  @work_refactor_project_id,
  @work_refactor_project_code
);

CALL create_project(
  @work_prefix_id,
  @demo_user_id,
  '#00C7E6',
  '团队管理培训',
  '参加团队管理培训课程',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 3 MONTH),
  360,
  @mgmt_id,
  @work_mgmt_project_id,
  @work_mgmt_project_code
);

CALL create_project(
  @work_prefix_id,
  @demo_user_id,
  '#FF8B00',
  '职业发展规划',
  '制定详细的职业发展规划',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 1 MONTH),
  180,
  @mgmt_id,
  @work_career_project_id,
  @work_career_project_code
);

CALL create_project(
  @learning_prefix_id,
  @demo_user_id,
  '#8B4513',
  'TypeScript学习',
  '学习TypeScript基础知识',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 1 MONTH),
  240,
  @learning_tech_goal_id,
  @learning_ts_project_id,
  @learning_ts_project_code
);

CALL create_project(
  @learning_prefix_id,
  @demo_user_id,
  '#36B37E',
  '英语口语提升',
  '提升英语口语水平',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 6 MONTH),
  720,
  @prog_id,
  @learning_english_project_id,
  @learning_english_project_code
);

CALL create_project(
  @learning_prefix_id,
  @demo_user_id,
  '#FF5630',
  '摄影技巧学习',
  '学习专业摄影技巧',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 2 MONTH),
  300,
  @prog_id,
  @learning_photo_project_id,
  @learning_photo_project_code
);

CALL create_project(
  @relax_prefix_id,
  @demo_user_id,
  '#FFC400',
  '周末徒步计划',
  '每月安排一次周末徒步活动',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 6 MONTH),
  720,
  @travel_id,
  @relax_hiking_project_id,
  @relax_hiking_project_code
);

CALL create_project(
  @relax_prefix_id,
  @demo_user_id,
  '#FF5630',
  '音乐欣赏计划',
  '每周欣赏一部古典音乐作品',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 3 MONTH),
  180,
  @read_id,
  @relax_music_project_id,
  @relax_music_project_code
);

CALL create_project(
  @relax_prefix_id,
  @demo_user_id,
  '#00B8D9',
  '电影观影计划',
  '每月观看一部经典电影',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 6 MONTH),
  360,
  @read_id,
  @relax_movie_project_id,
  @relax_movie_project_code
);

CALL create_project(
  @family_prefix_id,
  @demo_user_id,
  '#FF8B00',
  '家庭旅行计划',
  '规划并执行一次家庭旅行',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 3 MONTH),
  480,
  @family_act_id,
  @family_travel_project_id,
  @family_travel_project_code
);

CALL create_project(
  @family_prefix_id,
  @demo_user_id,
  '#00B8D9',
  '家庭财务规划',
  '制定家庭财务规划方案',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 2 MONTH),
  240,
  @family_act_id,
  @family_finance_project_id,
  @family_finance_project_code
);

CALL create_project(
  @family_prefix_id,
  @demo_user_id,
  '#FFC400',
  '家庭装修计划',
  '规划并执行家庭装修',
  NOW(3),
  DATE_ADD(NOW(3), INTERVAL 6 MONTH),
  1440,
  @family_act_id,
  @family_renovation_project_id,
  @family_renovation_project_code
);

-- 创建历史项目
CALL create_project(
  @work_prefix_id,
  @demo_user_id,
  '#6554C0',
  '学习 React',
  '深入学习 React 框架及其生态系统',
  '2023-01-01 00:00:00',
  '2023-03-31 23:59:59',
  4800,
  @dev_id,
  @react_project_id,
  @react_project_code
);

CALL create_project(
  @work_prefix_id,
  @demo_user_id,
  '#6554C0',
  '学习 Next.js',
  '学习 Next.js 框架，构建全栈应用',
  '2023-04-01 00:00:00',
  '2023-06-30 23:59:59',
  7200,
  @dev_id,
  @nextjs_project_id,
  @nextjs_project_code
);

CALL create_project(
  @work_prefix_id,
  @demo_user_id,
  '#6554C0',
  '学习 TypeScript',
  '掌握 TypeScript 类型系统',
  '2023-07-01 00:00:00',
  '2023-09-30 23:59:59',
  3600,
  @dev_id,
  @ts_project_id,
  @ts_project_code
);

CALL create_project(
  @work_prefix_id,
  @demo_user_id,
  '#00C7E6',
  '敏捷开发认证',
  '获取敏捷开发认证',
  '2023-02-01 00:00:00',
  '2023-05-31 23:59:59',
  6000,
  @mgmt_id,
  @agile_project_id,
  @agile_project_code
);

CALL create_project(
  @health_prefix_id,
  @demo_user_id,
  '#57D9A3',
  '参加马拉松',
  '训练并参加半程马拉松',
  '2023-03-01 00:00:00',
  '2023-10-31 23:59:59',
  9000,
  @exe_id,
  @marathon_project_id,
  @marathon_project_code
);

CALL create_project(
  @relax_prefix_id,
  @demo_user_id,
  '#00B8D9',
  '阅读《三体》三部曲',
  '阅读刘慈欣的科幻小说《三体》三部曲',
  '2023-02-01 00:00:00',
  '2023-05-31 23:59:59',
  1800,
  @read_id,
  @three_body_project_id,
  @three_body_project_code
);

CALL create_project(
  @relax_prefix_id,
  @demo_user_id,
  '#FFC400',
  '阅读《人类简史》',
  '阅读尤瓦尔·赫拉利的《人类简史》',
  '2023-06-01 00:00:00',
  '2023-07-31 23:59:59',
  1200,
  @read_id,
  @sapiens_project_id,
  @sapiens_project_code
);

CALL create_project(
  @relax_prefix_id,
  @demo_user_id,
  '#FF5630',
  '国内旅行计划',
  '计划并执行国内旅行',
  '2023-05-01 00:00:00',
  '2023-10-31 23:59:59',
  4800,
  @travel_id,
  @domestic_travel_project_id,
  @domestic_travel_project_code
);

CALL create_project(
  @learning_prefix_id,
  @demo_user_id,
  '#36B37E',
  '学习 Rust 语言',
  '学习 Rust 编程语言基础',
  '2023-01-01 00:00:00',
  '2023-03-31 23:59:59',
  3600,
  @prog_id,
  @rust_project_id,
  @rust_project_code
);

CALL create_project(
  @family_prefix_id,
  @demo_user_id,
  '#00B8D9',
  '周末家庭日',
  '每月安排一个周末家庭日',
  '2023-01-01 00:00:00',
  '2023-12-31 23:59:59',
  5200,
  @family_act_id,
  @family_weekend_project_id,
  @family_weekend_project_code
);

CALL create_project(
  @family_prefix_id,
  @demo_user_id,
  '#00B8D9',
  '家庭旅行',
  '规划并执行一次家庭旅行',
  '2023-07-01 00:00:00',
  '2023-08-31 23:59:59',
  3600,
  @family_act_id,
  @family_travel_history_project_id,
  @family_travel_history_project_code
);