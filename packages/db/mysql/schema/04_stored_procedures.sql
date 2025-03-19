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
    INSERT INTO UC_PROJECT_STATE (user_id, name, is_default, created_at, updated_at)
    SELECT p_user_id, name, TRUE, NOW(3), NOW(3)
    FROM PROJECT_STATE_TEMPLATE;
  END IF;
END //

-- 创建目标的存储过程
CREATE PROCEDURE create_goal(
  IN p_user_id INT UNSIGNED,
  IN p_color VARCHAR(7),
  IN p_summary VARCHAR(100),
  IN p_description TEXT,
  IN p_parent_id INT UNSIGNED,
  IN p_prefix VARCHAR(15),
  OUT p_goal_id INT UNSIGNED,
  OUT p_prefix_id INT UNSIGNED
)
BEGIN
  DECLARE v_parent_prefix_id INT UNSIGNED;
  DECLARE v_active_state_id INT UNSIGNED;
  
  -- 检查用户是否存在
  IF NOT EXISTS (SELECT 1 FROM USER WHERE user_id = p_user_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '用户不存在';
  END IF;
  
  -- 获取ACTIVE状态ID
  SELECT state_id INTO v_active_state_id FROM GOAL_STATE WHERE name = 'ACTIVE';
  
  -- 如果有父目标，检查父目标是否存在
  IF p_parent_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM UC_GOAL WHERE goal_id = p_parent_id AND user_id = p_user_id) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '父目标不存在';
    END IF;
    
    -- 获取父目标的前缀ID
    SELECT prefix_id INTO v_parent_prefix_id FROM UC_GOAL WHERE goal_id = p_parent_id;
    
    -- 使用父目标的前缀ID
    SET p_prefix_id = v_parent_prefix_id;
  ELSE
    -- 检查前缀是否已存在
    IF EXISTS (SELECT 1 FROM UC_GOAL_PREFIX WHERE user_id = p_user_id AND prefix = p_prefix) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '该前缀已被使用';
    END IF;
    
    -- 插入前缀记录
    INSERT INTO UC_GOAL_PREFIX (user_id, prefix, next_seq_number)
    VALUES (p_user_id, p_prefix, 1);
    
    -- 获取新创建的前缀ID
    SET p_prefix_id = LAST_INSERT_ID();
  END IF;
  
  -- 插入目标记录
  INSERT INTO UC_GOAL (
    user_id, color, summary, description,
    state_id, parent_id, prefix_id
  ) VALUES (
    p_user_id, p_color, p_summary, p_description,
    v_active_state_id, p_parent_id, p_prefix_id
  );
  
  -- 获取新创建的目标ID
  SET p_goal_id = LAST_INSERT_ID();
END //

-- 创建项目并生成项目编号的存储过程
CREATE PROCEDURE create_project(
  IN p_prefix_id INT UNSIGNED,
  IN p_user_id INT UNSIGNED,
  IN p_color VARCHAR(7),
  IN p_summary VARCHAR(100),
  IN p_description TEXT,
  IN p_start_date DATETIME(3),
  IN p_due_date DATETIME(3),
  IN p_original_estimate_minutes INT,
  IN p_state_id INT UNSIGNED,
  IN p_goal_id INT UNSIGNED,
  OUT p_project_id INT UNSIGNED,
  OUT p_code VARCHAR(30)
)
BEGIN
  DECLARE v_prefix VARCHAR(15);
  DECLARE v_next_seq INT UNSIGNED;
  
  START TRANSACTION;
  
  -- 获取并锁定前缀记录
  SELECT prefix, next_seq_number 
  INTO v_prefix, v_next_seq
  FROM UC_GOAL_PREFIX 
  WHERE prefix_id = p_prefix_id
  FOR UPDATE;
  
  -- 更新下一个序号
  UPDATE UC_GOAL_PREFIX 
  SET next_seq_number = next_seq_number + 1 
  WHERE prefix_id = p_prefix_id;
  
  -- 生成代码
  SET p_code = CONCAT(v_prefix, '-', v_next_seq);
  
  -- 插入项目记录
  INSERT INTO UC_PROJECT (
    code, user_id, color, summary, description,
    start_date, due_date, original_estimate_minutes,
    state_id, goal_id
  ) VALUES (
    p_code, p_user_id, p_color, p_summary, p_description,
    p_start_date, p_due_date, p_original_estimate_minutes,
    p_state_id, p_goal_id
  );
  
  -- 获取新插入的项目ID
  SET p_project_id = LAST_INSERT_ID();
  
  COMMIT;
END //

DELIMITER ; 