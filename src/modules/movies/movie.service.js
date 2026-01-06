import axios from "axios";
import { TMDB_CONFIG, tmdbAxiosConfig } from "../../config/tmdb.config.js";

/**
 * Fetch movie details
 */
export const fetchMovieDetails = async (movieId) => {
  const res = await axios.get(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}`,
    {
      ...tmdbAxiosConfig,
      params: {
        append_to_response: "credits,keywords,recommendations",
        language: TMDB_CONFIG.DEFAULT_LANGUAGE,
      },
    }
  );
  return res.data;
};

/**
 * Search movies
 */
export const searchMovies = async (query, page = 1) => {
  const res = await axios.get(
    `${TMDB_CONFIG.BASE_URL}/search/movie`,
    {
      ...tmdbAxiosConfig,
      params: {
        query,
        page,
        include_adult: false,
        language: TMDB_CONFIG.DEFAULT_LANGUAGE,
      },
    }
  );
  return res.data;
};

/**
 * Fetch trending movies
 */
export const fetchTrendingMovies = async (page = 1) => {
  const res = await axios.get(
    `${TMDB_CONFIG.BASE_URL}/trending/movie/week`,
    {
      ...tmdbAxiosConfig,
      params: { page },
    }
  );
  return res.data;
};

/**
 * Fetch similar movies
 */
export const fetchSimilarMovies = async (movieId) => {
  const res = await axios.get(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/similar`,
    {
      ...tmdbAxiosConfig,
      params: { language: TMDB_CONFIG.DEFAULT_LANGUAGE },
    }
  );
  return res.data.results;
};
