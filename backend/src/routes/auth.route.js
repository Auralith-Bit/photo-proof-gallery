import express from "express";
import rateLimit from "express-rate-limit";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Priority 5 — Rate limiting on auth routes to prevent brute-force attacks.
// Login: 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Please try again in 15 minutes." },
});

// Register: 5 new accounts per hour per IP
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many accounts created from this IP. Please try again later." },
});

// Forgot password rate limiter: 30 requests per 15 minutes per IP
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many password reset requests. Please try again in 15 minutes." },
});

router.post("/register", registerLimiter, authController.registerUser);
router.post("/login", loginLimiter, authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/me", authMiddleware, authController.getCurrentUser);
router.post("/forgot-password", forgotPasswordLimiter, authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;