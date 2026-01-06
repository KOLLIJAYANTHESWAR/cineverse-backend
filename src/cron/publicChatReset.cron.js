import cron from "node-cron";
import ChatMessage from "../modules/chat/message.model.js";
import redis from "../config/redis.js";

export const startPublicChatResetJob = () => {
  // 🕛 Runs every day at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("🧹 Running daily public chat reset...");

      // 1️⃣ Delete public chat messages
      await ChatMessage.deleteMany({ room: "public" });

      // 2️⃣ Clear Redis moderation keys (public chat only)
      const keys = await redis.keys("public:*");
      if (keys.length > 0) {
        await redis.del(keys);
      }

      console.log("✅ Public chat reset completed");
    } catch (err) {
      console.error("❌ Public chat reset failed:", err.message);
    }
  });
};
