const { config } = require("../config");
const { verifyToken } = require("../utils/jwt");
const userRepository = require("../repositories/user.repository");

/**
 * Approved session model: verify the JWT (signature + expiration) and
 * confirm the user still exists — nothing is checked against
 * `user_sessions` per request (that table is login history only).
 */
async function authenticate(req, res, next) {
  const token = req.cookies?.[config.cookie.name];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
      errors: [],
    });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid. Please log in again.",
      errors: [],
    });
  }

  const user = await userRepository.findById(decoded.sub);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid. Please log in again.",
      errors: [],
    });
  }

  req.user = { id: user.id, email: user.email, fullName: user.full_name };
  next();
}

module.exports = authenticate;
