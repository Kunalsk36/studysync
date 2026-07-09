const mysql = require("mysql2/promise");
const { config } = require("../config");
const logger = require("../utils/logger");

/**
 * Shared connection pool. Query logic belongs in `repositories/`, per
 * 07-ProjectStructure.md — this module only owns the connection itself.
 */
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Verifies a connection can be established. Used once at startup
 * (see server.js) — does not create tables or run migrations.
 */
async function verifyConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.query("SELECT 1");
    logger.info(`Database connection verified (${config.db.name}@${config.db.host})`);
    return true;
  } finally {
    connection.release();
  }
}

module.exports = { pool, verifyConnection };
