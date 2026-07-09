const authService = require("../services/auth.service");
const { setAuthCookie, clearAuthCookie } = require("../utils/cookie");
const { config } = require("../config");

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Registration successful. Please log in.",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { user, token } = await authService.login(req.body, req);
    setAuthCookie(res, token);
    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

async function google(req, res, next) {
  try {
    const { user, token } = await authService.loginWithGoogle(req.body, req);
    setAuthCookie(res, token);
    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies?.[config.cookie.name];
    await authService.logout(token);
    clearAuthCookie(res);
    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    await authService.forgotPassword(req.body.email);
    res.status(200).json({
      success: true,
      message: "If an account exists for this email, a reset link has been sent.",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    await authService.resetPassword(req.body);
    res.status(200).json({
      success: true,
      message: "Password reset successful. Please log in.",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  res.status(200).json({
    success: true,
    message: "Authenticated.",
    data: { user: req.user },
  });
}

module.exports = { register, login, google, logout, forgotPassword, resetPassword, me };
