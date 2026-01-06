import express from "express";
import cors from "cors";
import morgan from "morgan";

import routes from "./routes.js";
import { errorHandler } from "./shared/middlewares/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

/* ======================
   Global Middlewares
   ====================== */

// CORS (configure origin later if needed)
app.use(cors());

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging (dev only)
if (env.nodeEnv !== "production") {
  app.use(morgan("dev"));
}

/* ======================
   Health Check
   ====================== */

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

/* ======================
   API Routes
   ====================== */

app.use("/api", routes);

/* ======================
   404 Handler
   ====================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ======================
   Global Error Handler
   ====================== */

app.use(errorHandler);

export default app;
