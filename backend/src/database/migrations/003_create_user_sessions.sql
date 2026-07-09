-- 04-DatabaseSchema.md §10 — user_sessions
-- Login history / audit log only in the MVP (session model decision:
-- JWT is verified statelessly; this table is not checked per-request).
CREATE TABLE IF NOT EXISTS user_sessions (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT UNSIGNED NOT NULL,
  session_token  VARCHAR(255) NOT NULL,
  ip_address     VARCHAR(45) NULL,
  user_agent     TEXT NULL,
  login_time     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at     DATETIME NOT NULL,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE KEY uq_user_sessions_token (session_token),
  INDEX idx_user_sessions_user_id (user_id),
  CONSTRAINT fk_user_sessions_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
