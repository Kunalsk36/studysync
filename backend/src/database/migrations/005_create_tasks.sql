-- 04-DatabaseSchema.md §11 — tasks
CREATE TABLE IF NOT EXISTS tasks (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id           BIGINT UNSIGNED NOT NULL,
  category_id       BIGINT UNSIGNED NULL,
  title             VARCHAR(150) NOT NULL,
  description       TEXT NULL,
  priority          ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  status            ENUM('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
  estimated_minutes INT NULL,
  actual_minutes    INT NULL,
  due_date          DATETIME NULL,
  completed_at      DATETIME NULL,
  notes             TEXT NULL,
  tags              VARCHAR(255) NULL,
  color             VARCHAR(20) NULL,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tasks_user_id (user_id),
  INDEX idx_tasks_category_id (category_id),
  INDEX idx_tasks_status (status),
  INDEX idx_tasks_priority (priority),
  INDEX idx_tasks_due_date (due_date),
  CONSTRAINT fk_tasks_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_tasks_category_id
    FOREIGN KEY (category_id) REFERENCES task_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
