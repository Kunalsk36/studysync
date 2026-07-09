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
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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
