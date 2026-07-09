require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

/**
 * Variables that must be explicitly set in production — never silently
 * defaulted or substituted with a placeholder. Validated by
 * `assertRequiredConfig()`, called once from server.js before the app
 * starts listening.
 *
 * DB_PASSWORD is included beyond the original "at minimum" list: real
 * production MySQL (including Railway's managed MySQL) always requires a
 * password, so silently allowing an empty one in production is a real gap,
 * not just a theoretical one.
 */
const REQUIRED_IN_PRODUCTION = [
  "JWT_SECRET",
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
];

/**
 * Parses a short duration string ("7d", "15m", "3600s", "900000ms" or a
 * bare number of ms) into milliseconds. Used to derive the auth cookie's
 * `maxAge` from the same `JWT_EXPIRES_IN` value the JWT itself uses, so the
 * two can never drift out of sync with each other.
 */
function parseDurationToMs(duration) {
  const match = /^(\d+)\s*(ms|s|m|h|d)?$/i.exec(String(duration).trim());
  if (!match) {
    throw new Error(
      `Invalid duration "${duration}". Expected a format like "7d", "15m", or "3600s".`
    );
  }
  const value = Number(match[1]);
  const unit = (match[2] || "ms").toLowerCase();
  const msPerUnit = { ms: 1, s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * msPerUnit[unit];
}

/**
 * Centralized configuration loader. Every other module reads settings from
 * here instead of touching `process.env` directly (07-ProjectStructure.md
 * `config/` folder — "Application configuration").
 *
 * Values that are always safe with a development default (per the
 * production-readiness review): PORT, DB_HOST, DB_PORT, FRONTEND_URL,
 * JWT_EXPIRES_IN. Secrets (JWT_SECRET, GOOGLE_CLIENT_ID/SECRET) are read
 * as-is with no fallback — an empty/placeholder secret is a security hole,
 * not a convenience, so it's better for them to be `undefined` (and fail
 * loudly wherever they're used) than silently work.
 */
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

const config = {
  env: process.env.NODE_ENV || "development",
  isProduction,
  port: Number(process.env.PORT) || 5000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || "studysync",
    user: process.env.DB_USER || "root",
    // Empty string is a legitimate value here (many local MySQL installs
    // have no password) — unlike a secret, defaulting this is not a
    // security hole, just a dev convenience. Required explicitly in
    // production via REQUIRED_IN_PRODUCTION above.
    password: process.env.DB_PASSWORD || "",
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: jwtExpiresIn,
    cookieMaxAgeMs: parseDurationToMs(jwtExpiresIn),
  },

  cookie: {
    name: "studysync_token",
    // Approved decision: httpOnly cookie, Secure in production, SameSite=Lax.
    secure: isProduction,
    sameSite: "lax",
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },

  mail: {
    // Provider-independent: only these four values are read by utils/mailer.js.
    // Ethereal Email (https://ethereal.email) for MVP/dev; swap the SMTP_*
    // values for a real provider later without touching any calling code.
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || "",
    password: process.env.SMTP_PASSWORD || "",
  },

  ai: {
    provider: process.env.AI_PROVIDER || "",
  },
};

function assertRequiredConfig() {
  if (!isProduction) return;

  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s) in production: ${missing.join(", ")}. ` +
        "These must be set explicitly — see backend/.env.example — the application will not " +
        "start with a missing or placeholder value for any of them."
    );
  }
}

module.exports = { config, assertRequiredConfig };
