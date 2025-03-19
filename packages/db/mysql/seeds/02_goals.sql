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
  100000, -- user_id
  '#FF0000', -- color
  '健康管理', -- summary
  '保持身体健康', -- description
  NULL, -- parent_id
  'HT', -- prefix
  @health_goal_id, -- goal_id
  @health_prefix_id -- prefix_id
);

CALL create_goal(
  100000,
  '#00FF00',
  '职业发展',
  '职业发展相关目标',
  NULL,
  'WK',
  @work_goal_id,
  @work_prefix_id
);

CALL create_goal(
  100000,
  '#0000FF',
  '知识学习',
  '持续学习新知识',
  NULL,
  'LX',
  @learning_goal_id,
  @learning_prefix_id
);

CALL create_goal(
  100000,
  '#FFC400',
  '休闲娱乐',
  '休闲娱乐相关目标',
  NULL,
  'RL',
  @relax_goal_id,
  @relax_prefix_id
);

CALL create_goal(
  100000,
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
  100000,
  '#FFA500',
  '运动健身',
  '保持运动习惯',
  @health_goal_id,
  'SP', -- prefix
  @health_sport_goal_id,
  @health_sport_prefix_id
);

CALL create_goal(
  100000,
  '#FF69B4',
  '健康饮食',
  '健康饮食计划',
  @health_goal_id,
  'DT', -- prefix
  @health_diet_goal_id,
  @health_diet_prefix_id
);

CALL create_goal(
  100000,
  '#4B0082',
  '项目开发',
  '项目开发相关目标',
  @work_goal_id,
  'PD', -- prefix
  @work_dev_goal_id,
  @work_dev_prefix_id
);

CALL create_goal(
  100000,
  '#8B4513',
  '技术学习',
  '学习新技术',
  @learning_goal_id,
  'TL', -- prefix
  @learning_tech_goal_id,
  @learning_tech_prefix_id
);

-- 获取顶级目标ID
SET @work_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '职业发展');
SET @health_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '健康管理');
SET @relax_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '休闲娱乐');
SET @study_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '知识学习');
SET @family_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '家庭生活');

-- 插入子目标
INSERT INTO UC_GOAL (user_id, color, summary, description, state_id, parent_id)
VALUES 
(@demo_user_id, '#6554C0', '技术开发能力', '提升技术能力', @active_state_id, @work_goal_id),
(@demo_user_id, '#00C7E6', '项目管理能力', '提升项目管理能力', @active_state_id, @work_goal_id),
(@demo_user_id, '#FF8B00', '职业发展规划', '长期职业发展规划', @on_hold_state_id, @work_goal_id),
(@demo_user_id, '#57D9A3', '日常锻炼', '保持身体健康的锻炼', @active_state_id, @health_goal_id),
(@demo_user_id, '#FF5630', '睡眠管理', '改善睡眠质量', @completed_state_id, @health_goal_id),
(@demo_user_id, '#FFC400', '阅读计划', '阅读各类书籍', @active_state_id, @relax_goal_id),
(@demo_user_id, '#FF5630', '旅行计划', '探索新地方', @active_state_id, @relax_goal_id),
(@demo_user_id, '#4A6FDC', '摄影技能', '提高摄影技巧', @aborted_state_id, @relax_goal_id),
(@demo_user_id, '#36B37E', '编程语言学习', '学习新的编程语言', @on_hold_state_id, @learning_goal_id),
(@demo_user_id, '#FF8B00', '外语学习计划', '提高外语水平', @archived_state_id, @learning_goal_id),
(@demo_user_id, '#00B8D9', '家庭活动计划', '增加家庭共处时间', @active_state_id, @family_goal_id),
(@demo_user_id, '#FFC400', '家庭财务规划', '家庭财务规划', @completed_state_id, @family_goal_id);
