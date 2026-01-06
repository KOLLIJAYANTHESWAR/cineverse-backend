export const ROLES = Object.freeze({
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
});

/**
 * Role hierarchy (optional but useful)
 * Higher index = higher privilege
 */
export const ROLE_HIERARCHY = Object.freeze({
  user: 1,
  moderator: 5,
  admin: 10,
});
