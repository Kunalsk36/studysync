const { Router } = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const categoryRoutes = require("./category.routes");
const taskRoutes = require("./task.routes");
const calendarRoutes = require("./calendar.routes");
const pomodoroRoutes = require("./pomodoro.routes");
const goalRoutes = require("./goal.routes");

const router = Router();

// Deliberately outside the /api namespace — conventional for infrastructure
// health checks (load balancers, uptime monitors) rather than product APIs.
router.use("/health", healthRoutes);

// Product API surface, per 05-API.md §3 Base URL (/api).
router.use("/api/auth", authRoutes);

// Remaining feature routers (tasks, calendar, ...) are mounted here in
// later phases.
router.use("/api/categories", categoryRoutes);
router.use("/api/tasks", taskRoutes);
router.use("/api/calendar", calendarRoutes);
router.use("/api/pomodoro", pomodoroRoutes);
router.use("/api/goals", goalRoutes);

module.exports = router;
