require("dotenv").config();

const requiredInProduction = ["JWT_SECRET", "DB_HOST", "DB_NAME", "DB_USER"];

/**
 * Centralized configuration loader. Every other module reads settings from
 * here instead of touching `process.env` directly (07-ProjectStructure.md
 * `config/` folder — "Application configuration").
 */
const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || "studysync",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "",
    // Approved decision: 7 days, no refresh tokens in MVP.
    expiresIn: "7d",
    cookieMaxAgeMs: 7 * 24 * 60 * 60 * 1000,
  },

  cookie: {
    name: "studysync_token",
    // Approved decision: httpOnly cookie, Secure in production, SameSite=Lax.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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
  if (config.env !== "production") return;
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

module.exports = { config, assertRequiredConfig };
