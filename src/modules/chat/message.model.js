import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    room: {
      type: String, // e.g. "public", "dm_xxx", "group_xxx"
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    movie: {
      type: Number, // TMDB movie ID
      default: null,
    },
  },
  { timestamps: true }
);

// 🔥 IMPORTANT: compound index for fast pagination
chatMessageSchema.index({ room: 1, createdAt: -1 });

export default mongoose.model("ChatMessage", chatMessageSchema);
