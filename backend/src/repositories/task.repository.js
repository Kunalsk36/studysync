const { pool } = require("../database/connection");

async function create(taskData) {
  const {
    userId,
    categoryId,
    title,
    description,
    priority,
    status,
    estimatedMinutes,
    actualMinutes,
    dueDate,
    completedAt,
    notes,
    tags,
    color,
  } = taskData;

  const [result] = await pool.query(
    `INSERT INTO tasks (
      user_id, category_id, title, description, priority, status,
      estimated_minutes, actual_minutes, due_date, completed_at, notes, tags, color
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      categoryId || null,
      title,
      description || null,
      priority || "medium",
      status || "pending",
      estimatedMinutes || null,
      actualMinutes || null,
      dueDate || null,
      completedAt || null,
      notes || null,
      tags || null,
      color || null,
    ]
  );
  return findById(result.insertId, userId);
}

async function findAllByUserId(userId) {
  const [rows] = await pool.query(
    "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

async function findById(id, userId) {
  const [rows] = await pool.query(
    "SELECT * FROM tasks WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId]
  );
  return rows[0] || null;
}

async function update(id, userId, taskData) {
  // Build dynamic update query based on provided fields
  const fields = [];
  const values = [];

  const addField = (dbCol, val) => {
    if (val !== undefined) {
      fields.push(`${dbCol} = ?`);
      values.push(val === "" ? null : val);
    }
  };

  addField("category_id", taskData.categoryId);
  addField("title", taskData.title);
  addField("description", taskData.description);
  addField("priority", taskData.priority);
  addField("status", taskData.status);
  addField("estimated_minutes", taskData.estimatedMinutes);
  addField("actual_minutes", taskData.actualMinutes);
  addField("due_date", taskData.dueDate);
  addField("completed_at", taskData.completedAt);
  addField("notes", taskData.notes);
  addField("tags", taskData.tags);
  addField("color", taskData.color);

  if (fields.length === 0) return findById(id, userId);

  values.push(id, userId);

  await pool.query(
    `UPDATE tasks SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
    values
  );

  return findById(id, userId);
}

async function remove(id, userId) {
  const [result] = await pool.query(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [id, userId]
  );
  return result.affectedRows > 0;
}

module.exports = {
  create,
  findAllByUserId,
  findById,
  update,
  remove,
};
