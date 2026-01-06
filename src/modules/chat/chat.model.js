import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    name: String,
    type: { type: String, enum: ["public", "private"] },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("ChatRoom", chatRoomSchema);
