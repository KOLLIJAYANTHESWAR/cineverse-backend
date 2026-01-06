import User from "./user.model.js";

/**
 * Send friend request
 */
export const sendFriendRequest = async (req, res) => {
  const { userId } = req.params;
  const me = req.user.id;

  if (me === userId) {
    return res.status(400).json({ message: "Cannot add yourself" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const alreadyRequested = user.friendRequests.some(
    (r) => r.from.toString() === me
  );

  if (alreadyRequested) {
    return res.status(400).json({ message: "Request already sent" });
  }

  user.friendRequests.push({ from: me });
  await user.save();

  res.json({ success: true, message: "Friend request sent" });
};

/**
 * Accept friend request
 */
export const acceptFriendRequest = async (req, res) => {
  const { userId } = req.params;
  const me = req.user.id;

  const user = await User.findById(me);
  const requester = await User.findById(userId);

  if (!user || !requester) {
    return res.status(404).json({ message: "User not found" });
  }

  user.friendRequests = user.friendRequests.filter(
    (r) => r.from.toString() !== userId
  );

  user.friends.push(userId);
  requester.friends.push(me);

  await user.save();
  await requester.save();

  res.json({ success: true, message: "Friend request accepted" });
};
