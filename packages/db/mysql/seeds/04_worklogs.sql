USE life_tracker;

-- 获取用户ID
SET @demo_user_id = (SELECT user_id FROM USER WHERE email = 'demo@example.com');

-- 获取任务ID
SET @task_run_id = (SELECT task_id FROM UC_TASK WHERE user_id = @demo_user_id AND summary = '每周跑步计划');
SET @task_diet_id = (SELECT task_id FROM UC_TASK WHERE user_id = @demo_user_id AND summary = '健康饮食计划');
SET @task_sleep_id = (SELECT task_id FROM UC_TASK WHERE user_id = @demo_user_id AND summary = '睡眠改善计划');
SET @task_refactor_id = (SELECT task_id FROM UC_TASK WHERE user_id = @demo_user_id AND summary = '项目重构');
SET @task_tech_id = (SELECT task_id FROM UC_TASK WHERE user_id = @demo_user_id AND summary = '技术栈升级');
SET @task_mgmt_id = (SELECT task_id FROM UC_TASK WHERE user_id = @demo_user_id AND summary = '团队管理培训');
SET @task_career_id = (SELECT task_id FROM UC_TASK WHERE user_id = @demo_user_id AND summary = '职业发展规划');
SET @task_read_id = (SELECT task_id FROM UC_TASK WHERE user_id = @demo_user_id AND summary = '阅读《三体》');
SET @task_hiking_id = (SELECT task_id FROM UC_TASK WHERE user_id = @demo_user_id AND summary = '周末徒步计划');
SET @task_photo_id = (SELECT task_id FROM UC_TASK WHERE user_id = @demo_user_id AND summary = '摄影技能学习');

-- 插入worklog数据
INSERT INTO UC_TASK_WORKLOG (user_id, task_id, time_spent_minutes, log_date, note, created_at, updated_at) VALUES
-- 健康管理相关
(@demo_user_id, @task_run_id, 45, DATE_SUB(NOW(), INTERVAL 29 DAY), '完成5公里跑步', NOW(), NOW()),
(@demo_user_id, @task_diet_id, 30, DATE_SUB(NOW(), INTERVAL 28 DAY), '准备健康午餐', NOW(), NOW()),
(@demo_user_id, @task_sleep_id, 20, DATE_SUB(NOW(), INTERVAL 27 DAY), '记录睡眠情况', NOW(), NOW()),
(@demo_user_id, @task_run_id, 60, DATE_SUB(NOW(), INTERVAL 26 DAY), '完成6公里跑步', NOW(), NOW()),
(@demo_user_id, @task_diet_id, 45, DATE_SUB(NOW(), INTERVAL 25 DAY), '学习营养知识', NOW(), NOW()),
-- 职业发展相关
(@demo_user_id, @task_refactor_id, 180, DATE_SUB(NOW(), INTERVAL 24 DAY), '重构用户模块', NOW(), NOW()),
(@demo_user_id, @task_tech_id, 120, DATE_SUB(NOW(), INTERVAL 23 DAY), '学习新框架', NOW(), NOW()),
(@demo_user_id, @task_mgmt_id, 90, DATE_SUB(NOW(), INTERVAL 22 DAY), '团队管理课程', NOW(), NOW()),
(@demo_user_id, @task_career_id, 60, DATE_SUB(NOW(), INTERVAL 21 DAY), '更新职业规划', NOW(), NOW()),
(@demo_user_id, @task_refactor_id, 240, DATE_SUB(NOW(), INTERVAL 20 DAY), '重构数据层', NOW(), NOW()),
-- 休闲娱乐相关
(@demo_user_id, @task_read_id, 60, DATE_SUB(NOW(), INTERVAL 19 DAY), '阅读第一章', NOW(), NOW()),
(@demo_user_id, @task_hiking_id, 180, DATE_SUB(NOW(), INTERVAL 18 DAY), '城市公园徒步', NOW(), NOW()),
(@demo_user_id, @task_photo_id, 90, DATE_SUB(NOW(), INTERVAL 17 DAY), '学习构图技巧', NOW(), NOW()),
(@demo_user_id, @task_read_id, 45, DATE_SUB(NOW(), INTERVAL 16 DAY), '阅读第二章', NOW(), NOW()),
(@demo_user_id, @task_photo_id, 120, DATE_SUB(NOW(), INTERVAL 15 DAY), '外出实践拍摄', NOW(), NOW()),
-- 混合日期的记录
(@demo_user_id, @task_run_id, 50, DATE_SUB(NOW(), INTERVAL 14 DAY), '晨跑训练', NOW(), NOW()),
(@demo_user_id, @task_tech_id, 150, DATE_SUB(NOW(), INTERVAL 13 DAY), '技术框架深入学习', NOW(), NOW()),
(@demo_user_id, @task_read_id, 40, DATE_SUB(NOW(), INTERVAL 12 DAY), '阅读第三章', NOW(), NOW()),
(@demo_user_id, @task_diet_id, 35, DATE_SUB(NOW(), INTERVAL 11 DAY), '制定营养餐单', NOW(), NOW()),
(@demo_user_id, @task_mgmt_id, 120, DATE_SUB(NOW(), INTERVAL 10 DAY), '项目管理实践', NOW(), NOW()),
-- 最近的记录
(@demo_user_id, @task_refactor_id, 180, DATE_SUB(NOW(), INTERVAL 9 DAY), '代码优化', NOW(), NOW()),
(@demo_user_id, @task_sleep_id, 25, DATE_SUB(NOW(), INTERVAL 8 DAY), '睡眠质量分析', NOW(), NOW()),
(@demo_user_id, @task_photo_id, 60, DATE_SUB(NOW(), INTERVAL 7 DAY), '后期处理学习', NOW(), NOW()),
(@demo_user_id, @task_hiking_id, 240, DATE_SUB(NOW(), INTERVAL 6 DAY), '郊外远足', NOW(), NOW()),
(@demo_user_id, @task_tech_id, 90, DATE_SUB(NOW(), INTERVAL 5 DAY), '新技术调研', NOW(), NOW()),
-- 最新的记录
(@demo_user_id, @task_career_id, 45, DATE_SUB(NOW(), INTERVAL 4 DAY), '职业目标复盘', NOW(), NOW()),
(@demo_user_id, @task_run_id, 55, DATE_SUB(NOW(), INTERVAL 3 DAY), '间歇跑训练', NOW(), NOW()),
(@demo_user_id, @task_read_id, 50, DATE_SUB(NOW(), INTERVAL 2 DAY), '阅读第四章', NOW(), NOW()),
(@demo_user_id, @task_mgmt_id, 150, DATE_SUB(NOW(), INTERVAL 1 DAY), '团队建设活动', NOW(), NOW()),
(@demo_user_id, @task_refactor_id, 120, NOW(), '性能优化', NOW(), NOW());

-- 同一天的额外记录，用于测试数据聚合
INSERT INTO UC_TASK_WORKLOG (user_id, task_id, time_spent_minutes, log_date, note, created_at, updated_at) VALUES
-- 5天前的记录
(@demo_user_id, @task_tech_id, 90, DATE_SUB(NOW(), INTERVAL 5 DAY), '框架实践', NOW(), NOW()),
(@demo_user_id, @task_diet_id, 40, DATE_SUB(NOW(), INTERVAL 5 DAY), '营养知识学习', NOW(), NOW()),
(@demo_user_id, @task_read_id, 60, DATE_SUB(NOW(), INTERVAL 5 DAY), '阅读技术文档', NOW(), NOW()),
(@demo_user_id, @task_photo_id, 45, DATE_SUB(NOW(), INTERVAL 5 DAY), '整理照片', NOW(), NOW()),
-- 3天前的记录
(@demo_user_id, @task_tech_id, 120, DATE_SUB(NOW(), INTERVAL 3 DAY), '代码重构', NOW(), NOW()),
(@demo_user_id, @task_mgmt_id, 90, DATE_SUB(NOW(), INTERVAL 3 DAY), '项目会议', NOW(), NOW()),
(@demo_user_id, @task_diet_id, 30, DATE_SUB(NOW(), INTERVAL 3 DAY), '制定饮食计划', NOW(), NOW()),
(@demo_user_id, @task_photo_id, 60, DATE_SUB(NOW(), INTERVAL 3 DAY), '照片后期处理', NOW(), NOW()),
-- 2天前的记录
(@demo_user_id, @task_read_id, 50, DATE_SUB(NOW(), INTERVAL 2 DAY), '阅读第四章', NOW(), NOW()),
(@demo_user_id, @task_tech_id, 80, DATE_SUB(NOW(), INTERVAL 2 DAY), '单元测试编写', NOW(), NOW()),
(@demo_user_id, @task_diet_id, 45, DATE_SUB(NOW(), INTERVAL 2 DAY), '健康饮食研究', NOW(), NOW()),
-- 1天前的记录
(@demo_user_id, @task_mgmt_id, 150, DATE_SUB(NOW(), INTERVAL 1 DAY), '团队建设活动', NOW(), NOW()),
(@demo_user_id, @task_tech_id, 100, DATE_SUB(NOW(), INTERVAL 1 DAY), '性能测试', NOW(), NOW()),
(@demo_user_id, @task_photo_id, 40, DATE_SUB(NOW(), INTERVAL 1 DAY), '摄影技巧学习', NOW(), NOW()),
(@demo_user_id, @task_read_id, 45, DATE_SUB(NOW(), INTERVAL 1 DAY), '阅读专业书籍', NOW(), NOW()),
-- 今天的记录
(@demo_user_id, @task_refactor_id, 120, NOW(), '性能优化', NOW(), NOW()),
(@demo_user_id, @task_read_id, 30, NOW(), '复习前面章节', NOW(), NOW()),
(@demo_user_id, @task_photo_id, 45, NOW(), '整理照片', NOW(), NOW()),
(@demo_user_id, @task_tech_id, 90, NOW(), '代码评审', NOW(), NOW()),
(@demo_user_id, @task_diet_id, 60, NOW(), '营养搭配实践', NOW(), NOW());
