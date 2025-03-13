USE life_tracker;

DELIMITER //

-- 为用户创建默认项目状态的存储过程
CREATE PROCEDURE create_default_project_states(IN p_user_id INT UNSIGNED)
BEGIN
  DECLARE user_exists INT;
  DECLARE states_count INT;
  
  -- 检查用户是否存在
  SELECT COUNT(*) INTO user_exists FROM USER WHERE user_id = p_user_id;
  
  IF user_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '用户不存在';
  END IF;
  
  -- 检查用户是否已有项目状态
  SELECT COUNT(*) INTO states_count FROM UC_PROJECT_STATE WHERE user_id = p_user_id;
  
  -- 只有当用户没有状态时才创建
  IF states_count = 0 THEN
    -- 从模板表中获取默认状态并插入到用户状态表
    INSERT INTO UC_PROJECT_STATE (user_id, name, display_name, created_at, updated_at)
    SELECT p_user_id, name, display_name, NOW(3), NOW(3)
    FROM PROJECT_STATE_TEMPLATE
    WHERE is_default = TRUE;
  END IF;
END

DELIMITER //; 