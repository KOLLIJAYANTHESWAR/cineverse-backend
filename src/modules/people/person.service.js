import axios from "axios";
import { TMDB_CONFIG, tmdbAxiosConfig } from "../../config/tmdb.config.js";

/**
 * Fetch person details (actor / director)
 */
export const fetchPersonDetails = async (personId) => {
  const response = await axios.get(
    `${TMDB_CONFIG.BASE_URL}/person/${personId}`,
    {
      ...tmdbAxiosConfig,
      params: {
        append_to_response: "movie_credits",
        language: TMDB_CONFIG.DEFAULT_LANGUAGE,
      },
    }
  );

  return response.data;
};

/**
 * Search people (actors / directors)
 */
export const searchPeople = async (query, page = 1) => {
  const response = await axios.get(
    `${TMDB_CONFIG.BASE_URL}/search/person`,
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

  return response.data;
};

/**
 * Fetch popular people
 */
export const fetchPopularPeople = async (page = 1) => {
  const response = await axios.get(
    `${TMDB_CONFIG.BASE_URL}/person/popular`,
    {
      ...tmdbAxiosConfig,
      params: {
        page,
        language: TMDB_CONFIG.DEFAULT_LANGUAGE,
      },
    }
  );

  return response.data;
};
