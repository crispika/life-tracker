USE life_tracker;

-- GOAL_STATE表索引
CREATE INDEX idx_goal_state_name ON GOAL_STATE(name);

-- UC_GOAL表索引
CREATE INDEX idx_uc_goal_user ON UC_GOAL(user_id);
CREATE INDEX idx_uc_goal_parent ON UC_GOAL(user_id, parent_id);
CREATE INDEX idx_uc_goal_user_state ON UC_GOAL(user_id, state_id);
CREATE INDEX idx_uc_goal_user_created ON UC_GOAL(user_id, created_at);

-- UC_PROJECT_STATE表索引
CREATE INDEX idx_uc_project_state_user ON UC_PROJECT_STATE(user_id);
CREATE INDEX idx_uc_project_state_name ON UC_PROJECT_STATE(name);

-- UC_PROJECT表索引
CREATE INDEX idx_uc_project_user ON UC_PROJECT(user_id);
CREATE INDEX idx_uc_project_goal ON UC_PROJECT(goal_id);
CREATE INDEX idx_uc_project_user_state ON UC_PROJECT(user_id, state_id);
CREATE INDEX idx_uc_project_user_goal ON UC_PROJECT(user_id, goal_id);