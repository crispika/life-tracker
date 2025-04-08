USE life_tracker;

-- 获取用户ID
SET @demo_user_id = (SELECT user_id FROM USER WHERE email = 'demo@example.com');

-- 定义颜色变量
SET @color_red = '#ff4d4f';
SET @color_orange = '#fa8c16';
SET @color_yellow = '#fadb14';
SET @color_green = '#52c41a';
SET @color_cyan = '#13c2c2';
SET @color_blue = '#1890ff';
SET @color_purple = '#722ed1';
SET @color_brown = '#8B4513';
SET @color_gray = '#8c8c8c';
SET @color_black = '#000000';

-- 获取目标状态ID
SET @active_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'ACTIVE');
SET @on_hold_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'ON_HOLD');
SET @completed_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'COMPLETED');
SET @aborted_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'ABORTED');
SET @archived_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'ARCHIVED');

-- 创建一级目标
CALL create_goal(
  @demo_user_id,
  @color_blue,
  '健康管理',
  '保持身体健康',
  NULL,
  'HT',
  TRUE,
  @health_goal_id,
  @health_prefix_id
);

CALL create_goal(
  @demo_user_id,
  @color_red,
  '职业发展',
  '职业发展相关目标',
  NULL,
  'WK',
  TRUE,
  @work_goal_id,
  @work_prefix_id
);


CALL create_goal(
  @demo_user_id,
  @color_green,
  '休闲娱乐',
  '休闲娱乐相关目标',
  NULL,
  'RL',
  TRUE,
  @relax_goal_id,
  @relax_prefix_id
);


-- 创建子目标
CALL create_goal(
  @demo_user_id,
  @color_blue,
  '运动健身',
  '保持运动习惯',
  @health_goal_id,
  NULL,
  FALSE,
  @health_sport_goal_id,
  @health_sport_prefix_id
);

CALL create_goal(
  @demo_user_id,
  @color_blue,
  '健康饮食',
  '健康饮食计划',
  @health_goal_id,
  NULL,
  FALSE,
  @health_diet_goal_id,
  @health_diet_prefix_id
);

CALL create_goal(
  @demo_user_id,
  @color_red,
  '项目开发',
  '项目开发相关目标',
  @work_goal_id,
  NULL,
  FALSE,
  @work_dev_goal_id,
  @work_dev_prefix_id
);

-- 创建更多子目标
CALL create_goal(
  @demo_user_id,
  @color_red,
  '技术开发能力',
  '提升技术能力',
  @work_goal_id,
  NULL,
  FALSE,
  @work_tech_goal_id,
  @work_tech_prefix_id
);

CALL create_goal(
  @demo_user_id,
  @color_red,
  '项目管理能力',
  '提升项目管理能力',
  @work_goal_id,
  NULL,
  FALSE,
  @work_mgmt_goal_id,
  @work_mgmt_prefix_id
);

CALL create_goal(
  @demo_user_id,
  @color_red,
  '职业发展规划',
  '长期职业发展规划',
  @work_goal_id,
  NULL,
  FALSE,
  @work_career_goal_id,
  @work_career_prefix_id
);

CALL create_goal(
  @demo_user_id,
  @color_blue,
  '日常锻炼',
  '保持身体健康的锻炼',
  @health_goal_id,
  NULL,
  FALSE,
  @health_exercise_goal_id,
  @health_exercise_prefix_id
);

CALL create_goal(
  @demo_user_id,
  @color_blue,
  '睡眠管理',
  '改善睡眠质量',
  @health_goal_id,
  NULL,
  FALSE,
  @health_sleep_goal_id,
  @health_sleep_prefix_id
);

CALL create_goal(
  @demo_user_id,
  @color_green,
  '阅读计划',
  '阅读各类书籍',
  @relax_goal_id,
  NULL,
  FALSE,
  @relax_read_goal_id,
  @relax_read_prefix_id
);

CALL create_goal(
  @demo_user_id,
  @color_green,
  '旅行计划',
  '探索新地方',
  @relax_goal_id,
  NULL,
  FALSE,
  @relax_travel_goal_id,
  @relax_travel_prefix_id
);

CALL create_goal(
  @demo_user_id,
  @color_green,
  '摄影技能',
  '提高摄影技巧',
  @relax_goal_id,
  NULL,
  FALSE,
  @relax_photo_goal_id,
  @relax_photo_prefix_id
);