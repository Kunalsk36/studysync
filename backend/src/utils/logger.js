const winston = require("winston");
const { config } = require("../config");

/**
 * Lightweight structured logging for the MVP (02-TechSpec.md §7.1).
 * Console output only for now — file transports / an external APM service
 * (e.g. Sentry) are a Version 2 concern, not required for Phase 1.
 */
const logger = winston.createLogger({
  level: config.env === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    config.env === "production" ? winston.format.json() : winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
