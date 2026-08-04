CREATE TABLE IF NOT EXISTS pomodoro_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    task_id BIGINT UNSIGNED NULL,
    session_type ENUM('focus', 'short_break', 'long_break') NOT NULL DEFAULT 'focus',
    planned_minutes INT NOT NULL DEFAULT 25,
    actual_minutes INT NOT NULL DEFAULT 0,
    status ENUM('completed', 'interrupted', 'cancelled') NOT NULL DEFAULT 'completed',
    started_at DATETIME NOT NULL,
    ended_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
    INDEX idx_pomodoro_sessions_user_id (user_id),
    INDEX idx_pomodoro_sessions_task_id (task_id),
    INDEX idx_pomodoro_sessions_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
