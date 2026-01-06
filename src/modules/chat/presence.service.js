import { pubClient } from "../../config/redis.js";

const ONLINE_USERS_KEY = "online_users";

export const userOnline = async (userId) => {
  await pubClient.sAdd(ONLINE_USERS_KEY, userId);
  await pubClient.set(`last_seen:${userId}`, Date.now());
};

export const userOffline = async (userId) => {
  await pubClient.sRem(ONLINE_USERS_KEY, userId);
  await pubClient.set(`last_seen:${userId}`, Date.now());
};

export const getOnlineUsers = async () => {
  return await pubClient.sMembers(ONLINE_USERS_KEY);
};

export const getLastSeen = async (userId) => {
  return await pubClient.get(`last_seen:${userId}`);
};
