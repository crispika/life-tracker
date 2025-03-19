USE life_tracker;

-- 插入目标状态
INSERT INTO GOAL_STATE (name) VALUES
('ACTIVE'),
('ON_HOLD'),
('COMPLETED'),
('ABORTED'),
('ARCHIVED');

-- 插入项目状态模板
INSERT INTO PROJECT_STATE_TEMPLATE (name) VALUES
('OPEN'),
('IN_PROGRESS'),
('COMPLETED'),
('ON_HOLD'),
('ABORTED'),
('ARCHIVED');

-- 为示例用户插入默认项目状态
INSERT INTO UC_PROJECT_STATE (user_id, name, is_default)
SELECT 
  (SELECT user_id FROM USER WHERE email = 'demo@example.com'),
  name,
  TRUE
FROM PROJECT_STATE_TEMPLATE;
