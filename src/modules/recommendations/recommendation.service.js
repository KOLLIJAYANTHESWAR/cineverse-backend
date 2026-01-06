import axios from "axios";
import { TMDB_CONFIG, tmdbAxiosConfig } from "../../config/tmdb.config.js";

/**
 * -------- TMDB-BASED (PHASE 1) ----------
 */

/**
 * Similar movies (TMDB)
 */
export const getSimilarMoviesTMDB = async (movieId) => {
  const res = await axios.get(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/similar`,
    {
      ...tmdbAxiosConfig,
      params: { language: TMDB_CONFIG.DEFAULT_LANGUAGE },
    }
  );

  return res.data.results;
};

/**
 * Genre-based recommendations
 */
export const getGenreBasedRecommendations = async (genreIds, page = 1) => {
  const res = await axios.get(
    `${TMDB_CONFIG.BASE_URL}/discover/movie`,
    {
      ...tmdbAxiosConfig,
      params: {
        with_genres: genreIds.join(","),
        sort_by: "popularity.desc",
        page,
        language: TMDB_CONFIG.DEFAULT_LANGUAGE,
      },
    }
  );

  return res.data.results;
};

/**
 * Director-based recommendations
 */
export const getDirectorBasedRecommendations = async (directorId) => {
  const res = await axios.get(
    `${TMDB_CONFIG.BASE_URL}/discover/movie`,
    {
      ...tmdbAxiosConfig,
      params: {
        with_crew: directorId,
        sort_by: "popularity.desc",
        language: TMDB_CONFIG.DEFAULT_LANGUAGE,
      },
    }
  );

  return res.data.results;
};

/**
 * -------- ML-BASED (PHASE 2 – FUTURE) ----------
 * This is intentionally isolated.
 */

export const getMLRecommendations = async (userId) => {
  /**
   * Example:
   * POST http://ml-service/recommend
   * body: { userId }
   */

  // Placeholder for future ML microservice
  return [];
};
