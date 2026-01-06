import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  toggleLikeMovie,
  banUser,
} from "./user.controller.js";

import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

/**
 * My profile
 */
router.get("/me", authenticate, getMyProfile);
router.patch("/me", authenticate, updateMyProfile);

/**
 * Like / unlike movie (taste signal)
 */
router.patch("/me/like-movie", authenticate, toggleLikeMovie);

/**
 * Admin moderation
 */
router.patch("/:id/ban", authenticate, authorize("admin"), banUser);

export default router;
