-- 04-DatabaseSchema.md §16 — notifications
CREATE TABLE IF NOT EXISTS notifications (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id           BIGINT UNSIGNED NOT NULL,
  title             VARCHAR(150) NOT NULL,
  message           TEXT NOT NULL,
  notification_type ENUM('task','goal','calendar','achievement','system') NOT NULL DEFAULT 'system',
  is_read           BOOLEAN NOT NULL DEFAULT FALSE,
  scheduled_at      DATETIME NULL,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notifications_user_id (user_id),
  INDEX idx_notifications_is_read (is_read),
  INDEX idx_notifications_scheduled_at (scheduled_at),
  CONSTRAINT fk_notifications_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
