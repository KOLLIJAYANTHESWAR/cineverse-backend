import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import { env } from "../../config/env.js";

const SALT_ROUNDS = 10;

export const registerUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = new User({
    username,
    email,
    password: hashedPassword, // 🔥 MUST MATCH SCHEMA
    role: "user",
  });

  await user.save(); // 🔥 DO NOT USE create() HERE

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: "7d" }
  );

  return { user, token };
};
