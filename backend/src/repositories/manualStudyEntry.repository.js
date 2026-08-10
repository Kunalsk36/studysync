const { pool } = require("../database/connection");

async function create(entryData) {
  const { userId, goalId, minutes, entryDate, notes } = entryData;

  const [result] = await pool.query(
    `INSERT INTO manual_study_entries (user_id, goal_id, minutes, entry_date, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, goalId, minutes, entryDate, notes || null]
  );
  return findById(result.insertId, userId);
}

async function findAllByGoalId(goalId, userId) {
  const [rows] = await pool.query(
    "SELECT * FROM manual_study_entries WHERE goal_id = ? AND user_id = ? ORDER BY entry_date DESC, created_at DESC",
    [goalId, userId]
  );
  return rows;
}

async function findById(id, userId) {
  const [rows] = await pool.query(
    "SELECT * FROM manual_study_entries WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId]
  );
  return rows[0] || null;
}

async function update(id, userId, entryData) {
  const fields = [];
  const values = [];

  const addField = (dbCol, val) => {
    if (val !== undefined) {
      fields.push(`${dbCol} = ?`);
      values.push(val === "" ? null : val);
    }
  };

  addField("minutes", entryData.minutes);
  addField("entry_date", entryData.entryDate);
  addField("notes", entryData.notes);

  if (fields.length === 0) return findById(id, userId);

  values.push(id, userId);

  await pool.query(
    `UPDATE manual_study_entries SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
    values
  );

  return findById(id, userId);
}

async function remove(id, userId) {
  const [result] = await pool.query(
    "DELETE FROM manual_study_entries WHERE id = ? AND user_id = ?",
    [id, userId]
  );
  return result.affectedRows > 0;
}

module.exports = {
  create,
  findAllByGoalId,
  findById,
  update,
  remove,
};
