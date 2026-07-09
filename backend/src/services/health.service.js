const { config } = require("../config");

/**
 * Business logic for the health check. Kept deliberately small — Phase 1
 * only needs to confirm the server process itself is up and responding.
 */
function getHealthStatus() {
  return {
    status: "ok",
    environment: config.env,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  };
}

module.exports = { getHealthStatus };
