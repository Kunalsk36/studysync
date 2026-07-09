-- 04-DatabaseSchema.md §7 — users
CREATE TABLE IF NOT EXISTS users (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NULL,
  auth_provider ENUM('local', 'google') NOT NULL DEFAULT 'local',
  user_type     ENUM('student', 'professional', 'other') NULL,
  profile_image VARCHAR(500) NULL,
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  last_login    DATETIME NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  INDEX idx_users_auth_provider (auth_provider)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
