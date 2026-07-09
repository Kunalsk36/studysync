const logger = require("../utils/logger");
const { config } = require("../config");

/**
 * Centralized error handler (08-Rules.md §12: "Never expose stack traces to
 * users" / "Log technical errors for debugging"). Feature-specific error
 * shapes (validation errors, etc.) will build on this in later phases.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  // Expected client errors (4xx — wrong password, duplicate email, etc.)
  // are normal control flow, not application failures — only 5xx warrants
  // an `error`-level log with a stack trace.
  if (statusCode >= 500) {
    logger.error(err.message, { stack: err.stack, path: req.originalUrl });
  } else {
    logger.debug(`${statusCode} ${req.method} ${req.originalUrl}: ${err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Something went wrong." : err.message,
    errors: config.env === "development" && statusCode === 500 ? [err.message] : [],
  });
}

module.exports = errorHandler;
