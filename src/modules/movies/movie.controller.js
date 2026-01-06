import {
  fetchMovieDetails,
  searchMovies,
  fetchTrendingMovies,
  fetchSimilarMovies,
} from "./movie.service.js";

/**
 * @route GET /api/movies/:id
 */
export const getMovieDetails = async (req, res) => {
  try {
    const movie = await fetchMovieDetails(req.params.id);

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (err) {
    console.error("getMovieDetails:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch movie details",
    });
  }
};

/**
 * @route GET /api/movies/search
 */
export const searchMovieController = async (req, res) => {
  try {
    const { q, page } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Query is required" });
    }

    const results = await searchMovies(q, page || 1);

    res.status(200).json({
      success: true,
      page: results.page,
      totalPages: results.total_pages,
      data: results.results,
    });
  } catch (err) {
    console.error("searchMovieController:", err.message);
    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

/**
 * @route GET /api/movies/trending
 */
export const getTrendingMovies = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const movies = await fetchTrendingMovies(page);

    res.status(200).json({
      success: true,
      page: movies.page,
      totalPages: movies.total_pages,
      data: movies.results,
    });
  } catch (err) {
    console.error("getTrendingMovies:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trending movies",
    });
  }
};

/**
 * @route GET /api/movies/:id/similar
 */
export const getSimilarMovies = async (req, res) => {
  try {
    const movies = await fetchSimilarMovies(req.params.id);

    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (err) {
    console.error("getSimilarMovies:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch similar movies",
    });
  }
};
