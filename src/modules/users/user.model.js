import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ===============================
    // BASIC INFO
    // ===============================
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔐 never return password by default
    },

    avatar: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
      index: true,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    // ===============================
    // SOCIAL (FRIENDS & DMs)
    // ===============================
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    friendRequests: [
      {
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ===============================
    // TASTE PROFILE (FOR ML)
    // ===============================
    likedMovies: [
      {
        type: Number, // TMDB movie ID
        index: true,
      },
    ],

    preferredGenres: [
      {
        type: Number, // TMDB genre ID
      },
    ],

    favoriteDirectors: [
      {
        type: Number, // TMDB person ID
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
