import Post from "./post.model.js";

/**
 * @desc Create a post (text or movie share)
 * @route POST /api/posts
 * @access Authenticated
 */
export const createPost = async (req, res) => {
  try {
    const { content, movie } = req.body;

    if (!content && !movie) {
      return res.status(400).json({
        success: false,
        message: "Post content or movie is required",
      });
    }

    const post = await Post.create({
      author: req.user.id,
      content,
      movie: movie || null,
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("createPost:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

/**
 * @desc Get feed posts
 * @route GET /api/posts
 * @access Public
 */
export const getFeedPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ removed: false })
      .populate("author", "username role")
      .sort({ pinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("getFeedPosts:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

/**
 * @desc Like / Unlike a post
 * @route PATCH /api/posts/:id/like
 * @access Authenticated
 */
export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.removed) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = req.user.id;
    const liked = post.likes.includes(userId);

    if (liked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: !liked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("toggleLikePost:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update like",
    });
  }
};

/**
 * @desc Delete post (author or admin)
 * @route DELETE /api/posts/:id
 * @access Authenticated
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    post.removed = true;
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post removed",
    });
  } catch (error) {
    console.error("deletePost:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};
