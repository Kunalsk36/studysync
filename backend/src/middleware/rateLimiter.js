const rateLimit = require("express-rate-limit");

/**
 * Approved decision: 10 requests / 15 minutes / IP, applied to
 * Register, Login, and Forgot Password (PRD FR-SEC-006).
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again in a few minutes.",
    errors: [],
  },
});

module.exports = { authRateLimiter };
