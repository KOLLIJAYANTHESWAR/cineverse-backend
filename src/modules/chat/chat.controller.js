import ChatRoom from "./chat.model.js";
import ChatMessage from "./message.model.js";

/**
 * @desc Create a chat room (public or private)
 * @route POST /api/chat/rooms
 */
export const createRoom = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res
        .status(400)
        .json({ success: false, message: "Name and type are required" });
    }

    const room = await ChatRoom.create({
      name,
      type, // public | private
      owner: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json({
      success: true,
      data: room,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create room",
    });
  }
};

/**
 * @desc Get rooms user belongs to
 * @route GET /api/chat/rooms
 */
export const getMyRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      members: req.user.id,
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: rooms,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
};

/**
 * @desc Get messages from a room (PAGINATED)
 * @route GET /api/chat/rooms/:id/messages?page=1&limit=20
 */
export const getMessages = async (req, res) => {
  try {
    const roomId = req.params.id;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      ChatMessage.find({ room: roomId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "username")
        .lean(),

      ChatMessage.countDocuments({ room: roomId }),
    ]);

    res.json({
      success: true,
      meta: {
        page,
        limit,
        total,
        hasMore: skip + messages.length < total,
      },
      data: messages.reverse(), // oldest → newest
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};
