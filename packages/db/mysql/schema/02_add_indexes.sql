USE life_tracker;

-- TODO Optimize indexes, currently use AI generated temporarily
-- GOAL_STATE表索引
CREATE INDEX idx_goal_state_name ON GOAL_STATE(name);

-- UC_GOAL表索引
CREATE INDEX idx_uc_goal_user ON UC_GOAL(user_id);
CREATE INDEX idx_uc_goal_parent ON UC_GOAL(user_id, parent_id);
CREATE INDEX idx_uc_goal_user_state ON UC_GOAL(user_id, state_id);
CREATE INDEX idx_uc_goal_user_created ON UC_GOAL(user_id, created_at);

-- UC_TASK_STATE表索引
CREATE INDEX idx_uc_task_state_user ON UC_TASK_STATE(user_id);
CREATE INDEX idx_uc_task_state_name ON UC_TASK_STATE(name);

-- UC_TASK表索引
CREATE INDEX idx_uc_task_user ON UC_TASK(user_id);
CREATE INDEX idx_uc_task_goal ON UC_TASK(goal_id);
CREATE INDEX idx_uc_task_user_state ON UC_TASK(user_id, state_id);
CREATE INDEX idx_uc_task_user_goal ON UC_TASK(user_id, goal_id);

-- UC_TASK_WORKLOG表索引
CREATE INDEX idx_uc_task_worklog_task ON UC_TASK_WORKLOG(task_id);
CREATE INDEX idx_uc_task_worklog_user ON UC_TASK_WORKLOG(user_id);
CREATE INDEX idx_uc_task_worklog_created ON UC_TASK_WORKLOG(created_at);
CREATE INDEX idx_uc_task_worklog_date ON UC_TASK_WORKLOG(log_date);