import express from "express";
import {
  createPost,
  getFeedPosts,
  toggleLikePost,
  deletePost,
} from "./post.controller.js";

import { authenticate } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Feed
 */
router.get("/", getFeedPosts);

/**
 * Create post
 */
router.post("/", authenticate, createPost);

/**
 * Like / unlike
 */
router.patch("/:id/like", authenticate, toggleLikePost);

/**
 * Delete post
 */
router.delete("/:id", authenticate, deletePost);

export default router;
