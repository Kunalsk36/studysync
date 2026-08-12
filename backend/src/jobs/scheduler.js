const cron = require("node-cron");
const logger = require("../utils/logger");
const { runNotificationJob } = require("./notification.job");

let isInitialized = false;

function initScheduler() {
  if (isInitialized) {
    logger.warn("[Scheduler] Initialization attempted again, ignoring.");
    return;
  }

  logger.info("[Scheduler] Initializing cron jobs...");

  // Run notification job every 5 minutes
  cron.schedule("*/5 * * * *", () => {
    runNotificationJob().catch(err => {
      logger.error("[Scheduler] Error running notification job from cron:", err);
    });
  });

  isInitialized = true;
  logger.info("[Scheduler] Cron jobs initialized successfully.");
}

module.exports = {
  initScheduler,
};
