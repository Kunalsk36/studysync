const { pool } = require("../database/connection");

/**
 * Every user must have exactly one preferences row (04-DatabaseSchema.md §8
 * — one-to-one). Created immediately after a user is created.
 */
async function createDefault(userId) {
  await pool.query("INSERT INTO user_preferences (user_id) VALUES (?)", [userId]);
}

async function getByUserId(userId) {
  const [rows] = await pool.query("SELECT * FROM user_preferences WHERE user_id = ?", [userId]);
  return rows[0];
}

module.exports = { createDefault, getByUserId };
