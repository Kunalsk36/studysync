const healthService = require("../services/health.service");

/**
 * Controllers only handle HTTP request/response — no business logic here
 * (08-Rules.md §6).
 */
function getHealth(req, res) {
  const data = healthService.getHealthStatus();

  res.status(200).json({
    success: true,
    message: "Application is healthy.",
    data,
  });
}

module.exports = { getHealth };
