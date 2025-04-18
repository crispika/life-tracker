USE life_tracker;
DELIMITER //

CREATE OR REPLACE VIEW `vw_recent_worklog_by_date` AS
WITH latest_dates AS (
    SELECT DISTINCT
        user_id,
        DATE(log_date) AS log_day,
        DENSE_RANK() OVER (PARTITION BY user_id ORDER BY DATE(log_date) DESC) AS rnk
    FROM UC_TASK_WORKLOG
)
SELECT 
    w.user_id,
    w.log_date AS date,
    w.task_id,
    w.time_spent_minutes,
    g.goal_id,
    g.summary AS goal_summary,
    g.color AS goal_color,
    g.goal_path,
    t.summary AS task_summary,
    t.description AS task_description
FROM latest_dates d
JOIN UC_TASK_WORKLOG w ON w.user_id = d.user_id AND DATE(w.log_date) = d.log_day
JOIN UC_TASK t ON w.task_id = t.task_id
JOIN UC_GOAL g ON t.goal_id = g.goal_id
WHERE d.rnk <= 30
ORDER BY w.log_date ASC //

DELIMITER ;
