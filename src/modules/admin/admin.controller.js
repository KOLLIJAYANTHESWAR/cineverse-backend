import Announcement from "../posts/post.model.js";

/**
 * @desc    Create an announcement
 * @route   POST /api/admin/announcements
 * @access  Admin / Moderator
 */
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const announcement = await Announcement.create({
      title,
      content,
      type: "ANNOUNCEMENT",
      author: req.user.id,
      pinned: true,
    });

    res.status(201).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.error("Admin createAnnouncement error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create announcement",
    });
  }
};

/**
 * @desc    Get all announcements
 * @route   GET /api/admin/announcements
 * @access  Public (read-only)
 */
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      type: "ANNOUNCEMENT",
    })
      .sort({ createdAt: -1 })
      .populate("author", "username role");

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    console.error("Admin getAnnouncements error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
    });
  }
};

/**
 * @desc    Delete an announcement
 * @route   DELETE /api/admin/announcements/:id
 * @access  Admin only
 */
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Admin deleteAnnouncement error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete announcement",
    });
  }
};
