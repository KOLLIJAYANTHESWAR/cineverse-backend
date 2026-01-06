import express from "express";
import AuditLog from "./audit.model.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

// 🔐 ADMIN ONLY
router.use(authenticate, authorize("admin"));

router.get("/", async (req, res) => {
  const logs = await AuditLog.find()
    .populate("performedBy", "username")
    .populate("targetUser", "username")
    .populate("targetGroup", "name")
    .sort({ createdAt: -1 })
    .limit(200);

  res.json({
    success: true,
    data: logs,
  });
});

export default router;
