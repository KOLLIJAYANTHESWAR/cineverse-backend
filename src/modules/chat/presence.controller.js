import { getOnlineUsers, getLastSeen } from "./presence.service.js";

export const getPresence = async (req, res) => {
  const onlineUsers = await getOnlineUsers();
  res.json({ success: true, data: onlineUsers });
};

export const getUserLastSeen = async (req, res) => {
  const lastSeen = await getLastSeen(req.params.userId);
  res.json({ success: true, lastSeen });
};
