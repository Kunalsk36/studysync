const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate");
const { authRateLimiter } = require("../middleware/rateLimiter");
const {
  registerSchema,
  loginSchema,
  googleSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validations/auth.validation");

const router = Router();

// Approved: rate limiting applies to Register, Login, Forgot Password.
router.post("/register", authRateLimiter, validate(registerSchema), authController.register);
router.post("/login", authRateLimiter, validate(loginSchema), authController.login);
router.post("/google", validate(googleSchema), authController.google);
router.post("/logout", authenticate, authController.logout);
router.post(
  "/forgot-password",
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

// Not one of the 6 documented endpoints — small necessary addition for the
// httpOnly-cookie storage model: the frontend cannot read the cookie
// itself, so it needs a way to ask "am I logged in?" on page load.
router.get("/me", authenticate, authController.me);

module.exports = router;
