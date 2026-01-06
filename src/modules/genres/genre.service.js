import axios from "axios";
import { TMDB_CONFIG, tmdbAxiosConfig } from "../../config/tmdb.config.js";

/**
 * Fetch all movie genres from TMDB
 */
export const fetchAllGenres = async () => {
  const response = await axios.get(
    `${TMDB_CONFIG.BASE_URL}/genre/movie/list`,
    {
      ...tmdbAxiosConfig,
      params: { language: TMDB_CONFIG.DEFAULT_LANGUAGE },
    }
  );

  return response.data.genres;
};

/**
 * Fetch movies by genre
 */
export const fetchMoviesByGenre = async (genreId, page = 1) => {
  const response = await axios.get(
    `${TMDB_CONFIG.BASE_URL}/discover/movie`,
    {
      ...tmdbAxiosConfig,
      params: {
        with_genres: genreId,
        page,
        sort_by: "popularity.desc",
        language: TMDB_CONFIG.DEFAULT_LANGUAGE,
      },
    }
  );

  return response.data;
};

/**
 * Fetch top rated movies by genre
 */
export const fetchTopRatedByGenre = async (genreId, page = 1) => {
  const response = await axios.get(
    `${TMDB_CONFIG.BASE_URL}/discover/movie`,
    {
      ...tmdbAxiosConfig,
      params: {
        with_genres: genreId,
        sort_by: "vote_average.desc",
        "vote_count.gte": 100,
        page,
        language: TMDB_CONFIG.DEFAULT_LANGUAGE,
      },
    }
  );

  return response.data;
};
