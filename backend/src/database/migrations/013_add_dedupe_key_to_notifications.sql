ALTER TABLE notifications
ADD COLUMN dedupe_key VARCHAR(255) NOT NULL AFTER user_id,
ADD UNIQUE KEY uq_notifications_dedupe (user_id, dedupe_key);
