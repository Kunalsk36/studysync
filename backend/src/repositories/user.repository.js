const { pool } = require("../database/connection");

/**
 * All SQL for the `users` table lives here — parameterized queries only
 * (08-Rules.md §7 / SQL-injection prevention).
 */

async function findByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
}

async function create({ fullName, email, passwordHash, authProvider, profileImage }) {
  const [result] = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, auth_provider, profile_image)
     VALUES (?, ?, ?, ?, ?)`,
    [fullName, email, passwordHash || null, authProvider, profileImage || null]
  );
  return findById(result.insertId);
}

async function updateLastLogin(userId) {
  await pool.query("UPDATE users SET last_login = NOW() WHERE id = ?", [userId]);
}

async function updatePasswordHash(userId, passwordHash) {
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, userId]);
}

module.exports = { findByEmail, findById, create, updateLastLogin, updatePasswordHash };
