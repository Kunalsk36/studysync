const fs = require("fs");
const path = require("path");
const { pool } = require("./connection");
const logger = require("../utils/logger");

/**
 * Minimal migration runner — executes the numbered .sql files in
 * `migrations/` in order. Each statement uses `CREATE TABLE IF NOT EXISTS`,
 * so re-running this is always safe and never touches existing tables
 * (04-DatabaseSchema.md §26 Migration Strategy).
 */
async function runMigrations() {
  const migrationsDir = path.join(__dirname, "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    await pool.query(sql);
    logger.info(`Migration applied: ${file}`);
  }

  logger.info(`${files.length} migration(s) checked/applied.`);
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error(`Migration failed: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { runMigrations };
