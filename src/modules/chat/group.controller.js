import ChatGroup from "./group.model.js";

/**
 * Create group
 */
export const createGroup = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  const group = await ChatGroup.create({
    name,
    owner: userId,
    admins: [userId],
    members: [userId],
  });

  res.status(201).json({
    success: true,
    data: group,
  });
};

/**
 * Add member (admin only)
 */
export const addMember = async (req, res) => {
  const { groupId, userId } = req.params;
  const me = req.user.id;

  const group = await ChatGroup.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group not found" });

  if (!group.admins.map(String).includes(me)) {
    return res.status(403).json({ message: "Only admins can add members" });
  }

  if (!group.members.includes(userId)) {
    group.members.push(userId);
    await group.save();
  }

  res.json({ success: true });
};

/**
 * Remove member (admin only)
 */
export const removeMember = async (req, res) => {
  const { groupId, userId } = req.params;
  const me = req.user.id;

  const group = await ChatGroup.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group not found" });

  if (!group.admins.map(String).includes(me)) {
    return res.status(403).json({ message: "Only admins can remove members" });
  }

  group.members = group.members.filter((id) => id.toString() !== userId);
  group.admins = group.admins.filter((id) => id.toString() !== userId);

  await group.save();

  res.json({ success: true });
};

/**
 * Promote to admin (owner only)
 */
export const promoteAdmin = async (req, res) => {
  const { groupId, userId } = req.params;
  const me = req.user.id;

  const group = await ChatGroup.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group not found" });

  if (group.owner.toString() !== me) {
    return res.status(403).json({ message: "Only owner can promote admins" });
  }

  if (!group.admins.includes(userId)) {
    group.admins.push(userId);
    await group.save();
  }

  res.json({ success: true });
};
