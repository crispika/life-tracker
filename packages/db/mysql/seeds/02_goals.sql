USE life_tracker;

-- 获取用户ID
SET @demo_user_id = (SELECT user_id FROM USER WHERE email = 'demo@example.com');

-- 定义颜色变量
SET @color_red = '#ff6469';
SET @color_orange = '#ffab64';
SET @color_yellow = '#ffe76a';
SET @color_green = '#d8e664';
SET @color_cyan = '#7ee7c4';
SET @color_blue = '#7ed3f0';
SET @color_purple = '#c5b5fa';
SET @color_brown = '#DCAF8E';
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
  'Health',
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
  'Work',
  TRUE,
  @work_goal_id,
  @work_prefix_id
);


CALL create_goal(
  @demo_user_id,
  @color_cyan,
  '兴趣爱好',
  '兴趣爱好相关目标',
  NULL,
  'Relax',
  TRUE,
  @relax_goal_id,
  @relax_prefix_id
);


-- 创建子目标
CALL create_goal(
  @demo_user_id,
  @color_blue,
  '运动健身',
  '保持运动习保持运动习惯,这能很好的帮助你其他的目标达成惯',
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
  '健康的饮食是所有体能产生的基础，好的食物在强健你的身体，差的食物在消耗你的身体和源动力。',
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
  @color_cyan,
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
  @color_cyan,
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
  @color_cyan,
  '摄影技能',
  '提高摄影技巧',
  @relax_goal_id,
  NULL,
  FALSE,
  @relax_photo_goal_id,
  @relax_photo_prefix_id
);