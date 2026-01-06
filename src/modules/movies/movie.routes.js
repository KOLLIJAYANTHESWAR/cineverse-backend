import express from "express";
import {
  getMovieDetails,
  searchMovieController,
  getTrendingMovies,
  getSimilarMovies,
} from "./movie.controller.js";

const router = express.Router();

/**
 * Search movies
 */
router.get("/search", searchMovieController);

/**
 * Trending movies
 */
router.get("/trending", getTrendingMovies);

/**
 * Movie details
 */
router.get("/:id", getMovieDetails);

/**
 * Similar movies
 */
router.get("/:id/similar", getSimilarMovies);

export default router;
