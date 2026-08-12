const app = require("./app");
const { config, assertRequiredConfig } = require("./config");
const { verifyConnection } = require("./database/connection");
const logger = require("./utils/logger");

async function start() {
  try {
    assertRequiredConfig();

    try {
      await verifyConnection();
    } catch (err) {
      logger.warn(`Database connection failed: ${err.message}`);
      logger.warn("Continuing startup without a verified database connection.");
    }

    try {
      const { initScheduler } = require("./jobs/scheduler");
      initScheduler();
    } catch (err) {
      logger.warn(`Scheduler initialization failed: ${err.message}`);
    }

    app.listen(config.port, () => {
      logger.info(`StudySync API running on http://localhost:${config.port} [${config.env}]`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

start();
