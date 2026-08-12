const { pool } = require("../database/connection");

async function create(notificationData) {
  const { userId, title, message, notificationType, scheduledAt, dedupeKey } = notificationData;
  const [result] = await pool.query(
    `INSERT INTO notifications (
      user_id, title, message, notification_type, scheduled_at, dedupe_key
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      title,
      message,
      notificationType || "system",
      scheduledAt || null,
      dedupeKey,
    ]
  );
  return findById(result.insertId, userId);
}

async function findAllByUserId(userId) {
  const [rows] = await pool.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

async function findById(id, userId) {
  const [rows] = await pool.query(
    "SELECT * FROM notifications WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId]
  );
  return rows[0] || null;
}

async function markAsRead(id, userId) {
  const [result] = await pool.query(
    "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
    [id, userId]
  );
  if (result.affectedRows === 0) return null;
  return findById(id, userId);
}

async function markAllAsRead(userId) {
  const [result] = await pool.query(
    "UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE",
    [userId]
  );
  return result.affectedRows;
}

async function remove(id, userId) {
  const [result] = await pool.query(
    "DELETE FROM notifications WHERE id = ? AND user_id = ?",
    [id, userId]
  );
  return result.affectedRows > 0;
}

module.exports = {
  create,
  findAllByUserId,
  findById,
  markAsRead,
  markAllAsRead,
  remove,
};
