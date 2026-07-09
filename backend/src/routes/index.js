const { Router } = require("express");
const healthRoutes = require("./health.routes");

const router = Router();

// Deliberately outside the /api namespace — conventional for infrastructure
// health checks (load balancers, uptime monitors) rather than product APIs.
router.use("/health", healthRoutes);

// Feature routers (auth, tasks, calendar, ...) are mounted under /api in
// later phases, per 05-API.md — none exist yet.

module.exports = router;
