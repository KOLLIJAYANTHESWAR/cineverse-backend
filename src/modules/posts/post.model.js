import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["POST", "ANNOUNCEMENT"],
      default: "POST",
      index: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    // Shared movie (TMDB ID)
    movie: {
      type: Number,
      default: null,
      index: true,
    },

    // Engagement
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    commentsCount: {
      type: Number,
      default: 0,
    },

    pinned: {
      type: Boolean,
      default: false,
    },

    removed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for feeds
postSchema.index({ createdAt: -1 });
postSchema.index({ pinned: -1, createdAt: -1 });

export default mongoose.model("Post", postSchema);
