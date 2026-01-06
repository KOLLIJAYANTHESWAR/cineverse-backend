import { registerUser, loginUser } from "./auth.service.js";
import { successResponse, errorResponse } from "../../shared/utils/apiResponse.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return errorResponse(res, {
        statusCode: 400,
        message: "All fields are required",
      });
    }

    const user = await registerUser({ username, email, password });

    return successResponse(res, {
      statusCode: 201,
      message: "User registered successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: 400,
      message: error.message,
    });
  }
};

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
  } catch (error) {
    return errorResponse(res, {
      statusCode: 401,
      message: error.message,
    });
  }
};
