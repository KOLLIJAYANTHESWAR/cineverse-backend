import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} from "./admin.controller.js";

import {
  authenticate,
  authorize,
} from "../../shared/middlewares/auth.middleware.js";

import { ROLES } from "../../shared/constants/roles.js";

const router = express.Router();

/**
 * Announcements
 */

// 🔓 Public – anyone can read announcements
router.get("/announcements", getAnnouncements);

// 🟡 Admin / Moderator – create announcement
router.post(
  "/announcements",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.MODERATOR),
  createAnnouncement
);

// 🔴 Admin only – delete announcement
router.delete(
  "/announcements/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  deleteAnnouncement
);

export default router;
