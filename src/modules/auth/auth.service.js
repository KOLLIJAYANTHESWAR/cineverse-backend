import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../users/user.model.js";
import { env } from "../../config/env.js";

const SALT_ROUNDS = 10;

// ===============================
// TOKEN HELPERS
// ===============================
export const generateHashedToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  return { token, hashedToken };
};

// ===============================
// REGISTER
// ===============================
export const registerUser = async ({ username, email, password }) => {
  // 🔧 NORMALIZE EMAIL (FIX #3)
  email = email.toLowerCase();

  const emailExists = await User.findOne({ email });
  if (emailExists) throw new Error("Email already in use");

  const usernameExists = await User.findOne({ username });
  if (usernameExists) throw new Error("Username already taken");

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const { token, hashedToken } = generateHashedToken();

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: Date.now() + 60 * 60 * 1000,
  });

  return { user, verificationToken: token };
};

// ===============================
// LOGIN
// ===============================
export const loginUser = async ({ email, password }) => {
  email = email.toLowerCase();

  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("Invalid email or password");
  if (!user.isEmailVerified)
    throw new Error("Please verify your email first");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    env.jwtSecret,
    { expiresIn: "7d" }
  );

  return { user, token };
};
