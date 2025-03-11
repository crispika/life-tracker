USE life_tracker;

DELIMITER //
CREATE TRIGGER after_user_insert
AFTER INSERT ON USER
FOR EACH ROW
BEGIN
  CALL create_default_project_states(NEW.user_id);
END //
DELIMITER ;