// src/routes/health.routes.js
import express from "express";
import mongoose from "mongoose";
import redis from "../config/redis.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    redis: redis?.isOpen ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

export default router;
