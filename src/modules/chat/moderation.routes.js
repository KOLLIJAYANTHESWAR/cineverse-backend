import express from "express";
import {
  muteMember,
  kickMember,
  banMember,
} from "./moderation.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:groupId/mute/:userId", authenticate, muteMember);
router.post("/:groupId/kick/:userId", authenticate, kickMember);
router.post("/:groupId/ban/:userId", authenticate, banMember);

export default router;
