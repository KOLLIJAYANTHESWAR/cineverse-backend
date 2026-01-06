import User from "./user.model.js";

/**
 * @desc Get my profile
 * @route GET /api/users/me
 * @access Authenticated
 */
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-__v");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("getMyProfile:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/**
 * @desc Update profile
 * @route PATCH /api/users/me
 * @access Authenticated
 */
export const updateMyProfile = async (req, res) => {
  try {
    const allowedFields = ["username", "avatar"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("updateMyProfile:", error.message);
    res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};

/**
 * @desc Like / unlike a movie
 * @route PATCH /api/users/me/like-movie
 * @access Authenticated
 */
export const toggleLikeMovie = async (req, res) => {
  try {
    const { movieId, genres = [], directorId } = req.body;

    if (!movieId) {
      return res.status(400).json({
        message: "movieId is required",
      });
    }

    const user = await User.findById(req.user.id);

    const alreadyLiked = user.likedMovies.includes(movieId);

    if (alreadyLiked) {
      user.likedMovies.pull(movieId);
    } else {
      user.likedMovies.push(movieId);

      // Update taste signals
      genres.forEach((g) => {
        if (!user.preferredGenres.includes(g)) {
          user.preferredGenres.push(g);
        }
      });

      if (directorId && !user.favoriteDirectors.includes(directorId)) {
        user.favoriteDirectors.push(directorId);
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likedMoviesCount: user.likedMovies.length,
    });
  } catch (error) {
    console.error("toggleLikeMovie:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update liked movies",
    });
  }
};

/**
 * @desc Admin – ban user
 * @route PATCH /api/users/:id/ban
 * @access Admin
 */
export const banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "User banned",
      data: user,
    });
  } catch (error) {
    console.error("banUser:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to ban user",
    });
  }
};
