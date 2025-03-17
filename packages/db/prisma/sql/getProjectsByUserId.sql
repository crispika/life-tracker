SELECT 
    up.project_id,
    up.summary as project_summary,
    up.description,
    up.start_date,
    up.due_date,
    up.original_estimate_minutes,
    up.time_spent_minutes,
    ug.summary as goal_summary,
    ug.color,
    ups.name as state_name
FROM UC_PROJECT up 
LEFT JOIN UC_GOAL ug ON up.goal_id = ug.goal_id AND up.user_id = ug.user_id
INNER JOIN UC_PROJECT_STATE ups ON up.state_id = ups.state_id AND up.user_id = ups.user_id
WHERE up.user_id = ?