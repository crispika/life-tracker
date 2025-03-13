USE life_tracker;

-- 获取用户ID
SET @demo_user_id = (SELECT user_id FROM USER WHERE email = 'demo@example.com');

-- 获取目标状态ID
SET @active_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'ACTIVE');
SET @on_hold_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'ON_HOLD');
SET @completed_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'COMPLETED');
SET @aborted_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'ABORTED');
SET @archived_state_id = (SELECT state_id FROM GOAL_STATE WHERE name = 'ARCHIVED');

-- 插入顶级目标
INSERT INTO UC_GOAL (user_id, color, summary, description, state_id)
VALUES 
(@demo_user_id, '#4A6FDC', '工作', '与职业发展相关的目标', @active_state_id),
(@demo_user_id, '#36B37E', '健康', '与身心健康相关的目标', @active_state_id),
(@demo_user_id, '#FF8B00', '休闲', '与休闲娱乐相关的目标', @active_state_id),
(@demo_user_id, '#FF5630', '学习', '个人学习计划', @on_hold_state_id),
(@demo_user_id, '#00C7E6', '家庭', '家庭相关目标', @active_state_id);

-- 获取顶级目标ID
SET @work_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '工作');
SET @health_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '健康');
SET @relax_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '休闲');
SET @study_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '学习');
SET @family_id = (SELECT goal_id FROM UC_GOAL WHERE user_id = @demo_user_id AND summary = '家庭');

-- 插入子目标
INSERT INTO UC_GOAL (user_id, color, summary, description, state_id, parent_id)
VALUES 
(@demo_user_id, '#6554C0', '技术开发', '提升技术能力', @active_state_id, @work_id),
(@demo_user_id, '#00C7E6', '项目管理', '提升项目管理能力', @active_state_id, @work_id),
(@demo_user_id, '#FF8B00', '职业规划', '长期职业发展规划', @on_hold_state_id, @work_id),
(@demo_user_id, '#57D9A3', '锻炼', '保持身体健康的锻炼', @active_state_id, @health_id),
(@demo_user_id, '#00B8D9', '饮食', '健康饮食习惯', @active_state_id, @health_id),
(@demo_user_id, '#FF5630', '睡眠', '改善睡眠质量', @completed_state_id, @health_id),
(@demo_user_id, '#FFC400', '阅读', '阅读各类书籍', @active_state_id, @relax_id),
(@demo_user_id, '#FF5630', '旅行', '探索新地方', @active_state_id, @relax_id),
(@demo_user_id, '#4A6FDC', '摄影', '提高摄影技巧', @aborted_state_id, @relax_id),
(@demo_user_id, '#36B37E', '编程语言', '学习新的编程语言', @on_hold_state_id, @study_id),
(@demo_user_id, '#FF8B00', '外语学习', '提高外语水平', @archived_state_id, @study_id),
(@demo_user_id, '#00B8D9', '家庭活动', '增加家庭共处时间', @active_state_id, @family_id),
(@demo_user_id, '#FFC400', '家庭财务', '家庭财务规划', @completed_state_id, @family_id);
