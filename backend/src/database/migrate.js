const fs = require("fs");
const path = require("path");
const { pool } = require("./connection");
const logger = require("../utils/logger");

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      filename VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [appliedRows] = await pool.query(`SELECT filename FROM migrations`);
  const appliedSet = new Set(appliedRows.map((row) => row.filename));

  let appliedCount = 0;

  for (const file of files) {
    if (appliedSet.has(file)) {
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    
    try {
      await pool.query(sql);
      await pool.query(`INSERT INTO migrations (filename) VALUES (?)`, [file]);
      logger.info(`Migration applied: ${file}`);
      appliedCount++;
    } catch (err) {
      logger.error(`Migration failed on file: ${file}`);
      throw err;
    }
  }

  if (appliedCount === 0) {
    logger.info(`No pending migrations to apply.`);
  } else {
    logger.info(`${appliedCount} migration(s) applied successfully.`);
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error(`Migration process failed: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { runMigrations };
