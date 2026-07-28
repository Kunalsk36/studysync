-- 04-DatabaseSchema.md §12 — task_categories
CREATE TABLE IF NOT EXISTS task_categories (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL,
  name       VARCHAR(100) NOT NULL,
  color      VARCHAR(20) NULL,
  icon       VARCHAR(50) NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_task_categories_user_name (user_id, name),
  INDEX idx_task_categories_user_id (user_id),
  CONSTRAINT fk_task_categories_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
