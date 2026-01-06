import express from "express";
import {
  createRoom,
  getMyRooms,
  getMessages,
} from "./chat.controller.js";

import { authenticate } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

// 🔐 All chat APIs require login
router.use(authenticate);

/**
 * ======================
 * ROOMS
 * ======================
 */

// Create chat room (DM / Group handled internally)
router.post("/rooms", createRoom);

// Get my rooms
router.get("/rooms", getMyRooms);

/**
 * ======================
 * MESSAGES
 * ======================
 * Supports pagination:
 * ?page=1&limit=20
 */
router.get("/rooms/:id/messages", getMessages);

export default router;
