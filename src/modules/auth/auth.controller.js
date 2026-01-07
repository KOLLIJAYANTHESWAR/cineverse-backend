import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../users/user.model.js";
import {
  registerUser,
  loginUser,
  generateHashedToken,
} from "./auth.service.js";
import {
  successResponse,
  errorResponse,
} from "../../shared/utils/apiResponse.js";
import { sendEmail } from "../../shared/services/email.service.js";
import {
  verifyEmailTemplate,
  resetPasswordTemplate,
} from "../../shared/services/email.templates.js";

// ===============================
// REGISTER
// ===============================
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Username, email and password are required",
      });
    }

    // 🔐 PASSWORD STRENGTH
    if (password.length < 8) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Password must be at least 8 characters long",
      });
    }

    const { user, verificationToken } = await registerUser({
      username,
      email,
      password,
    });

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    // 📧 SEND VERIFICATION EMAIL
    await sendEmail({
      to: user.email,
      subject: "Verify your CineVerse account",
      html: verifyEmailTemplate(verifyLink),
    });

    return successResponse(res, {
      statusCode: 201,
      message: "Account created. Verification email sent.",
    });
  } catch (err) {
    return errorResponse(res, {
      statusCode: 400,
      message: err.message,
    });
  }
};

// ===============================
// LOGIN
// ===============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Email and password are required",
      });
    }

    const { user, token } = await loginUser({ email, password });

    return successResponse(res, {
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    return errorResponse(res, {
      statusCode: 401,
      message: err.message,
    });
  }
};

// ===============================
// VERIFY EMAIL
// ===============================
export const verifyEmail = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid or expired verification link",
    });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return successResponse(res, {
    message: "Email verified successfully. You can now login.",
  });
};

// ===============================
// RESEND VERIFICATION
// ===============================
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user)
      return errorResponse(res, {
        statusCode: 404,
        message: "User not found",
      });

    if (user.isEmailVerified) {
      return successResponse(res, {
        message: "Email already verified",
      });
    }

    const { token, hashedToken } = generateHashedToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your CineVerse account",
      html: verifyEmailTemplate(verifyLink),
    });

    return successResponse(res, {
      message: "Verification email resent",
    });
  } catch (err) {
    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to resend verification email",
    });
  }
};

// ===============================
// FORGOT PASSWORD
// ===============================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // 🔒 Do NOT reveal user existence
  if (!user) {
    return successResponse(res, {
      message: "If email exists, reset link sent",
    });
  }

  const { token, hashedToken } = generateHashedToken();
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your CineVerse password",
    html: resetPasswordTemplate(resetLink),
  });

  return successResponse(res, {
    message: "Password reset email sent",
  });
};

// ===============================
// RESET PASSWORD
// ===============================
export const resetPassword = async (req, res) => {
  if (!req.body.password || req.body.password.length < 8) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Password must be at least 8 characters long",
    });
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid or expired reset token",
    });

  user.password = await bcrypt.hash(req.body.password, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return successResponse(res, {
    message: "Password reset successful",
  });
};
