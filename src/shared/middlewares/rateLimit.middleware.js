import rateLimit from "express-rate-limit";

/**
 * 🔐 Strict limiter (login, register)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    message: "Too many attempts. Try again later.",
  },
});

/**
 * 🧱 General API limiter
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
});

/**
 * 💬 Chat limiter (public chat spam control)
 */
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 messages/minute
  message: {
    success: false,
    message: "You are sending messages too fast.",
  },
});
// shared/middlewares/rateLimit.middleware.js
export const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: "Too many user requests. Please slow down.",
  },
});
