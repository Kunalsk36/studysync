const { pool } = require("../database/connection");

async function create(goalData) {
  const { userId, title, description, targetHours, targetDate, status } = goalData;

  const [result] = await pool.query(
    `INSERT INTO study_goals (user_id, title, description, target_hours, target_date, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      title,
      description || null,
      targetHours,
      targetDate || null,
      status || "active",
    ]
  );
  return findById(result.insertId, userId);
}

const goalWithProgressQuery = `
  SELECT 
    g.*,
    COALESCE((SELECT SUM(actual_minutes) FROM pomodoro_sessions WHERE goal_id = g.id AND status = 'completed'), 0) / 60.0 AS pomodoro_hours,
    COALESCE((SELECT SUM(minutes) FROM manual_study_entries WHERE goal_id = g.id), 0) / 60.0 AS manual_hours
  FROM study_goals g
`;

function mapGoalProgress(row) {
  if (!row) return null;
  const pomodoroHours = parseFloat(row.pomodoro_hours) || 0;
  const manualHours = parseFloat(row.manual_hours) || 0;
  const totalCompletedHours = pomodoroHours + manualHours;
  const targetHours = parseFloat(row.target_hours);
  let progressPercentage = 0;
  
  if (targetHours > 0) {
    progressPercentage = (totalCompletedHours / targetHours) * 100;
  }

  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    description: row.description,
    target_hours: targetHours,
    target_date: row.target_date,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    pomodoro_hours: Number(pomodoroHours.toFixed(2)),
    manual_hours: Number(manualHours.toFixed(2)),
    total_completed_hours: Number(totalCompletedHours.toFixed(2)),
    progress_percentage: Number(progressPercentage.toFixed(2)),
  };
}

async function findAllByUserId(userId) {
  const [rows] = await pool.query(
    `${goalWithProgressQuery} WHERE g.user_id = ? ORDER BY g.created_at DESC`,
    [userId]
  );
  return rows.map(mapGoalProgress);
}

async function findById(id, userId) {
  const [rows] = await pool.query(
    `${goalWithProgressQuery} WHERE g.id = ? AND g.user_id = ? LIMIT 1`,
    [id, userId]
  );
  return mapGoalProgress(rows[0]);
}

async function update(id, userId, goalData) {
  const fields = [];
  const values = [];

  const addField = (dbCol, val) => {
    if (val !== undefined) {
      fields.push(`${dbCol} = ?`);
      values.push(val === "" ? null : val);
    }
  };

  addField("title", goalData.title);
  addField("description", goalData.description);
  addField("target_hours", goalData.targetHours);
  addField("target_date", goalData.targetDate);
  addField("status", goalData.status);

  if (fields.length === 0) return findById(id, userId);

  values.push(id, userId);

  await pool.query(
    `UPDATE study_goals SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
    values
  );

  return findById(id, userId);
}

async function remove(id, userId) {
  const [result] = await pool.query(
    "DELETE FROM study_goals WHERE id = ? AND user_id = ?",
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
