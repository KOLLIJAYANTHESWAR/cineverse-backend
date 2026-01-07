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
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true, // ✅ prevents Email vs email duplicates
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔐 never exposed in queries
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
      index: true,
    },

    // ===============================
    // EMAIL VERIFICATION
    // ===============================
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    emailVerificationToken: {
      type: String,
      index: true,
    },

    emailVerificationExpires: {
      type: Date,
    },
    // ===============================
    // 🔐 PASSWORD RESET
    // ===============================
    passwordResetToken: {
      type: String,
    },

    passwordResetExpires: {
      type: Date,
    },


    // ===============================
    // SOCIAL
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
    // TASTE PROFILE (ML READY)
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
  {
    timestamps: true,
  }
);


// ===============================
// INDEX SAFETY (PRODUCTION)
// ===============================
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export default mongoose.model("User", userSchema);

