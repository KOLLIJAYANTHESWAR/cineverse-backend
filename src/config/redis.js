import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

export const pubClient = redis;
export const subClient = redis.duplicate();

export const connectRedis = async () => {
  redis.on("error", (err) =>
    console.error("❌ Redis error:", err)
  );

  await redis.connect();
  await subClient.connect();

  console.log("⚡ Redis connected");
};

export default redis; // ✅ THIS FIXES YOUR ERROR
