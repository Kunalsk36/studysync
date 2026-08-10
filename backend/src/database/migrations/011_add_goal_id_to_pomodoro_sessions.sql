ALTER TABLE pomodoro_sessions
ADD COLUMN goal_id BIGINT UNSIGNED NULL AFTER task_id,
ADD CONSTRAINT fk_pomodoro_sessions_goal_id FOREIGN KEY (goal_id) REFERENCES study_goals(id) ON DELETE SET NULL,
ADD INDEX idx_pomodoro_sessions_goal_id (goal_id);
