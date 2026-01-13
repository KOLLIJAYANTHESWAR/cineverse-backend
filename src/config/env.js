import dotenv from "dotenv";

dotenv.config();

/* ===============================
   REQUIRED ENV VARIABLES
   =============================== */
const requiredEnvVars = [
  "PORT",
  "MONGO_URI",
  "TMDB_TOKEN",
  "JWT_SECRET",
  "FRONTEND_URL",
  "RESEND_API_KEY",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1);
  }
});

/* ===============================
   EXPORT SAFE ENV OBJECT
   =============================== */
export const env = {
  // Server
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  mongoUri: process.env.MONGO_URI,

  // Auth
  jwtSecret: process.env.JWT_SECRET,

  // TMDB
  tmdbToken: process.env.TMDB_TOKEN,

  // Frontend
  frontendUrl: process.env.FRONTEND_URL,

  // Email (Resend)
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM || "Cinevraix <noreply@cinevraix.com>",
};
