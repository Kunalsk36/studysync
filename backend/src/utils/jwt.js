const jwt = require("jsonwebtoken");
const { config } = require("../config");

/**
 * JWT is stateless (approved session model) — the token payload is the
 * only thing verified per-request; `user_sessions` is login history only.
 */
function signToken(payload, options = {}) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    ...options,
  });
}

function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

module.exports = { signToken, verifyToken };
