const { pool } = require("../database/connection");

/**
 * `user_sessions` is login history / audit log only in the MVP — the
 * approved session model does not validate requests against it, so this
 * repository only ever needs to insert and deactivate rows.
 */

async function create({ userId, sessionToken, ipAddress, userAgent, expiresAt }) {
  await pool.query(
    `INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, sessionToken, ipAddress || null, userAgent || null, expiresAt]
  );
}

async function deactivate(sessionToken) {
  await pool.query("UPDATE user_sessions SET is_active = FALSE WHERE session_token = ?", [
    sessionToken,
  ]);
}

module.exports = { create, deactivate };
