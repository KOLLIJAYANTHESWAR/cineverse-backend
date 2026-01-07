import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "PORT",
  "MONGO_URI",
  "TMDB_TOKEN",
  "JWT_SECRET", // 🔥 ADD THIS
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1);
  }
});

export const env = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  tmdbToken: process.env.TMDB_TOKEN,
  jwtSecret: process.env.JWT_SECRET, // 🔥 ADD THIS
  nodeEnv: process.env.NODE_ENV || "development",
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  emailFrom: process.env.EMAIL_FROM,

};
