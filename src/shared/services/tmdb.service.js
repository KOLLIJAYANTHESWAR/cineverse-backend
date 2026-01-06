import axios from "axios";
import { TMDB_CONFIG, tmdbAxiosConfig } from "../../config/tmdb.config.js";

/**
 * Create a single Axios instance for TMDB
 * (VERY important for consistency & scaling)
 */
const tmdbClient = axios.create({
  baseURL: TMDB_CONFIG.BASE_URL,
  ...tmdbAxiosConfig,
});

/**
 * Global response interceptor
 */
tmdbClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.status_message ||
      error.message ||
      "TMDB request failed";

    const status = error?.response?.status || 500;

    const err = new Error(message);
    err.statusCode = status;

    throw err;
  }
);

/**
 * -----------------------------
 * GENERIC REQUEST HELPERS
 * -----------------------------
 */

/**
 * GET request wrapper
 */
export const tmdbGet = async (url, params = {}) => {
  const response = await tmdbClient.get(url, {
    params: {
      language: TMDB_CONFIG.DEFAULT_LANGUAGE,
      ...params,
    },
  });

  return response.data;
};

/**
 * -----------------------------
 * MOVIES
 * -----------------------------
 */

export const getMovieDetails = (movieId) =>
  tmdbGet(`/movie/${movieId}`, {
    append_to_response: "credits,keywords,recommendations",
  });

export const searchMovies = (query, page = 1) =>
  tmdbGet("/search/movie", {
    query,
    page,
    include_adult: false,
  });

export const getTrendingMovies = (page = 1) =>
  tmdbGet("/trending/movie/week", { page });

export const getSimilarMovies = (movieId) =>
  tmdbGet(`/movie/${movieId}/similar`);

/**
 * -----------------------------
 * GENRES
 * -----------------------------
 */

export const getGenres = () => tmdbGet("/genre/movie/list");

export const getMoviesByGenre = (genreId, page = 1) =>
  tmdbGet("/discover/movie", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    page,
  });

/**
 * -----------------------------
 * PEOPLE (Actors / Directors)
 * -----------------------------
 */

export const getPersonDetails = (personId) =>
  tmdbGet(`/person/${personId}`, {
    append_to_response: "movie_credits",
  });

export const searchPeople = (query, page = 1) =>
  tmdbGet("/search/person", {
    query,
    page,
    include_adult: false,
  });

export const getPopularPeople = (page = 1) =>
  tmdbGet("/person/popular", { page });

/**
 * -----------------------------
 * RECOMMENDATIONS
 * -----------------------------
 */

export const getDirectorMovies = (directorId) =>
  tmdbGet("/discover/movie", {
    with_crew: directorId,
    sort_by: "popularity.desc",
  });

export const getGenreRecommendations = (genreIds, page = 1) =>
  tmdbGet("/discover/movie", {
    with_genres: genreIds.join(","),
    sort_by: "popularity.desc",
    page,
  });

/**
 * -----------------------------
 * IMAGE HELPERS (Frontend)
 * -----------------------------
 */

export const getImageUrl = (
  path,
  size = "w500"
) => {
  if (!path) return null;
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
};
