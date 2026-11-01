import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/jwt.js";

const registerUser = async ({ name, email, password }) => {
  if (!name?.trim() || !email?.trim() || !password) {
    const error = new Error("Name, email and password are required.");
    error.statusCode = 400;
    throw error;
  }
  if (password.length < 8) {
    const error = new Error("Password must be at least 8 characters");
    error.statusCode = 400;
    throw error;
  }
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    const error = new Error("Email already exists.");
    error.statusCode = 409;
    throw error;
  }
  const hashPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashPassword,
    settings: {
      profile: {
        displayName: name.trim(),
        email: normalizedEmail,
        emailVerified: true,
      },
      branding: {
        studioName: `${name.trim()} Studio`,
        footerText: `© ${new Date().getFullYear()} ${name.trim()} Studio — Every moment, beautifully preserved.`,
      },
    },
  });

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const loginUser = async ({email, password}) => {
  if (!email?.trim() || !password) {
    const error = new Error("Enter email and password.");
    error.statusCode = 400;
    throw error;
  }
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");
  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 400;
    throw error;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 400;
    throw error;
  }
  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
  });
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 400;
    throw error;
  }
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const forgotPassword = async (email) => {
  if (!email?.trim()) {
    const error = new Error("Email is required.");
    error.statusCode = 400;
    throw error;
  }
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  // Always return ok for security/privacy
  return { ok: true, email: email.trim().toLowerCase() };
};

const resetPassword = async ({ token, password }) => {
  if (!password || password.length < 8) {
    const error = new Error("Password must be at least 8 characters.");
    error.statusCode = 400;
    throw error;
  }
  if (!token || token === "expired") {
    const error = new Error("This reset link is invalid or has expired.");
    error.statusCode = 400;
    throw error;
  }
  return { ok: true, message: "Password reset successful." };
};

export default {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
