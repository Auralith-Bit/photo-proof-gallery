import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/jwt.js";
import { sendPasswordResetEmail, sendWelcomeEmail, sendLoginNotificationEmail } from "../utils/email.js";

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

  // Send welcome email asynchronously
  sendWelcomeEmail({
    to: user.email,
    name: user.name,
  }).catch((err) => console.error("Welcome email error:", err.message));

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

const loginUser = async ({ email, password, ip }) => {
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

  // Send login notification email if enabled (default true)
  if (user.settings?.security?.notifyOnNewDevice !== false) {
    sendLoginNotificationEmail({
      to: user.email,
      name: user.settings?.profile?.displayName || user.name,
      ip,
      time: new Date().toUTCString(),
    }).catch((err) => console.error("Login alert email error:", err.message));
  }

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

/**
 * Priority 1 & 3 — Generates a real reset token, saves it hashed to DB,
 * and sends the reset email via Nodemailer.
 */
const forgotPassword = async (email) => {
  if (!email?.trim()) {
    const error = new Error("Email is required.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  // Always return ok — never reveal whether the email exists (security best practice)
  if (!user) {
    return { ok: true };
  }

  // Generate a secure random token and store its hash in the DB
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // Send the email — if it fails, clear the token so the user can retry
  try {
    await sendPasswordResetEmail({
      to: user.email,
      name: user.settings?.profile?.displayName || user.name,
      token: rawToken,
    });
  } catch (emailErr) {
    console.error("Failed to send reset email:", emailErr.message);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    const error = new Error(
      "Could not send the reset email. Please check your email configuration and try again."
    );
    error.statusCode = 500;
    throw error;
  }

  return { ok: true };
};

/**
 * Priority 3 — Actually verifies the token against the DB and saves the new password.
 */
const resetPassword = async ({ token, password }) => {
  if (!password || password.length < 8) {
    const error = new Error("Password must be at least 8 characters.");
    error.statusCode = 400;
    throw error;
  }

  if (!token) {
    const error = new Error("This reset link is invalid or has expired.");
    error.statusCode = 400;
    throw error;
  }

  // Hash the incoming raw token to compare with what we stored
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    const error = new Error("This reset link is invalid or has expired.");
    error.statusCode = 400;
    throw error;
  }

  // Save the new password and clear the token
  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  if (!user.settings) user.settings = {};
  if (!user.settings.security) user.settings.security = {};
  user.settings.security.passwordUpdatedAt = new Date();
  await user.save();

  return { ok: true, message: "Password reset successful." };
};

export default {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
