USE life_tracker;

DELIMITER //

-- 用户创建后创建默认任务状态的触发器
CREATE TRIGGER after_user_insert
AFTER INSERT ON USER
FOR EACH ROW
BEGIN
  CALL create_default_task_states_for_user(NEW.user_id);
END //

-- 用户删除前删除相关任务的触发器
CREATE TRIGGER before_user_delete
BEFORE DELETE ON USER
FOR EACH ROW
BEGIN
  -- 先删除该用户的所有任务
  -- 这样当级联删除任务状态时，不会因为任务引用而报错
  DELETE FROM UC_TASK WHERE user_id = OLD.user_id;
END //

DELIMITER ;