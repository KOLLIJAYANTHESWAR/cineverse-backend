import jwt from "jsonwebtoken";
import ChatMessage from "./message.model.js";
import ChatGroup from "./group.model.js";
import User from "../users/user.model.js";
import { env } from "../../config/env.js";

// 🟢 Presence service
import {
  userOnline,
  userOffline,
} from "./presence.service.js";

export const initSocket = (io) => {
  // ===============================
  // 🔐 SOCKET AUTH (JWT)
  // ===============================
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error("No token provided");

      const decoded = jwt.verify(token, env.jwtSecret);

      const user = await User.findById(decoded.id).select(
        "username role isBanned"
      );
      if (!user) throw new Error("User not found");

      // 🚫 GLOBAL BAN (PROJECT ADMIN LEVEL)
      if (user.isBanned) {
        throw new Error("User is globally banned");
      }

      socket.user = {
        id: user._id.toString(),
        username: user.username,
        role: user.role, // admin | moderator | user
      };

      next();
    } catch (err) {
      console.error("❌ Socket auth failed:", err.message);
      next(new Error("Authentication failed"));
    }
  });

  // ===============================
  // 🔌 CONNECTION
  // ===============================
  io.on("connection", async (socket) => {
    console.log("🟢 User connected:", socket.user.username);

    const isPlatformAdmin = socket.user.role === "admin";

    // 🟢 PRESENCE: USER ONLINE
    await userOnline(socket.user.id);
    io.emit("user-online", {
      userId: socket.user.id,
      username: socket.user.username,
    });

    // ===============================
    // 🚪 JOIN ROOM
    // ===============================
    socket.on("join-room", async (roomId) => {
      try {
        if (roomId.startsWith("group_") && !isPlatformAdmin) {
          const groupId = roomId.replace("group_", "");
          const group = await ChatGroup.findById(groupId);

          if (!group) {
            socket.emit("error-message", "Group not found");
            return;
          }

          // ⛔ GROUP BAN CHECK
          if (
            group.bannedMembers
              ?.map((id) => id.toString())
              .includes(socket.user.id)
          ) {
            socket.emit("error-message", "You are banned from this group");
            return;
          }

          // 🔐 MEMBER CHECK
          if (
            !group.members
              .map((id) => id.toString())
              .includes(socket.user.id)
          ) {
            socket.emit("error-message", "Not a group member");
            return;
          }
        }

        socket.join(roomId);

        socket.to(roomId).emit("system-message", {
          type: "join",
          username: socket.user.username,
        });
      } catch (err) {
        console.error("❌ Join room error:", err.message);
        socket.emit("error-message", "Failed to join room");
      }
    });

    // ===============================
    // ✍️ TYPING INDICATORS
    // ===============================
    socket.on("typing-start", (roomId) => {
      socket.to(roomId).emit("typing-start", {
        userId: socket.user.id,
        username: socket.user.username,
      });
    });

    socket.on("typing-stop", (roomId) => {
      socket.to(roomId).emit("typing-stop", {
        userId: socket.user.id,
      });
    });

    // ===============================
    // 💬 SEND MESSAGE
    // ===============================
    socket.on("send-message", async ({ roomId, text, movieId }) => {
      try {
        if (!roomId || !text) return;

        if (roomId.startsWith("group_") && !isPlatformAdmin) {
          const groupId = roomId.replace("group_", "");
          const group = await ChatGroup.findById(groupId);

          if (!group) {
            socket.emit("error-message", "Group not found");
            return;
          }

          // 🔐 MEMBER CHECK
          if (
            !group.members
              .map((id) => id.toString())
              .includes(socket.user.id)
          ) {
            socket.emit("error-message", "Not allowed to send message");
            return;
          }

          // 🔇 MUTE CHECK
          const mute = group.mutedMembers?.find(
            (m) =>
              m.user.toString() === socket.user.id &&
              new Date(m.until) > new Date()
          );

          if (mute) {
            socket.emit(
              "error-message",
              `You are muted until ${new Date(
                mute.until
              ).toLocaleTimeString()}`
            );
            return;
          }
        }

        const message = await ChatMessage.create({
          room: roomId,
          sender: socket.user.id,
          text,
          movie: movieId || null,
        });

        io.to(roomId).emit("new-message", {
          id: message._id,
          room: roomId,
          senderId: socket.user.id,
          senderUsername: socket.user.username,
          text: message.text,
          movie: message.movie,
          createdAt: message.createdAt,
        });
      } catch (err) {
        console.error("❌ Message failed:", err.message);
        socket.emit("error-message", "Message failed");
      }
    });

    // ===============================
    // 🎧 AUDIO CALL (WEBRTC SIGNALING)
    // ===============================
    socket.on("join-audio", async (roomId) => {
      if (roomId.startsWith("group_") && !isPlatformAdmin) {
        const groupId = roomId.replace("group_", "");
        const group = await ChatGroup.findById(groupId);

        if (
          !group ||
          !group.members.map(String).includes(socket.user.id)
        ) {
          socket.emit("error-message", "Not allowed to join audio");
          return;
        }
      }

      const audioRoom = `audio_${roomId}`;
      socket.join(audioRoom);

      socket.to(audioRoom).emit("audio-user-joined", {
        userId: socket.user.id,
        username: socket.user.username,
      });
    });

    socket.on("offer", ({ to, offer }) => {
      socket.to(to).emit("offer", {
        from: socket.id,
        offer,
        username: socket.user.username,
      });
    });

    socket.on("answer", ({ to, answer }) => {
      socket.to(to).emit("answer", {
        from: socket.id,
        answer,
      });
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      socket.to(to).emit("ice-candidate", {
        from: socket.id,
        candidate,
      });
    });

    socket.on("leave-audio", (roomId) => {
      const audioRoom = `audio_${roomId}`;
      socket.leave(audioRoom);

      socket.to(audioRoom).emit("audio-user-left", {
        userId: socket.user.id,
      });
    });

    // ===============================
    // 🔌 DISCONNECT
    // ===============================
    socket.on("disconnect", async () => {
      await userOffline(socket.user.id);

      io.emit("user-offline", {
        userId: socket.user.id,
        username: socket.user.username,
      });

      console.log("🔴 User disconnected:", socket.user.username);
    });
  });
};
