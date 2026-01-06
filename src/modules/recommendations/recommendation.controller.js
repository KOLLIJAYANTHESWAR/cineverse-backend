import {
  getSimilarMoviesTMDB,
  getGenreBasedRecommendations,
  getDirectorBasedRecommendations,
  getMLRecommendations,
} from "./recommendation.service.js";

/**
 * @desc Recommendations based on movie
 * @route GET /api/recommendations/movie/:id
 */
export const recommendByMovie = async (req, res) => {
  try {
    const movieId = req.params.id;

    const recommendations = await getSimilarMoviesTMDB(movieId);

    res.status(200).json({
      success: true,
      type: "SIMILAR_MOVIES",
      data: recommendations,
    });
  } catch (error) {
    console.error("recommendByMovie:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get movie recommendations",
    });
  }
};

/**
 * @desc Genre-based recommendations
 * @route GET /api/recommendations/genre
 * @query genres=28,12
 */
export const recommendByGenre = async (req, res) => {
  try {
    const genres = req.query.genres;

    if (!genres) {
      return res.status(400).json({
        success: false,
        message: "Genres are required",
      });
    }

    const genreIds = genres.split(",").map(Number);

    const recommendations = await getGenreBasedRecommendations(genreIds);

    res.status(200).json({
      success: true,
      type: "GENRE_BASED",
      data: recommendations,
    });
  } catch (error) {
    console.error("recommendByGenre:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get genre recommendations",
    });
  }
};

/**
 * @desc Director-based recommendations
 * @route GET /api/recommendations/director/:id
 */
export const recommendByDirector = async (req, res) => {
  try {
    const directorId = req.params.id;

    const recommendations = await getDirectorBasedRecommendations(directorId);

    res.status(200).json({
      success: true,
      type: "DIRECTOR_BASED",
      data: recommendations,
    });
  } catch (error) {
    console.error("recommendByDirector:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get director recommendations",
    });
  }
};

/**
 * @desc Personalized recommendations (ML)
 * @route GET /api/recommendations/me
 * @access Authenticated
 */
export const recommendForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const recommendations = await getMLRecommendations(userId);

    res.status(200).json({
      success: true,
      type: "PERSONALIZED",
      data: recommendations,
    });
  } catch (error) {
    console.error("recommendForUser:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get personalized recommendations",
    });
  }
};
