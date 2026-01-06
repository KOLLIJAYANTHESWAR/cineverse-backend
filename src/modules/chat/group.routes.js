import express from "express";
import {
  createGroup,
  addMember,
  removeMember,
  promoteAdmin,
} from "./group.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createGroup);
router.post("/:groupId/add/:userId", authenticate, addMember);
router.post("/:groupId/remove/:userId", authenticate, removeMember);
router.post("/:groupId/promote/:userId", authenticate, promoteAdmin);

export default router;
