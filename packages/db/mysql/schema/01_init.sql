CREATE DATABASE IF NOT EXISTS life_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE life_tracker;

CREATE TABLE IF NOT EXISTS USER (
  user_id INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  avatar_url VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) AUTO_INCREMENT=100000 COMMENT='global USER 表';

CREATE TABLE IF NOT EXISTS GOAL_STATE (
  state_id INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) AUTO_INCREMENT=100000 COMMENT='global GOAL STATE 引用表';

CREATE TABLE IF NOT EXISTS UC_GOAL_PREFIX (
  prefix_id INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT(8) UNSIGNED NOT NULL,
  prefix VARCHAR(15) NOT NULL COMMENT '代码前缀，最多5个中文或15个英文',
  next_seq_number INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '下一个序号',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  CONSTRAINT fk_code_prefix_user FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE,
  CONSTRAINT uk_code_prefix UNIQUE (user_id, prefix)
) AUTO_INCREMENT=100000 COMMENT='目标代码前缀表';

CREATE TABLE IF NOT EXISTS UC_GOAL (
  goal_id INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT(8) UNSIGNED NOT NULL COMMENT '所属用户ID',
  color VARCHAR(7) NOT NULL,
  summary VARCHAR(100) NOT NULL,
  description TEXT,
  state_id INT(8) UNSIGNED NOT NULL COMMENT '状态ID',
  parent_id INT(8) UNSIGNED NULL COMMENT '父目标ID',
  prefix_id INT(8) UNSIGNED NOT NULL COMMENT '代码前缀ID',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  CONSTRAINT fk_uc_goal_user FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_uc_goal_state FOREIGN KEY (state_id) REFERENCES GOAL_STATE(state_id) ON DELETE RESTRICT,
  CONSTRAINT fk_uc_goal_parent FOREIGN KEY (parent_id) REFERENCES UC_GOAL(goal_id) ON DELETE SET NULL,
  CONSTRAINT fk_uc_goal_prefix FOREIGN KEY (prefix_id) REFERENCES UC_GOAL_PREFIX(prefix_id),
  CONSTRAINT uk_uc_goal_summary UNIQUE (user_id, summary)
) AUTO_INCREMENT=100000 COMMENT='用户GOAL表，支持树形结构';

CREATE TABLE IF NOT EXISTS UC_TASK_STATE (
  state_id INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT(8) UNSIGNED NOT NULL COMMENT '所属用户ID',
  name VARCHAR(50) NOT NULL COMMENT '状态名称',
  system_defined BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  CONSTRAINT fk_uc_task_state_user FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE,
  CONSTRAINT uk_uc_task_state_name UNIQUE (user_id, name)
) AUTO_INCREMENT=100000 COMMENT='用户任务状态表';

CREATE TABLE IF NOT EXISTS UC_TASK (
  task_id INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(30) NOT NULL COMMENT '任务编号（如HT-1）',
  user_id INT(8) UNSIGNED NOT NULL COMMENT '所属用户ID',
  color VARCHAR(7) NOT NULL COMMENT '颜色代码',
  summary VARCHAR(100) NOT NULL COMMENT '任务名称',
  description TEXT COMMENT '任务描述',
  start_date DATETIME(3) NOT NULL COMMENT '开始日期',
  due_date DATETIME(3) NOT NULL COMMENT '截止日期',
  original_estimate_minutes INT NOT NULL COMMENT '预估时间（分钟）',
  time_spent_minutes INT NOT NULL DEFAULT 0 COMMENT '实际花费时间（分钟）',
  state_id INT(8) UNSIGNED NOT NULL COMMENT '状态ID',
  goal_id INT(8) UNSIGNED COMMENT '关联的目标ID',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  CONSTRAINT fk_uc_task_user FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_uc_task_state FOREIGN KEY (state_id) REFERENCES UC_TASK_STATE(state_id) ON DELETE RESTRICT,
  CONSTRAINT fk_uc_task_goal FOREIGN KEY (goal_id) REFERENCES UC_GOAL(goal_id) ON DELETE SET NULL,
  CONSTRAINT uk_uc_task_code UNIQUE (user_id, code)
) AUTO_INCREMENT=100000 COMMENT='用户任务表';

-- 任务状态模板表
CREATE TABLE IF NOT EXISTS TASK_STATE_TEMPLATE (
  template_id INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL COMMENT '状态名称',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) AUTO_INCREMENT=100000 COMMENT='任务状态模板表，用于初始化用户的默认任务状态';

-- 任务初始化状态设置表
CREATE TABLE IF NOT EXISTS UC_TASK_INIT_STATE (
  init_state_id INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT(8) UNSIGNED NOT NULL,
  state_id INT(8) UNSIGNED NOT NULL COMMENT '新建任务时的默认状态ID',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  CONSTRAINT fk_uc_task_init_state_user FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_uc_task_init_state_state FOREIGN KEY (state_id) REFERENCES UC_TASK_STATE(state_id) ON DELETE RESTRICT,
  CONSTRAINT uk_uc_task_init_state_user UNIQUE (user_id)
) AUTO_INCREMENT=100000 COMMENT='用户任务初始化状态设置表';
