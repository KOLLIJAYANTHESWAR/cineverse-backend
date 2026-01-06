import express from "express";
import {
  recommendByMovie,
  recommendByGenre,
  recommendByDirector,
  recommendForUser,
} from "./recommendation.controller.js";

import { authenticate } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Movie-based (similar)
 */
router.get("/movie/:id", recommendByMovie);

/**
 * Genre-based
 * /api/recommendations/genre?genres=27,53
 */
router.get("/genre", recommendByGenre);

/**
 * Director-based
 */
router.get("/director/:id", recommendByDirector);

/**
 * Personalized (ML – future)
 */
router.get("/me", authenticate, recommendForUser);

export default router;
