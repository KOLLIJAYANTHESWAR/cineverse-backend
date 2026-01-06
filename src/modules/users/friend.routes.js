import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
} from "./friend.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.post("/request/:userId", authenticate, sendFriendRequest);
router.post("/accept/:userId", authenticate, acceptFriendRequest);

export default router;
