USE life_tracker;

-- 插入目标状态
INSERT INTO GOAL_STATE (name, display_name) VALUES
('ACTIVE', '活跃'),
('ON_HOLD', '暂停'),
('COMPLETED', '完成'),
('ABORTED', '已取消'),
('ARCHIVED', '已归档');

-- 插入项目状态模板
INSERT INTO PROJECT_STATE_TEMPLATE (name, display_name, is_default) VALUES
('OPEN', '未开始', TRUE),
('IN_PROGRESS', '进行中', TRUE),
('COMPLETED', '已完成', TRUE),
('ON_HOLD', '已暂停', TRUE),
('ABORTED', '已取消', TRUE),
('ARCHIVED', '已归档', TRUE);
