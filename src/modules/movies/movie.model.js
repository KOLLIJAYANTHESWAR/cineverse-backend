import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    posterPath: String,
    backdropPath: String,
    releaseDate: String,
    genres: [Number], // TMDB genre IDs
    popularity: Number,
    voteAverage: Number,
    voteCount: Number,
  },
  { timestamps: true }
);

// Fast lookups
movieSchema.index({ popularity: -1 });
movieSchema.index({ voteAverage: -1 });

export default mongoose.model("Movie", movieSchema);
