const { pool } = require("../database/connection");

async function create(eventData) {
  const { userId, title, description, eventType, startDatetime, endDatetime, location, isAllDay } = eventData;
  
  const query = `
    INSERT INTO calendar_events 
      (user_id, title, description, event_type, start_datetime, end_datetime, location, is_all_day)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    userId, 
    title, 
    description || null, 
    eventType || 'study', 
    new Date(startDatetime), 
    new Date(endDatetime), 
    location || null, 
    isAllDay ? 1 : 0
  ];

  const [result] = await pool.query(query, params);
  return findById(result.insertId, userId);
}

async function findById(id, userId) {
  const query = `SELECT * FROM calendar_events WHERE id = ? AND user_id = ?`;
  const [rows] = await pool.query(query, [id, userId]);
  return rows[0];
}

async function findAll(userId, filters = {}) {
  let query = `SELECT * FROM calendar_events WHERE user_id = ?`;
  const params = [userId];

  if (filters.startDate) {
    query += ` AND start_datetime >= ?`;
    params.push(new Date(filters.startDate));
  }
  
  if (filters.endDate) {
    query += ` AND start_datetime <= ?`;
    params.push(new Date(filters.endDate));
  }

  if (filters.eventType && filters.eventType !== 'all') {
    query += ` AND event_type = ?`;
    params.push(filters.eventType);
  }

  if (filters.search) {
    query += ` AND (title LIKE ? OR description LIKE ?)`;
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  query += ` ORDER BY start_datetime ASC`;

  const [rows] = await pool.query(query, params);
  return rows;
}

async function update(id, userId, updateData) {
  const fields = [];
  const params = [];

  const dbMap = {
    title: 'title',
    description: 'description',
    eventType: 'event_type',
    startDatetime: 'start_datetime',
    endDatetime: 'end_datetime',
    location: 'location',
    isAllDay: 'is_all_day'
  };

  for (const [key, value] of Object.entries(updateData)) {
    if (dbMap[key] && value !== undefined) {
      fields.push(`${dbMap[key]} = ?`);
      if (key === 'startDatetime' || key === 'endDatetime') {
        params.push(new Date(value));
      } else if (key === 'isAllDay') {
        params.push(value ? 1 : 0);
      } else {
        params.push(value);
      }
    }
  }

  if (fields.length === 0) return findById(id, userId);

  params.push(id, userId);
  
  const query = `UPDATE calendar_events SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
  await pool.query(query, params);
  
  return findById(id, userId);
}

async function remove(id, userId) {
  const query = `DELETE FROM calendar_events WHERE id = ? AND user_id = ?`;
  const [result] = await pool.query(query, [id, userId]);
  return result.affectedRows > 0;
}

module.exports = {
  create,
  findById,
  findAll,
  update,
  remove
};
