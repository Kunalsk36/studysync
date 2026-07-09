const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const { config } = require("../config");
const userRepository = require("../repositories/user.repository");
const userPreferencesRepository = require("../repositories/userPreferences.repository");
const userSessionRepository = require("../repositories/userSession.repository");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signToken, verifyToken } = require("../utils/jwt");
const { sendMail } = require("../utils/mailer");
const logger = require("../utils/logger");

const googleClient = new OAuth2Client(config.google.clientId);

class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

function toPublicUser(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    authProvider: user.auth_provider,
    profileImage: user.profile_image,
  };
}

/** Short fingerprint of the current password hash — makes a reset token
 * single-use without needing a dedicated database table (see Section on
 * "reset tokens" in the implementation notes; no such table exists in
 * 04-DatabaseSchema.md, so a stateless approach was used deliberately). */
function passwordFingerprint(passwordHash) {
  return crypto
    .createHash("sha256")
    .update(passwordHash || "")
    .digest("hex")
    .slice(0, 16);
}

async function issueSession(user, req) {
  const token = signToken({ sub: user.id });
  await userSessionRepository.create({
    userId: user.id,
    sessionToken: token,
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
    expiresAt: new Date(Date.now() + config.jwt.cookieMaxAgeMs),
  });
  return token;
}

async function register({ fullName, email, password }) {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new AuthError("An account with this email already exists.", 409);
  }

  const passwordHash = await hashPassword(password);
  const user = await userRepository.create({
    fullName,
    email,
    passwordHash,
    authProvider: "local",
  });
  await userPreferencesRepository.createDefault(user.id);

  return toPublicUser(user);
}

async function login({ email, password }, req) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    // Same message as "wrong password" — avoids leaking which emails are registered.
    throw new AuthError("Invalid email or password.", 401);
  }

  if (user.auth_provider === "google" || !user.password_hash) {
    throw new AuthError(
      "This account uses Google Sign-In. Please continue with Google to log in.",
      403
    );
  }

  const passwordMatches = await comparePassword(password, user.password_hash);
  if (!passwordMatches) {
    throw new AuthError("Invalid email or password.", 401);
  }

  await userRepository.updateLastLogin(user.id);
  const token = await issueSession(user, req);

  return { user: toPublicUser(user), token };
}

async function loginWithGoogle({ idToken }, req) {
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.google.clientId,
    });
    payload = ticket.getPayload();
  } catch {
    throw new AuthError("Invalid Google credential.", 401);
  }

  const email = payload.email.toLowerCase();
  let user = await userRepository.findByEmail(email);
  let isNewUser = false;

  if (!user) {
    // New account — creates via Google, no local password (PRD FR-AUTH-003).
    user = await userRepository.create({
      fullName: payload.name || email,
      email,
      passwordHash: null,
      authProvider: "google",
      profileImage: payload.picture || null,
    });
    await userPreferencesRepository.createDefault(user.id);
    isNewUser = true;
  }
  // Existing account (local or google) — link per PRD §15.5: authenticate
  // against the same users.id rather than creating a duplicate.

  await userRepository.updateLastLogin(user.id);
  const token = await issueSession(user, req);

  return { user: toPublicUser(user), token, isNewUser };
}

async function logout(sessionToken) {
  if (sessionToken) {
    await userSessionRepository.deactivate(sessionToken);
  }
}

async function forgotPassword(email) {
  const user = await userRepository.findByEmail(email);

  // Always behave the same externally regardless of outcome (prevents
  // account enumeration) — the controller returns one generic message.
  if (!user) return;

  if (user.auth_provider === "google" || !user.password_hash) {
    await sendMail({
      to: user.email,
      subject: "StudySync — Sign in with Google",
      text: "This account uses Google Sign-In. Please continue with Google to log in.",
      html: "<p>This account uses <strong>Google Sign-In</strong>. Please continue with Google to log in.</p>",
    });
    return;
  }

  const resetToken = signTokenForReset(user);
  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;

  await sendMail({
    to: user.email,
    subject: "StudySync — Reset your password",
    text: `Reset your password: ${resetUrl} (expires in 15 minutes)`,
    html: `<p>Click below to reset your password. This link expires in 15 minutes.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });
}

function signTokenForReset(user) {
  return signToken(
    { sub: user.id, purpose: "password_reset", fp: passwordFingerprint(user.password_hash) },
    { expiresIn: "15m" }
  );
}

async function resetPassword({ token, newPassword }) {
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw new AuthError("This reset link is invalid or has expired.", 400);
  }

  if (decoded.purpose !== "password_reset") {
    throw new AuthError("This reset link is invalid or has expired.", 400);
  }

  const user = await userRepository.findById(decoded.sub);
  if (!user) {
    throw new AuthError("This reset link is invalid or has expired.", 400);
  }

  // Fingerprint mismatch means the password already changed since this
  // token was issued — makes the token single-use with no extra table.
  if (passwordFingerprint(user.password_hash) !== decoded.fp) {
    throw new AuthError("This reset link is invalid or has expired.", 400);
  }

  const passwordHash = await hashPassword(newPassword);
  await userRepository.updatePasswordHash(user.id, passwordHash);
  logger.info(`Password reset completed for user ${user.id}`);
}

module.exports = {
  AuthError,
  register,
  login,
  loginWithGoogle,
  logout,
  forgotPassword,
  resetPassword,
  toPublicUser,
};
