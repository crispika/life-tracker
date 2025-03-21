USE life_tracker;

DELIMITER //

-- 用户创建后创建默认项目状态的触发器
CREATE TRIGGER after_user_insert
AFTER INSERT ON USER
FOR EACH ROW
BEGIN
  CALL create_default_project_states_for_user(NEW.user_id);
END //

-- 用户删除前删除相关项目的触发器
CREATE TRIGGER before_user_delete
BEFORE DELETE ON USER
FOR EACH ROW
BEGIN
  -- 先删除该用户的所有项目
  -- 这样当级联删除项目状态时，不会因为项目引用而报错
  DELETE FROM UC_PROJECT WHERE user_id = OLD.user_id;
END //

DELIMITER ;