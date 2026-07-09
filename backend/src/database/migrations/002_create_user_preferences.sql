-- 04-DatabaseSchema.md §8 — user_preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id                     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id                BIGINT UNSIGNED NOT NULL,
  theme                  ENUM('light', 'dark') NOT NULL DEFAULT 'dark',
  daily_goal_hours       DECIMAL(3,1) NOT NULL DEFAULT 2.0,
  weekly_goal_hours      DECIMAL(4,1) NULL,
  preferred_study_time   ENUM('morning', 'afternoon', 'evening', 'night') NULL,
  notifications_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  sound_enabled          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_preferences_user_id (user_id),
  CONSTRAINT fk_user_preferences_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
