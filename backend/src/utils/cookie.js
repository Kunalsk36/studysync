const { config } = require("../config");

/**
 * Single source of truth for the auth cookie's attributes, so
 * setAuthCookie/clearAuthCookie can never drift out of sync with each
 * other (approved decision: httpOnly, Secure in production, SameSite=Lax).
 */
function cookieOptions() {
  return {
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    maxAge: config.jwt.cookieMaxAgeMs,
    path: "/",
  };
}

function setAuthCookie(res, token) {
  res.cookie(config.cookie.name, token, cookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie(config.cookie.name, { ...cookieOptions(), maxAge: undefined });
}

module.exports = { setAuthCookie, clearAuthCookie };
