import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    // ===============================
    // BASIC INFO
    // ===============================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ===============================
    // OWNERSHIP & ROLES
    // ===============================
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ===============================
    // MODERATION
    // ===============================
    mutedMembers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        until: {
          type: Date,
          required: true,
        },
      },
    ],

    bannedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ===============================
    // SETTINGS
    // ===============================
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatGroup", groupSchema);
