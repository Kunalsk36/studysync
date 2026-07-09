const logger = require("../utils/logger");
const { config } = require("../config");

/**
 * Centralized error handler (08-Rules.md §12: "Never expose stack traces to
 * users" / "Log technical errors for debugging"). Feature-specific error
 * shapes (validation errors, etc.) will build on this in later phases.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(err.message, { stack: err.stack, path: req.originalUrl });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Something went wrong." : err.message,
    errors: config.env === "development" && statusCode === 500 ? [err.message] : [],
  });
}

module.exports = errorHandler;
