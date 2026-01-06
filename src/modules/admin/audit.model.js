import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true, // e.g. USER_BANNED, POST_DELETED
      index: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    targetGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatGroup",
      default: null,
    },

    metadata: {
      type: Object,
      default: {},
    },

    ip: String,
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
