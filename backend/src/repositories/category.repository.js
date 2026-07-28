const { pool } = require("../database/connection");

async function create({ userId, name, color, icon }) {
  const [result] = await pool.query(
    `INSERT INTO task_categories (user_id, name, color, icon)
     VALUES (?, ?, ?, ?)`,
    [userId, name, color || null, icon || null]
  );
  return findById(result.insertId, userId);
}

async function findAllByUserId(userId) {
  const [rows] = await pool.query(
    "SELECT * FROM task_categories WHERE user_id = ? ORDER BY created_at ASC",
    [userId]
  );
  return rows;
}

async function findById(id, userId) {
  const [rows] = await pool.query(
    "SELECT * FROM task_categories WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId]
  );
  return rows[0] || null;
}

async function findByNameAndUserId(name, userId) {
  const [rows] = await pool.query(
    "SELECT * FROM task_categories WHERE name = ? AND user_id = ? LIMIT 1",
    [name, userId]
  );
  return rows[0] || null;
}

async function update(id, userId, { name, color, icon }) {
  await pool.query(
    `UPDATE task_categories 
     SET name = ?, color = ?, icon = ?
     WHERE id = ? AND user_id = ?`,
    [name, color || null, icon || null, id, userId]
  );
  return findById(id, userId);
}

async function remove(id, userId) {
  const [result] = await pool.query(
    "DELETE FROM task_categories WHERE id = ? AND user_id = ?",
    [id, userId]
  );
  return result.affectedRows > 0;
}

module.exports = {
  create,
  findAllByUserId,
  findById,
  findByNameAndUserId,
  update,
  remove,
};
