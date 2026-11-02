import authServices from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
};

const registerUser = async (req, res) => {
  try {
    const result = await authServices.registerUser(req.body);

    res.cookie("token", result.token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: result.user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const clientIp = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const result = await authServices.loginUser({ ...req.body, ip: clientIp });

    res.cookie("token", result.token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  return res.status(200).json({
    success: true,
    message: "User logout successfully.",
  });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await authServices.getCurrentUser(req.user.userId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Get Current User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authServices.forgotPassword(req.body.email);
    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authServices.resetPassword(req.body);
    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
