import ChatGroup from "./group.model.js";
import { logAudit } from "../admin/audit.service.js";

/**
 * 🔇 Mute member (GROUP ADMIN ONLY)
 */
export const muteMember = async (req, res) => {
  const { groupId, userId } = req.params;
  const { minutes = 10 } = req.body;
  const me = req.user.id;

  const group = await ChatGroup.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  if (!group.admins.map(String).includes(me)) {
    return res.status(403).json({ message: "Only admins can mute" });
  }

  const until = new Date(Date.now() + minutes * 60 * 1000);

  // Remove old mute if exists
  group.mutedMembers = group.mutedMembers.filter(
    (m) => m.user.toString() !== userId
  );

  group.mutedMembers.push({ user: userId, until });
  await group.save();

  // 🧾 AUDIT LOG
  await logAudit({
    action: "GROUP_MEMBER_MUTED",
    performedBy: me,
    targetUser: userId,
    targetGroup: groupId,
    metadata: { minutes },
    req,
  });

  res.json({ success: true, mutedUntil: until });
};

/**
 * 🚪 Kick member (GROUP ADMIN ONLY)
 */
export const kickMember = async (req, res) => {
  const { groupId, userId } = req.params;
  const me = req.user.id;

  const group = await ChatGroup.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  if (!group.admins.map(String).includes(me)) {
    return res.status(403).json({ message: "Only admins can kick" });
  }

  group.members = group.members.filter((id) => id.toString() !== userId);
  group.admins = group.admins.filter((id) => id.toString() !== userId);

  await group.save();

  // 🧾 AUDIT LOG
  await logAudit({
    action: "GROUP_MEMBER_KICKED",
    performedBy: me,
    targetUser: userId,
    targetGroup: groupId,
    req,
  });

  res.json({ success: true });
};

/**
 * ⛔ Ban member (GROUP ADMIN ONLY)
 */
export const banMember = async (req, res) => {
  const { groupId, userId } = req.params;
  const me = req.user.id;

  const group = await ChatGroup.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  if (!group.admins.map(String).includes(me)) {
    return res.status(403).json({ message: "Only admins can ban" });
  }

  group.members = group.members.filter((id) => id.toString() !== userId);
  group.admins = group.admins.filter((id) => id.toString() !== userId);

  if (!group.bannedMembers.map(String).includes(userId)) {
    group.bannedMembers.push(userId);
  }

  await group.save();

  // 🧾 AUDIT LOG
  await logAudit({
    action: "GROUP_MEMBER_BANNED",
    performedBy: me,
    targetUser: userId,
    targetGroup: groupId,
    req,
  });

  res.json({ success: true });
};
