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

async function findAllByUserId(userId, options = {}) {
  const {
    search,
    status,
    priority,
    categoryId,
    dueDate,
    sortBy = "created_at",
    order = "desc",
    page = 1,
    limit = 10,
  } = options;

  let whereClause = "WHERE user_id = ?";
  const values = [userId];

  if (search) {
    whereClause += " AND (title LIKE ? OR description LIKE ?)";
    const likeTerm = `%${search}%`;
    values.push(likeTerm, likeTerm);
  }

  if (status) {
    whereClause += " AND status = ?";
    values.push(status);
  }

  if (priority) {
    whereClause += " AND priority = ?";
    values.push(priority);
  }

  if (categoryId) {
    whereClause += " AND category_id = ?";
    values.push(categoryId);
  }

  if (dueDate) {
    whereClause += " AND DATE(due_date) = DATE(?)";
    values.push(dueDate);
  }

  // Count query
  const countQuery = `SELECT COUNT(*) as total FROM tasks ${whereClause}`;
  const [[{ total }]] = await pool.query(countQuery, values);

  // Data query
  let query = `SELECT * FROM tasks ${whereClause}`;

  // Validate sortBy to prevent SQL injection
  const validSortColumns = ["created_at", "updated_at", "due_date", "priority", "title"];
  const sortCol = validSortColumns.includes(sortBy) ? sortBy : "created_at";
  const sortOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

  query += ` ORDER BY ${sortCol} ${sortOrder}`;

  const offset = (page - 1) * limit;
  query += " LIMIT ? OFFSET ?";
  const queryValues = [...values, Number(limit), Number(offset)];

  const [rows] = await pool.query(query, queryValues);

  return {
    data: rows,
    total,
  };
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
