import {
  fetchAllGenres,
  fetchMoviesByGenre,
  fetchTopRatedByGenre,
} from "./genre.service.js";

/**
 * @desc Get all genres
 * @route GET /api/genres
 * @access Public
 */
export const getGenres = async (req, res) => {
  try {
    const genres = await fetchAllGenres();

    res.status(200).json({
      success: true,
      count: genres.length,
      data: genres,
    });
  } catch (error) {
    console.error("getGenres error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch genres",
    });
  }
};

/**
 * @desc Get movies by genre
 * @route GET /api/genres/:id/movies
 * @access Public
 */
export const getMoviesByGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;

    const movies = await fetchMoviesByGenre(id, page);

    res.status(200).json({
      success: true,
      page: movies.page,
      totalPages: movies.total_pages,
      data: movies.results,
    });
  } catch (error) {
    console.error("getMoviesByGenre error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch movies by genre",
    });
  }
};

/**
 * @desc Get top rated movies by genre
 * @route GET /api/genres/:id/top
 * @access Public
 */
export const getTopRatedByGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;

    const movies = await fetchTopRatedByGenre(id, page);

    res.status(200).json({
      success: true,
      page: movies.page,
      totalPages: movies.total_pages,
      data: movies.results,
    });
  } catch (error) {
    console.error("getTopRatedByGenre error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top rated movies",
    });
  }
};
