USE life_tracker;
-- TODO check transaction management for all procedures

DELIMITER //

-- 为用户创建默认任务状态的存储过程
CREATE PROCEDURE create_default_task_states_for_user(IN p_user_id INT UNSIGNED)
BEGIN
  DECLARE user_exists INT;
  DECLARE states_count INT;
  DECLARE open_state_id INT UNSIGNED;
  
  -- 检查用户是否存在
  SELECT COUNT(*) INTO user_exists FROM USER WHERE user_id = p_user_id;
  
  IF user_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '用户不存在';
  END IF;
  
  -- 检查用户是否已有任务状态
  SELECT COUNT(*) INTO states_count FROM UC_TASK_STATE WHERE user_id = p_user_id;
  
  -- 只有当用户没有状态时才创建
  IF states_count = 0 THEN
    -- 从模板表中获取默认状态并插入到用户状态表
    INSERT INTO UC_TASK_STATE (user_id, name, system_defined, created_at, updated_at)
    SELECT p_user_id, name, TRUE, NOW(3), NOW(3)
    FROM TASK_STATE_TEMPLATE;
    
    -- 获取OPEN状态的ID
    SELECT state_id INTO open_state_id
    FROM UC_TASK_STATE
    WHERE user_id = p_user_id AND name = 'OPEN';
    
    -- 设置用户的默认初始化状态
    INSERT INTO UC_TASK_INIT_STATE (user_id, state_id)
    VALUES (p_user_id, open_state_id);
  END IF;
END //

-- 创建目标的存储过程
CREATE PROCEDURE create_goal(
  IN p_user_id INT UNSIGNED,
  IN p_color VARCHAR(7),
  IN p_summary VARCHAR(300),
  IN p_description TEXT,
  IN p_parent_id INT UNSIGNED,
  IN p_prefix VARCHAR(15),
  IN p_is_first_level BOOLEAN,
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
  
  -- 如果是一级目标，必须指定前缀
  IF p_is_first_level THEN
    IF p_prefix IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '一级目标必须指定前缀';
    END IF;
    
    -- 检查前缀是否已存在
    IF EXISTS (SELECT 1 FROM UC_GOAL_PREFIX WHERE user_id = p_user_id AND prefix = p_prefix) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '该前缀已被使用';
    END IF;
    
    -- 插入前缀记录
    INSERT INTO UC_GOAL_PREFIX (user_id, prefix, next_seq_number)
    VALUES (p_user_id, p_prefix, 1);
    
    -- 获取新创建的前缀ID
    SET p_prefix_id = LAST_INSERT_ID();
  ELSE
    -- 如果不是一级目标，必须有父目标
    IF p_parent_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '非一级目标必须指定父目标';
    END IF;
    
    -- 检查父目标是否存在
    IF NOT EXISTS (SELECT 1 FROM UC_GOAL WHERE goal_id = p_parent_id AND user_id = p_user_id) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '父目标不存在';
    END IF;
    
    -- 获取父目标的前缀ID
    SELECT prefix_id INTO v_parent_prefix_id FROM UC_GOAL WHERE goal_id = p_parent_id;
    
    -- 子目标必须使用父目标的前缀ID
    IF p_prefix IS NOT NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '子目标不能指定新的前缀，必须继承父目标的前缀';
    END IF;
    
    -- 使用父目标的前缀ID
    SET p_prefix_id = v_parent_prefix_id;
  END IF;
  
  -- 插入目标记录
  INSERT INTO UC_GOAL (
    user_id, color, summary, description,
    state_id, parent_id, prefix_id, is_first_level
  ) VALUES (
    p_user_id, p_color, p_summary, p_description,
    v_active_state_id, p_parent_id, p_prefix_id, p_is_first_level
  );
  
  -- 获取新创建的目标ID
  SET p_goal_id = LAST_INSERT_ID();
END //

-- 创建任务并生成任务编号的存储过程
CREATE PROCEDURE create_task(
  IN p_prefix_id INT UNSIGNED,
  IN p_user_id INT UNSIGNED,
  IN p_color VARCHAR(7),
  IN p_summary VARCHAR(300),
  IN p_description TEXT,
  IN p_start_date DATETIME(3),
  IN p_due_date DATETIME(3),
  IN p_original_estimate_minutes INT,
  IN p_goal_id INT UNSIGNED,
  OUT p_task_id INT UNSIGNED,
  OUT p_code VARCHAR(30)
)
BEGIN
  DECLARE v_prefix VARCHAR(15);
  DECLARE v_next_seq INT UNSIGNED;
  DECLARE v_default_state_id INT UNSIGNED;
  
  START TRANSACTION;
  
  -- 检查用户是否存在
  IF NOT EXISTS (SELECT 1 FROM USER WHERE user_id = p_user_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '用户不存在';
  END IF;
  
  -- 检查前缀是否存在
  IF NOT EXISTS (SELECT 1 FROM UC_GOAL_PREFIX WHERE prefix_id = p_prefix_id AND user_id = p_user_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '前缀不存在';
  END IF;
  
  -- 检查目标ID是否为空
  IF p_goal_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'goal_id不能为空';
  END IF;

  -- 检查目标是否存在
  IF NOT EXISTS (SELECT 1 FROM UC_GOAL WHERE goal_id = p_goal_id AND user_id = p_user_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'goal不存在';
  END IF;
  
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
  
  -- 获取用户的默认初始化状态
  SELECT state_id INTO v_default_state_id
  FROM UC_TASK_INIT_STATE
  WHERE user_id = p_user_id;
  
  -- 如果没有设置默认状态，报错
  IF v_default_state_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '未找到默认任务状态，请先初始化任务状态';
  END IF;
  
  -- 插入任务记录
  INSERT INTO UC_TASK (
    code, user_id, color, summary, description,
    start_date, due_date, original_estimate_minutes,
    state_id, goal_id
  ) VALUES (
    p_code, p_user_id, p_color, p_summary, p_description,
    p_start_date, p_due_date, p_original_estimate_minutes,
    v_default_state_id, p_goal_id
  );
  
  -- 获取新插入的任务ID
  SET p_task_id = LAST_INSERT_ID();
  
  COMMIT;
END //

-- 删除目标的存储过程
CREATE PROCEDURE delete_goal_with_all_children(
  IN p_user_id INT UNSIGNED,
  IN p_goal_id INT UNSIGNED
)
BEGIN
  DECLARE v_goal_exists INT;
  DECLARE v_is_first_level BOOLEAN;
  DECLARE v_prefix_id INT UNSIGNED;
  
  -- 检查用户是否存在
  IF NOT EXISTS (SELECT 1 FROM USER WHERE user_id = p_user_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '用户不存在';
  END IF;
  
  -- 检查目标是否存在且属于该用户
  SELECT COUNT(*) INTO v_goal_exists FROM UC_GOAL 
  WHERE goal_id = p_goal_id AND user_id = p_user_id;
  
  IF v_goal_exists = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '目标不存在或不属于该用户';
  END IF;
  
  -- 获取目标是否是一级目标及其前缀ID
  SELECT is_first_level, prefix_id INTO v_is_first_level, v_prefix_id
  FROM UC_GOAL
  WHERE goal_id = p_goal_id AND user_id = p_user_id;
  
  START TRANSACTION;
  
  -- 使用递归CTE查找所有子目标ID（包括当前目标）
  WITH RECURSIVE goal_tree AS (
    -- 基本情况：当前目标
    SELECT goal_id FROM UC_GOAL WHERE goal_id = p_goal_id AND user_id = p_user_id
    
    UNION ALL
    
    -- 递归情况：所有子目标
    SELECT c.goal_id
    FROM UC_GOAL c
    JOIN goal_tree p ON c.parent_id = p.goal_id
    WHERE c.user_id = p_user_id
  )
  
  -- 首先删除所有关联的任务
  DELETE FROM UC_TASK 
  WHERE goal_id IN (SELECT goal_id FROM goal_tree) 
  AND user_id = p_user_id;
  
  -- 然后从叶子节点开始删除目标（先删除没有子目标的目标）
  DELETE FROM UC_GOAL
  WHERE goal_id IN (
    WITH RECURSIVE goal_tree AS (
      -- 基本情况：当前目标
      SELECT goal_id FROM UC_GOAL WHERE goal_id = p_goal_id AND user_id = p_user_id
      
      UNION ALL
      
      -- 递归情况：所有子目标
      SELECT c.goal_id
      FROM UC_GOAL c
      JOIN goal_tree p ON c.parent_id = p.goal_id
      WHERE c.user_id = p_user_id
    )
    SELECT goal_id FROM goal_tree
  )
  AND user_id = p_user_id;
  
  -- 如果是一级目标，删除对应的前缀
  IF v_is_first_level THEN
    DELETE FROM UC_GOAL_PREFIX
    WHERE prefix_id = v_prefix_id
    AND user_id = p_user_id;
  END IF;
  
  COMMIT;
END //

DELIMITER ; 