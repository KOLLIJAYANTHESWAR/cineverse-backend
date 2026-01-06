import express from "express";
import {
  getGenres,
  getMoviesByGenre,
  getTopRatedByGenre,
} from "./genre.controller.js";

const router = express.Router();

/**
 * Genres
 */
router.get("/", getGenres);

/**
 * Movies by genre
 */
router.get("/:id/movies", getMoviesByGenre);

/**
 * Top rated movies by genre
 */
router.get("/:id/top", getTopRatedByGenre);

export default router;
