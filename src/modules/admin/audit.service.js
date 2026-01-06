import AuditLog from "./audit.model.js";

export const logAudit = async ({
  action,
  performedBy,
  targetUser = null,
  targetGroup = null,
  metadata = {},
  req,
}) => {
  try {
    await AuditLog.create({
      action,
      performedBy,
      targetUser,
      targetGroup,
      metadata,
      ip: req?.ip || "system",
    });
  } catch (err) {
    console.error("❌ Audit log failed:", err.message);
  }
};
