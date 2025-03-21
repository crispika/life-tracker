USE life_tracker;

-- 获取用户ID
SET @demo_user_id = (SELECT user_id FROM USER WHERE email = 'demo@example.com');

-- 获取目标状态ID
SET @active_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'ACTIVE');
SET @on_hold_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'ON_HOLD');
SET @completed_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'COMPLETED');
SET @aborted_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'ABORTED');
SET @archived_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'ARCHIVED');

-- 创建顶级目标
CALL create_goal(
  @demo_user_id,
  '#FF0000',
  '健康管理',
  '保持身体健康',
  NULL,
  'HT',
  @health_goal_id,
  @health_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#00FF00',
  '职业发展',
  '职业发展相关目标',
  NULL,
  'WK',
  @work_goal_id,
  @work_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#0000FF',
  '知识学习',
  '持续学习新知识',
  NULL,
  'LX',
  @learning_goal_id,
  @learning_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#FFC400',
  '休闲娱乐',
  '休闲娱乐相关目标',
  NULL,
  'RL',
  @relax_goal_id,
  @relax_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#00B8D9',
  '家庭生活',
  '家庭生活相关目标',
  NULL,
  'FM',
  @family_goal_id,
  @family_prefix_id
);

-- 创建子目标
CALL create_goal(
  @demo_user_id,
  '#FFA500',
  '运动健身',
  '保持运动习惯',
  @health_goal_id,
  NULL,
  @health_sport_goal_id,
  @health_sport_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#FF69B4',
  '健康饮食',
  '健康饮食计划',
  @health_goal_id,
  NULL,
  @health_diet_goal_id,
  @health_diet_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#4B0082',
  '项目开发',
  '项目开发相关目标',
  @work_goal_id,
  NULL,
  @work_dev_goal_id,
  @work_dev_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#8B4513',
  '技术学习',
  '学习新技术',
  @learning_goal_id,
  NULL,
  @learning_tech_goal_id,
  @learning_tech_prefix_id
);

-- 创建更多子目标
CALL create_goal(
  @demo_user_id,
  '#6554C0',
  '技术开发能力',
  '提升技术能力',
  @work_goal_id,
  NULL,
  @work_tech_goal_id,
  @work_tech_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#00C7E6',
  '项目管理能力',
  '提升项目管理能力',
  @work_goal_id,
  NULL,
  @work_mgmt_goal_id,
  @work_mgmt_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#FF8B00',
  '职业发展规划',
  '长期职业发展规划',
  @work_goal_id,
  NULL,
  @work_career_goal_id,
  @work_career_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#57D9A3',
  '日常锻炼',
  '保持身体健康的锻炼',
  @health_goal_id,
  NULL,
  @health_exercise_goal_id,
  @health_exercise_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#FF5630',
  '睡眠管理',
  '改善睡眠质量',
  @health_goal_id,
  NULL,
  @health_sleep_goal_id,
  @health_sleep_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#FFC400',
  '阅读计划',
  '阅读各类书籍',
  @relax_goal_id,
  NULL,
  @relax_read_goal_id,
  @relax_read_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#FF5630',
  '旅行计划',
  '探索新地方',
  @relax_goal_id,
  NULL,
  @relax_travel_goal_id,
  @relax_travel_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#4A6FDC',
  '摄影技能',
  '提高摄影技巧',
  @relax_goal_id,
  NULL,
  @relax_photo_goal_id,
  @relax_photo_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#36B37E',
  '编程语言学习',
  '学习新的编程语言',
  @learning_goal_id,
  NULL,
  @learning_prog_goal_id,
  @learning_prog_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#FF8B00',
  '外语学习计划',
  '提高外语水平',
  @learning_goal_id,
  NULL,
  @learning_lang_goal_id,
  @learning_lang_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#00B8D9',
  '家庭活动计划',
  '增加家庭共处时间',
  @family_goal_id,
  NULL,
  @family_act_goal_id,
  @family_act_prefix_id
);

CALL create_goal(
  @demo_user_id,
  '#FFC400',
  '家庭财务规划',
  '家庭财务规划',
  @family_goal_id,
  NULL,
  @family_finance_goal_id,
  @family_finance_prefix_id
);
