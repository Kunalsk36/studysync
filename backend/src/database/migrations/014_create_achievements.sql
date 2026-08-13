CREATE TABLE IF NOT EXISTS achievements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    badge_icon VARCHAR(100) DEFAULT NULL,
    badge_color VARCHAR(30) DEFAULT NULL,
    requirement VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO achievements (title, description, badge_icon, badge_color, requirement) VALUES
('First Task Completed', 'Complete your very first task in StudySync.', 'check-circle', 'blue', 'tasks_completed >= 1'),
('7-Day Streak', 'Maintain a study streak for seven consecutive days.', 'fire', 'orange', 'current_streak >= 7'),
('100 Study Hours', 'Accumulate 100 hours of total study time.', 'clock', 'purple', 'study_hours >= 100'),
('50 Completed Tasks', 'Complete 50 tasks across all categories.', 'list-checks', 'green', 'tasks_completed >= 50');
