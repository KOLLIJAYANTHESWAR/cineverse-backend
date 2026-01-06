import User from "../users/user.model.js";
import Post from "../posts/post.model.js";

// 🔨 Ban user globally
export const banUser = async (req, res) => {
  const { userId } = req.params;

  await User.findByIdAndUpdate(userId, { isBanned: true });

  res.json({ success: true, message: "User banned globally" });
};

// 🔓 Unban user
export const unbanUser = async (req, res) => {
  const { userId } = req.params;

  await User.findByIdAndUpdate(userId, { isBanned: false });

  res.json({ success: true, message: "User unbanned" });
};

// 🗑 Delete ANY post
export const deleteAnyPost = async (req, res) => {
  const { postId } = req.params;

  await Post.findByIdAndDelete(postId);

  res.json({ success: true, message: "Post deleted" });
};
