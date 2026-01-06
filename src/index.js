import "./config/env.js";
import connectDB from "./config/db.js";
import server from "./server.js";
import { env } from "./config/env.js";
import { connectRedis } from "./config/redis.js";
import { startPublicChatResetJob } from "./cron/publicChatReset.cron.js";

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();           // ✅ Redis first
    startPublicChatResetJob();      // ✅ Cron after Redis

    server.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
      console.log(`🌍 Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error("❌ Application failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
