const { pool } = require("../database/connection");

async function create(sessionData) {
  const { userId, taskId, sessionType, plannedMinutes, startedAt } = sessionData;
  
  const query = `
    INSERT INTO pomodoro_sessions 
      (user_id, task_id, session_type, planned_minutes, started_at, actual_minutes, status)
    VALUES (?, ?, ?, ?, ?, 0, 'completed')
  `;
  
  const params = [
    userId, 
    taskId || null, 
    sessionType, 
    plannedMinutes, 
    new Date(startedAt)
  ];

  const [result] = await pool.query(query, params);
  return findById(result.insertId, userId);
}

async function findById(id, userId) {
  const query = `SELECT * FROM pomodoro_sessions WHERE id = ? AND user_id = ?`;
  const [rows] = await pool.query(query, [id, userId]);
  return rows[0];
}

async function update(id, userId, updateData) {
  const { actualMinutes, status, endedAt } = updateData;
  
  const query = `
    UPDATE pomodoro_sessions 
    SET actual_minutes = ?, status = ?, ended_at = ?
    WHERE id = ? AND user_id = ?
  `;
  
  await pool.query(query, [
    actualMinutes, 
    status, 
    new Date(endedAt),
    id, 
    userId
  ]);
  
  return findById(id, userId);
}

async function getHistory(userId, filters = {}) {
  let query = `
    SELECT p.*, t.title as task_title 
    FROM pomodoro_sessions p
    LEFT JOIN tasks t ON p.task_id = t.id
    WHERE p.user_id = ?
  `;
  const params = [userId];

  if (filters.startDate) {
    query += ` AND p.started_at >= ?`;
    params.push(new Date(filters.startDate));
  }
  
  if (filters.endDate) {
    query += ` AND p.started_at <= ?`;
    params.push(new Date(filters.endDate));
  }

  query += ` ORDER BY p.started_at DESC`;

  const [rows] = await pool.query(query, params);
  return rows;
}

module.exports = {
  create,
  findById,
  update,
  getHistory
};
