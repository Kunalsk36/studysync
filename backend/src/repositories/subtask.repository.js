const { pool } = require("../database/connection");

async function create(subtaskData) {
  const { taskId, title, isCompleted = false, completedAt = null } = subtaskData;

  const [result] = await pool.query(
    `INSERT INTO subtasks (task_id, title, is_completed, completed_at) VALUES (?, ?, ?, ?)`,
    [taskId, title, isCompleted, completedAt]
  );
  
  return findById(result.insertId, taskId);
}

async function findAllByTaskId(taskId) {
  const [rows] = await pool.query(
    "SELECT * FROM subtasks WHERE task_id = ? ORDER BY created_at ASC",
    [taskId]
  );
  return rows;
}

async function findById(id, taskId) {
  const [rows] = await pool.query(
    "SELECT * FROM subtasks WHERE id = ? AND task_id = ? LIMIT 1",
    [id, taskId]
  );
  return rows[0] || null;
}

async function update(id, taskId, subtaskData) {
  const fields = [];
  const values = [];

  const addField = (dbCol, val) => {
    if (val !== undefined) {
      fields.push(`${dbCol} = ?`);
      values.push(val);
    }
  };

  addField("title", subtaskData.title);
  addField("is_completed", subtaskData.isCompleted);
  addField("completed_at", subtaskData.completedAt);

  if (fields.length === 0) return findById(id, taskId);

  values.push(id, taskId);

  await pool.query(
    `UPDATE subtasks SET ${fields.join(", ")} WHERE id = ? AND task_id = ?`,
    values
  );

  return findById(id, taskId);
}

async function remove(id, taskId) {
  const [result] = await pool.query(
    "DELETE FROM subtasks WHERE id = ? AND task_id = ?",
    [id, taskId]
  );
  return result.affectedRows > 0;
}

module.exports = {
  create,
  findAllByTaskId,
  findById,
  update,
  remove,
};
