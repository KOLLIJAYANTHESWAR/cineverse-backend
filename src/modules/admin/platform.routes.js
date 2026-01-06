import express from "express";
import {
  banUser,
  unbanUser,
  deleteAnyPost,
} from "./platform.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

// 🔐 PROJECT ADMIN ONLY
router.post("/ban-user/:userId", authenticate, authorize("admin"), banUser);
router.post("/unban-user/:userId", authenticate, authorize("admin"), unbanUser);
router.delete("/post/:postId", authenticate, authorize("admin"), deleteAnyPost);

export default router;
