import express from "express";

/**
 * Feature Routes
 */
import movieRoutes from "./modules/movies/movie.routes.js";
import genreRoutes from "./modules/genres/genre.routes.js";
import peopleRoutes from "./modules/people/person.routes.js";
import recommendationRoutes from "./modules/recommendations/recommendation.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import postRoutes from "./modules/posts/post.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import friendRoutes from "./modules/users/friend.routes.js";
import groupRoutes from "./modules/chat/group.routes.js";
import moderationRoutes from "./modules/chat/moderation.routes.js";
import platformAdminRoutes from "./modules/admin/platform.routes.js";
import auditRoutes from "./modules/admin/audit.routes.js";

/**
 * Rate limiters
 */
import {
  authLimiter,
  apiLimiter,
} from "./shared/middlewares/rateLimit.middleware.js";

const router = express.Router();

/* ======================
   API Route Mapping
   ====================== */

// 🔐 AUTH (STRICT RATE LIMIT)
router.use("/auth", authLimiter, authRoutes);

// 🌍 PUBLIC / GENERAL APIs (SAFE LIMIT)
router.use("/movies", apiLimiter, movieRoutes);
router.use("/genres", apiLimiter, genreRoutes);
router.use("/people", apiLimiter, peopleRoutes);
router.use("/recommendations", apiLimiter, recommendationRoutes);
router.use("/posts", apiLimiter, postRoutes);

// 👤 USER / SOCIAL
router.use("/users", userRoutes);
router.use("/users/friends", friendRoutes);

// 💬 CHAT (socket spam handled later with Redis)
router.use("/chat", chatRoutes);
router.use("/groups", groupRoutes);
router.use("/groups/moderation", moderationRoutes);

// 🛡 ADMIN
router.use("/admin", adminRoutes);
router.use("/admin", platformAdminRoutes);
router.use("/admin/audit-logs", auditRoutes);

/* ======================
   API Root
   ====================== */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CineVerse API v1 is running",
  });
});

export default router;
