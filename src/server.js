import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { initSocket } from "./modules/chat/socket.js";
import { env } from "./config/env.js";

/**
 * Create HTTP server
 */
const server = http.createServer(app);

/**
 * Initialize Socket.IO
 */
const io = new Server(server, {
  cors: {
    origin: "*", // tighten later in production
    methods: ["GET", "POST"],
  },
});

/**
 * Attach socket handlers
 */
initSocket(io);

/**
 * Handle server-level errors
 */
server.on("error", (error) => {
  console.error("❌ Server error:", error.message);
  process.exit(1);
});

/**
 * Graceful shutdown
 */
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down server...");
  server.close(() => {
    console.log("✅ Server closed gracefully");
    process.exit(0);
  });
});

export default server;
